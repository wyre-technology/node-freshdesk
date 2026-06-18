import { describe, it, expect } from 'vitest';
import { clientWith } from '../mocks/handlers.js';
import { groupFixture } from '../fixtures/index.js';

describe('GroupsResource', () => {
  it('list -> GET /groups', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/groups', json: [groupFixture] },
    ]);
    const result = await client.groups.list();
    expect(result).toEqual([groupFixture]);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/groups' });
  });

  it('get -> GET /groups/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/groups/3', json: groupFixture },
    ]);
    const result = await client.groups.get(3);
    expect(result).toEqual(groupFixture);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/groups/3' });
  });

  it('create -> POST /groups', async () => {
    const { client, requests } = clientWith([
      { method: 'POST', path: '/groups', status: 201, json: groupFixture },
    ]);
    await client.groups.create({ name: 'Tier 1' });
    expect(requests[0]).toMatchObject({ method: 'POST', path: '/groups', body: { name: 'Tier 1' } });
  });

  it('update -> PUT /groups/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'PUT', path: '/groups/3', json: groupFixture },
    ]);
    await client.groups.update(3, { description: 'updated' });
    expect(requests[0]).toMatchObject({ method: 'PUT', path: '/groups/3' });
  });

  it('delete -> DELETE /groups/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'DELETE', path: '/groups/3', status: 204 },
    ]);
    await client.groups.delete(3);
    expect(requests[0]).toMatchObject({ method: 'DELETE', path: '/groups/3' });
  });
});
