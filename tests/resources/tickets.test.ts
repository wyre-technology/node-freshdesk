import { describe, it, expect } from 'vitest';
import { clientWith } from '../mocks/handlers.js';
import { ticketFixture, conversationFixture } from '../fixtures/index.js';

describe('TicketsResource', () => {
  it('list -> GET /tickets', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/tickets', json: [ticketFixture] },
    ]);
    const result = await client.tickets.list({ perPage: 50 });
    expect(result).toEqual([ticketFixture]);
    expect(requests[0]).toMatchObject({ method: 'GET' });
    expect(requests[0].path).toBe('/tickets?per_page=50');
  });

  it('get -> GET /tickets/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/tickets/1', json: ticketFixture },
    ]);
    const result = await client.tickets.get(1);
    expect(result).toEqual(ticketFixture);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/tickets/1' });
  });

  it('create -> POST /tickets', async () => {
    const { client, requests } = clientWith([
      { method: 'POST', path: '/tickets', status: 201, json: ticketFixture },
    ]);
    const body = { subject: 'x', description: 'y', status: 2, priority: 1, email: 'a@b.c' };
    const result = await client.tickets.create(body);
    expect(result).toEqual(ticketFixture);
    expect(requests[0]).toMatchObject({ method: 'POST', path: '/tickets', body });
  });

  it('update -> PUT /tickets/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'PUT', path: '/tickets/1', json: { ...ticketFixture, priority: 4 } },
    ]);
    const result = await client.tickets.update(1, { priority: 4 });
    expect(result.priority).toBe(4);
    expect(requests[0]).toMatchObject({ method: 'PUT', path: '/tickets/1', body: { priority: 4 } });
  });

  it('delete -> DELETE /tickets/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'DELETE', path: '/tickets/1', status: 204 },
    ]);
    await client.tickets.delete(1);
    expect(requests[0]).toMatchObject({ method: 'DELETE', path: '/tickets/1' });
  });

  it('search -> GET /search/tickets?query="..." returns {results,total}', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/search/tickets', json: { results: [ticketFixture], total: 1 } },
    ]);
    const result = await client.tickets.search({ query: 'priority:4' });
    expect(result.total).toBe(1);
    expect(result.results).toEqual([ticketFixture]);
    expect(requests[0].path).toContain('/search/tickets');
    expect(requests[0].url).toContain(encodeURIComponent('"priority:4"'));
  });

  it('listConversations -> GET /tickets/{id}/conversations', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/tickets/1/conversations', json: [conversationFixture] },
    ]);
    const result = await client.tickets.listConversations(1);
    expect(result).toEqual([conversationFixture]);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/tickets/1/conversations' });
  });

  it('reply -> POST /tickets/{id}/reply', async () => {
    const { client, requests } = clientWith([
      { method: 'POST', path: '/tickets/1/reply', status: 201, json: conversationFixture },
    ]);
    const result = await client.tickets.reply(1, { body: 'hi' });
    expect(result).toEqual(conversationFixture);
    expect(requests[0]).toMatchObject({ method: 'POST', path: '/tickets/1/reply', body: { body: 'hi' } });
  });

  it('createNote -> POST /tickets/{id}/notes', async () => {
    const { client, requests } = clientWith([
      { method: 'POST', path: '/tickets/1/notes', status: 201, json: conversationFixture },
    ]);
    const result = await client.tickets.createNote(1, { body: 'internal', private: true });
    expect(result).toEqual(conversationFixture);
    expect(requests[0]).toMatchObject({
      method: 'POST',
      path: '/tickets/1/notes',
      body: { body: 'internal', private: true },
    });
  });

  it('updateConversation -> PUT /conversations/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'PUT', path: '/conversations/100', json: conversationFixture },
    ]);
    await client.tickets.updateConversation(100, { body: 'edited' });
    expect(requests[0]).toMatchObject({
      method: 'PUT',
      path: '/conversations/100',
      body: { body: 'edited' },
    });
  });

  it('deleteConversation -> DELETE /conversations/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'DELETE', path: '/conversations/100', status: 204 },
    ]);
    await client.tickets.deleteConversation(100);
    expect(requests[0]).toMatchObject({ method: 'DELETE', path: '/conversations/100' });
  });

  it('listAll -> follows Link: rel="next" across pages', async () => {
    const page2 = { ...ticketFixture, id: 2 };
    const { client, requests } = clientWith([
      // Page 1 carries a Link: rel="next" header pointing at page 2.
      {
        method: 'GET',
        path: '/tickets',
        json: [ticketFixture],
        headers: { link: '<https://acme.freshdesk.com/api/v2/tickets?page=2>; rel="next"' },
      },
      // Page 2 has no Link header, so iteration stops.
      { method: 'GET', path: '/tickets', json: [page2] },
    ]);

    const items = [];
    for await (const t of client.tickets.listAll()) {
      items.push(t);
    }

    expect(items).toEqual([ticketFixture, page2]);
    expect(requests[1].path).toBe('/tickets?page=2');
  });
});
