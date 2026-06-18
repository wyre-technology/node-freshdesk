import type { HttpClient } from '../http.js';
import type { BusinessHours } from '../types/business-hours.js';

/**
 * Business hours. Read-only in the public API.
 *
 * @see https://developers.freshdesk.com/api/#business-hours
 */
export class BusinessHoursResource {
  constructor(private readonly getClient: () => Promise<HttpClient>) {}

  /** `GET /business_hours` — list all business-hours configurations. */
  async list(): Promise<BusinessHours[]> {
    const client = await this.getClient();
    return client.request<BusinessHours[]>('/business_hours');
  }

  /** `GET /business_hours/{id}` — fetch a single business-hours configuration. */
  async get(id: number): Promise<BusinessHours> {
    const client = await this.getClient();
    return client.request<BusinessHours>(`/business_hours/${id}`);
  }
}
