import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { CustomLogger } from '../common/services/logger.service';
import { IApiGenre } from './entities/genre.entity';
import { GenresService } from './genres.service';

describe('GenresService', () => {
  let service: GenresService;
  let cacheManager: Cache;

  const mockConfig = {
    API_KEY: 'test-api-key',
    API_BASE_URL: 'https://api.test.com',
    API_VERSION: '3',
    API_LANGUAGE: 'en-US',
  };

  const mockGenres: IApiGenre = {
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' },
      { id: 3, name: 'Comedy' },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        GenresService,
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
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return genres from cache if available', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(mockGenres);

      const result = await service.findAll();

      expect(result).toEqual(mockGenres.genres);
      expect(cacheManager.get).toHaveBeenCalledWith(
        expect.stringContaining('genres:list'),
      );
    });

    it('should fetch and cache genres if not in cache', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(undefined);

      const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGenres),
      } as any);

      const result = await service.findAll();

      expect(result).toEqual(mockGenres.genres);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(mockConfig.API_BASE_URL),
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.stringContaining('genres:list'),
        mockGenres,
      );
    });

    it('should throw error if genres fetch fails', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);

      const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as any);

      await expect(service.findAll()).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
