import { buildBasicAuth } from './auth.js';
import {
  FreshdeskError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  type FreshdeskFieldError,
} from './errors.js';

export interface HttpClientConfig {
  /** Fully-qualified base URL, e.g. `https://acme.freshdesk.com/api/v2`. */
  baseUrl: string;
  /** Freshdesk API key (used as the Basic-auth username). */
  apiKey: string;
  /** Per-request timeout in milliseconds. */
  timeout: number;
  /** Maximum number of retries for transient failures (429 / 5xx / network). */
  maxRetries: number;
  fetchImpl: typeof fetch;
}

export interface RequestOptions {
  method?: string;
  params?: Record<string, unknown>;
  body?: unknown;
}

/**
 * Result of a raw request: the parsed JSON body plus the response headers.
 *
 * Freshdesk list endpoints return a bare JSON array as the body and signal the
 * next page through the `Link` response header, so pagination helpers need
 * access to the headers — `request()` alone (body only) is not enough.
 */
export interface RawResponse<T> {
  data: T;
  headers: Headers;
  status: number;
}

/** A token-bucket limiter that smooths client-side request bursts. */
class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private readonly capacity: number,
    private readonly refillPerSecond: number,
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  async take(): Promise<void> {
    // Refill based on elapsed time.
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSeconds * this.refillPerSecond);
    this.lastRefill = now;

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    // Wait until a token becomes available.
    const waitMs = ((1 - this.tokens) / this.refillPerSecond) * 1000;
    await new Promise((r) => setTimeout(r, waitMs));
    this.tokens = 0;
    this.lastRefill = Date.now();
  }
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly authHeader: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly fetchImpl: typeof fetch;
  private readonly limiter: TokenBucket;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.authHeader = buildBasicAuth(config.apiKey);
    this.timeout = config.timeout;
    this.maxRetries = config.maxRetries;
    this.fetchImpl = config.fetchImpl;
    // Freshdesk rate limits per minute; smooth bursts at ~50 req/s with a
    // small burst capacity. The server-side 429 + Retry-After is the source of
    // truth — this just avoids hammering the API on tight loops.
    this.limiter = new TokenBucket(10, 50);
  }

  /** Issue a request and return the parsed JSON body only. */
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { data } = await this.requestRaw<T>(path, options);
    return data;
  }

  /**
   * Issue a request and return the parsed body together with the response
   * headers. Used by pagination to follow the `Link: <...>; rel="next"` header.
   *
   * `path` may be a path relative to the base URL (e.g. `/tickets`) or an
   * absolute URL (e.g. the value pulled from a `Link` header).
   */
  async requestRaw<T>(path: string, options: RequestOptions = {}): Promise<RawResponse<T>> {
    const { method = 'GET', params, body } = options;

    let url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            for (const v of value) {
              searchParams.append(`${key}[]`, String(v));
            }
          } else {
            searchParams.set(key, String(value));
          }
        }
      }
      const qs = searchParams.toString();
      if (qs) url += `${url.includes('?') ? '&' : '?'}${qs}`;
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(1000 * 2 ** (attempt - 1) + Math.random() * 1000, 30_000);
        await new Promise((r) => setTimeout(r, delay));
      }

      await this.limiter.take();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const headers: Record<string, string> = {
        Authorization: this.authHeader,
        Accept: 'application/json',
      };

      if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
      }

      let response: Response;
      try {
        response = await this.fetchImpl(url, {
          method,
          headers,
          body: body !== undefined ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err as Error;
        if (lastError.name === 'AbortError') {
          lastError = new Error(`Request timeout after ${this.timeout}ms`);
        }
        continue;
      }

      if (response.ok) {
        if (response.status === 204) {
          return { data: {} as T, headers: response.headers, status: response.status };
        }
        // Always read text first, then JSON.parse — never call `.json()` then
        // fall back to `.text()`, because a body can only be consumed once.
        const rawText = await response.text().catch(() => '');
        let data: T;
        try {
          data = (rawText ? JSON.parse(rawText) : {}) as T;
        } catch {
          data = {} as T;
        }
        return { data, headers: response.headers, status: response.status };
      }

      const requestId = response.headers.get('x-request-id') || undefined;
      const rawText = await response.text().catch(() => '');
      let responseBody: unknown;
      try {
        responseBody = JSON.parse(rawText);
      } catch {
        responseBody = rawText || 'No response body';
      }

      const errorMessage = this.buildErrorMessage(response.status, responseBody, requestId);

      switch (response.status) {
        case 400:
          throw new ValidationError(
            errorMessage,
            extractFieldErrors(responseBody),
            responseBody,
            requestId,
          );

        case 401:
          throw new AuthenticationError(errorMessage, responseBody, requestId);

        case 403:
          throw new ForbiddenError(errorMessage, responseBody, requestId);

        case 404:
          throw new NotFoundError(errorMessage, responseBody, requestId);

        case 429: {
          // Honor the Retry-After header (seconds). Retry up to maxRetries,
          // then surface a RateLimitError carrying the retry hint.
          const retryAfter = parseRetryAfter(response.headers.get('retry-after'));
          if (attempt < this.maxRetries) {
            await new Promise((r) => setTimeout(r, retryAfter * 1000));
            continue;
          }
          throw new RateLimitError(errorMessage, retryAfter, responseBody, requestId);
        }

        default:
          if (response.status >= 500) {
            lastError = new ServerError(errorMessage, response.status, responseBody, requestId);
            if (attempt < this.maxRetries) continue;
            throw lastError;
          }
          throw new FreshdeskError(errorMessage, response.status, responseBody, requestId);
      }
    }

    throw lastError || new FreshdeskError('Request failed after retries');
  }

  private buildErrorMessage(status: number, responseBody: unknown, requestId?: string): string {
    let message = `HTTP ${status}`;

    if (typeof responseBody === 'string' && responseBody) {
      message += `: ${responseBody.substring(0, 200)}`;
    } else if (typeof responseBody === 'object' && responseBody) {
      const bodyStr = JSON.stringify(responseBody);
      if (bodyStr.length > 2) {
        message += `: ${bodyStr.substring(0, 200)}`;
      }
    }

    if (requestId) {
      message += ` (Request ID: ${requestId})`;
    }

    return message;
  }
}

/** Parse a `Retry-After` header value (seconds) with a sane default. */
function parseRetryAfter(value: string | null): number {
  if (!value) return 1;
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : 1;
}

/**
 * Pull the per-field validation errors out of a Freshdesk 400 response body.
 * The documented shape is `{ description, errors: [{ field, message, code }] }`.
 */
function extractFieldErrors(body: unknown): FreshdeskFieldError[] {
  if (body && typeof body === 'object' && Array.isArray((body as { errors?: unknown }).errors)) {
    return (body as { errors: FreshdeskFieldError[] }).errors;
  }
  return [];
}
