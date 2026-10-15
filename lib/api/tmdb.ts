import { TMDB_BASE_URL } from './constants';
import type { Movie, TVShow, TMDBResponse, Video, Cast, Crew, Review, Season, Genre } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({ api_key: API_KEY, ...params });
  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams}`;
  const res = await fetch(url, { next: { revalidate: 3600 } } as RequestInit);
  if (!res.ok) throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// ─── Trending ────────────────────────────────────────────────
export async function fetchTrending(
  mediaType: 'movie' | 'tv' | 'all' = 'all',
  timeWindow: 'day' | 'week' = 'week'
): Promise<TMDBResponse<Movie & TVShow>> {
  return tmdbFetch(`/trending/${mediaType}/${timeWindow}`);
}

// ─── Movies ──────────────────────────────────────────────────
export async function fetchTopRatedMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return tmdbFetch('/movie/top_rated', { page: String(page) });
}

export async function fetchPopularMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return tmdbFetch('/movie/popular', { page: String(page) });
}

export async function fetchUpcomingMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return tmdbFetch('/movie/upcoming', { page: String(page) });
}

export async function fetchNowPlayingMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return tmdbFetch('/movie/now_playing', { page: String(page) });
}

export async function fetchMovieDetails(id: number): Promise<Movie> {
  return tmdbFetch(`/movie/${id}`, { append_to_response: 'videos,credits,reviews,recommendations,similar' });
}

export async function fetchMovieGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>('/genre/movie/list');
  return data.genres;
}

// ─── TV Shows ────────────────────────────────────────────────
export async function fetchPopularTV(page = 1): Promise<TMDBResponse<TVShow>> {
  return tmdbFetch('/tv/popular', { page: String(page) });
}

export async function fetchTopRatedTV(page = 1): Promise<TMDBResponse<TVShow>> {
  return tmdbFetch('/tv/top_rated', { page: String(page) });
}

export async function fetchOnTheAirTV(page = 1): Promise<TMDBResponse<TVShow>> {
  return tmdbFetch('/tv/on_the_air', { page: String(page) });
}

export async function fetchTVDetails(id: number): Promise<TVShow> {
  return tmdbFetch(`/tv/${id}`, { append_to_response: 'videos,credits,reviews,recommendations' });
}

export async function fetchSeasonDetails(tvId: number, seasonNumber: number): Promise<Season> {
  return tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`);
}

export async function fetchTVGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>('/genre/tv/list');
  return data.genres;
}

// ─── Search ──────────────────────────────────────────────────
export async function searchMulti(query: string, page = 1): Promise<TMDBResponse<Movie & TVShow>> {
  return tmdbFetch('/search/multi', { query, page: String(page) });
}

export async function searchMovies(query: string, page = 1): Promise<TMDBResponse<Movie>> {
  return tmdbFetch('/search/movie', { query, page: String(page) });
}

export async function searchTV(query: string, page = 1): Promise<TMDBResponse<TVShow>> {
  return tmdbFetch('/search/tv', { query, page: String(page) });
}

// ─── Discover ────────────────────────────────────────────────
export async function discoverMovies(
  page = 1,
  params: Record<string, string> = {}
): Promise<TMDBResponse<Movie>> {
  return tmdbFetch('/discover/movie', { page: String(page), ...params });
}

export async function discoverTV(
  page = 1,
  params: Record<string, string> = {}
): Promise<TMDBResponse<TVShow>> {
  return tmdbFetch('/discover/tv', { page: String(page), ...params });
}

// ─── Helpers ─────────────────────────────────────────────────
export function getTrailer(videos?: { results: Video[] }): Video | undefined {
  if (!videos?.results) return undefined;
  return (
    videos.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube' && v.official) ||
    videos.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
    videos.results.find((v) => v.site === 'YouTube')
  );
}

export function getDirector(credits?: { cast: Cast[]; crew: Crew[] }): Crew | undefined {
  return credits?.crew?.find((c) => c.job === 'Director');
}
