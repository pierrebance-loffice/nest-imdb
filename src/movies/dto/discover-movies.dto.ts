import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class DiscoverMoviesDto {
  @ApiProperty({
    description: "Page number for pagination",
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: "Sorting criteria",
    required: false,
    default: "popularity.desc",
    example: "popularity.desc",
  })
  @IsOptional()
  @IsString()
  sort_by?: string = "popularity.desc";
}
