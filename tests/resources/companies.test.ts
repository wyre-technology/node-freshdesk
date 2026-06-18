import { describe, it, expect } from 'vitest';
import { clientWith } from '../mocks/handlers.js';
import { companyFixture } from '../fixtures/index.js';

describe('CompaniesResource', () => {
  it('list -> GET /companies', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/companies', json: [companyFixture] },
    ]);
    const result = await client.companies.list();
    expect(result).toEqual([companyFixture]);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/companies' });
  });

  it('get -> GET /companies/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/companies/9', json: companyFixture },
    ]);
    const result = await client.companies.get(9);
    expect(result).toEqual(companyFixture);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/companies/9' });
  });

  it('create -> POST /companies', async () => {
    const { client, requests } = clientWith([
      { method: 'POST', path: '/companies', status: 201, json: companyFixture },
    ]);
    await client.companies.create({ name: 'Acme Corp' });
    expect(requests[0]).toMatchObject({ method: 'POST', path: '/companies', body: { name: 'Acme Corp' } });
  });

  it('update -> PUT /companies/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'PUT', path: '/companies/9', json: companyFixture },
    ]);
    await client.companies.update(9, { industry: 'Software' });
    expect(requests[0]).toMatchObject({ method: 'PUT', path: '/companies/9' });
  });

  it('delete -> DELETE /companies/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'DELETE', path: '/companies/9', status: 204 },
    ]);
    await client.companies.delete(9);
    expect(requests[0]).toMatchObject({ method: 'DELETE', path: '/companies/9' });
  });

  it('autocomplete -> GET /companies/autocomplete?name=', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/companies/autocomplete', json: [{ id: 9, name: 'Acme Corp' }] },
    ]);
    await client.companies.autocomplete('Acme');
    expect(requests[0].path).toBe('/companies/autocomplete?name=Acme');
  });

  it('search -> GET /search/companies?query="..."', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/search/companies', json: { results: [companyFixture], total: 1 } },
    ]);
    const result = await client.companies.search({ query: 'name:Acme' });
    expect(result).toEqual({ results: [companyFixture], total: 1 });
    expect(requests[0].url).toContain(encodeURIComponent('"name:Acme"'));
  });
});
