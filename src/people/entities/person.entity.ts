import { MovieCreditDto } from "./movie-credit.entity";

export interface IPerson {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  deathday?: string;
  place_of_birth: string;
  profile_path: string;
  known_for_department: string;
  popularity: number;
  movie_credits?: {
    cast: MovieCreditDto[];
    crew: MovieCreditDto[];
  };
  images?: {
    profiles: Array<{
      file_path: string;
      width: number;
      height: number;
    }>;
  };
  external_ids?: {
    imdb_id: string;
    facebook_id: string | null;
    instagram_id: string | null;
    twitter_id: string | null;
  };
}
