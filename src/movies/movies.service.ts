import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GenresService } from "../genres/genres.service";
import { IMovie, PaginatedApiDiscoveries } from "./entities/movie.entity";

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly language: string;

  constructor(
    private configService: ConfigService,
    private genresService: GenresService
  ) {
    const apiKey = this.configService.get<string>("API_KEY");
    const baseUrl = this.configService.get<string>("API_BASE_URL");
    const language = this.configService.get<string>("API_LANGUAGE");

    if (!apiKey || !baseUrl) {
      throw new Error(
        "API_KEY and API_BASE_URL must be defined in environment variables"
      );
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.language = language;
  }

  async findAll() {
    // TODO: Implement API call to get all movies
    return [];
  }

  async findOne(id: string): Promise<IMovie> {
    try {
      const extra = ["keywords", "credits", "images", "keywords", "videos"];
      const url = `${this.baseUrl}/movie/${id}?language=${
        this.language
      }&api_key=${this.apiKey}&append_to_response=${extra.join(",")}`;

      this.logger.debug(`Fetching movie from URL: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        this.logger.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.logger.debug(`Received data: ${JSON.stringify(data)}`);

      return data as IMovie;
    } catch (error) {
      this.logger.error(`Failed to fetch movie: ${error.message}`);
      throw new Error(`Failed to fetch movie: ${error.message}`);
    }
  }

  async discover(
    page: number = 1,
    sorting: string = "popularity.desc"
  ): Promise<PaginatedApiDiscoveries> {
    try {
      const query = [
        `page=${page}`,
        `sort_by=${sorting}`,
        `language=${this.language}`,
        `api_key=${this.apiKey}`,
        `include_adult=false`,
        `include_video=false`,
      ];

      const url = `${this.baseUrl}/discover/movie?${query.join("&")}`;
      this.logger.debug(`Fetching discoveries from URL: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        this.logger.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as PaginatedApiDiscoveries;
      const genres = await this.genresService.findAll();

      return {
        ...data,
        results: data.results.map((discovery) => ({
          ...discovery,
          genres: discovery.genre_ids
            .map((id) => genres.find((genre) => genre.id === id))
            .filter(Boolean),
        })),
      };
    } catch (error) {
      this.logger.error(`Failed to fetch discoveries: ${error.message}`);
      throw new Error(`Failed to fetch discoveries: ${error.message}`);
    }
  }
}
