import { HttpStatus } from '@nestjs/common';
import { TmdbApiException } from './tmdb-api.exception';

describe('TmdbApiException', () => {
  describe('constructor', () => {
    it('should create an exception with default status', () => {
      const exception = new TmdbApiException('Test error');
      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(exception.getResponse()).toEqual({
        message: 'Test error',
        tmdbErrorCode: undefined,
        timestamp: expect.any(String),
      });
    });

    it('should create an exception with custom status and error code', () => {
      const exception = new TmdbApiException(
        'Test error',
        HttpStatus.BAD_REQUEST,
        123,
      );
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.getResponse()).toEqual({
        message: 'Test error',
        tmdbErrorCode: 123,
        timestamp: expect.any(String),
      });
    });
  });

  describe('fromHttpStatus', () => {
    it('should create a 401 exception', () => {
      const exception = TmdbApiException.fromHttpStatus(401);
      expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      expect(exception.getResponse()).toEqual({
        message: 'Invalid API key: You must be granted a valid key',
        tmdbErrorCode: 7,
        timestamp: expect.any(String),
      });
    });

    it('should create a 404 exception', () => {
      const exception = TmdbApiException.fromHttpStatus(404);
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(exception.getResponse()).toEqual({
        message: 'The resource you requested could not be found',
        tmdbErrorCode: 34,
        timestamp: expect.any(String),
      });
    });

    it('should create a 429 exception', () => {
      const exception = TmdbApiException.fromHttpStatus(429);
      expect(exception.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
      expect(exception.getResponse()).toEqual({
        message:
          'Too many requests: Your request count is over the allowed limit',
        tmdbErrorCode: 25,
        timestamp: expect.any(String),
      });
    });

    it('should create a default exception for unknown status', () => {
      const exception = TmdbApiException.fromHttpStatus(500);
      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(exception.getResponse()).toEqual({
        message: 'An error occurred while fetching data from TMDB API',
        tmdbErrorCode: undefined,
        timestamp: expect.any(String),
      });
    });
  });
});
