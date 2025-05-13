import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_KEYS, DEFAULT_PAGINATION } from '../common/constants';
import { BaseService } from '../common/services/base.service';
import { CustomLogger } from '../common/services/logger.service';
import { GenresService } from '../genres/genres.service';
import { PaginatedMoviesResponseDto } from './dto/movie-response.dto';
import { IMovieDetails } from './entities/movie.entity';

@Injectable()
export class MoviesService extends BaseService {
  constructor(
    private genresService: GenresService,
    configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    logger: CustomLogger,
  ) {
    super(configService, logger);
  }

  async findOne(id: string): Promise<IMovieDetails> {
    const cacheKey = CACHE_KEYS.MOVIES.DETAILS(id);
    return this.handleTmdbApiCall<IMovieDetails>(
      `movie/${id}?append_to_response=keywords,credits,images,videos`,
      this.cacheManager,
      cacheKey,
    );
  }

  async discover(
    page: number = DEFAULT_PAGINATION.PAGE,
    sort_by: string = DEFAULT_PAGINATION.SORT,
  ): Promise<PaginatedMoviesResponseDto> {
    const cacheKey = CACHE_KEYS.MOVIES.DISCOVER(page, sort_by);
    const data = await this.handleTmdbApiCall<PaginatedMoviesResponseDto>(
      `discover/movie?page=${page}&sort_by=${sort_by}&include_adult=false&include_video=false`,
      this.cacheManager,
      cacheKey,
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
