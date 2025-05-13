# nest-imdb

NestJS backend for requesting IMDB API

## Technical Overview

### Architecture

- Built with NestJS v11.1.0
- TypeScript-based implementation
- Express.js as the underlying HTTP framework
- Modular architecture following NestJS best practices
- Class-validator for request validation
- Swagger/OpenAPI documentation

### Core Features

- Movie discovery and details
- Person information retrieval
- Genre management
- Pagination support
- CORS enabled
- Environment-based configuration
- Request validation using DTOs
- Response caching
- Rate limiting
- API documentation with Swagger

### API Endpoints

#### Movies

- `GET /movies/discover`

  - Query Parameters (using DiscoverMoviesDto):
    - `page`: Page number (default: 1, min: 1)
    - `sort_by`: Sorting criteria (default: "popularity.desc")
  - Returns paginated movie discoveries with enriched genre information
  - Includes caching and rate limiting

  Example:

  ```bash
  # Get first page of popular movies
  curl "http://localhost:3000/movies/discover"

  # Get second page of movies sorted by release date
  curl "http://localhost:3000/movies/discover?page=2&sort_by=release_date.desc"
  ```

- `GET /movies/:id`

  - Returns detailed movie information including:
    - Basic movie details
    - Keywords
    - Credits
    - Images
    - Videos
  - Includes caching and rate limiting

  Example:

  ```bash
  # Get details for movie with ID 123
  curl "http://localhost:3000/movies/123"
  ```

#### People

- `GET /people/:id`

  - Returns detailed person information including:
    - Basic person details
    - Movie credits
    - Images
    - External IDs

  Example:

  ```bash
  # Get details for person with ID 456
  curl "http://localhost:3000/people/456"
  ```

#### Genres

- `GET /genres`

  - Returns complete list of movie genres

  Example:

  ```bash
  # Get all available genres
  curl "http://localhost:3000/genres"
  ```

### Response Examples

#### Movie Discovery Response

```json
{
  "page": 1,
  "results": [
    {
      "id": 123,
      "title": "Example Movie",
      "overview": "Movie description...",
      "poster_path": "/poster.jpg",
      "backdrop_path": "/backdrop.jpg",
      "release_date": "2024-01-01",
      "vote_average": 8.5,
      "vote_count": 1000,
      "genres": [
        { "id": 1, "name": "Action" },
        { "id": 2, "name": "Adventure" }
      ]
    }
  ],
  "total_pages": 100,
  "total_results": 2000
}
```

#### Movie Details Response

```json
{
  "id": 123,
  "title": "Example Movie",
  "overview": "Movie description...",
  "poster_path": "/poster.jpg",
  "backdrop_path": "/backdrop.jpg",
  "release_date": "2024-01-01",
  "vote_average": 8.5,
  "vote_count": 1000,
  "genres": [
    { "id": 1, "name": "Action" },
    { "id": 2, "name": "Adventure" }
  ],
  "runtime": 120,
  "status": "Released",
  "tagline": "Movie tagline",
  "credits": {
    "cast": [...],
    "crew": [...]
  },
  "videos": {
    "results": [...]
  },
  "images": {
    "backdrops": [...],
    "posters": [...],
    "logos": [...]
  }
}
```

#### Person Details Response

```json
{
  "id": 456,
  "name": "John Doe",
  "biography": "Actor biography...",
  "birthday": "1980-01-01",
  "deathday": null,
  "place_of_birth": "New York, USA",
  "profile_path": "/profile.jpg",
  "known_for_department": "Acting",
  "popularity": 100,
  "credits": {
    "cast": [...],
    "crew": [...]
  },
  "images": {
    "profiles": [...]
  }
}
```

#### Genres Response

```json
[
  { "id": 1, "name": "Action" },
  { "id": 2, "name": "Adventure" },
  { "id": 3, "name": "Animation" }
]
```

### Error Responses

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "statusCode": 404,
  "message": "Movie not found",
  "error": "Not Found"
}
```

Common error codes:

- `400`: Bad Request (invalid parameters)
- `404`: Not Found (resource doesn't exist)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

### Data Models

#### Movie DTOs

```

```
