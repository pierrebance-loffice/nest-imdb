import { HttpException, HttpStatus } from "@nestjs/common";

export class TmdbApiException extends HttpException {
  constructor(
    message: string,
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly tmdbErrorCode?: number
  ) {
    super(
      {
        message,
        tmdbErrorCode,
        timestamp: new Date().toISOString(),
      },
      status
    );
  }

  static fromHttpStatus(status: number): TmdbApiException {
    switch (status) {
      case 401:
        return new TmdbApiException(
          "Invalid API key: You must be granted a valid key",
          HttpStatus.UNAUTHORIZED,
          7
        );
      case 404:
        return new TmdbApiException(
          "The resource you requested could not be found",
          HttpStatus.NOT_FOUND,
          34
        );
      case 429:
        return new TmdbApiException(
          "Too many requests: Your request count is over the allowed limit",
          HttpStatus.TOO_MANY_REQUESTS,
          25
        );
      default:
        return new TmdbApiException(
          "An error occurred while fetching data from TMDB API",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
}
