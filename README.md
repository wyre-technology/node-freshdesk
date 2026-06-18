# @wyre-technology/node-freshdesk

Node.js client library for the [Freshdesk v2 API](https://developers.freshdesk.com/api/).

A small, dependency-free (native `fetch`) TypeScript SDK covering the core
Freshdesk help-desk surface: tickets and conversations, contacts, companies,
agents, groups, the solutions knowledge base, SLA policies, business hours, and
canned responses.

## Features

- **Tickets** — list, get, create, update, delete, search, plus conversations
  (list, reply, note, update, delete).
- **Contacts** — full CRUD, soft/hard delete, autocomplete, search, make-agent,
  restore, send-invite, and merge.
- **Companies** — CRUD, autocomplete, and search.
- **Agents** — list, get, `me`, and CRUD.
- **Groups** — CRUD.
- **Solutions** — categories, folders, and articles (nested CRUD).
- **SLA policies** — list, create, update.
- **Business hours** — list, get (read-only).
- **Canned responses** — list folders, get a folder, list responses in a folder
  (read-only).
- Typed errors, automatic retries with backoff, `Retry-After`-aware rate-limit
  handling, and `Link: rel="next"` pagination helpers.

## Installation

This package is published to **GitHub Packages**. Add an `.npmrc` that points the
`@wyre-technology` scope at the GitHub registry:

```
@wyre-technology:registry=https://npm.pkg.github.com
```

Then install:

```bash
npm install @wyre-technology/node-freshdesk
```

## Quick start

```ts
import { FreshdeskClient } from '@wyre-technology/node-freshdesk';

const fd = new FreshdeskClient({
  domain: 'acme', // the subdomain in https://acme.freshdesk.com
  apiKey: process.env.FRESHDESK_API_KEY!,
});

// List tickets (single page)
const tickets = await fd.tickets.list({ perPage: 50 });

// Iterate every ticket, following pagination automatically
for await (const ticket of fd.tickets.listAll()) {
  console.log(ticket.id, ticket.subject);
}

// Create a ticket
const created = await fd.tickets.create({
  subject: 'Printer on fire',
  description: 'Please help',
  email: 'customer@example.com',
  status: 2, // Open
  priority: 1, // Low
});

// Search (returns { results, total })
const { results, total } = await fd.tickets.search({ query: 'priority:4' });
```

## Authentication

Freshdesk uses HTTP Basic auth with the **API key as the username** and a dummy
password of `X` (the password is ignored but must be present):

```
Authorization: Basic base64("<apiKey>:X")
```

The SDK builds this header for you from the `apiKey` you pass to
`FreshdeskClient`. You only ever supply your `{ domain, apiKey }`.

## Rate limits

Freshdesk enforces a **per-account, per-minute** rate limit (the exact ceiling
depends on your plan). When the API returns `429 Too Many Requests`, the SDK
honors the `Retry-After` header and retries up to `maxRetries` times before
throwing a `RateLimitError` that carries the `retryAfter` hint. A small
client-side token bucket also smooths request bursts.

## Error handling

All errors extend `FreshdeskError` (also exported as `ServiceError`):

| Status | Error class            | Notes                                            |
| ------ | ---------------------- | ------------------------------------------------ |
| 400    | `ValidationError`      | Carries the per-field `errors` array.            |
| 401    | `AuthenticationError`  | Invalid or missing API key.                      |
| 403    | `ForbiddenError`       | Authenticated but not permitted.                 |
| 404    | `NotFoundError`        | Resource does not exist.                         |
| 429    | `RateLimitError`       | Carries `retryAfter` (seconds).                  |
| 5xx    | `ServerError`          | Retried automatically before surfacing.          |

```ts
import { ValidationError, RateLimitError } from '@wyre-technology/node-freshdesk';

try {
  await fd.tickets.create({ subject: '', description: '', status: 2, priority: 1 });
} catch (err) {
  if (err instanceof ValidationError) {
    console.error('Field errors:', err.errors);
  } else if (err instanceof RateLimitError) {
    console.error(`Rate limited; retry after ${err.retryAfter}s`);
  } else {
    throw err;
  }
}
```

## Configuration

```ts
new FreshdeskClient({
  domain: 'acme',        // required: subdomain or full host
  apiKey: '...',         // required
  baseUrl: '...',        // optional: override the computed base URL
  timeout: 30_000,       // optional: per-request timeout (ms)
  maxRetries: 3,         // optional: retries for 429 / 5xx / network
  fetchImpl: globalThis.fetch, // optional: inject a custom fetch
});
```

## API reference

See the official Freshdesk API documentation:
<https://developers.freshdesk.com/api/>

## License

Apache-2.0
