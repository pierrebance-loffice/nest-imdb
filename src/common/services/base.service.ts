import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { TmdbApiException } from '../exceptions/tmdb-api.exception';
import { CustomLogger } from './logger.service';

export abstract class BaseService {
  protected readonly apiKey: string;
  protected readonly apiVersion: string;
  protected readonly baseUrl: string;
  protected readonly language: string;

  constructor(
    protected configService: ConfigService,
    protected readonly logger: CustomLogger,
  ) {
    const apiKey = this.configService.get<string>('API_KEY');
    const baseUrl = this.configService.get<string>('API_BASE_URL');
    const apiVersion = this.configService.get<string>('API_VERSION');
    const language = this.configService.get<string>('API_LANGUAGE');

    if (!apiKey || !baseUrl || !apiVersion) {
      throw new Error(
        'API_KEY, API_BASE_URL and API_VERSION must be defined in environment variables',
      );
    }

    this.apiKey = apiKey;
    this.apiVersion = apiVersion;
    this.baseUrl = baseUrl;
    this.language = language;
    this.logger.setContext(this.constructor.name);
  }

  public async handleTmdbApiCall<T>(
    endpoint: string,
    cacheManager: Cache,
    cacheKey: string,
  ): Promise<T> {
    const cachedData = await cacheManager.get<T>(cacheKey);
    if (cachedData) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return cachedData;
    }

    try {
      const url = new URL(`/${this.apiVersion}/${endpoint}`, this.baseUrl);

      url.searchParams.append('api_key', this.apiKey);
      url.searchParams.append('language', this.language);

      this.logger.debug(`Fetching data from TMDB API: ${url.toString()}`);
      const response = await fetch(url.toString());

      if (!response.ok) {
        this.logger.error(`TMDB API error! status: ${response.status}`);
        throw new TmdbApiException(response.status.toString());
      }

      const data = await response.json();
      this.logger.debug(`Received data from TMDB API: ${JSON.stringify(data)}`);

      await cacheManager.set(cacheKey, data);
      return data as T;
    } catch (error) {
      if (error instanceof TmdbApiException) {
        throw error;
      }
      this.logger.error(`Failed to fetch data from TMDB API: ${error.message}`);
      throw new TmdbApiException('500');
    }
  }
}
