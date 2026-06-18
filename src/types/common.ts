/** Configuration for constructing a {@link FreshdeskClient}. */
export interface FreshdeskClientConfig {
  /**
   * Freshdesk account subdomain — the part before `.freshdesk.com`. For
   * `https://acme.freshdesk.com` this is `acme`. A full host is also accepted.
   */
  domain: string;
  /** Freshdesk API key (sent as the HTTP Basic-auth username, password `X`). */
  apiKey: string;
  /** Override the computed base URL (mainly for testing). */
  baseUrl?: string;
  /** Per-request timeout in milliseconds. Defaults to 30000. */
  timeout?: number;
  /** Maximum retries for 429 / 5xx / network errors. Defaults to 3. */
  maxRetries?: number;
  /** Inject a custom `fetch` implementation (defaults to `globalThis.fetch`). */
  fetchImpl?: typeof fetch;
}

/** Standard pagination params accepted by every list endpoint. */
export interface ListParams {
  /** 1-based page number. */
  page?: number;
  /** Records per page (max 100; values above are clamped). */
  perPage?: number;
  /** Arbitrary additional filter query params passed straight through. */
  [filter: string]: unknown;
}

/** Params for the search endpoints (`/search/{tickets|contacts|companies}`). */
export interface SearchParams {
  /** Freshdesk query-language string (without surrounding quotes). */
  query: string;
  /** 1-based page number (search is paginated up to 10 pages of 30). */
  page?: number;
}

/** Shape of a Freshdesk search response: a results array plus a total count. */
export interface SearchResult<T> {
  results: T[];
  total: number;
}

/** UTC timestamp as an ISO-8601 string, e.g. `2024-01-15T09:30:00Z`. */
export type Timestamp = string;
