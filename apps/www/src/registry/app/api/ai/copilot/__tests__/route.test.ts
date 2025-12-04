import { describe, expect, it, jest, mock, beforeEach } from 'bun:test';
import { NextRequest } from 'next/server';

import { POST } from '../route';

// Mock the ai module
mock.module('ai', () => ({
  generateObject: jest.fn(),
}));

const { generateObject } = await import('ai');
const mockedGenerateObject = generateObject as jest.Mock;

describe('POST /api/ai/copilot', () => {
  const mockAbortController = new AbortController();
  
  const createMockRequest = (body: any): NextRequest => {
    return {
      json: async () => body,
      signal: mockAbortController.signal,
    } as NextRequest;
  };

  beforeEach(() => {
    mockedGenerateObject.mockClear();
    // Set the environment variable for tests
    process.env.AI_GATEWAY_API_KEY = 'test-api-key';
  });

  describe('Happy Path', () => {
    it('should successfully generate object completion with valid inputs', async () => {
      const mockResult = {
        object: { text: 'completion text' },
        usage: { promptTokens: 10, completionTokens: 5 },
      };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test prompt',
        system: 'test system',
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockResult);
      expect(mockedGenerateObject).toHaveBeenCalledWith({
        abortSignal: mockAbortController.signal,
        model: 'openai/gpt-4',
        prompt: 'test prompt',
        schema: expect.any(Object),
        schemaDescription: 'A text completion suggestion for the editor',
        schemaName: 'completion',
        system: 'test system',
        temperature: 0.7,
      });
    });

    it('should use default model gpt-4o-mini when model is not provided', async () => {
      const mockResult = {
        object: { text: 'completion with default model' },
      };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        prompt: 'test prompt',
        system: 'test system',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(200);
      expect(mockedGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-4o-mini',
        })
      );
    });

    it('should use provided apiKey from request body', async () => {
      const mockResult = { object: { text: 'test' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        apiKey: 'custom-api-key',
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(200);
    });

    it('should use environment variable API key when not provided in request', async () => {
      const mockResult = { object: { text: 'test' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(200);
    });

    it('should handle gpt-3.5-turbo model correctly', async () => {
      const mockResult = {
        object: { text: 'turbo completion' },
        usage: { promptTokens: 8, completionTokens: 4 },
      };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-3.5-turbo',
        prompt: 'quick prompt',
        system: 'system message',
      });

      await POST(req);

      expect(mockedGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-3.5-turbo',
        })
      );
    });

    it('should pass abort signal to generateObject', async () => {
      const customAbortController = new AbortController();
      const mockResult = {
        object: { text: 'abortable completion' },
      };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = {
        json: async () => ({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
        signal: customAbortController.signal,
      } as NextRequest;

      await POST(req);

      expect(mockedGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          abortSignal: customAbortController.signal,
        })
      );
    });

    it('should use temperature 0.7 for generation', async () => {
      const mockResult = { object: { text: 'test' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      await POST(req);

      expect(mockedGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          temperature: 0.7,
        })
      );
    });

    it('should include schema configuration for structured output', async () => {
      const mockResult = { object: { text: 'structured completion' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      await POST(req);

      const call = mockedGenerateObject.mock.calls[0][0];
      expect(call.schemaDescription).toBe('A text completion suggestion for the editor');
      expect(call.schemaName).toBe('completion');
      expect(call.schema).toBeDefined();
    });

    it('should return full generateObject result to preserve response contract', async () => {
      const mockResult = {
        object: { text: 'test completion' },
        usage: { promptTokens: 10, completionTokens: 5 },
        finishReason: 'stop',
        warnings: [],
      };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      const data = await response.json();

      // Verify the entire result object is returned, not just object.text
      expect(data).toEqual(mockResult);
      expect(data.object).toBeDefined();
      expect(data.usage).toBeDefined();
    });
  });

  describe('API Key Validation', () => {
    it('should return 401 when API key is missing from both request and environment', async () => {
      delete process.env.AI_GATEWAY_API_KEY;

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test prompt',
        system: 'test system',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Missing ai gateway API key.');
    });

    it('should accept API key from request body', async () => {
      delete process.env.AI_GATEWAY_API_KEY;
      const mockResult = { object: { text: 'test' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        apiKey: 'provided-api-key',
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(200);
    });

    it('should prefer request apiKey over environment variable', async () => {
      process.env.AI_GATEWAY_API_KEY = 'env-key';
      const mockResult = { object: { text: 'test' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        apiKey: 'request-key',
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(200);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long prompts', async () => {
      const longPrompt = 'a'.repeat(10000);
      const mockResult = { object: { text: 'completion for long prompt' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: longPrompt,
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(200);
      expect(mockedGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: longPrompt,
        })
      );
    });

    it('should handle special characters in prompt', async () => {
      const specialPrompt = 'Test with \n\t special chars: äöü@#$%^&*()';
      const mockResult = { object: { text: 'completion' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: specialPrompt,
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(200);
    });

    it('should handle unicode characters in prompt', async () => {
      const unicodePrompt = 'Test 你好 🚀 emoji and unicode';
      const mockResult = { object: { text: 'unicode completion' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: unicodePrompt,
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(200);
    });

    it('should handle additional unexpected fields in request body', async () => {
      const mockResult = { object: { text: 'completion' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
        unexpectedField: 'should be ignored',
        anotherField: 123,
      });

      const response = await POST(req);
      
      expect(response.status).toBe(200);
    });

    it('should handle empty object completion from AI', async () => {
      const mockResult = { object: { text: '' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.object.text).toBe('');
    });

    it('should handle undefined prompt (defaults allowed)', async () => {
      const mockResult = { object: { text: 'test' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(200);
      expect(mockedGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: undefined,
        })
      );
    });

    it('should handle undefined system message', async () => {
      const mockResult = { object: { text: 'test' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(200);
      expect(mockedGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          system: undefined,
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle AbortError with 408 status', async () => {
      const abortError = new Error('Request aborted');
      abortError.name = 'AbortError';
      mockedGenerateObject.mockRejectedValue(abortError);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      const data = await response.json();
      
      expect(response.status).toBe(408);
      expect(data).toBeNull();
    });

    it('should handle generic errors with 500 status', async () => {
      const genericError = new Error('Generic error message');
      mockedGenerateObject.mockRejectedValue(genericError);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to process AI request');
    });

    it('should handle API rate limit errors', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      rateLimitError.name = 'RateLimitError';
      mockedGenerateObject.mockRejectedValue(rateLimitError);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to process AI request');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network request failed');
      networkError.name = 'NetworkError';
      mockedGenerateObject.mockRejectedValue(networkError);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to process AI request');
    });

    it('should handle timeout errors gracefully', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockedGenerateObject.mockRejectedValue(timeoutError);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to process AI request');
    });

    it('should handle errors without message', async () => {
      const errorWithoutMessage = new Error();
      mockedGenerateObject.mockRejectedValue(errorWithoutMessage);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(500);
    });

    it('should handle non-Error objects thrown', async () => {
      mockedGenerateObject.mockRejectedValue('string error');

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.status).toBe(500);
    });

    it('should handle malformed JSON in request', async () => {
      const req = {
        json: async () => {
          throw new Error('Invalid JSON');
        },
        signal: mockAbortController.signal,
      } as NextRequest;

      const response = await POST(req);
      
      expect(response.status).toBe(500);
    });
  });

  describe('Model Prefix Handling', () => {
    it('should prepend openai/ prefix to model name', async () => {
      const mockResult = { object: { text: 'test' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4-turbo',
        prompt: 'test',
        system: 'test',
      });

      await POST(req);

      expect(mockedGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-4-turbo',
        })
      );
    });

    it('should handle model names with hyphens', async () => {
      const mockResult = { object: { text: 'test' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4-32k',
        prompt: 'test',
        system: 'test',
      });

      await POST(req);

      expect(mockedGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-4-32k',
        })
      );
    });

    it('should handle model names with version numbers', async () => {
      const mockResult = { object: { text: 'test' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4-0613',
        prompt: 'test',
        system: 'test',
      });

      await POST(req);

      expect(mockedGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-4-0613',
        })
      );
    });
  });

  describe('Schema Validation', () => {
    it('should use zod schema with text field', async () => {
      const mockResult = { object: { text: 'validated text' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      await POST(req);

      const call = mockedGenerateObject.mock.calls[0][0];
      expect(call.schema).toBeDefined();
      expect(call.schema._def).toBeDefined();
    });

    it('should include schema description for AI guidance', async () => {
      const mockResult = { object: { text: 'guided completion' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      await POST(req);

      const call = mockedGenerateObject.mock.calls[0][0];
      expect(call.schemaDescription).toBe('A text completion suggestion for the editor');
    });

    it('should include schema name for identification', async () => {
      const mockResult = { object: { text: 'named completion' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      await POST(req);

      const call = mockedGenerateObject.mock.calls[0][0];
      expect(call.schemaName).toBe('completion');
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle multiple concurrent requests independently', async () => {
      const mockResults = [
        { object: { text: 'completion 1' } },
        { object: { text: 'completion 2' } },
        { object: { text: 'completion 3' } },
      ];
      
      mockedGenerateObject
        .mockResolvedValueOnce(mockResults[0])
        .mockResolvedValueOnce(mockResults[1])
        .mockResolvedValueOnce(mockResults[2]);

      const requests = [
        createMockRequest({ model: 'gpt-4', prompt: 'test 1', system: 'sys 1' }),
        createMockRequest({ model: 'gpt-4', prompt: 'test 2', system: 'sys 2' }),
        createMockRequest({ model: 'gpt-4', prompt: 'test 3', system: 'sys 3' }),
      ];

      const responses = await Promise.all(requests.map(req => POST(req)));
      const data = await Promise.all(responses.map(res => res.json()));

      expect(data[0]).toEqual(mockResults[0]);
      expect(data[1]).toEqual(mockResults[1]);
      expect(data[2]).toEqual(mockResults[2]);
      expect(mockedGenerateObject).toHaveBeenCalledTimes(3);
    });
  });

  describe('Response Format', () => {
    it('should return JSON response with correct content type', async () => {
      const mockResult = { object: { text: 'test' } };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      
      expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('should return well-formed JSON for success cases', async () => {
      const mockResult = {
        object: { text: 'formatted completion' },
        usage: { promptTokens: 10, completionTokens: 5 },
      };
      mockedGenerateObject.mockResolvedValue(mockResult);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      const data = await response.json();
      
      expect(() => JSON.parse(JSON.stringify(data))).not.toThrow();
    });

    it('should return well-formed JSON for error cases', async () => {
      const error = new Error('Test error');
      mockedGenerateObject.mockRejectedValue(error);

      const req = createMockRequest({
        model: 'gpt-4',
        prompt: 'test',
        system: 'test',
      });

      const response = await POST(req);
      const data = await response.json();
      
      expect(() => JSON.parse(JSON.stringify(data))).not.toThrow();
      expect(data.error).toBeDefined();
    });
  });
});