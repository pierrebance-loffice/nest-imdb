import { Module } from '@nestjs/common';
import { GenresModule } from '../genres/genres.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [GenresModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
