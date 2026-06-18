import type { Timestamp } from './common.js';

/**
 * A canned-response folder. The folder's `responses` array is only populated
 * when a single folder is fetched (`GET /canned_response_folders/{id}`).
 *
 * This resource is read-only in this SDK.
 *
 * @see https://developers.freshdesk.com/api/#canned-responses
 */
export interface CannedResponseFolder {
  id: number;
  name?: string;
  /** Number of canned responses in the folder. */
  responses_count?: number;
  /** True for system-managed folders such as "Personal". */
  personal?: boolean;
  /** Populated when viewing a single folder; absent in the list response. */
  responses?: CannedResponse[];
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

/** A single canned response within a folder. */
export interface CannedResponse {
  id: number;
  title?: string;
  /** HTML body of the response. */
  content_html?: string;
  /** Plain-text body of the response. */
  content?: string;
  folder_id?: number;
  /** Attachment metadata, shape is free-form on the wire. */
  attachments?: unknown[];
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
