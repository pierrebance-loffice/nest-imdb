import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cache } from "cache-manager";
import { CACHE_KEYS, DEFAULT_PAGINATION } from "../common/constants";
import { BaseService } from "../common/services/base.service";
import { CustomLogger } from "../common/services/logger.service";
import { GenresService } from "../genres/genres.service";
import { PaginatedMoviesResponseDto } from "./dto/movie-response.dto";
import { IMovieDetails } from "./entities/movie.entity";

@Injectable()
export class MoviesService extends BaseService {
  constructor(
    private genresService: GenresService,
    configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    logger: CustomLogger
  ) {
    super(configService, logger);
  }

  async findOne(id: string): Promise<IMovieDetails> {
    const cacheKey = CACHE_KEYS.MOVIES.DETAILS(id);
    const appendToResponse = ["keywords", "credits", "images", "videos"];
    const url = `${this.baseUrl}/movie/${id}?language=${
      this.language
    }&api_key=${this.apiKey}&append_to_response=${appendToResponse.join(",")}`;

    return this.handleTmdbApiCall<IMovieDetails>(
      url,
      this.cacheManager,
      cacheKey
    );
  }

  async discover(
    page: number = DEFAULT_PAGINATION.PAGE,
    sort_by: string = DEFAULT_PAGINATION.SORT
  ): Promise<PaginatedMoviesResponseDto> {
    const cacheKey = CACHE_KEYS.MOVIES.DISCOVER(page, sort_by);
    const params = new URLSearchParams({
      page: page.toString(),
      sort_by: sort_by,
      include_adult: "false",
      include_video: "false",
      language: this.language,
      api_key: this.apiKey,
    });

    const url = `${this.baseUrl}/discover/movie?${params.toString()}`;
    const data = await this.handleTmdbApiCall<PaginatedMoviesResponseDto>(
      url,
      this.cacheManager,
      cacheKey
    );

    const genres = await this.genresService.findAll();
    return {
      ...data,
      results: data.results.map((discovery) => ({
        ...discovery,
        genres: discovery.genre_ids
          .map((id) => genres.find((genre) => genre.id === id))
          .filter(Boolean),
      })),
    };
  }
}
