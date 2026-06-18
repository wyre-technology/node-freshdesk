import { describe, it, expect } from 'vitest';
import { clientWith } from '../mocks/handlers.js';
import { contactFixture, agentFixture } from '../fixtures/index.js';

describe('ContactsResource', () => {
  it('list -> GET /contacts', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/contacts', json: [contactFixture] },
    ]);
    const result = await client.contacts.list();
    expect(result).toEqual([contactFixture]);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/contacts' });
  });

  it('get -> GET /contacts/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/contacts/5', json: contactFixture },
    ]);
    const result = await client.contacts.get(5);
    expect(result).toEqual(contactFixture);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/contacts/5' });
  });

  it('create -> POST /contacts', async () => {
    const { client, requests } = clientWith([
      { method: 'POST', path: '/contacts', status: 201, json: contactFixture },
    ]);
    await client.contacts.create({ name: 'Ada', email: 'ada@example.com' });
    expect(requests[0]).toMatchObject({
      method: 'POST',
      path: '/contacts',
      body: { name: 'Ada', email: 'ada@example.com' },
    });
  });

  it('update -> PUT /contacts/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'PUT', path: '/contacts/5', json: contactFixture },
    ]);
    await client.contacts.update(5, { job_title: 'Engineer' });
    expect(requests[0]).toMatchObject({ method: 'PUT', path: '/contacts/5' });
  });

  it('softDelete -> DELETE /contacts/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'DELETE', path: '/contacts/5', status: 204 },
    ]);
    await client.contacts.softDelete(5);
    expect(requests[0]).toMatchObject({ method: 'DELETE', path: '/contacts/5' });
  });

  it('hardDelete -> DELETE /contacts/{id}/hard_delete', async () => {
    const { client, requests } = clientWith([
      { method: 'DELETE', path: '/contacts/5/hard_delete', status: 204 },
    ]);
    await client.contacts.hardDelete(5, true);
    expect(requests[0]).toMatchObject({ method: 'DELETE' });
    expect(requests[0].path).toBe('/contacts/5/hard_delete?force=true');
  });

  it('autocomplete -> GET /contacts/autocomplete?term=', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/contacts/autocomplete', json: [{ id: 5, name: 'Ada' }] },
    ]);
    await client.contacts.autocomplete('ada');
    expect(requests[0].path).toBe('/contacts/autocomplete?term=ada');
  });

  it('search -> GET /search/contacts?query="..."', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/search/contacts', json: { results: [contactFixture], total: 1 } },
    ]);
    const result = await client.contacts.search({ query: 'email:ada@example.com' });
    expect(result).toEqual({ results: [contactFixture], total: 1 });
    expect(requests[0].url).toContain(encodeURIComponent('"email:ada@example.com"'));
  });

  it('makeAgent -> PUT /contacts/{id}/make_agent', async () => {
    const { client, requests } = clientWith([
      { method: 'PUT', path: '/contacts/5/make_agent', json: agentFixture },
    ]);
    const result = await client.contacts.makeAgent(5);
    expect(result).toEqual(agentFixture);
    expect(requests[0]).toMatchObject({ method: 'PUT', path: '/contacts/5/make_agent' });
  });

  it('restore -> PUT /contacts/{id}/restore', async () => {
    const { client, requests } = clientWith([
      { method: 'PUT', path: '/contacts/5/restore', json: contactFixture },
    ]);
    await client.contacts.restore(5);
    expect(requests[0]).toMatchObject({ method: 'PUT', path: '/contacts/5/restore' });
  });

  it('sendInvite -> POST /contacts/{id}/send_invite', async () => {
    const { client, requests } = clientWith([
      { method: 'POST', path: '/contacts/5/send_invite', status: 204 },
    ]);
    await client.contacts.sendInvite(5);
    expect(requests[0]).toMatchObject({ method: 'POST', path: '/contacts/5/send_invite' });
  });

  it('merge -> POST /contacts/merge', async () => {
    const { client, requests } = clientWith([
      { method: 'POST', path: '/contacts/merge', status: 204 },
    ]);
    await client.contacts.merge({ primary_contact_id: 5, secondary_contact_ids: [6, 7] });
    expect(requests[0]).toMatchObject({
      method: 'POST',
      path: '/contacts/merge',
      body: { primary_contact_id: 5, secondary_contact_ids: [6, 7] },
    });
  });
});
