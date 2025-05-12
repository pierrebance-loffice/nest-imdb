export interface IGenre {
  id: number;
  name: string;
}

export interface IApiGenre {
  genres: IGenre[];
}
