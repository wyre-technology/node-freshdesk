import type { HttpClient } from '../http.js';
import type { SlaPolicy, SlaPolicyCreate, SlaPolicyUpdate } from '../types/sla-policies.js';

/**
 * SLA policies. Freshdesk exposes list/create/update only — there is no
 * single-get or delete in the public API.
 *
 * @see https://developers.freshdesk.com/api/#sla-policies
 */
export class SlaPoliciesResource {
  constructor(private readonly getClient: () => Promise<HttpClient>) {}

  /** `GET /sla_policies` — list all SLA policies. */
  async list(): Promise<SlaPolicy[]> {
    const client = await this.getClient();
    return client.request<SlaPolicy[]>('/sla_policies');
  }

  /** `POST /sla_policies` — create an SLA policy. */
  async create(body: SlaPolicyCreate): Promise<SlaPolicy> {
    const client = await this.getClient();
    return client.request<SlaPolicy>('/sla_policies', { method: 'POST', body });
  }

  /** `PUT /sla_policies/{id}` — update an SLA policy. */
  async update(id: number, body: SlaPolicyUpdate): Promise<SlaPolicy> {
    const client = await this.getClient();
    return client.request<SlaPolicy>(`/sla_policies/${id}`, { method: 'PUT', body });
  }
}
