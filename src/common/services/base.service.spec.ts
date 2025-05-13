import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { TmdbApiException } from '../exceptions/tmdb-api.exception';
import { BaseService } from './base.service';
import { CustomLogger } from './logger.service';

// Create a concrete test class that extends BaseService
class TestBaseService extends BaseService {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly logger: CustomLogger,
  ) {
    super(configService, logger);
  }
}

describe('BaseService', () => {
  let service: TestBaseService;
  let cacheManager: Cache;

  const mockConfig = {
    API_KEY: 'test-api-key',
    API_BASE_URL: 'https://api.test.com',
    API_VERSION: '3',
    API_LANGUAGE: 'en-US',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TestBaseService,
          useFactory: (configService: ConfigService, logger: CustomLogger) =>
            new TestBaseService(configService, logger),
          inject: [ConfigService, CustomLogger],
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => mockConfig[key]),
          },
        },
        {
          provide: CustomLogger,
          useValue: {
            setContext: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TestBaseService>(TestBaseService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  describe('handleTmdbApiCall', () => {
    const mockEndpoint = '/test';
    const mockCacheKey = 'test:cache:key';
    const mockData = { test: 'data' };

    it('should return cached data if available', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(mockData);

      const result = await service['handleTmdbApiCall'](
        mockEndpoint,
        cacheManager,
        mockCacheKey,
      );

      expect(result).toEqual(mockData);
      expect(cacheManager.get).toHaveBeenCalledWith(mockCacheKey);
    });

    it('should fetch and cache data if not in cache', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(undefined);

      const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as any);

      const result = await service['handleTmdbApiCall'](
        mockEndpoint,
        cacheManager,
        mockCacheKey,
      );

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(mockConfig.API_BASE_URL),
      );
      expect(cacheManager.set).toHaveBeenCalledWith(mockCacheKey, mockData);
    });

    it('should throw TmdbApiException on API error', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);

      const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as any);

      await expect(
        service['handleTmdbApiCall'](mockEndpoint, cacheManager, mockCacheKey),
      ).rejects.toThrow(TmdbApiException);

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should include append_to_response parameter when provided', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(undefined);

      const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as any);

      await service['handleTmdbApiCall'](
        mockEndpoint,
        cacheManager,
        mockCacheKey,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(mockConfig.API_BASE_URL),
      );
    });
  });
});
