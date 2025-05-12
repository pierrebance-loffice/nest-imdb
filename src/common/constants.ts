export const CACHE_KEYS = {
  MOVIES: {
    DISCOVER: (page: number, sorting: string) =>
      `movies:discover:${page}:${sorting}`,
    DETAILS: (id: string) => `movies:details:${id}`,
  },
  PEOPLE: {
    DETAILS: (id: string) => `people:details:${id}`,
  },
  GENRES: {
    LIST: "genres:list",
  },
} as const;

export const RATE_LIMITS = {
  MOVIES: {
    DISCOVER: {
      limit: 100,
      ttl: 60,
    },
    DETAILS: {
      limit: 100,
      ttl: 60,
    },
  },
  PEOPLE: {
    DETAILS: {
      limit: 100,
      ttl: 60,
    },
  },
  GENRES: {
    LIST: {
      limit: 100,
      ttl: 60,
    },
  },
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  SORT: "popularity.desc",
} as const;
