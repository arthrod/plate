import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';

import { callCompletionApi } from './callCompletionApi';

describe('callCompletionApi', () => {
  let mockFetch: ReturnType<typeof mock>;

  beforeEach(() => {
    mockFetch = mock(() => Promise.resolve());
  });

  afterEach(() => {
    mockFetch.mockClear();
  });

  describe('response format compatibility', () => {
    it('should accept response with text field from structured output', async () => {
      // This simulates the response from generateObject with completionSchema
      const structuredResponse = {
        text: 'Hello world completion',
      };

      mockFetch.mockImplementation(() =>
        Promise.resolve({
          body: {},
          json: () => Promise.resolve(structuredResponse),
          ok: true,
        })
      );

      const result = await callCompletionApi({
        api: '/api/ai/copilot',
        fetch: mockFetch as unknown as typeof fetch,
        prompt: 'test prompt',
      });

      expect(result).toBe('Hello world completion');
    });

    it('should throw error when text field is missing', async () => {
      // Response without text field should fail
      const invalidResponse = {
        completion: 'some text', // wrong field name
      };

      mockFetch.mockImplementation(() =>
        Promise.resolve({
          body: {},
          json: () => Promise.resolve(invalidResponse),
          ok: true,
        })
      );

      let errorMessage = '';
      await callCompletionApi({
        api: '/api/ai/copilot',
        fetch: mockFetch as unknown as typeof fetch,
        prompt: 'test prompt',
        onError: (error) => {
          errorMessage = error.message;
        },
      });

      expect(errorMessage).toBe('The response does not contain a text field.');
    });

    it('should throw error when text field is empty string', async () => {
      const emptyTextResponse = {
        text: '',
      };

      mockFetch.mockImplementation(() =>
        Promise.resolve({
          body: {},
          json: () => Promise.resolve(emptyTextResponse),
          ok: true,
        })
      );

      let errorMessage = '';
      await callCompletionApi({
        api: '/api/ai/copilot',
        fetch: mockFetch as unknown as typeof fetch,
        prompt: 'test prompt',
        onError: (error) => {
          errorMessage = error.message;
        },
      });

      expect(errorMessage).toBe('The response does not contain a text field.');
    });

    it('should call setCompletion with the text value', async () => {
      const structuredResponse = {
        text: 'AI generated completion',
      };

      mockFetch.mockImplementation(() =>
        Promise.resolve({
          body: {},
          json: () => Promise.resolve(structuredResponse),
          ok: true,
        })
      );

      let completionValue = '';
      await callCompletionApi({
        api: '/api/ai/copilot',
        fetch: mockFetch as unknown as typeof fetch,
        prompt: 'test prompt',
        setCompletion: (value) => {
          completionValue = value;
        },
      });

      expect(completionValue).toBe('AI generated completion');
    });

    it('should call onFinish with prompt and completion', async () => {
      const structuredResponse = {
        text: 'completion text',
      };

      mockFetch.mockImplementation(() =>
        Promise.resolve({
          body: {},
          json: () => Promise.resolve(structuredResponse),
          ok: true,
        })
      );

      let finishPrompt = '';
      let finishCompletion = '';
      await callCompletionApi({
        api: '/api/ai/copilot',
        fetch: mockFetch as unknown as typeof fetch,
        prompt: 'my prompt',
        onFinish: (prompt, completion) => {
          finishPrompt = prompt;
          finishCompletion = completion;
        },
      });

      expect(finishPrompt).toBe('my prompt');
      expect(finishCompletion).toBe('completion text');
    });
  });

  describe('request format', () => {
    it('should send prompt in request body', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          body: {},
          json: () => Promise.resolve({ text: 'response' }),
          ok: true,
        })
      );

      await callCompletionApi({
        api: '/api/ai/copilot',
        fetch: mockFetch as unknown as typeof fetch,
        prompt: 'test prompt',
      });

      expect(mockFetch).toHaveBeenCalled();
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0]).toBe('/api/ai/copilot');
      expect(callArgs[1].method).toBe('POST');
      expect(callArgs[1].headers).toEqual({
        'Content-Type': 'application/json',
      });
      const requestBody = JSON.parse(callArgs[1].body);
      expect(requestBody).toEqual({ prompt: 'test prompt' });
    });

    it('should include additional body parameters', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          body: {},
          json: () => Promise.resolve({ text: 'response' }),
          ok: true,
        })
      );

      await callCompletionApi({
        api: '/api/ai/copilot',
        body: { model: 'gpt-4o-mini', system: 'You are helpful' },
        fetch: mockFetch as unknown as typeof fetch,
        prompt: 'test prompt',
      });

      expect(mockFetch).toHaveBeenCalled();
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0]).toBe('/api/ai/copilot');
      const requestBody = JSON.parse(callArgs[1].body);
      expect(requestBody).toEqual({
        model: 'gpt-4o-mini',
        prompt: 'test prompt',
        system: 'You are helpful',
      });
    });
  });
});
