import type { HttpClient } from './http.js';
import type { ListParams } from './types/common.js';

/**
 * Freshdesk allows up to 100 records per page and discourages paging beyond
 * page 500. We cap the per-page size and the total pages we will auto-follow.
 */
export const MAX_PER_PAGE = 100;
export const MAX_PAGES = 500;

/**
 * Parse the `Link` response header and return the URL marked `rel="next"`, or
 * `null` when there is no next page.
 *
 * Example header:
 *   <https://acme.freshdesk.com/api/v2/tickets?page=2>; rel="next"
 */
export function parseNextLink(linkHeader: string | null): string | null {
  if (!linkHeader) return null;
  for (const part of linkHeader.split(',')) {
    const match = part.match(/<([^>]+)>\s*;\s*rel="?next"?/i);
    if (match) return match[1];
  }
  return null;
}

/** Build the `page` / `per_page` query params from caller-facing list params. */
export function buildPageParams(params: ListParams = {}): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (params.page !== undefined) out.page = params.page;
  if (params.perPage !== undefined) {
    out.per_page = Math.min(params.perPage, MAX_PER_PAGE);
  }
  return out;
}

/**
 * Async generator that walks every page of a Freshdesk list endpoint by
 * following the `Link: rel="next"` header. Yields each item individually.
 *
 * @param client HTTP client
 * @param path   List endpoint path (e.g. `/tickets`)
 * @param params Initial query params (filters, per_page, ...)
 */
export async function* paginate<T>(
  client: HttpClient,
  path: string,
  params: Record<string, unknown> = {},
): AsyncIterable<T> {
  // Default to the max page size so we make as few round-trips as possible.
  const initialParams = { per_page: MAX_PER_PAGE, ...params };
  let next: string | null = path;
  let firstRequest = true;
  let pages = 0;

  while (next && pages < MAX_PAGES) {
    const { data, headers } = await client.requestRaw<T[]>(
      next,
      firstRequest ? { params: initialParams } : {},
    );
    firstRequest = false;
    pages += 1;

    const items = Array.isArray(data) ? data : [];
    for (const item of items) {
      yield item;
    }

    next = parseNextLink(headers.get('link'));
  }
}
