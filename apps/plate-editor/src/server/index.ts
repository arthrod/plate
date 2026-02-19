import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
import { aiRoutes } from './routes/ai';
import { uploadRoutes } from './routes/upload';

interface StoredDocument {
  id: string;
  title: string;
  content: unknown[];
  updatedAt: string;
}

const app = new Hono();

// CORS: restrict origins in production, allow all in development
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? [];
app.use(
  '/api/*',
  cors({
    origin: allowedOrigins.length > 0
      ? allowedOrigins
      : '*',
  })
);
app.get('/api/health', (c) => c.json({ ok: true }));

app.route('/api/ai', aiRoutes);
app.route('/api/uploadthing', uploadRoutes);

// Phase 1: in-memory document store
const docs = new Map<string, StoredDocument>();

app.get('/api/documents/:id', (c) => {
  const doc = docs.get(c.req.param('id'));
  if (!doc) return c.json({ error: 'Not found' }, 404);
  return c.json(doc);
});

app.put('/api/documents/:id', async (c) => {
  const id = c.req.param('id');
  const existing = docs.get(id);
  const body = await c.req.json();

  // Validate the update payload
  if (body.title !== undefined && typeof body.title !== 'string') {
    return c.json({ error: 'title must be a string' }, 400);
  }
  if (body.content !== undefined && !Array.isArray(body.content)) {
    return c.json({ error: 'content must be an array' }, 400);
  }

  // Upsert: create-if-not-exist so the persistence hook's 404 fallback works
  const base: StoredDocument = existing ?? {
    id,
    title: 'Untitled',
    content: [{ type: 'p', children: [{ text: '' }] }],
    updatedAt: new Date().toISOString(),
  };

  const updated: StoredDocument = {
    ...base,
    ...(body.title !== undefined && { title: body.title }),
    ...(body.content !== undefined && { content: body.content }),
    id,
    updatedAt: new Date().toISOString(),
  };
  docs.set(id, updated);
  return c.json({ ok: true });
});

app.post('/api/documents', (c) => {
  const id = crypto.randomUUID();
  const doc: StoredDocument = { id, title: 'Untitled', content: [{ type: 'p', children: [{ text: '' }] }], updatedAt: new Date().toISOString() };
  docs.set(id, doc);
  return c.json(doc);
});

app.delete('/api/documents/:id', (c) => {
  docs.delete(c.req.param('id'));
  return c.json({ ok: true });
});

app.get('/api/documents', (c) => {
  const list = Array.from(docs.values()).map(({ id, title, updatedAt }) => ({ id, title, updatedAt }));
  return c.json(list);
});

// Serve Vite-built SPA (production)
app.use('/*', serveStatic({ root: './dist/client' }));
app.use('/*', serveStatic({ path: './dist/client/index.html' }));

export default {
  port: Number(process.env.PORT) || 8080,
  fetch: app.fetch,
};
