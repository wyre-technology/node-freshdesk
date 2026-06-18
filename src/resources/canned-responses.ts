import type { HttpClient } from '../http.js';
import type { CannedResponseFolder, CannedResponse } from '../types/canned-responses.js';

/**
 * Canned responses. Read-only in this SDK.
 *
 * NOTE: The Freshdesk docs are inconsistent about singular vs. plural for the
 * folder path (some write operations show `/canned_response_folder`). The
 * read paths used here were verified against
 * https://developers.freshdesk.com/api/#canned-responses and are plural:
 *   - list folders:        GET /canned_response_folders
 *   - view a folder:       GET /canned_response_folders/{id}
 *   - responses in folder: GET /canned_response_folders/{id}/responses
 *
 * @see https://developers.freshdesk.com/api/#canned-responses
 */
export class CannedResponsesResource {
  constructor(private readonly getClient: () => Promise<HttpClient>) {}

  /** `GET /canned_response_folders` — list all canned-response folders. */
  async listFolders(): Promise<CannedResponseFolder[]> {
    const client = await this.getClient();
    return client.request<CannedResponseFolder[]>('/canned_response_folders');
  }

  /** `GET /canned_response_folders/{id}` — fetch a single folder. */
  async getFolder(id: number): Promise<CannedResponseFolder> {
    const client = await this.getClient();
    return client.request<CannedResponseFolder>(`/canned_response_folders/${id}`);
  }

  /** `GET /canned_response_folders/{id}/responses` — list responses in a folder. */
  async listResponsesInFolder(id: number): Promise<CannedResponse[]> {
    const client = await this.getClient();
    return client.request<CannedResponse[]>(`/canned_response_folders/${id}/responses`);
  }
}
