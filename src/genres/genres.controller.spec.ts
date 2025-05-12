import { Test, TestingModule } from "@nestjs/testing";
import { IGenre } from "./entities/genre.entity";
import { GenresController } from "./genres.controller";
import { GenresService } from "./genres.service";

describe("GenresController", () => {
  let controller: GenresController;
  let service: GenresService;

  const mockGenres: IGenre[] = [
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 3, name: "Comedy" },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [
        {
          provide: GenresService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GenresController>(GenresController);
    service = module.get<GenresService>(GenresService);
  });

  describe("findAll", () => {
    it("should return an array of genres", async () => {
      jest.spyOn(service, "findAll").mockResolvedValueOnce(mockGenres);

      const result = await controller.findAll();

      expect(result).toEqual(mockGenres);
      expect(service.findAll).toHaveBeenCalled();
    });

    it("should throw error if genres fetch fails", async () => {
      jest
        .spyOn(service, "findAll")
        .mockRejectedValueOnce(new Error("Failed to fetch genres"));

      await expect(controller.findAll()).rejects.toThrow(
        "Failed to fetch genres"
      );
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
