import { Test, TestingModule } from "@nestjs/testing";
import { IPerson } from "./entities/person.entity";
import { PeopleController } from "./people.controller";
import { PeopleService } from "./people.service";

describe("PeopleController", () => {
  let controller: PeopleController;
  let service: PeopleService;

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
      controllers: [PeopleController],
      providers: [
        {
          provide: PeopleService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PeopleController>(PeopleController);
    service = module.get<PeopleService>(PeopleService);
  });

  describe("findOne", () => {
    const personId = "123";

    it("should return person details", async () => {
      jest.spyOn(service, "findOne").mockResolvedValueOnce(mockPerson);

      const result = await controller.findOne(personId);

      expect(result).toEqual(mockPerson);
      expect(service.findOne).toHaveBeenCalledWith(personId);
    });

    it("should throw error if person not found", async () => {
      jest
        .spyOn(service, "findOne")
        .mockRejectedValueOnce(new Error("Not found"));

      await expect(controller.findOne(personId)).rejects.toThrow("Not found");
      expect(service.findOne).toHaveBeenCalledWith(personId);
    });
  });
});
