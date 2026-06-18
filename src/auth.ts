/**
 * Build the HTTP Basic auth header for the Freshdesk API.
 *
 * Freshdesk authenticates with the API key supplied as the *username* and a
 * dummy password of `X` (the password is ignored but must be present):
 *
 *   Authorization: Basic base64(`${apiKey}:X`)
 *
 * @see https://developers.freshdesk.com/api/#authentication
 */
export function buildBasicAuth(apiKey: string, password = 'X'): string {
  const credentials = `${apiKey}:${password}`;
  const encoded = Buffer.from(credentials, 'utf-8').toString('base64');
  return `Basic ${encoded}`;
}

/**
 * Construct the Freshdesk API v2 base URL from an account subdomain.
 *
 * `domain` is just the subdomain (the part before `.freshdesk.com`). If a
 * caller passes a full host (e.g. `acme.freshdesk.com`) we tolerate it.
 */
export function buildBaseUrl(domain: string): string {
  const subdomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/\.freshdesk\.com.*$/, '')
    .replace(/\/.*$/, '')
    .trim();
  return `https://${subdomain}.freshdesk.com/api/v2`;
}
