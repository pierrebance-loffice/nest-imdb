export interface IMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: {
    id: number;
    name: string;
  }[];
}

export interface IDiscovery {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: { id: number; name: string }[];
}

export interface PaginatedApiDiscoveries {
  page: number;
  results: IDiscovery[];
  total_pages: number;
  total_results: number;
}
