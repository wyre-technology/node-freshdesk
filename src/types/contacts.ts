import type { Timestamp } from './common.js';

/**
 * A Freshdesk contact (requester).
 *
 * @see https://developers.freshdesk.com/api/#contacts
 */
export interface Contact {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  twitter_id?: string;
  unique_external_id?: string;
  company_id?: number;
  view_all_tickets?: boolean;
  other_emails?: string[];
  address?: string;
  job_title?: string;
  language?: string;
  time_zone?: string;
  description?: string;
  tags?: string[];
  /** True once the contact has verified their email/portal access. */
  active?: boolean;
  /** True when the contact has been soft-deleted. */
  deleted?: boolean;
  custom_fields?: Record<string, unknown>;
  avatar?: Record<string, unknown> | null;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

/** Payload for creating a contact. One of email/phone/mobile/twitter is required. */
export interface ContactCreate {
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  twitter_id?: string;
  unique_external_id?: string;
  company_id?: number;
  view_all_tickets?: boolean;
  other_emails?: string[];
  address?: string;
  job_title?: string;
  language?: string;
  time_zone?: string;
  description?: string;
  tags?: string[];
  custom_fields?: Record<string, unknown>;
}

/** Payload for updating a contact (all fields optional). */
export type ContactUpdate = Partial<ContactCreate>;

/** Lightweight contact shape returned by `/contacts/autocomplete`. */
export interface ContactAutocomplete {
  id: number;
  name?: string;
  email?: string;
}

/** Payload for `POST /contacts/merge`. */
export interface ContactMerge {
  /** The contact that survives the merge. */
  primary_contact_id: number;
  /** Contacts folded into the primary contact. */
  secondary_contact_ids: number[];
  /** Optionally retain specific identity fields from the primary contact. */
  contact?: Record<string, unknown>;
}
