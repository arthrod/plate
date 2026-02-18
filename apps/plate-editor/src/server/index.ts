import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
import { aiRoutes } from './routes/ai';
import { uploadRoutes } from './routes/upload';

const app = new Hono();

app.use('/api/*', cors());
app.get('/api/health', (c) => c.json({ ok: true }));

app.route('/api/ai', aiRoutes);
app.route('/api/upload', uploadRoutes);

// Phase 1: in-memory document store
const docs = new Map<string, any>();

app.get('/api/documents/:id', (c) => {
  const doc = docs.get(c.req.param('id'));
  if (!doc) return c.json({ error: 'Not found' }, 404);
  return c.json(doc);
});

app.put('/api/documents/:id', async (c) => {
  const body = await c.req.json();
  docs.set(c.req.param('id'), { ...body, id: c.req.param('id'), updatedAt: new Date().toISOString() });
  return c.json({ ok: true });
});

app.post('/api/documents', (c) => {
  const id = crypto.randomUUID();
  const doc = { id, title: 'Untitled', content: [{ type: 'p', children: [{ text: '' }] }], updatedAt: new Date().toISOString() };
  docs.set(id, doc);
  return c.json(doc);
});

app.delete('/api/documents/:id', (c) => {
  docs.delete(c.req.param('id'));
  return c.json({ ok: true });
});

app.get('/api/documents', (c) => {
  const list = Array.from(docs.values()).map(({ id, title, updatedAt }: any) => ({ id, title, updatedAt }));
  return c.json(list);
});

// Serve Vite-built SPA (production)
app.use('/*', serveStatic({ root: './dist/client' }));
app.use('/*', serveStatic({ path: './dist/client/index.html' }));

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
};
