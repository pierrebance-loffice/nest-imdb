import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Cache } from "cache-manager";
import { CustomLogger } from "../common/services/logger.service";
import { IApiGenre } from "./entities/genre.entity";
import { GenresService } from "./genres.service";

describe("GenresService", () => {
  let service: GenresService;
  let cacheManager: Cache;
  let configService: ConfigService;
  let logger: CustomLogger;

  const mockConfig = {
    API_KEY: "test-api-key",
    API_BASE_URL: "https://api.test.com",
    API_LANGUAGE: "en-US",
  };

  const mockGenres: IApiGenre = {
    genres: [
      { id: 1, name: "Action" },
      { id: 2, name: "Adventure" },
      { id: 3, name: "Comedy" },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<CustomLogger>(CustomLogger);
  });

  describe("findAll", () => {
    it("should return genres from cache if available", async () => {
      jest.spyOn(cacheManager, "get").mockResolvedValueOnce(mockGenres);

      const result = await service.findAll();

      expect(result).toEqual(mockGenres.genres);
      expect(cacheManager.get).toHaveBeenCalledWith(
        expect.stringContaining("genres:list")
      );
    });

    it("should fetch and cache genres if not in cache", async () => {
      jest.spyOn(cacheManager, "get").mockResolvedValueOnce(null);
      jest.spyOn(cacheManager, "set").mockResolvedValueOnce(undefined);

      const mockFetch = jest.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGenres),
      } as any);

      const result = await service.findAll();

      expect(result).toEqual(mockGenres.genres);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(mockConfig.API_BASE_URL),
        expect.any(Object)
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.stringContaining("genres:list"),
        mockGenres
      );
    });

    it("should throw error if genres fetch fails", async () => {
      jest.spyOn(cacheManager, "get").mockResolvedValueOnce(null);

      const mockFetch = jest.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as any);

      await expect(service.findAll()).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
