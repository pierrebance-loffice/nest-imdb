import { Controller, Get, Param, Query } from "@nestjs/common";
import { MoviesService } from "./movies.service";

@Controller()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get("/discover/movies")
  async discover(
    @Query("page") page?: number,
    @Query("sort_by") sortBy?: string
  ) {
    return this.moviesService.discover(page, sortBy);
  }

  @Get("/movies/:id")
  async findOne(@Param("id") id: string) {
    return this.moviesService.findOne(id);
  }
}
