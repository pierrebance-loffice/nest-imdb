import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GenresModule } from "./genres/genres.module";
import { MoviesModule } from "./movies/movies.module";
import { PeopleModule } from "./people/people.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MoviesModule,
    PeopleModule,
    GenresModule,
  ],
})
export class AppModule {}
