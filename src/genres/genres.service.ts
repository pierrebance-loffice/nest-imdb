import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cache } from "cache-manager";
import { CACHE_KEYS } from "../common/constants";
import { BaseService } from "../common/services/base.service";
import { CustomLogger } from "../common/services/logger.service";
import { IApiGenre, IGenre } from "./entities/genre.entity";

@Injectable()
export class GenresService extends BaseService {
  constructor(
    configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    logger: CustomLogger
  ) {
    super(configService, logger);
  }

  async findAll(): Promise<IGenre[]> {
    const cacheKey = CACHE_KEYS.GENRES.LIST;
    const url = `${this.baseUrl}/genre/movie/list?language=${this.language}&api_key=${this.apiKey}`;

    const data = await this.handleTmdbApiCall<IApiGenre>(
      url,
      this.cacheManager,
      cacheKey
    );
    return data.genres;
  }
}
