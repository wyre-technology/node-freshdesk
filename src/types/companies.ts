import type { Timestamp } from './common.js';

/**
 * A Freshdesk company.
 *
 * @see https://developers.freshdesk.com/api/#companies
 */
export interface Company {
  id: number;
  name?: string;
  description?: string;
  note?: string;
  domains?: string[];
  health_score?: string;
  account_tier?: string;
  renewal_date?: Timestamp;
  industry?: string;
  custom_fields?: Record<string, unknown>;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

/** Payload for creating a company. */
export interface CompanyCreate {
  name: string;
  description?: string;
  note?: string;
  domains?: string[];
  health_score?: string;
  account_tier?: string;
  renewal_date?: Timestamp;
  industry?: string;
  custom_fields?: Record<string, unknown>;
}

/** Payload for updating a company (all fields optional). */
export type CompanyUpdate = Partial<CompanyCreate>;

/** Lightweight company shape returned by `/companies/autocomplete`. */
export interface CompanyAutocomplete {
  id: number;
  name?: string;
}
