import type { FreshdeskClientConfig } from './types/common.js';
import { HttpClient } from './http.js';
import { buildBaseUrl } from './auth.js';
import { TicketsResource } from './resources/tickets.js';
import { ContactsResource } from './resources/contacts.js';
import { CompaniesResource } from './resources/companies.js';
import { AgentsResource } from './resources/agents.js';
import { GroupsResource } from './resources/groups.js';
import { SolutionsResource } from './resources/solutions.js';
import { SlaPoliciesResource } from './resources/sla-policies.js';
import { BusinessHoursResource } from './resources/business-hours.js';
import { CannedResponsesResource } from './resources/canned-responses.js';

/**
 * Freshdesk API v2 client.
 *
 * Construct with an account `domain` (the subdomain before `.freshdesk.com`)
 * and an `apiKey`. Resources are exposed as properties and share a single,
 * lazily-created HTTP client.
 *
 * @example
 * const fd = new FreshdeskClient({ domain: 'acme', apiKey: 'xxxxx' });
 * const tickets = await fd.tickets.list();
 */
export class FreshdeskClient {
  readonly tickets: TicketsResource;
  readonly contacts: ContactsResource;
  readonly companies: CompaniesResource;
  readonly agents: AgentsResource;
  readonly groups: GroupsResource;
  readonly solutions: SolutionsResource;
  readonly slaPolicies: SlaPoliciesResource;
  readonly businessHours: BusinessHoursResource;
  readonly cannedResponses: CannedResponsesResource;

  private httpClient: HttpClient | null = null;
  private readonly config: FreshdeskClientConfig;

  constructor(config: FreshdeskClientConfig) {
    this.config = {
      timeout: 30_000,
      maxRetries: 3,
      fetchImpl: globalThis.fetch,
      ...config,
    };

    // Lazy HTTP client getter shared by every resource.
    const getClient = async () => this.getHttpClient();

    this.tickets = new TicketsResource(getClient);
    this.contacts = new ContactsResource(getClient);
    this.companies = new CompaniesResource(getClient);
    this.agents = new AgentsResource(getClient);
    this.groups = new GroupsResource(getClient);
    this.solutions = new SolutionsResource(getClient);
    this.slaPolicies = new SlaPoliciesResource(getClient);
    this.businessHours = new BusinessHoursResource(getClient);
    this.cannedResponses = new CannedResponsesResource(getClient);
  }

  private async getHttpClient(): Promise<HttpClient> {
    if (this.httpClient) {
      return this.httpClient;
    }

    const baseUrl = this.config.baseUrl ?? buildBaseUrl(this.config.domain);

    this.httpClient = new HttpClient({
      baseUrl,
      apiKey: this.config.apiKey,
      timeout: this.config.timeout!,
      maxRetries: this.config.maxRetries!,
      fetchImpl: this.config.fetchImpl!,
    });

    return this.httpClient;
  }
}
