// ─── Media Types ─────────────────────────────────────────────
export type MediaType = 'movie' | 'tv' | 'anime';

export interface Genre {
  id: number;
  name: string;
}

// ─── TMDB Types ──────────────────────────────────────────────
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  genres?: Genre[];
  adult: boolean;
  media_type?: string;
  runtime?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  production_companies?: { id: number; name: string; logo_path: string | null }[];
  videos?: { results: Video[] };
  credits?: { cast: Cast[]; crew: Crew[] };
  reviews?: { results: Review[] };
  recommendations?: { results: Movie[] };
  similar?: { results: Movie[] };
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  genres?: Genre[];
  media_type?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  tagline?: string;
  status?: string;
  seasons?: Season[];
  videos?: { results: Video[] };
  credits?: { cast: Cast[]; crew: Crew[] };
  reviews?: { results: Review[] };
  recommendations?: { results: TVShow[] };
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
  episodes?: Episode[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  still_path: string | null;
  vote_average: number;
  runtime?: number;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Review {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  url: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

// ─── Anime Types (Jikan) ────────────────────────────────────
export interface Anime {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  synopsis: string | null;
  images: {
    jpg: { image_url: string; small_image_url: string; large_image_url: string };
    webp: { image_url: string; small_image_url: string; large_image_url: string };
  };
  trailer: { youtube_id: string | null; url: string | null; embed_url: string | null };
  episodes: number | null;
  status: string;
  airing: boolean;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  type: string;
  source: string;
  duration: string;
  rating: string;
  season: string | null;
  year: number | null;
  genres: { mal_id: number; name: string }[];
  studios: { mal_id: number; name: string }[];
  aired: { from: string | null; to: string | null; string: string };
}

export interface AnimeCharacter {
  character: {
    mal_id: number;
    name: string;
    images: { jpg: { image_url: string }; webp: { image_url: string } };
  };
  role: string;
  voice_actors: { person: { mal_id: number; name: string; images: { jpg: { image_url: string } } }; language: string }[];
}

export interface AnimeEpisode {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  title_romanji: string | null;
  aired: string | null;
  filler: boolean;
  recap: boolean;
}

// ─── Unified Media Item (for MediaCard) ─────────────────────
export interface MediaItem {
  id: number;
  title: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  rating: number;
  year: string;
  overview: string;
  mediaType: MediaType;
  genreIds?: number[];
  genres?: string[];
}

// ─── Watchlist ───────────────────────────────────────────────
export type WatchStatus = 'watching' | 'plan_to_watch' | 'completed';

export interface WatchlistItem extends MediaItem {
  addedAt: number;
  status: WatchStatus;
}

// ─── API Response ────────────────────────────────────────────
export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
  };
}

// ─── Search / Filter ────────────────────────────────────────
export interface SearchFilters {
  genre?: number[];
  yearFrom?: number;
  yearTo?: number;
  ratingMin?: number;
  sortBy?: 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc' | 'title.asc';
}
