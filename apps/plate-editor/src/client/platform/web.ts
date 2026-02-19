import type { DocumentStore, AIService } from './types';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const store: DocumentStore = {
  async get(id) {
    const res = await fetch(`${API_BASE}/api/documents/${id}`);
    if (!res.ok) return null;
    return res.json();
  },
  async save(id, doc) {
    const res = await fetch(`${API_BASE}/api/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    if (!res.ok) throw new Error(`Failed to save document: ${res.status}`);
  },
  async list() {
    const res = await fetch(`${API_BASE}/api/documents`);
    if (!res.ok) return [];
    return res.json();
  },
  async create() {
    const res = await fetch(`${API_BASE}/api/documents`, { method: 'POST' });
    if (!res.ok) throw new Error(`Failed to create document: ${res.status}`);
    return res.json();
  },
  async delete(id) {
    const res = await fetch(`${API_BASE}/api/documents/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete document: ${res.status}`);
  },
};

export const ai: AIService = {
  command: (params) =>
    fetch(`${API_BASE}/api/ai/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }),
  copilot: (params) =>
    fetch(`${API_BASE}/api/ai/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }),
};
