export interface DocumentMeta {
  id: string;
  title: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  content: unknown[];
  updatedAt: string;
}

export interface DocumentStore {
  get(id: string): Promise<Document | null>;
  save(id: string, doc: Partial<Document>): Promise<void>;
  list(): Promise<DocumentMeta[]>;
  create(): Promise<Document>;
  delete(id: string): Promise<void>;
}

export interface AIService {
  command(params: { system: string; prompt: string }): Promise<Response>;
  copilot(params: { prompt: string }): Promise<Response>;
}
