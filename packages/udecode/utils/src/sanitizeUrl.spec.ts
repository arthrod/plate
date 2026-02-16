import { sanitizeUrl } from './sanitizeUrl';

describe('sanitizeUrl', () => {
  describe('when permitInvalid is false', () => {
    const options = {
      allowedSchemes: ['http'],
      permitInvalid: false,
    };

    it('should return null when url is invalid', () => {
      expect(sanitizeUrl('invalid', options)).toBeNull();
    });

    it('should return null when url has disallowed scheme', () => {
      expect(sanitizeUrl('javascript://example.com/', options)).toBeNull();
    });

    it('should return url when url is valid', () => {
      expect(sanitizeUrl('http://example.com/', options)).toBe(
        'http://example.com/'
      );
    });
  });

  describe('when permitInvalid is true', () => {
    const options = {
      allowedSchemes: ['http'],
      permitInvalid: true,
    };

    it('should return url when url is invalid', () => {
      expect(sanitizeUrl('invalid', options)).toBe('invalid');
    });

    it('should return null when url has disallowed scheme', () => {
      expect(sanitizeUrl('javascript://example.com/', options)).toBeNull();
    });

    it('should return url when url is valid', () => {
      expect(sanitizeUrl('http://example.com/', options)).toBe(
        'http://example.com/'
      );
    });
  });

  describe('when options are default', () => {
    const options = {};

    it('should use default allowed schemes (http, https, mailto, tel)', () => {
      expect(sanitizeUrl('javascript:alert(1)', options)).toBeNull();
      expect(sanitizeUrl('http://example.com', options)).toBe(
        'http://example.com/'
      );
      expect(sanitizeUrl('https://example.com', options)).toBe(
        'https://example.com/'
      );
      expect(sanitizeUrl('mailto:test@example.com', options)).toBe(
        'mailto:test@example.com'
      );
      expect(sanitizeUrl('tel:1234567890', options)).toBe('tel:1234567890');
    });
  });
});
