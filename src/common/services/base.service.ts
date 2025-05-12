import { ConfigService } from "@nestjs/config";
import { Cache } from "cache-manager";
import { CustomLogger } from "./logger.service";

export abstract class BaseService {
  protected readonly apiKey: string;
  protected readonly baseUrl: string;
  protected readonly language: string;

  constructor(
    protected configService: ConfigService,
    protected readonly logger: CustomLogger
  ) {
    const apiKey = this.configService.get<string>("API_KEY");
    const baseUrl = this.configService.get<string>("API_BASE_URL");
    const language = this.configService.get<string>("API_LANGUAGE");

    if (!apiKey || !baseUrl) {
      throw new Error(
        "API_KEY and API_BASE_URL must be defined in environment variables"
      );
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.language = language;
    this.logger.setContext(this.constructor.name);
  }

  protected async handleTmdbApiCall<T>(
    url: string,
    cacheManager: Cache,
    cacheKey: string
  ): Promise<T> {
    const cachedData = await cacheManager.get<T>(cacheKey);
    if (cachedData) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return cachedData;
    }

    try {
      this.logger.debug(`Fetching data from TMDB API: ${url}`);
      const response = await fetch(url);

      if (!response.ok) {
        this.logger.error(`TMDB API error! status: ${response.status}`);
        throw new Error(`TMDB API error! status: ${response.status}`);
      }

      const data = await response.json();
      this.logger.debug(`Received data from TMDB API: ${JSON.stringify(data)}`);

      await cacheManager.set(cacheKey, data);
      return data as T;
    } catch (error) {
      this.logger.error(`Failed to fetch data from TMDB API: ${error.message}`);
      throw error;
    }
  }
}
