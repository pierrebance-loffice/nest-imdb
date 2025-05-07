# nest-imdb

NestJS backend for requesting IMDB API

## Technical Overview

### Architecture

- Built with NestJS v11.1.0
- TypeScript-based implementation
- Express.js as the underlying HTTP framework
- Modular architecture following NestJS best practices

### Core Features

- Movie discovery and details
- Person information retrieval
- Genre management
- Pagination support
- CORS enabled
- Environment-based configuration

### API Endpoints

#### Movies

- `GET /discover/movies`

  - Query Parameters:
    - `page`: Page number (default: 1)
    - `sort_by`: Sorting criteria (default: "popularity.desc")
  - Returns paginated movie discoveries with enriched genre information

- `GET /movies/:id`
  - Returns detailed movie information including:
    - Basic movie details
    - Keywords
    - Credits
    - Images
    - Videos

#### People

- `GET /people/:id`
  - Returns detailed person information including:
    - Basic person details
    - Movie credits
    - Images
    - External IDs

#### Genres

- `GET /genres`
  - Returns complete list of movie genres

### Data Models

#### Movie

```typescript
interface IMovie {
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
```

#### Person

```typescript
interface IPerson {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  deathday: string | null;
  place_of_birth: string;
  profile_path: string;
  known_for_department: string;
  popularity: number;
}
```

#### Genre

```typescript
interface IApiGenre {
  genres: {
    id: number;
    name: string;
  }[];
}
```

### Environment Variables

Required environment variables:

- `API_KEY`: External API authentication key
- `API_BASE_URL`: Base URL for external API
- `API_LANGUAGE`: Language preference for API responses

### Development

#### Prerequisites

- Node.js
- pnpm

#### Installation

```bash
pnpm install
```

#### Running the Application

Development mode:

```bash
pnpm dev
```

Production build:

```bash
pnpm build
pnpm start
```

### Error Handling

- Comprehensive error handling in services
- NestJS Logger integration
- HTTP error status propagation
- Type-safe error responses

### Security Features

- Environment variable protection
- CORS configuration
- API key management
- Input validation through TypeScript types

### Testing

_Note: Test implementation is pending_

## License

MIT
