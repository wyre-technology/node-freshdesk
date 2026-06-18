import { describe, it, expect } from 'vitest';
import { clientWith } from '../mocks/handlers.js';
import { agentFixture } from '../fixtures/index.js';

describe('AgentsResource', () => {
  it('list -> GET /agents', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/agents', json: [agentFixture] },
    ]);
    const result = await client.agents.list();
    expect(result).toEqual([agentFixture]);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/agents' });
  });

  it('get -> GET /agents/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/agents/7', json: agentFixture },
    ]);
    const result = await client.agents.get(7);
    expect(result).toEqual(agentFixture);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/agents/7' });
  });

  it('me -> GET /agents/me', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/agents/me', json: agentFixture },
    ]);
    const result = await client.agents.me();
    expect(result).toEqual(agentFixture);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/agents/me' });
  });

  it('create -> POST /agents', async () => {
    const { client, requests } = clientWith([
      { method: 'POST', path: '/agents', status: 201, json: agentFixture },
    ]);
    await client.agents.create({ email: 'grace@example.com', ticket_scope: 1 });
    expect(requests[0]).toMatchObject({
      method: 'POST',
      path: '/agents',
      body: { email: 'grace@example.com', ticket_scope: 1 },
    });
  });

  it('update -> PUT /agents/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'PUT', path: '/agents/7', json: agentFixture },
    ]);
    await client.agents.update(7, { occasional: true });
    expect(requests[0]).toMatchObject({ method: 'PUT', path: '/agents/7' });
  });

  it('delete -> DELETE /agents/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'DELETE', path: '/agents/7', status: 204 },
    ]);
    await client.agents.delete(7);
    expect(requests[0]).toMatchObject({ method: 'DELETE', path: '/agents/7' });
  });
});
