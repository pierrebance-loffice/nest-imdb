import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IPerson } from "./entities/person.entity";

@Injectable()
export class PeopleService {
  private readonly logger = new Logger(PeopleService.name);
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

  async findOne(id: string): Promise<IPerson> {
    try {
      const extra = ["movie_credits", "images", "external_ids"];
      const url = `${this.baseUrl}/person/${id}?language=${
        this.language
      }&api_key=${this.apiKey}&append_to_response=${extra.join(",")}`;

      this.logger.debug(`Fetching person from URL: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        this.logger.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.logger.debug(`Received data: ${JSON.stringify(data)}`);

      return data as IPerson;
    } catch (error) {
      this.logger.error(`Failed to fetch person: ${error.message}`);
      throw new Error(`Failed to fetch person: ${error.message}`);
    }
  }
}
