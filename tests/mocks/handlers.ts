import { vi } from 'vitest';
import { FreshdeskClient } from '../../src/client.js';

export const BASE_URL = 'https://acme.freshdesk.com/api/v2';

/** A captured request, recorded by the mock fetch. */
export interface CapturedRequest {
  method: string;
  /** Full request URL including query string. */
  url: string;
  /** URL path + query, with the base URL stripped (e.g. `/tickets?page=2`). */
  path: string;
  /** Parsed JSON request body, if any. */
  body: unknown;
}

/** A handler describes a canned response for one `METHOD path` route. */
export interface Handler {
  method: string;
  /** Path to match, ignoring query string (e.g. `/tickets/1`). */
  path: string;
  status?: number;
  /** Response body (serialized to JSON). */
  json?: unknown;
  /** Extra response headers (e.g. a `Link` header for pagination). */
  headers?: Record<string, string>;
}

/**
 * Build a mock `fetch` from a list of route handlers. This is an MSW-style
 * abstraction implemented with `vi.fn()` so the SDK's native-fetch transport is
 * exercised without pulling in an extra dependency.
 *
 * The returned object also exposes the captured requests so tests can assert on
 * the exact verb, URL and body each method issued.
 */
export function createMockFetch(handlers: Handler[]) {
  const requests: CapturedRequest[] = [];
  // A mutable copy so that, when several handlers match the same route, they
  // are consumed in order (this lets a test model successive pagination pages).
  const remaining = [...handlers];

  const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
    const method = (init?.method ?? 'GET').toUpperCase();
    const path = url.startsWith(BASE_URL) ? url.slice(BASE_URL.length) : url;
    const pathNoQuery = path.split('?')[0];

    let body: unknown;
    if (typeof init?.body === 'string') {
      try {
        body = JSON.parse(init.body);
      } catch {
        body = init.body;
      }
    }
    requests.push({ method, url, path, body });

    const matches = (h: Handler) => h.method.toUpperCase() === method && h.path === pathNoQuery;
    // Prefer (and consume) the first not-yet-used matching handler; fall back to
    // the last matching handler so a single registration can serve repeat calls.
    let handler = remaining.find(matches);
    if (handler) {
      remaining.splice(remaining.indexOf(handler), 1);
    } else {
      handler = [...handlers].reverse().find(matches);
    }
    if (!handler) {
      return {
        ok: false,
        status: 404,
        text: async () => `No mock handler for ${method} ${pathNoQuery}`,
        headers: new Headers(),
      } as unknown as Response;
    }

    const status = handler.status ?? 200;
    return {
      ok: status >= 200 && status < 300,
      status,
      text: async () => (handler.json === undefined ? '' : JSON.stringify(handler.json)),
      headers: new Headers({ 'content-type': 'application/json', ...(handler.headers ?? {}) }),
    } as unknown as Response;
  });

  return { fetchImpl, requests };
}

/** Convenience: build a {@link FreshdeskClient} wired to a mock fetch. */
export function clientWith(handlers: Handler[]) {
  const { fetchImpl, requests } = createMockFetch(handlers);
  const client = new FreshdeskClient({ domain: 'acme', apiKey: 'test-key', fetchImpl });
  return { client, requests };
}
