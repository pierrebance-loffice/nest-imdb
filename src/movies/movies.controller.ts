import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import {
  CACHE_KEYS,
  DEFAULT_PAGINATION,
  RATE_LIMITS,
} from '../common/constants';
import { DiscoverMoviesDto } from './dto/discover-movies.dto';
import {
  MovieDetailsDto,
  PaginatedMoviesResponseDto,
} from './dto/movie-response.dto';
import { MoviesService } from './movies.service';

@ApiTags('Movies')
@Controller('movies')
@UseInterceptors(CacheInterceptor)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('discover')
  @ApiOperation({ summary: 'Discover movies' })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of discovered movies',
    type: PaginatedMoviesResponseDto,
  })
  @CacheKey(
    CACHE_KEYS.MOVIES.DISCOVER(
      DEFAULT_PAGINATION.PAGE,
      DEFAULT_PAGINATION.SORT,
    ),
  )
  @CacheTTL(RATE_LIMITS.MOVIES.DISCOVER.ttl)
  @Throttle({
    default: {
      limit: RATE_LIMITS.MOVIES.DISCOVER.limit,
      ttl: RATE_LIMITS.MOVIES.DISCOVER.ttl,
    },
  })
  async discover(@Query() query: DiscoverMoviesDto) {
    const page = query.page ?? 1;
    const sort_by = query.sort_by ?? 'popularity.desc';
    return this.moviesService.discover(page, sort_by);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Movie ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the movie details',
    type: MovieDetailsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
  })
  @CacheKey(CACHE_KEYS.MOVIES.DETAILS(':id'))
  @CacheTTL(RATE_LIMITS.MOVIES.DETAILS.ttl)
  @Throttle({
    default: {
      limit: RATE_LIMITS.MOVIES.DETAILS.limit,
      ttl: RATE_LIMITS.MOVIES.DETAILS.ttl,
    },
  })
  async findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }
}
