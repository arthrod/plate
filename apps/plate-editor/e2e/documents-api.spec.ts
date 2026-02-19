import { test, expect } from '@playwright/test';

test.describe('Documents API', () => {
  test('POST /api/documents creates a document', async ({ request }) => {
    const res = await request.post('/api/documents');
    expect(res.status()).toBe(200);
    const doc = await res.json();
    expect(doc.id).toBeTruthy();
    expect(doc.title).toBe('Untitled');
    expect(doc.content).toBeDefined();
    expect(doc.updatedAt).toBeTruthy();
  });

  test('GET /api/documents lists documents', async ({ request }) => {
    // Create a doc first
    await request.post('/api/documents');
    const res = await request.get('/api/documents');
    expect(res.status()).toBe(200);
    const list = await res.json();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty('id');
    expect(list[0]).toHaveProperty('title');
  });

  test('GET /api/documents/:id returns a document', async ({ request }) => {
    const createRes = await request.post('/api/documents');
    const doc = await createRes.json();

    const res = await request.get(`/api/documents/${doc.id}`);
    expect(res.status()).toBe(200);
    const fetched = await res.json();
    expect(fetched.id).toBe(doc.id);
    expect(fetched.title).toBe('Untitled');
  });

  test('PUT /api/documents/:id updates a document', async ({ request }) => {
    const createRes = await request.post('/api/documents');
    const doc = await createRes.json();

    const res = await request.put(`/api/documents/${doc.id}`, {
      data: { title: 'Updated Title', content: [{ type: 'p', children: [{ text: 'Hello' }] }] },
    });
    expect(res.status()).toBe(200);

    const getRes = await request.get(`/api/documents/${doc.id}`);
    const updated = await getRes.json();
    expect(updated.title).toBe('Updated Title');
  });

  test('DELETE /api/documents/:id removes a document', async ({ request }) => {
    const createRes = await request.post('/api/documents');
    const doc = await createRes.json();

    const delRes = await request.delete(`/api/documents/${doc.id}`);
    expect(delRes.status()).toBe(200);

    const getRes = await request.get(`/api/documents/${doc.id}`);
    expect(getRes.status()).toBe(404);
  });

  test('GET /api/documents/:id returns 404 for missing doc', async ({ request }) => {
    const res = await request.get('/api/documents/nonexistent-id');
    expect(res.status()).toBe(404);
  });
});
