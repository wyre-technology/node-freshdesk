import type { HttpClient } from '../http.js';
import type { ListParams, SearchParams, SearchResult } from '../types/common.js';
import type {
  Contact,
  ContactCreate,
  ContactUpdate,
  ContactAutocomplete,
  ContactMerge,
} from '../types/contacts.js';
import type { Agent } from '../types/agents.js';
import { buildPageParams, paginate } from '../pagination.js';

/**
 * Contacts (requesters) and contact lifecycle operations.
 *
 * @see https://developers.freshdesk.com/api/#contacts
 */
export class ContactsResource {
  constructor(private readonly getClient: () => Promise<HttpClient>) {}

  /** `GET /contacts` — list contacts (single page). */
  async list(params: ListParams = {}): Promise<Contact[]> {
    const client = await this.getClient();
    return client.request<Contact[]>('/contacts', { params: buildPageParams(params) });
  }

  /** Async iterator over every contact, following `Link: rel="next"`. */
  async *listAll(filters: Record<string, unknown> = {}): AsyncIterable<Contact> {
    const client = await this.getClient();
    yield* paginate<Contact>(client, '/contacts', filters);
  }

  /** `GET /contacts/{id}` — fetch a single contact. */
  async get(id: number): Promise<Contact> {
    const client = await this.getClient();
    return client.request<Contact>(`/contacts/${id}`);
  }

  /** `POST /contacts` — create a contact. */
  async create(body: ContactCreate): Promise<Contact> {
    const client = await this.getClient();
    return client.request<Contact>('/contacts', { method: 'POST', body });
  }

  /** `PUT /contacts/{id}` — update a contact. */
  async update(id: number, body: ContactUpdate): Promise<Contact> {
    const client = await this.getClient();
    return client.request<Contact>(`/contacts/${id}`, { method: 'PUT', body });
  }

  /** `DELETE /contacts/{id}` — soft-delete (deactivate) a contact. */
  async softDelete(id: number): Promise<void> {
    const client = await this.getClient();
    await client.request<void>(`/contacts/${id}`, { method: 'DELETE' });
  }

  /** `DELETE /contacts/{id}/hard_delete` — permanently delete a contact. */
  async hardDelete(id: number, force = false): Promise<void> {
    const client = await this.getClient();
    await client.request<void>(`/contacts/${id}/hard_delete`, {
      method: 'DELETE',
      params: force ? { force: true } : undefined,
    });
  }

  /** `GET /contacts/autocomplete?term=` — lightweight name/email lookup. */
  async autocomplete(term: string): Promise<ContactAutocomplete[]> {
    const client = await this.getClient();
    return client.request<ContactAutocomplete[]>('/contacts/autocomplete', { params: { term } });
  }

  /** `GET /search/contacts?query="..."` — search contacts. */
  async search(params: SearchParams): Promise<SearchResult<Contact>> {
    const client = await this.getClient();
    return client.request<SearchResult<Contact>>('/search/contacts', {
      params: { query: `"${params.query}"`, ...(params.page && { page: params.page }) },
    });
  }

  /** `PUT /contacts/{id}/make_agent` — promote a contact to an agent. */
  async makeAgent(id: number): Promise<Agent> {
    const client = await this.getClient();
    return client.request<Agent>(`/contacts/${id}/make_agent`, { method: 'PUT' });
  }

  /** `PUT /contacts/{id}/restore` — restore a soft-deleted contact. */
  async restore(id: number): Promise<Contact> {
    const client = await this.getClient();
    return client.request<Contact>(`/contacts/${id}/restore`, { method: 'PUT' });
  }

  /** `POST /contacts/{id}/send_invite` — send an activation invite. */
  async sendInvite(id: number): Promise<void> {
    const client = await this.getClient();
    await client.request<void>(`/contacts/${id}/send_invite`, { method: 'POST' });
  }

  /** `POST /contacts/merge` — merge secondary contacts into a primary contact. */
  async merge(body: ContactMerge): Promise<void> {
    const client = await this.getClient();
    await client.request<void>('/contacts/merge', { method: 'POST', body });
  }
}
