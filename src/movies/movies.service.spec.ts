import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { CustomLogger } from '../common/services/logger.service';
import { GenresService } from '../genres/genres.service';
import { IMovieDetails } from './entities/movie.entity';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let cacheManager: Cache;

  const mockConfig = {
    API_KEY: 'test-api-key',
    API_BASE_URL: 'https://api.test.com',
    API_VERSION: '3',
    API_LANGUAGE: 'en-US',
  };

  const mockMovieDetails: IMovieDetails = {
    id: 1,
    title: 'Test Movie',
    overview: 'Test overview',
    poster_path: '/test.jpg',
    backdrop_path: '/test-backdrop.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [1, 2],
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' },
    ],
    belongs_to_collection: null,
    budget: 1000000,
    homepage: 'https://test.com',
    imdb_id: 'tt123456',
    production_companies: [
      {
        id: 1,
        logo_path: '/logo.jpg',
        name: 'Test Studio',
        origin_country: 'US',
      },
    ],
    production_countries: [
      {
        iso_3166_1: 'US',
        name: 'United States',
      },
    ],
    revenue: 2000000,
    runtime: 120,
    spoken_languages: [
      {
        english_name: 'English',
        iso_639_1: 'en',
        name: 'English',
      },
    ],
    status: 'Released',
    tagline: 'Test tagline',
    videos: {
      results: [
        {
          id: '1',
          iso_639_1: 'en',
          iso_3166_1: 'US',
          key: 'test-key',
          name: 'Test Trailer',
          official: true,
          published_at: '2024-01-01',
          site: 'YouTube',
          size: 1080,
          type: 'Trailer',
        },
      ],
    },
    credits: {
      cast: [
        {
          adult: false,
          gender: 2,
          id: 1,
          known_for_department: 'Acting',
          name: 'Test Actor',
          original_name: 'Test Actor',
          popularity: 100,
          profile_path: '/actor.jpg',
          cast_id: 1,
          character: 'Test Character',
          credit_id: '1',
          order: 0,
        },
      ],
      crew: [
        {
          adult: false,
          gender: 2,
          id: 2,
          known_for_department: 'Directing',
          name: 'Test Director',
          original_name: 'Test Director',
          popularity: 100,
          profile_path: '/director.jpg',
          credit_id: '2',
          department: 'Directing',
          job: 'Director',
        },
      ],
    },
    images: {
      backdrops: [
        {
          aspect_ratio: 1.78,
          height: 1080,
          iso_639_1: null,
          file_path: '/backdrop.jpg',
          vote_average: 5.5,
          vote_count: 100,
          width: 1920,
        },
      ],
      logos: [
        {
          aspect_ratio: 2.5,
          height: 200,
          iso_639_1: null,
          file_path: '/logo.jpg',
          vote_average: 5.5,
          vote_count: 100,
          width: 500,
        },
      ],
      posters: [
        {
          aspect_ratio: 0.667,
          height: 1500,
          iso_639_1: null,
          file_path: '/poster.jpg',
          vote_average: 5.5,
          vote_count: 100,
          width: 1000,
        },
      ],
    },
    keywords: {
      keywords: [
        {
          id: 1,
          name: 'test',
        },
      ],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        MoviesService,
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
          provide: GenresService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              { id: 1, name: 'Action' },
              { id: 2, name: 'Adventure' },
            ]),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  describe('findOne', () => {
    const movieId = '123';

    it('should return movie details from cache if available', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(mockMovieDetails);

      const result = await service.findOne(movieId);

      expect(result).toEqual(mockMovieDetails);
      expect(cacheManager.get).toHaveBeenCalledWith(
        expect.stringContaining(`movies:details:${movieId}`),
      );
    });

    it('should fetch and cache movie details if not in cache', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(undefined);

      const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMovieDetails),
      } as any);

      const result = await service.findOne(movieId);

      expect(result).toEqual(mockMovieDetails);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(mockConfig.API_BASE_URL),
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.stringContaining(`movies:details:${movieId}`),
        mockMovieDetails,
      );
    });

    it('should throw error if movie not found', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);

      const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as any);

      await expect(service.findOne(movieId)).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('discover', () => {
    const page = 1;
    const sort = 'popularity.desc';

    it('should return discovered movies from cache if available', async () => {
      const mockResponse = {
        page: 1,
        results: [mockMovieDetails],
        total_pages: 1,
        total_results: 1,
      };

      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(mockResponse);

      const result = await service.discover(page, sort);

      expect(result).toEqual(mockResponse);
      expect(cacheManager.get).toHaveBeenCalledWith(
        expect.stringContaining(`movies:discover:${page}:${sort}`),
      );
    });

    it('should fetch and cache discovered movies if not in cache', async () => {
      const mockResponse = {
        page: 1,
        results: [mockMovieDetails],
        total_pages: 1,
        total_results: 1,
      };

      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(undefined);

      const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as any);

      const result = await service.discover(page, sort);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(mockConfig.API_BASE_URL),
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.stringContaining(`movies:discover:${page}:${sort}`),
        mockResponse,
      );
    });

    it('should throw error if discovery fails', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);

      const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as any);

      await expect(service.discover(page, sort)).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
