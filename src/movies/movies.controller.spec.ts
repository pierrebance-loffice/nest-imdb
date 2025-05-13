import { CacheModule } from '@nestjs/cache-manager';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { IMovieDetails } from './entities/movie.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

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

  const mockDiscoverResponse = {
    page: 1,
    results: [mockMovieDetails],
    total_pages: 1,
    total_results: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockMovieDetails),
            discover: jest
              .fn()
              .mockImplementation(() => Promise.resolve(mockDiscoverResponse)),
          },
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    const movieId = '123';

    it('should return movie details', async () => {
      const result = await controller.findOne(movieId);

      expect(result).toEqual(mockMovieDetails);
      expect(service.findOne).toHaveBeenCalledWith(movieId);
    });

    it('should throw error if movie not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new Error('Movie not found'));

      await expect(controller.findOne(movieId)).rejects.toThrow(
        'Movie not found',
      );
      expect(service.findOne).toHaveBeenCalledWith(movieId);
    });
  });

  describe('discover', () => {
    it('should return discovered movies with provided parameters', async () => {
      const query = { page: 1, sort_by: 'popularity.desc' };
      const result = await controller.discover(query);

      expect(result).toEqual(mockDiscoverResponse);
      expect(service.discover).toHaveBeenCalledWith(query.page, query.sort_by);
    });

    it('should use default values if parameters are not provided', async () => {
      const query = {};
      const result = await controller.discover(query);

      expect(result).toEqual(mockDiscoverResponse);
      expect(service.discover).toHaveBeenCalledWith(1, 'popularity.desc');
    });

    it('should throw error if discovery fails', async () => {
      const query = { page: 1, sort_by: 'popularity.desc' };
      jest
        .spyOn(service, 'discover')
        .mockRejectedValueOnce(new Error('Discovery failed'));

      await expect(controller.discover(query)).rejects.toThrow(
        'Discovery failed',
      );
      expect(service.discover).toHaveBeenCalledWith(query.page, query.sort_by);
    });
  });
});
