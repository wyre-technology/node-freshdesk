import type { Timestamp } from './common.js';

/** The contact-like profile embedded in an agent record. */
export interface AgentContact {
  active?: boolean;
  email?: string;
  job_title?: string;
  language?: string;
  last_login_at?: Timestamp;
  mobile?: string;
  name?: string;
  phone?: string;
  time_zone?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

/**
 * A Freshdesk agent.
 *
 * @see https://developers.freshdesk.com/api/#agents
 */
export interface Agent {
  id: number;
  available?: boolean;
  occasional?: boolean;
  ticket_scope?: number;
  signature?: string;
  group_ids?: number[];
  role_ids?: number[];
  available_since?: Timestamp;
  type?: string;
  contact?: AgentContact;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

/** Payload for creating an agent. */
export interface AgentCreate {
  email: string;
  ticket_scope: number;
  occasional?: boolean;
  signature?: string;
  group_ids?: number[];
  role_ids?: number[];
  type?: string;
}

/** Payload for updating an agent (all fields optional). */
export type AgentUpdate = Partial<AgentCreate>;
