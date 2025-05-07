import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IApiGenre } from "./entities/genre.entity";

@Injectable()
export class GenresService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly language: string;
  constructor(private configService: ConfigService) {
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

  async findAll(): Promise<IApiGenre["genres"]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=${this.language}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as IApiGenre;
      return data.genres;
    } catch (error) {
      throw new Error(`Failed to fetch genres: ${error.message}`);
    }
  }
}
