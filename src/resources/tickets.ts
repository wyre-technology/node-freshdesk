import type { HttpClient } from '../http.js';
import type { ListParams, SearchParams, SearchResult } from '../types/common.js';
import type {
  Ticket,
  TicketCreate,
  TicketUpdate,
  TicketConversation,
  TicketReply,
  TicketNote,
  ConversationUpdate,
} from '../types/tickets.js';
import { buildPageParams, paginate } from '../pagination.js';

/**
 * Tickets, their conversations (replies/notes), and ticket search.
 *
 * @see https://developers.freshdesk.com/api/#tickets
 */
export class TicketsResource {
  constructor(private readonly getClient: () => Promise<HttpClient>) {}

  /** `GET /tickets` — list tickets (single page). */
  async list(params: ListParams = {}): Promise<Ticket[]> {
    const client = await this.getClient();
    return client.request<Ticket[]>('/tickets', { params: buildPageParams(params) });
  }

  /** Async iterator over every ticket, following `Link: rel="next"`. */
  async *listAll(filters: Record<string, unknown> = {}): AsyncIterable<Ticket> {
    const client = await this.getClient();
    yield* paginate<Ticket>(client, '/tickets', filters);
  }

  /** `GET /tickets/{id}` — fetch a single ticket. */
  async get(id: number, params: Record<string, unknown> = {}): Promise<Ticket> {
    const client = await this.getClient();
    return client.request<Ticket>(`/tickets/${id}`, { params });
  }

  /** `POST /tickets` — create a ticket. */
  async create(body: TicketCreate): Promise<Ticket> {
    const client = await this.getClient();
    return client.request<Ticket>('/tickets', { method: 'POST', body });
  }

  /** `PUT /tickets/{id}` — update a ticket. */
  async update(id: number, body: TicketUpdate): Promise<Ticket> {
    const client = await this.getClient();
    return client.request<Ticket>(`/tickets/${id}`, { method: 'PUT', body });
  }

  /** `DELETE /tickets/{id}` — move a ticket to trash. */
  async delete(id: number): Promise<void> {
    const client = await this.getClient();
    await client.request<void>(`/tickets/${id}`, { method: 'DELETE' });
  }

  /**
   * `GET /search/tickets?query="..."` — search tickets with the Freshdesk
   * query language. The query string is wrapped in double quotes for you.
   */
  async search(params: SearchParams): Promise<SearchResult<Ticket>> {
    const client = await this.getClient();
    return client.request<SearchResult<Ticket>>('/search/tickets', {
      params: { query: `"${params.query}"`, ...(params.page && { page: params.page }) },
    });
  }

  /** `GET /tickets/{id}/conversations` — list a ticket's conversations. */
  async listConversations(id: number, params: ListParams = {}): Promise<TicketConversation[]> {
    const client = await this.getClient();
    return client.request<TicketConversation[]>(`/tickets/${id}/conversations`, {
      params: buildPageParams(params),
    });
  }

  /** `POST /tickets/{id}/reply` — add a public reply to a ticket. */
  async reply(id: number, body: TicketReply): Promise<TicketConversation> {
    const client = await this.getClient();
    return client.request<TicketConversation>(`/tickets/${id}/reply`, { method: 'POST', body });
  }

  /** `POST /tickets/{id}/notes` — add a note (private by default) to a ticket. */
  async createNote(id: number, body: TicketNote): Promise<TicketConversation> {
    const client = await this.getClient();
    return client.request<TicketConversation>(`/tickets/${id}/notes`, { method: 'POST', body });
  }

  /** `PUT /conversations/{id}` — edit a conversation (reply/note) body. */
  async updateConversation(id: number, body: ConversationUpdate): Promise<TicketConversation> {
    const client = await this.getClient();
    return client.request<TicketConversation>(`/conversations/${id}`, { method: 'PUT', body });
  }

  /** `DELETE /conversations/{id}` — delete a conversation. */
  async deleteConversation(id: number): Promise<void> {
    const client = await this.getClient();
    await client.request<void>(`/conversations/${id}`, { method: 'DELETE' });
  }
}
