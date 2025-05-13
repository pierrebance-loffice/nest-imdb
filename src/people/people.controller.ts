import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CACHE_KEYS, RATE_LIMITS } from '../common/constants';
import { PersonDto } from './dto/person-response.dto';
import { PeopleService } from './people.service';

@ApiTags('People')
@Controller('people')
@UseInterceptors(CacheInterceptor)
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a person by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Person ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the person details',
    type: PersonDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Person not found',
  })
  @CacheKey(CACHE_KEYS.PEOPLE.DETAILS(':id'))
  @CacheTTL(RATE_LIMITS.PEOPLE.DETAILS.ttl)
  @Throttle({
    default: {
      limit: RATE_LIMITS.PEOPLE.DETAILS.limit,
      ttl: RATE_LIMITS.PEOPLE.DETAILS.ttl,
    },
  })
  async findOne(@Param('id') id: string): Promise<PersonDto> {
    return this.peopleService.findOne(id);
  }
}
