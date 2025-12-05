import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { POST } from './route';

// Mock the AI SDK
const mockGenerateObject = mock(() => Promise.resolve({
  object: { text: 'completion text' },
  usage: { promptTokens: 10, completionTokens: 20 },
  finishReason: 'stop',
}));

mock.module('ai', () => ({
  generateObject: mockGenerateObject,
}));

describe('AI Copilot API Route', () => {
  const originalEnv = process.env.AI_GATEWAY_API_KEY;

  beforeEach(() => {
    mockGenerateObject.mockClear();
    // Set default API key for tests
    process.env.AI_GATEWAY_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    // Restore original environment
    if (originalEnv !== undefined) {
      process.env.AI_GATEWAY_API_KEY = originalEnv;
    } else {
      delete process.env.AI_GATEWAY_API_KEY;
    }
  });

  describe('POST handler - authentication', () => {
    it('should accept request with API key in body', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'custom-api-key',
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);
      expect(response.status).toBe(200);
    });

    it('should accept request with environment API key', async () => {
      process.env.AI_GATEWAY_API_KEY = 'env-api-key';
      
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);
      expect(response.status).toBe(200);
    });

    it('should return 401 when API key is missing', async () => {
      delete process.env.AI_GATEWAY_API_KEY;
      
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Missing ai gateway API key.');
    });

    it('should prefer body API key over environment variable', async () => {
      process.env.AI_GATEWAY_API_KEY = 'env-key';
      
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: 'body-key',
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);
      expect(response.status).toBe(200);
      // Verify the call was made (API key would be used internally)
      expect(mockGenerateObject).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST handler - happy path', () => {
    it('should successfully generate text completion with valid request', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'Complete this sentence',
          system: 'You are a helpful assistant',
        }),
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledTimes(1);
      expect(mockGenerateObject).toHaveBeenCalledWith({
        abortSignal: expect.any(AbortSignal),
        model: 'openai/gpt-4',
        prompt: 'Complete this sentence',
        schema: expect.any(Object),
        schemaDescription: 'A text completion suggestion for the editor',
        schemaName: 'completion',
        system: 'You are a helpful assistant',
        temperature: 0.7,
      });
      expect(data).toHaveProperty('object');
      expect(data).toHaveProperty('usage');
      expect(data).toHaveProperty('finishReason');
    });

    it('should use default model when not specified', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          prompt: 'test prompt',
          system: 'test system',
        }),
      });

      const response = await POST(mockRequest);
      expect(response.status).toBe(200);
      
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-4o-mini',
        })
      );
    });

    it('should handle different model names correctly', async () => {
      const models = ['gpt-3.5-turbo', 'gpt-4-turbo', 'gpt-4o'];

      for (const model of models) {
        mockGenerateObject.mockClear();
        const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
          method: 'POST',
          body: JSON.stringify({
            model,
            prompt: 'test prompt',
            system: 'test system',
          }),
        });

        await POST(mockRequest);

        expect(mockGenerateObject).toHaveBeenCalledWith(
          expect.objectContaining({
            model: `openai/${model}`,
          })
        );
      }
    });

    it('should pass through the abort signal from the request', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      await POST(mockRequest);

      const callArgs = mockGenerateObject.mock.calls[0][0];
      expect(callArgs.abortSignal).toBeDefined();
      expect(callArgs.abortSignal).toBeInstanceOf(AbortSignal);
    });

    it('should use correct temperature setting', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      await POST(mockRequest);

      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          temperature: 0.7,
        })
      );
    });

    it('should include zod schema configuration', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      await POST(mockRequest);

      const callArgs = mockGenerateObject.mock.calls[0][0];
      expect(callArgs.schema).toBeDefined();
      expect(callArgs.schemaDescription).toBe('A text completion suggestion for the editor');
      expect(callArgs.schemaName).toBe('completion');
    });
  });

  describe('POST handler - edge cases', () => {
    it('should handle undefined prompt and system parameters', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
        }),
      });

      const response = await POST(mockRequest);

      // Code doesn't validate, so it will try to call AI with undefined values
      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: undefined,
          system: undefined,
        })
      );
    });

    it('should handle empty prompt string', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: '',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);
      expect(response.status).toBe(200);
      
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: '',
        })
      );
    });

    it('should handle empty system string', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: '',
        }),
      });

      const response = await POST(mockRequest);
      expect(response.status).toBe(200);
      
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          system: '',
        })
      );
    });

    it('should handle malformed JSON body', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await expect(POST(mockRequest)).rejects.toThrow();
    });

    it('should handle null values in request body', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: null,
          prompt: null,
          system: null,
        }),
      });

      const response = await POST(mockRequest);
      
      // Null model becomes undefined, triggering default
      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-4o-mini',
        })
      );
    });

    it('should handle very long prompts', async () => {
      const longPrompt = 'a'.repeat(10000);
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: longPrompt,
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: longPrompt,
        })
      );
    });

    it('should handle special characters in prompt and system', async () => {
      const specialCharsPrompt = '<script>alert("xss")</script>\n\t\r\\\'\"';
      const specialCharsSystem = '`${injection}` \\n \\t';

      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: specialCharsPrompt,
          system: specialCharsSystem,
        }),
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: specialCharsPrompt,
          system: specialCharsSystem,
        })
      );
    });

    it('should handle Unicode and emoji in prompts', async () => {
      const unicodePrompt = '你好世界 🚀 مرحبا';
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: unicodePrompt,
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(200);
      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: unicodePrompt,
        })
      );
    });

    it('should handle empty API key string', async () => {
      delete process.env.AI_GATEWAY_API_KEY;
      
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: '',
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);
      
      // Empty string is falsy, so it should return 401
      expect(response.status).toBe(401);
    });
  });

  describe('POST handler - error handling', () => {
    it('should handle AbortError with 408 status', async () => {
      const abortError = new Error('Request aborted');
      abortError.name = 'AbortError';
      mockGenerateObject.mockRejectedValueOnce(abortError);

      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(408);
      const data = await response.json();
      expect(data).toBeNull();
    });

    it('should handle generic errors with 500 status', async () => {
      const genericError = new Error('Internal server error');
      mockGenerateObject.mockRejectedValueOnce(genericError);

      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Failed to process AI request');
    });

    it('should handle AI API rate limit errors', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      rateLimitError.name = 'RateLimitError';
      mockGenerateObject.mockRejectedValueOnce(rateLimitError);

      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Failed to process AI request');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network request failed');
      networkError.name = 'NetworkError';
      mockGenerateObject.mockRejectedValueOnce(networkError);

      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(500);
    });

    it('should handle timeout errors gracefully', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockGenerateObject.mockRejectedValueOnce(timeoutError);

      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(500);
    });

    it('should handle non-Error thrown objects', async () => {
      mockGenerateObject.mockRejectedValueOnce('string error');

      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(500);
    });

    it('should handle errors without name property', async () => {
      const errorWithoutName = { message: 'Something went wrong' };
      mockGenerateObject.mockRejectedValueOnce(errorWithoutName);

      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(500);
    });
  });

  describe('POST handler - response format validation', () => {
    it('should return JSON with correct content-type header', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);

      expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('should preserve all fields from generateObject result', async () => {
      const mockResult = {
        object: { text: 'completion text' },
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
        finishReason: 'stop',
        warnings: [],
      };
      mockGenerateObject.mockResolvedValueOnce(mockResult);

      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data).toEqual(mockResult);
    });

    it('should handle empty object in generateObject result', async () => {
      mockGenerateObject.mockResolvedValueOnce({
        object: { text: '' },
        usage: { promptTokens: 5, completionTokens: 0 },
        finishReason: 'stop',
      });

      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.object.text).toBe('');
    });
  });

  describe('POST handler - model parameter variations', () => {
    it('should handle model name with version suffix', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4-0125-preview',
          prompt: 'test',
          system: 'test',
        }),
      });

      await POST(mockRequest);

      expect(mockGenerateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-4-0125-preview',
        })
      );
    });

    it('should handle model name with special characters', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4-turbo-2024-04-09',
          prompt: 'test',
          system: 'test',
        }),
      });

      const response = await POST(mockRequest);
      expect(response.status).toBe(200);
    });
  });

  describe('POST handler - schema validation', () => {
    it('should use completionSchema with correct structure', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      await POST(mockRequest);

      const callArgs = mockGenerateObject.mock.calls[0][0];
      const schema = callArgs.schema;

      // Verify schema can parse valid data
      expect(() => schema.parse({ text: 'test' })).not.toThrow();
    });

    it('should validate schema rejects invalid data', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      await POST(mockRequest);

      const callArgs = mockGenerateObject.mock.calls[0][0];
      const schema = callArgs.schema;

      // Verify schema rejects data without text field
      expect(() => schema.parse({})).toThrow();
      expect(() => schema.parse({ text: 123 })).toThrow();
    });

    it('should validate schema accepts string text field', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/ai/copilot', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: 'test',
          system: 'test',
        }),
      });

      await POST(mockRequest);

      const callArgs = mockGenerateObject.mock.calls[0][0];
      const schema = callArgs.schema;

      const validData = schema.parse({ text: 'valid completion' });
      expect(validData).toEqual({ text: 'valid completion' });
    });
  });

  describe('POST handler - concurrent requests', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, (_, i) =>
        new NextRequest('http://localhost:3000/api/ai/copilot', {
          method: 'POST',
          body: JSON.stringify({
            model: 'gpt-4',
            prompt: `test ${i}`,
            system: 'test',
          }),
        })
      );

      const responses = await Promise.all(requests.map(req => POST(req)));

      expect(responses).toHaveLength(5);
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
      expect(mockGenerateObject).toHaveBeenCalledTimes(5);
    });

    it('should handle concurrent requests with different models', async () => {
      const models = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'];
      const requests = models.map(model =>
        new NextRequest('http://localhost:3000/api/ai/copilot', {
          method: 'POST',
          body: JSON.stringify({
            model,
            prompt: 'test',
            system: 'test',
          }),
        })
      );

      const responses = await Promise.all(requests.map(req => POST(req)));

      expect(responses).toHaveLength(3);
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
      expect(mockGenerateObject).toHaveBeenCalledTimes(3);
    });
  });
});