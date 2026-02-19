import { test, expect } from '@playwright/test';

test.describe('Health API', () => {
  test('GET /api/health returns ok', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
  });
});
