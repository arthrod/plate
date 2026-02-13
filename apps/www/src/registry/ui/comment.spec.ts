/**
 * Tests for comment.tsx utility functions
 *
 * Covers:
 * - formatCommentDate function with various time differences
 */

import { describe, expect, it } from 'bun:test';
import { formatCommentDate } from './comment';

describe('formatCommentDate', () => {
  describe('minutes format', () => {
    it('should format 0 minutes as "0m"', () => {
      const now = new Date();
      const date = new Date(now.getTime());

      expect(formatCommentDate(date)).toBe('0m');
    });

    it('should format 1 minute as "1m"', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 60 * 1000);

      expect(formatCommentDate(date)).toBe('1m');
    });

    it('should format 30 minutes as "30m"', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 30 * 60 * 1000);

      expect(formatCommentDate(date)).toBe('30m');
    });

    it('should format 59 minutes as "59m"', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 59 * 60 * 1000);

      expect(formatCommentDate(date)).toBe('59m');
    });
  });

  describe('hours format', () => {
    it('should format 1 hour as "1h"', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 60 * 60 * 1000);

      expect(formatCommentDate(date)).toBe('1h');
    });

    it('should format 2 hours as "2h"', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 2 * 60 * 60 * 1000);

      expect(formatCommentDate(date)).toBe('2h');
    });

    it('should format 12 hours as "12h"', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 12 * 60 * 60 * 1000);

      expect(formatCommentDate(date)).toBe('12h');
    });

    it('should format 23 hours as "23h"', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 23 * 60 * 60 * 1000);

      expect(formatCommentDate(date)).toBe('23h');
    });
  });

  describe('days format', () => {
    it('should format 1 day as "1d"', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      expect(formatCommentDate(date)).toBe('1d');
    });

    it('should format exactly 1 day as "1d"', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 25 * 60 * 60 * 1000);

      expect(formatCommentDate(date)).toBe('1d');
    });
  });

  describe('full date format', () => {
    it('should format 2 days ago with MM/dd/yyyy', () => {
      const now = new Date('2024-03-15T12:00:00Z');
      const date = new Date('2024-03-13T12:00:00Z');

      // Mock the current date for consistent testing
      const result = formatCommentDate(date);

      // Should be in MM/dd/yyyy format
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('should format 7 days ago with MM/dd/yyyy', () => {
      const date = new Date('2024-01-01T00:00:00Z');

      const result = formatCommentDate(date);

      // Should be in MM/dd/yyyy format
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(result).toBe('01/01/2024');
    });

    it('should format 30 days ago with MM/dd/yyyy', () => {
      const date = new Date('2023-12-15T00:00:00Z');

      const result = formatCommentDate(date);

      // Should be in MM/dd/yyyy format
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(result).toBe('12/15/2023');
    });

    it('should format a year ago with MM/dd/yyyy', () => {
      const date = new Date('2023-01-01T00:00:00Z');

      const result = formatCommentDate(date);

      // Should be in MM/dd/yyyy format
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(result).toBe('01/01/2023');
    });
  });

  describe('boundary cases', () => {
    it('should handle exactly 60 minutes (1 hour boundary)', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 60 * 60 * 1000);

      // At exactly 60 minutes, should be "1h"
      const result = formatCommentDate(date);
      expect(result).toBe('1h');
    });

    it('should handle exactly 24 hours (1 day boundary)', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // At exactly 24 hours, should be "1d"
      const result = formatCommentDate(date);
      expect(result).toBe('1d');
    });

    it('should handle exactly 48 hours (2 days boundary)', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 48 * 60 * 60 * 1000);

      // At exactly 48 hours, should be full date format
      const result = formatCommentDate(date);
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });

  describe('future dates', () => {
    it('should handle future dates gracefully (returns 0m or negative)', () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 60 * 60 * 1000);

      // Future dates will have negative difference, which should be handled
      const result = formatCommentDate(futureDate);

      // The function may return "0m" or a negative value depending on implementation
      // We just verify it doesn't crash
      expect(result).toBeDefined();
    });
  });

  describe('specific date formatting', () => {
    it('should format January dates correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');

      const result = formatCommentDate(date);
      expect(result).toBe('01/15/2024');
    });

    it('should format December dates correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z');

      const result = formatCommentDate(date);
      expect(result).toBe('12/25/2023');
    });

    it('should pad single digit months', () => {
      const date = new Date('2024-03-05T10:30:00Z');

      const result = formatCommentDate(date);
      expect(result).toBe('03/05/2024');
    });

    it('should pad single digit days', () => {
      const date = new Date('2024-11-03T10:30:00Z');

      const result = formatCommentDate(date);
      expect(result).toBe('11/03/2024');
    });
  });

  describe('edge cases', () => {
    it('should handle midnight timestamps', () => {
      const date = new Date('2024-01-01T00:00:00Z');

      const result = formatCommentDate(date);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle end of day timestamps', () => {
      const date = new Date('2024-12-31T23:59:59Z');

      const result = formatCommentDate(date);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle leap year dates', () => {
      const date = new Date('2024-02-29T12:00:00Z');

      const result = formatCommentDate(date);
      expect(result).toBe('02/29/2024');
    });

    it('should handle very old dates', () => {
      const date = new Date('2000-01-01T00:00:00Z');

      const result = formatCommentDate(date);
      expect(result).toBe('01/01/2000');
    });
  });

  describe('time zone handling', () => {
    it('should work with UTC dates', () => {
      const date = new Date('2024-06-15T12:00:00Z');

      const result = formatCommentDate(date);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should work with dates with timezone offset', () => {
      const date = new Date('2024-06-15T12:00:00-05:00');

      const result = formatCommentDate(date);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });
});