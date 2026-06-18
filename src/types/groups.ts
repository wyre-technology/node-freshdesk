import type { Timestamp } from './common.js';

/**
 * A Freshdesk agent group.
 *
 * @see https://developers.freshdesk.com/api/#groups
 */
export interface Group {
  id: number;
  name?: string;
  description?: string;
  agent_ids?: number[];
  /** Auto-ticket-assignment toggle. */
  auto_ticket_assign?: boolean | number;
  escalate_to?: number;
  unassigned_for?: string;
  business_hour_id?: number;
  group_type?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

/** Payload for creating a group. */
export interface GroupCreate {
  name: string;
  description?: string;
  agent_ids?: number[];
  auto_ticket_assign?: boolean | number;
  escalate_to?: number;
  unassigned_for?: string;
  business_hour_id?: number;
}

/** Payload for updating a group (all fields optional). */
export type GroupUpdate = Partial<GroupCreate>;
