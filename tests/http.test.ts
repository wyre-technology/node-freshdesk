import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpClient } from '../src/http.js';
import {
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
} from '../src/errors.js';

describe('HttpClient', () => {
  let httpClient: HttpClient;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    httpClient = new HttpClient({
      baseUrl: 'https://acme.freshdesk.com/api/v2',
      apiKey: 'test-key',
      timeout: 5000,
      maxRetries: 2,
      fetchImpl: mockFetch,
    });
    vi.clearAllMocks();
  });

  it('should make a successful GET request with Basic auth (apiKey:X)', async () => {
    const mockBody = { id: 1, subject: 'test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(mockBody),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    const result = await httpClient.request('/tickets/1');

    expect(result).toEqual(mockBody);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://acme.freshdesk.com/api/v2/tickets/1',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          // base64("test-key:X")
          Authorization: 'Basic dGVzdC1rZXk6WA==',
          Accept: 'application/json',
        }),
      })
    );
  });

  it('should serialize array query params with [] suffix', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => '{}',
      headers: new Headers(),
    });

    await httpClient.request('/tickets', {
      params: { page: 1, ids: ['a', 'b'] },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://acme.freshdesk.com/api/v2/tickets?page=1&ids%5B%5D=a&ids%5B%5D=b',
      expect.any(Object)
    );
  });

  it('should return {} on a 204 No Content response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      text: async () => '',
      headers: new Headers(),
    });

    const result = await httpClient.request('/tickets/1', { method: 'DELETE' });
    expect(result).toEqual({});
  });

  it('should throw AuthenticationError on 401', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
      headers: new Headers(),
    });

    await expect(httpClient.request('/tickets')).rejects.toThrow(AuthenticationError);
  });

  it('should throw ForbiddenError on 403', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: async () => 'Forbidden',
      headers: new Headers(),
    });

    await expect(httpClient.request('/tickets')).rejects.toThrow(ForbiddenError);
  });

  it('should throw NotFoundError on 404', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => 'Not Found',
      headers: new Headers(),
    });

    await expect(httpClient.request('/tickets/999')).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError with field errors on 400', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () =>
        JSON.stringify({
          description: 'Validation failed',
          errors: [{ field: 'priority', message: 'is not a valid value', code: 'invalid_value' }],
        }),
      headers: new Headers(),
    });

    try {
      await httpClient.request('/tickets', { method: 'POST', body: {} });
      throw new Error('expected ValidationError');
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).errors[0]).toMatchObject({ field: 'priority' });
    }
  });

  it('should honor Retry-After and retry on 429, then succeed', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'rate limited',
        headers: new Headers({ 'retry-after': '0' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ ok: true }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

    const result = await httpClient.request('/tickets');
    expect(result).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  }, 10000);

  it('should throw RateLimitError after max retries on 429', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => 'rate limited',
      headers: new Headers({ 'retry-after': '0' }),
    });

    await expect(httpClient.request('/tickets')).rejects.toThrow(RateLimitError);
    expect(mockFetch).toHaveBeenCalledTimes(3); // initial + 2 retries
  }, 20000);

  it('should retry on a 500, then succeed', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
        headers: new Headers(),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ ok: true }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

    const result = await httpClient.request('/tickets');
    expect(result).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  }, 10000);

  it('should throw ServerError after max retries on 5xx', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
      headers: new Headers(),
    });

    await expect(httpClient.request('/tickets')).rejects.toThrow(ServerError);
    expect(mockFetch).toHaveBeenCalledTimes(3); // initial + 2 retries
  }, 20000);
});
