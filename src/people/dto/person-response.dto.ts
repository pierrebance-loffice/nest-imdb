import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { MovieCreditDto } from "../entities/movie-credit.entity";
import { IPerson } from "../entities/person.entity";

export class PersonDto implements IPerson {
  @ApiProperty({ description: "Person ID" })
  @IsNumber()
  id: number;

  @ApiProperty({ description: "Person name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Person biography" })
  @IsString()
  biography: string;

  @ApiProperty({ description: "Person birthday" })
  @IsString()
  birthday: string;

  @ApiProperty({ description: "Person death day", required: false })
  @IsOptional()
  @IsString()
  deathday?: string;

  @ApiProperty({ description: "Person place of birth" })
  @IsString()
  place_of_birth: string;

  @ApiProperty({ description: "Person profile path" })
  @IsString()
  profile_path: string;

  @ApiProperty({ description: "Person known for department" })
  @IsString()
  known_for_department: string;

  @ApiProperty({ description: "Person popularity" })
  @IsNumber()
  popularity: number;

  @ApiProperty({ description: "Person movie credits", required: false })
  @IsOptional()
  @IsObject()
  movie_credits?: {
    cast: MovieCreditDto[];
    crew: MovieCreditDto[];
  };

  @ApiProperty({ description: "Person images", required: false })
  @IsOptional()
  @IsObject()
  images?: {
    profiles: Array<{
      file_path: string;
      width: number;
      height: number;
    }>;
  };

  @ApiProperty({ description: "Person external IDs", required: false })
  @IsOptional()
  @IsObject()
  external_ids?: {
    imdb_id: string;
    facebook_id: string | null;
    instagram_id: string | null;
    twitter_id: string | null;
  };
}
