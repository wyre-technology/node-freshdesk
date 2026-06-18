import { describe, it, expect } from 'vitest';
import { clientWith } from '../mocks/handlers.js';
import { slaPolicyFixture } from '../fixtures/index.js';

describe('SlaPoliciesResource', () => {
  it('list -> GET /sla_policies', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/sla_policies', json: [slaPolicyFixture] },
    ]);
    const result = await client.slaPolicies.list();
    expect(result).toEqual([slaPolicyFixture]);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/sla_policies' });
  });

  it('create -> POST /sla_policies', async () => {
    const { client, requests } = clientWith([
      { method: 'POST', path: '/sla_policies', status: 201, json: slaPolicyFixture },
    ]);
    await client.slaPolicies.create({ name: 'Default SLA' });
    expect(requests[0]).toMatchObject({ method: 'POST', path: '/sla_policies', body: { name: 'Default SLA' } });
  });

  it('update -> PUT /sla_policies/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'PUT', path: '/sla_policies/41', json: slaPolicyFixture },
    ]);
    await client.slaPolicies.update(41, { description: 'updated' });
    expect(requests[0]).toMatchObject({ method: 'PUT', path: '/sla_policies/41' });
  });
});
