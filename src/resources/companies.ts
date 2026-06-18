import type { HttpClient } from '../http.js';
import type { ListParams, SearchParams, SearchResult } from '../types/common.js';
import type {
  Company,
  CompanyCreate,
  CompanyUpdate,
  CompanyAutocomplete,
} from '../types/companies.js';
import { buildPageParams, paginate } from '../pagination.js';

/**
 * Companies (customer accounts).
 *
 * @see https://developers.freshdesk.com/api/#companies
 */
export class CompaniesResource {
  constructor(private readonly getClient: () => Promise<HttpClient>) {}

  /** `GET /companies` — list companies (single page). */
  async list(params: ListParams = {}): Promise<Company[]> {
    const client = await this.getClient();
    return client.request<Company[]>('/companies', { params: buildPageParams(params) });
  }

  /** Async iterator over every company, following `Link: rel="next"`. */
  async *listAll(filters: Record<string, unknown> = {}): AsyncIterable<Company> {
    const client = await this.getClient();
    yield* paginate<Company>(client, '/companies', filters);
  }

  /** `GET /companies/{id}` — fetch a single company. */
  async get(id: number): Promise<Company> {
    const client = await this.getClient();
    return client.request<Company>(`/companies/${id}`);
  }

  /** `POST /companies` — create a company. */
  async create(body: CompanyCreate): Promise<Company> {
    const client = await this.getClient();
    return client.request<Company>('/companies', { method: 'POST', body });
  }

  /** `PUT /companies/{id}` — update a company. */
  async update(id: number, body: CompanyUpdate): Promise<Company> {
    const client = await this.getClient();
    return client.request<Company>(`/companies/${id}`, { method: 'PUT', body });
  }

  /** `DELETE /companies/{id}` — delete a company. */
  async delete(id: number): Promise<void> {
    const client = await this.getClient();
    await client.request<void>(`/companies/${id}`, { method: 'DELETE' });
  }

  /** `GET /companies/autocomplete?name=` — lightweight name lookup. */
  async autocomplete(name: string): Promise<CompanyAutocomplete[]> {
    const client = await this.getClient();
    return client.request<CompanyAutocomplete[]>('/companies/autocomplete', { params: { name } });
  }

  /** `GET /search/companies?query="..."` — search companies. */
  async search(params: SearchParams): Promise<SearchResult<Company>> {
    const client = await this.getClient();
    return client.request<SearchResult<Company>>('/search/companies', {
      params: { query: `"${params.query}"`, ...(params.page && { page: params.page }) },
    });
  }
}
