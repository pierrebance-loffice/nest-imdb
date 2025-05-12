import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Cache } from "cache-manager";
import { CustomLogger } from "../common/services/logger.service";
import { IPerson } from "./entities/person.entity";
import { PeopleService } from "./people.service";

describe("PeopleService", () => {
  let service: PeopleService;
  let cacheManager: Cache;
  let configService: ConfigService;
  let logger: CustomLogger;

  const mockConfig = {
    API_KEY: "test-api-key",
    API_BASE_URL: "https://api.test.com",
    API_LANGUAGE: "en-US",
  };

  const mockPerson: IPerson = {
    id: 1,
    name: "Test Person",
    profile_path: "/test.jpg",
    known_for_department: "Acting",
    popularity: 100,
    biography: "Test biography",
    birthday: "1980-01-01",
    deathday: null,
    place_of_birth: "Test City",
    movie_credits: {
      cast: [
        {
          id: 1,
          title: "Test Movie",
          character: "Test Character",
          release_date: "2024-01-01",
          poster_path: "/test.jpg",
        },
      ],
      crew: [
        {
          id: 2,
          title: "Test Movie 2",
          department: "Directing",
          job: "Director",
          release_date: "2024-01-01",
          poster_path: "/test.jpg",
        },
      ],
    },
    images: {
      profiles: [
        {
          file_path: "/profile.jpg",
          width: 1000,
          height: 1500,
        },
      ],
    },
    external_ids: {
      imdb_id: "nm123456",
      facebook_id: null,
      instagram_id: null,
      twitter_id: null,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
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

    service = module.get<PeopleService>(PeopleService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<CustomLogger>(CustomLogger);
  });

  describe("findOne", () => {
    const personId = "123";

    it("should return person details from cache if available", async () => {
      jest.spyOn(cacheManager, "get").mockResolvedValueOnce(mockPerson);

      const result = await service.findOne(personId);

      expect(result).toEqual(mockPerson);
      expect(cacheManager.get).toHaveBeenCalledWith(
        expect.stringContaining(`people:details:${personId}`)
      );
    });

    it("should fetch and cache person details if not in cache", async () => {
      jest.spyOn(cacheManager, "get").mockResolvedValueOnce(null);
      jest.spyOn(cacheManager, "set").mockResolvedValueOnce(undefined);

      const mockFetch = jest.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPerson),
      } as any);

      const result = await service.findOne(personId);

      expect(result).toEqual(mockPerson);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(mockConfig.API_BASE_URL),
        expect.any(Object)
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.stringContaining(`people:details:${personId}`),
        mockPerson
      );
    });

    it("should throw error if person not found", async () => {
      jest.spyOn(cacheManager, "get").mockResolvedValueOnce(null);

      const mockFetch = jest.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as any);

      await expect(service.findOne(personId)).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
