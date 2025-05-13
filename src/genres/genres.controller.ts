import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CACHE_KEYS, RATE_LIMITS } from '../common/constants';
import { GenreDto } from './dto/genre-response.dto';
import { GenresService } from './genres.service';

@ApiTags('Genres')
@Controller('genres')
@UseInterceptors(CacheInterceptor)
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all genres',
    type: [GenreDto],
  })
  @CacheKey(CACHE_KEYS.GENRES.LIST)
  @CacheTTL(RATE_LIMITS.GENRES.LIST.ttl)
  @Throttle({
    default: {
      limit: RATE_LIMITS.GENRES.LIST.limit,
      ttl: RATE_LIMITS.GENRES.LIST.ttl,
    },
  })
  async findAll() {
    return this.genresService.findAll();
  }
}
