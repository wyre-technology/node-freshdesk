import type { HttpClient } from '../http.js';
import type { ListParams } from '../types/common.js';
import type { Group, GroupCreate, GroupUpdate } from '../types/groups.js';
import { buildPageParams, paginate } from '../pagination.js';

/**
 * Agent groups.
 *
 * @see https://developers.freshdesk.com/api/#groups
 */
export class GroupsResource {
  constructor(private readonly getClient: () => Promise<HttpClient>) {}

  /** `GET /groups` — list groups (single page). */
  async list(params: ListParams = {}): Promise<Group[]> {
    const client = await this.getClient();
    return client.request<Group[]>('/groups', { params: buildPageParams(params) });
  }

  /** Async iterator over every group, following `Link: rel="next"`. */
  async *listAll(filters: Record<string, unknown> = {}): AsyncIterable<Group> {
    const client = await this.getClient();
    yield* paginate<Group>(client, '/groups', filters);
  }

  /** `GET /groups/{id}` — fetch a single group. */
  async get(id: number): Promise<Group> {
    const client = await this.getClient();
    return client.request<Group>(`/groups/${id}`);
  }

  /** `POST /groups` — create a group. */
  async create(body: GroupCreate): Promise<Group> {
    const client = await this.getClient();
    return client.request<Group>('/groups', { method: 'POST', body });
  }

  /** `PUT /groups/{id}` — update a group. */
  async update(id: number, body: GroupUpdate): Promise<Group> {
    const client = await this.getClient();
    return client.request<Group>(`/groups/${id}`, { method: 'PUT', body });
  }

  /** `DELETE /groups/{id}` — delete a group. */
  async delete(id: number): Promise<void> {
    const client = await this.getClient();
    await client.request<void>(`/groups/${id}`, { method: 'DELETE' });
  }
}
