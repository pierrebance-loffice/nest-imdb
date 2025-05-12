import { ApiProperty } from "@nestjs/swagger";
import { IGenre } from "../entities/genre.entity";

export class GenreDto implements IGenre {
  @ApiProperty({ description: "Genre ID" })
  id: number;

  @ApiProperty({ description: "Genre name" })
  name: string;
}

export class GenresResponseDto {
  @ApiProperty({ type: [GenreDto] })
  genres: GenreDto[];
}
