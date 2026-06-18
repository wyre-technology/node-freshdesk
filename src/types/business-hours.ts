import type { Timestamp } from './common.js';

/**
 * A Freshdesk business-hours configuration. The per-day working hours map is
 * free-form on the wire (keyed by weekday), so it is typed loosely.
 *
 * This resource is read-only in the public API.
 *
 * @see https://developers.freshdesk.com/api/#business-hours
 */
export interface BusinessHours {
  id: number;
  name?: string;
  description?: string;
  time_zone?: string;
  /** True for the account's default business-hours configuration. */
  is_default?: boolean;
  /** Per-weekday working hours, keyed by lowercase weekday name. */
  business_hours?: Record<string, unknown>;
  /** Holiday list, shape is free-form on the wire. */
  list_of_holidays?: unknown[];
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
