import { Hono } from 'hono';

export const uploadRoutes = new Hono();

uploadRoutes.post('/file', async (c) => {
  // Phase 1: placeholder - will integrate with uploadthing or R2 later
  return c.json({ error: 'Upload not yet implemented' }, 501);
});
