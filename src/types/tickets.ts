import type { Timestamp } from './common.js';

/**
 * A Freshdesk ticket.
 *
 * Fields mirror the API wire format (snake_case). `status`, `priority` and
 * `source` are numeric enums on the wire; the documented defaults are encoded
 * below for convenience but any number is accepted.
 *
 * @see https://developers.freshdesk.com/api/#tickets
 */
export interface Ticket {
  id: number;
  subject?: string;
  description?: string;
  /** Plain-text version of {@link Ticket.description}. */
  description_text?: string;
  /** 2=Open, 3=Pending, 4=Resolved, 5=Closed (plus custom statuses). */
  status?: number;
  /** 1=Low, 2=Medium, 3=High, 4=Urgent. */
  priority?: number;
  /** 1=Email, 2=Portal, 3=Phone, 7=Chat, 9=Feedback Widget, 10=Outbound Email. */
  source?: number;
  /** Ticket type, e.g. "Question", "Incident", "Problem". */
  type?: string;
  requester_id?: number;
  responder_id?: number;
  group_id?: number;
  company_id?: number;
  email?: string;
  phone?: string;
  name?: string;
  product_id?: number;
  tags?: string[];
  cc_emails?: string[];
  fwd_emails?: string[];
  reply_cc_emails?: string[];
  custom_fields?: Record<string, unknown>;
  spam?: boolean;
  is_escalated?: boolean;
  fr_escalated?: boolean;
  due_by?: Timestamp;
  fr_due_by?: Timestamp;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

/** Payload for creating a ticket. One of requester_id/email/phone is required. */
export interface TicketCreate {
  subject: string;
  description: string;
  /** Numeric status (see {@link Ticket.status}). */
  status: number;
  /** Numeric priority (see {@link Ticket.priority}). */
  priority: number;
  requester_id?: number;
  email?: string;
  phone?: string;
  name?: string;
  facebook_id?: string;
  twitter_id?: string;
  unique_external_id?: string;
  source?: number;
  type?: string;
  responder_id?: number;
  group_id?: number;
  company_id?: number;
  product_id?: number;
  tags?: string[];
  cc_emails?: string[];
  custom_fields?: Record<string, unknown>;
  due_by?: Timestamp;
  fr_due_by?: Timestamp;
  email_config_id?: number;
  parent_id?: number;
}

/** Payload for updating a ticket (all fields optional). */
export type TicketUpdate = Partial<TicketCreate>;

/**
 * A conversation entry on a ticket — a public reply or a private/public note.
 *
 * @see https://developers.freshdesk.com/api/#conversations
 */
export interface TicketConversation {
  id: number;
  ticket_id?: number;
  body?: string;
  /** Plain-text version of {@link TicketConversation.body}. */
  body_text?: string;
  /** True for private (internal) notes. */
  private?: boolean;
  /** True for notes that should be visible to the requester. */
  incoming?: boolean;
  user_id?: number;
  support_email?: string;
  to_emails?: string[];
  from_email?: string;
  cc_emails?: string[];
  bcc_emails?: string[];
  source?: number;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

/** Payload for `POST /tickets/{id}/reply` — a public reply. */
export interface TicketReply {
  body: string;
  from_email?: string;
  user_id?: number;
  cc_emails?: string[];
  bcc_emails?: string[];
}

/** Payload for `POST /tickets/{id}/notes` — a note (private by default). */
export interface TicketNote {
  body: string;
  private?: boolean;
  user_id?: number;
  notify_emails?: string[];
  incoming?: boolean;
}

/** Payload for `PUT /conversations/{id}` — edit a note/reply body. */
export interface ConversationUpdate {
  body: string;
}
