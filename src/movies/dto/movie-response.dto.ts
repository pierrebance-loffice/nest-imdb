import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { IMovie, IMovieDetails } from "../entities/movie.entity";

export class MovieVideoDto {
  @ApiProperty({ description: "Video ID" })
  @IsString()
  id: string;

  @ApiProperty({ description: "ISO 639-1 language code" })
  @IsString()
  iso_639_1: string;

  @ApiProperty({ description: "ISO 3166-1 country code" })
  @IsString()
  iso_3166_1: string;

  @ApiProperty({ description: "Video key" })
  @IsString()
  key: string;

  @ApiProperty({ description: "Video name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Whether the video is official" })
  @IsString()
  official: boolean;

  @ApiProperty({ description: "Publication date" })
  @IsString()
  published_at: string;

  @ApiProperty({ description: "Video site" })
  @IsString()
  site: string;

  @ApiProperty({ description: "Video size" })
  @IsNumber()
  size: number;

  @ApiProperty({ description: "Video type" })
  @IsString()
  type: string;
}

export class MovieCastDto {
  @ApiProperty({ description: "Whether the person is an adult" })
  @IsString()
  adult: boolean;

  @ApiProperty({ description: "Gender" })
  @IsNumber()
  gender: number | null;

  @ApiProperty({ description: "Cast member ID" })
  @IsNumber()
  id: number;

  @ApiProperty({ description: "Known for department" })
  @IsString()
  known_for_department: string;

  @ApiProperty({ description: "Cast member name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Original name" })
  @IsString()
  original_name: string;

  @ApiProperty({ description: "Popularity score" })
  @IsNumber()
  popularity: number;

  @ApiProperty({ description: "Profile image path" })
  @IsString()
  profile_path: string | null;

  @ApiProperty({ description: "Cast ID" })
  @IsNumber()
  cast_id: number;

  @ApiProperty({ description: "Character name" })
  @IsString()
  character: string;

  @ApiProperty({ description: "Credit ID" })
  @IsString()
  credit_id: string;

  @ApiProperty({ description: "Order in credits" })
  @IsNumber()
  order: number;
}

export class MovieCrewDto {
  @ApiProperty({ description: "Whether the person is an adult" })
  @IsString()
  adult: boolean;

  @ApiProperty({ description: "Gender" })
  @IsNumber()
  gender: number | null;

  @ApiProperty({ description: "Crew member ID" })
  @IsNumber()
  id: number;

  @ApiProperty({ description: "Known for department" })
  @IsString()
  known_for_department: string;

  @ApiProperty({ description: "Crew member name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Original name" })
  @IsString()
  original_name: string;

  @ApiProperty({ description: "Popularity score" })
  @IsNumber()
  popularity: number;

  @ApiProperty({ description: "Profile image path" })
  @IsString()
  profile_path: string | null;

  @ApiProperty({ description: "Credit ID" })
  @IsString()
  credit_id: string;

  @ApiProperty({ description: "Department" })
  @IsString()
  department: string;

  @ApiProperty({ description: "Job title" })
  @IsString()
  job: string;
}

export class MovieImageDto {
  @ApiProperty({ description: "Aspect ratio" })
  @IsNumber()
  aspect_ratio: number;

  @ApiProperty({ description: "Image height" })
  @IsNumber()
  height: number;

  @ApiProperty({ description: "ISO 639-1 language code" })
  @IsString()
  iso_639_1: string | null;

  @ApiProperty({ description: "Image file path" })
  @IsString()
  file_path: string;

  @ApiProperty({ description: "Vote average" })
  @IsNumber()
  vote_average: number;

  @ApiProperty({ description: "Vote count" })
  @IsNumber()
  vote_count: number;

  @ApiProperty({ description: "Image width" })
  @IsNumber()
  width: number;
}

export class MovieKeywordDto {
  @ApiProperty({ description: "Keyword ID" })
  @IsNumber()
  id: number;

  @ApiProperty({ description: "Keyword name" })
  @IsString()
  name: string;
}

export class GenreDto {
  @ApiProperty({ description: "Genre ID" })
  @IsNumber()
  id: number;

  @ApiProperty({ description: "Genre name" })
  @IsString()
  name: string;
}

export class MovieDto implements IMovie {
  vote_count: number;
  genre_ids: number[];
  @ApiProperty({
    description: "Movie ID",
    example: 12345,
  })
  @IsNumber({}, { message: "Movie ID must be a number" })
  id: number;

  @ApiProperty({
    description: "Movie title",
    example: "The Shawshank Redemption",
  })
  @IsString({ message: "Title must be a string" })
  title: string;

  @ApiProperty({
    description: "Movie overview",
    example: "Two imprisoned men bond over a number of years...",
  })
  @IsString({ message: "Overview must be a string" })
  overview: string;

  @ApiProperty({
    description: "Movie poster path",
    example: "/poster.jpg",
  })
  @IsString({ message: "Poster path must be a string" })
  poster_path: string;

  @ApiProperty({
    description: "Movie release date",
    example: "1994-09-23",
  })
  @IsString({ message: "Release date must be a string" })
  release_date: string;

  @ApiProperty({
    description: "Movie vote average",
    example: 8.7,
    minimum: 0,
    maximum: 10,
  })
  @IsNumber({}, { message: "Vote average must be a number" })
  vote_average: number;

  @ApiProperty({
    description: "Movie genres",
    type: [GenreDto],
    example: [{ id: 1, name: "Drama" }],
  })
  @IsArray({ message: "Genres must be an array" })
  @ValidateNested({ each: true, message: "Each genre must be valid" })
  @Type(() => GenreDto)
  genres: GenreDto[];

  @ApiProperty({
    description: "Movie backdrop path",
    example: "/backdrop.jpg",
  })
  @IsString({ message: "Backdrop path must be a string" })
  backdrop_path: string | null;

  @ApiProperty({
    description: "Movie runtime in minutes",
    required: false,
    example: 142,
  })
  @IsOptional()
  @IsNumber({}, { message: "Runtime must be a number" })
  runtime?: number;

  @ApiProperty({
    description: "Movie status",
    required: false,
    example: "Released",
    enum: [
      "Released",
      "Post Production",
      "In Production",
      "Planned",
      "Rumored",
      "Canceled",
    ],
  })
  @IsOptional()
  @IsString({ message: "Status must be a string" })
  status?: string;

  @ApiProperty({
    description: "Movie tagline",
    required: false,
    example: "Fear can hold you prisoner. Hope can set you free.",
  })
  @IsOptional()
  @IsString({ message: "Tagline must be a string" })
  tagline?: string;
}

export class DiscoveryDto extends MovieDto {
  @ApiProperty({ description: "Movie genre IDs", type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  genre_ids: number[];
}

export class MovieDetailsDto extends MovieDto implements IMovieDetails {
  @ApiProperty({
    description: "Movie collection information",
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;

  @ApiProperty({
    description: "Movie budget",
    example: 25000000,
  })
  @IsNumber()
  budget: number;

  @ApiProperty({
    description: "Movie homepage URL",
    example: "https://www.example.com",
  })
  @IsString()
  homepage: string | null;

  @ApiProperty({
    description: "IMDB ID",
    example: "tt0111161",
  })
  @IsString()
  imdb_id: string | null;

  @ApiProperty({
    description: "Production companies",
    type: [Object],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;

  @ApiProperty({
    description: "Production countries",
    type: [Object],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;

  @ApiProperty({
    description: "Movie revenue",
    example: 28341469,
  })
  @IsNumber()
  revenue: number;

  @ApiProperty({
    description: "Movie runtime in minutes",
    example: 142,
  })
  @IsNumber()
  runtime: number | null;

  @ApiProperty({
    description: "Spoken languages",
    type: [Object],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;

  @ApiProperty({
    description: "Movie videos",
    required: false,
    type: [MovieVideoDto],
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MovieVideoDto)
  videos: {
    results: MovieVideoDto[];
  };

  @ApiProperty({ description: "Movie credits", required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MovieCastDto)
  credits: {
    cast: MovieCastDto[];
    crew: MovieCrewDto[];
  };

  @ApiProperty({ description: "Movie images", required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MovieImageDto)
  images: {
    backdrops: MovieImageDto[];
    logos: MovieImageDto[];
    posters: MovieImageDto[];
  };

  @ApiProperty({ description: "Movie keywords", required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MovieKeywordDto)
  keywords: {
    keywords: MovieKeywordDto[];
  };

  @ApiProperty({
    description: "Movie status",
    example: "Released",
    enum: [
      "Released",
      "Post Production",
      "In Production",
      "Planned",
      "Rumored",
      "Canceled",
    ],
  })
  @IsString({ message: "Status must be a string" })
  status: string;

  @ApiProperty({
    description: "Movie tagline",
    example: "Fear can hold you prisoner. Hope can set you free.",
  })
  @IsString({ message: "Tagline must be a string" })
  tagline: string | null;
}

export class PaginatedMoviesResponseDto {
  @ApiProperty({ description: "Current page number" })
  @IsNumber()
  page: number;

  @ApiProperty({ description: "List of movies", type: [DiscoveryDto] })
  @IsArray()
  results: DiscoveryDto[];

  @ApiProperty({ description: "Total number of pages" })
  @IsNumber()
  total_pages: number;

  @ApiProperty({ description: "Total number of results" })
  @IsNumber()
  total_results: number;
}
