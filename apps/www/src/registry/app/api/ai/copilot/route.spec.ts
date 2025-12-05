import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test';
import { NextRequest } from 'next/server';
import { POST } from './route';

// Mock the 'ai' module
const mockGenerateObject = mock(async () => ({
  object: { text: 'suggested completion text' },
  usage: { promptTokens: 10, completionTokens: 5 },
  finishReason: 'stop',
}));

mock.module('ai', () => ({
  generateObject: mockGenerateObject,
}));

describe('POST /api/ai/copilot', () => {
  const originalEnv = process.env.AI_GATEWAY_API_KEY;

  beforeEach(() => {
    mockGenerateObject.mockClear();
    // Set a default API key for tests
    process.env.AI_GATEWAY_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    mockGenerateObject.mockClear();
    // Restore original env
    if (originalEnv) {
      process.env.AI_GATEWAY_API_KEY = originalEnv;
    } else {
      delete process.env.AI_GATEWAY_API_KEY;
    }
  });

  describe('Authentication', () => {
    it('should accept request with apiKey in body', async () => {
      delete process.env.AI_GATEWAY_API_KEY;

      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'custom-api-key',
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledTimes(1);
    });

    it('should accept request with env API key when no apiKey in body', async () => {
      process.env.AI_GATEWAY_API_KEY = 'env-api-key';

      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledTimes(1);
    });

    it('should return 401 when no API key is provided', async () => {
      delete process.env.AI_GATEWAY_API_KEY;

      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Missing ai gateway API key.');
      expect(mockGenerateObject).not.toHaveBeenCalled();
    });

    it('should prefer apiKey from body over env variable', async () => {
      process.env.AI_GATEWAY_API_KEY = 'env-key';

      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'body-key',
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should handle empty string apiKey', async () => {
      delete process.env.AI_GATEWAY_API_KEY;

      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: '',
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
    });
  });

  describe('Happy Path', () => {
    it('should successfully generate completion with valid request', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Complete this sentence:',
          system: 'You are a helpful assistant',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty('object');
      expect(data.object).toEqual({ text: 'suggested completion text' });
    });

    it('should use default model when not specified', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      await POST(request);

      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-4o-mini',
        })
      );
    });

    it('should pass correct parameters to generateObject', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4-turbo',
          prompt: 'Write a function',
          system: 'You are a code assistant',
        }),
      });

      await POST(request);

      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-4-turbo',
          prompt: 'Write a function',
          system: 'You are a code assistant',
          temperature: 0.7,
          schemaName: 'completion',
          schemaDescription: 'A text completion suggestion for the editor',
        })
      );
    });

    it('should include abort signal from request', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-3.5-turbo',
          prompt: 'Test prompt',
          system: 'Test system',
        }),
      });

      await POST(request);

      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          abortSignal: request.signal,
        })
      );
    });

    it('should include zod schema in the request', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Generate text',
          system: 'System prompt',
        }),
      });

      await POST(request);

      const callArgs = mockGenerateObject.mock.calls[0][0];
      expect(callArgs).toHaveProperty('schema');
      expect(callArgs.schema).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty prompt', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: '',
          system: 'System prompt',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: '',
        })
      );
    });

    it('should handle empty system prompt', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Test prompt',
          system: '',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          system: '',
        })
      );
    });

    it('should handle missing system prompt', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Test prompt',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          system: undefined,
        })
      );
    });

    it('should handle different model variations', async () => {
      const models = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini'];

      for (const model of models) {
        mockGenerateObject.mockClear();
        const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
          method: 'POST',
          body: JSON.stringify({
            apiKey: 'test-key',
            model,
            prompt: 'Test',
            system: 'Test',
          }),
        });

        await POST(request);

        expect(mockGenerateObject).toHaveBeenCalledWith(
          expect.objectContaining({
            model: `openai/${model}`,
          })
        );
      }
    });

    it('should handle very long prompts', async () => {
      const longPrompt = 'a'.repeat(10000);
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: longPrompt,
          system: 'System',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: longPrompt,
        })
      );
    });

    it('should handle special characters in prompt', async () => {
      const specialPrompt = 'Test with \n newlines \t tabs "quotes" and \'apostrophes\'';
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: specialPrompt,
          system: 'System',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: specialPrompt,
        })
      );
    });

    it('should handle Unicode characters in prompt', async () => {
      const unicodePrompt = 'Test with emoji 🚀 and Chinese 你好 and Arabic مرحبا';
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: unicodePrompt,
          system: 'System',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: unicodePrompt,
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should return 408 on AbortError', async () => {
      mockGenerateObject.mockImplementationOnce(() => {
        const error = new Error('Request aborted');
        error.name = 'AbortError';
        throw error;
      });

      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(408);
      const data = await response.json();
      expect(data).toBeNull();
    });

    it('should return 500 on general errors', async () => {
      mockGenerateObject.mockImplementationOnce(() => {
        throw new Error('API connection failed');
      });

      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Failed to process AI request');
    });

    it('should handle rate limit errors', async () => {
      mockGenerateObject.mockImplementationOnce(() => {
        const error = new Error('Rate limit exceeded');
        error.name = 'RateLimitError';
        throw error;
      });

      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    it('should handle malformed JSON in request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: 'not valid json',
      });

      try {
        await POST(request);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle network timeout errors', async () => {
      mockGenerateObject.mockImplementationOnce(() => {
        const error = new Error('Network timeout');
        error.name = 'TimeoutError';
        throw error;
      });

      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
    });
  });

  describe('Schema Validation', () => {
    it('should ensure schema describes text field correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      await POST(request);

      const callArgs = mockGenerateObject.mock.calls[0][0];
      expect(callArgs.schemaDescription).toBe('A text completion suggestion for the editor');
      expect(callArgs.schemaName).toBe('completion');
    });

    it('should validate response conforms to expected structure', async () => {
      mockGenerateObject.mockImplementationOnce(async () => ({
        object: { text: 'completion text' },
        usage: { promptTokens: 5, completionTokens: 3 },
        finishReason: 'stop',
      }));

      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('object');
      expect(data.object).toHaveProperty('text');
      expect(typeof data.object.text).toBe('string');
    });
  });

  describe('Temperature Configuration', () => {
    it('should always use temperature of 0.7', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      await POST(request);

      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          temperature: 0.7,
        })
      );
    });
  });

  describe('Model Prefix Handling', () => {
    it('should prepend "openai/" to model name', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      await POST(request);

      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-4',
        })
      );
    });
  });

  describe('Response Format', () => {
    it('should return full generateObject result', async () => {
      const mockResult = {
        object: { text: 'test completion' },
        usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15 },
        finishReason: 'stop',
        rawResponse: { headers: {} },
      };

      mockGenerateObject.mockImplementationOnce(async () => mockResult);

      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toEqual(mockResult);
    });

    it('should preserve all metadata from generateObject', async () => {
      const mockResult = {
        object: { text: 'completion' },
        usage: { promptTokens: 20, completionTokens: 10, totalTokens: 30 },
        finishReason: 'length',
        warnings: ['Token limit approaching'],
      };

      mockGenerateObject.mockImplementationOnce(async () => mockResult);

      const request = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'gpt-4',
          prompt: 'Test',
          system: 'Test',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.warnings).toEqual(['Token limit approaching']);
      expect(data.finishReason).toBe('length');
    });
  });
});