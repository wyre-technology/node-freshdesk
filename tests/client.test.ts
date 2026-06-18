import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FreshdeskClient } from '../src/client.js';

describe('FreshdeskClient', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.clearAllMocks();
  });

  it('should create a client with required config and expose resources', () => {
    const client = new FreshdeskClient({
      domain: 'acme',
      apiKey: 'test-key',
      fetchImpl: mockFetch,
    });

    expect(client).toBeDefined();
    expect(client.tickets).toBeDefined();
    expect(client.contacts).toBeDefined();
    expect(client.companies).toBeDefined();
    expect(client.agents).toBeDefined();
    expect(client.groups).toBeDefined();
    expect(client.solutions).toBeDefined();
    expect(client.slaPolicies).toBeDefined();
    expect(client.businessHours).toBeDefined();
    expect(client.cannedResponses).toBeDefined();
  });

  it('should derive the base URL from the account domain', async () => {
    const client = new FreshdeskClient({
      domain: 'acme',
      apiKey: 'test-key',
      fetchImpl: mockFetch,
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => '[]',
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    await client.tickets.list();

    expect(mockFetch).toHaveBeenCalledWith(
      'https://acme.freshdesk.com/api/v2/tickets',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Basic'),
        }),
      })
    );
  });

  it('should tolerate a full host as the domain', async () => {
    const client = new FreshdeskClient({
      domain: 'https://acme.freshdesk.com',
      apiKey: 'test-key',
      fetchImpl: mockFetch,
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => '[]',
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    await client.tickets.list();

    expect(mockFetch.mock.calls[0][0]).toBe('https://acme.freshdesk.com/api/v2/tickets');
  });

  it('should use a custom base URL when provided', async () => {
    const client = new FreshdeskClient({
      domain: 'acme',
      apiKey: 'test-key',
      baseUrl: 'https://custom.example.com/api/v2',
      fetchImpl: mockFetch,
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => '[]',
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    await client.tickets.list();

    expect(mockFetch.mock.calls[0][0]).toBe('https://custom.example.com/api/v2/tickets');
  });
});
