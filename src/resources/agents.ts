import type { HttpClient } from '../http.js';
import type { ListParams } from '../types/common.js';
import type { Agent, AgentCreate, AgentUpdate } from '../types/agents.js';
import { buildPageParams, paginate } from '../pagination.js';

/**
 * Agents (support staff).
 *
 * @see https://developers.freshdesk.com/api/#agents
 */
export class AgentsResource {
  constructor(private readonly getClient: () => Promise<HttpClient>) {}

  /** `GET /agents` — list agents (single page). */
  async list(params: ListParams = {}): Promise<Agent[]> {
    const client = await this.getClient();
    return client.request<Agent[]>('/agents', { params: buildPageParams(params) });
  }

  /** Async iterator over every agent, following `Link: rel="next"`. */
  async *listAll(filters: Record<string, unknown> = {}): AsyncIterable<Agent> {
    const client = await this.getClient();
    yield* paginate<Agent>(client, '/agents', filters);
  }

  /** `GET /agents/{id}` — fetch a single agent. */
  async get(id: number): Promise<Agent> {
    const client = await this.getClient();
    return client.request<Agent>(`/agents/${id}`);
  }

  /** `GET /agents/me` — fetch the agent that owns the API key. */
  async me(): Promise<Agent> {
    const client = await this.getClient();
    return client.request<Agent>('/agents/me');
  }

  /** `POST /agents` — create an agent. */
  async create(body: AgentCreate): Promise<Agent> {
    const client = await this.getClient();
    return client.request<Agent>('/agents', { method: 'POST', body });
  }

  /** `PUT /agents/{id}` — update an agent. */
  async update(id: number, body: AgentUpdate): Promise<Agent> {
    const client = await this.getClient();
    return client.request<Agent>(`/agents/${id}`, { method: 'PUT', body });
  }

  /** `DELETE /agents/{id}` — downgrade an agent to a contact. */
  async delete(id: number): Promise<void> {
    const client = await this.getClient();
    await client.request<void>(`/agents/${id}`, { method: 'DELETE' });
  }
}
