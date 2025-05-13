import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_KEYS } from '../common/constants';
import { BaseService } from '../common/services/base.service';
import { CustomLogger } from '../common/services/logger.service';
import { IPerson } from './entities/person.entity';

@Injectable()
export class PeopleService extends BaseService {
  constructor(
    configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    logger: CustomLogger,
  ) {
    super(configService, logger);
  }

  async findOne(id: string): Promise<IPerson> {
    const cacheKey = CACHE_KEYS.PEOPLE.DETAILS(id);
    return this.handleTmdbApiCall<IPerson>(
      `person/${id}?append_to_response=movie_credits,images,external_ids`,
      this.cacheManager,
      cacheKey,
    );
  }
}
