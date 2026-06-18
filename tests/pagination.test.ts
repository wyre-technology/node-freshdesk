import { describe, it, expect, beforeEach, vi } from 'vitest';
import { paginate, parseNextLink, buildPageParams } from '../src/pagination.js';
import { HttpClient } from '../src/http.js';

describe('parseNextLink', () => {
  it('returns the next URL from a Link header', () => {
    const header = '<https://acme.freshdesk.com/api/v2/tickets?page=2>; rel="next"';
    expect(parseNextLink(header)).toBe('https://acme.freshdesk.com/api/v2/tickets?page=2');
  });

  it('returns null when there is no Link header', () => {
    expect(parseNextLink(null)).toBeNull();
  });

  it('returns null when the Link header has no next rel', () => {
    expect(parseNextLink('<https://x/api/v2/tickets?page=1>; rel="prev"')).toBeNull();
  });
});

describe('buildPageParams', () => {
  it('passes through page and clamps per_page to 100', () => {
    expect(buildPageParams({ page: 2, perPage: 250 })).toEqual({ page: 2, per_page: 100 });
  });

  it('returns an empty object when nothing is provided', () => {
    expect(buildPageParams()).toEqual({});
  });
});

describe('paginate', () => {
  let httpClient: HttpClient;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    httpClient = new HttpClient({
      baseUrl: 'https://acme.freshdesk.com/api/v2',
      apiKey: 'test-key',
      timeout: 5000,
      maxRetries: 1,
      fetchImpl: mockFetch,
    });
    vi.clearAllMocks();
  });

  it('should follow Link: rel="next" across pages, yielding each item', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([{ id: 1 }, { id: 2 }]),
        headers: new Headers({
          'content-type': 'application/json',
          link: '<https://acme.freshdesk.com/api/v2/tickets?page=2>; rel="next"',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([{ id: 3 }]),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

    const items: Array<{ id: number }> = [];
    for await (const item of paginate<{ id: number }>(httpClient, '/tickets')) {
      items.push(item);
    }

    expect(items).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    // Second request must hit the absolute URL from the Link header.
    expect(mockFetch.mock.calls[1][0]).toBe('https://acme.freshdesk.com/api/v2/tickets?page=2');
  });

  it('should handle a single page (no Link header)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify([{ id: 1 }]),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    const items: Array<{ id: number }> = [];
    for await (const item of paginate<{ id: number }>(httpClient, '/tickets')) {
      items.push(item);
    }

    expect(items).toEqual([{ id: 1 }]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
