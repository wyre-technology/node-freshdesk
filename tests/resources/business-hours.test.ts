import { describe, it, expect } from 'vitest';
import { clientWith } from '../mocks/handlers.js';
import { businessHoursFixture } from '../fixtures/index.js';

describe('BusinessHoursResource', () => {
  it('list -> GET /business_hours', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/business_hours', json: [businessHoursFixture] },
    ]);
    const result = await client.businessHours.list();
    expect(result).toEqual([businessHoursFixture]);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/business_hours' });
  });

  it('get -> GET /business_hours/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/business_hours/51', json: businessHoursFixture },
    ]);
    const result = await client.businessHours.get(51);
    expect(result).toEqual(businessHoursFixture);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/business_hours/51' });
  });
});
