import type { Timestamp } from './common.js';

/**
 * An SLA target row keyed by priority within an SLA policy. The exact shape of
 * `sla_target` is free-form on the wire, so it is typed loosely.
 *
 * @see https://developers.freshdesk.com/api/#sla-policies
 */
export interface SlaPolicy {
  id: number;
  name?: string;
  description?: string;
  /** Per-priority response/resolution targets keyed by priority level. */
  sla_target?: Record<string, unknown>;
  applicable_to?: Record<string, unknown>;
  /** Escalation configuration for response and resolution breaches. */
  escalation?: Record<string, unknown>;
  position?: number;
  is_default?: boolean;
  active?: boolean;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface SlaPolicyCreate {
  name: string;
  description?: string;
  sla_target?: Record<string, unknown>;
  applicable_to?: Record<string, unknown>;
  escalation?: Record<string, unknown>;
}

export type SlaPolicyUpdate = Partial<SlaPolicyCreate>;
