import { JIKAN_BASE_URL } from './constants';
import type { Anime, AnimeCharacter, AnimeEpisode, JikanResponse } from '@/types';

// Jikan has a rate limit of ~3 requests/second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 350; // ms

async function jikanFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();

  const searchParams = new URLSearchParams(params);
  const url = `${JIKAN_BASE_URL}${endpoint}${searchParams.toString() ? '?' + searchParams : ''}`;
  const res = await fetch(url, { next: { revalidate: 3600 } } as RequestInit);
  if (!res.ok) throw new Error(`Jikan API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// ─── Top / Trending ──────────────────────────────────────────
export async function fetchTopAnime(
  page = 1,
  filter: 'airing' | 'upcoming' | 'bypopularity' | 'favorite' = 'bypopularity'
): Promise<JikanResponse<Anime[]>> {
  return jikanFetch('/top/anime', { page: String(page), filter });
}

export async function fetchTopAiringAnime(page = 1): Promise<JikanResponse<Anime[]>> {
  return jikanFetch('/top/anime', { page: String(page), filter: 'airing' });
}

export async function fetchUpcomingAnime(page = 1): Promise<JikanResponse<Anime[]>> {
  return jikanFetch('/top/anime', { page: String(page), filter: 'upcoming' });
}

// ─── Details ─────────────────────────────────────────────────
export async function fetchAnimeDetails(id: number): Promise<JikanResponse<Anime>> {
  return jikanFetch(`/anime/${id}/full`);
}

export async function fetchAnimeCharacters(id: number): Promise<JikanResponse<AnimeCharacter[]>> {
  return jikanFetch(`/anime/${id}/characters`);
}

export async function fetchAnimeEpisodes(id: number, page = 1): Promise<JikanResponse<AnimeEpisode[]>> {
  return jikanFetch(`/anime/${id}/episodes`, { page: String(page) });
}

export async function fetchAnimeRecommendations(id: number): Promise<JikanResponse<{ entry: Anime }[]>> {
  return jikanFetch(`/anime/${id}/recommendations`);
}

// ─── Search ──────────────────────────────────────────────────
export async function searchAnime(
  query: string,
  page = 1,
  params: Record<string, string> = {}
): Promise<JikanResponse<Anime[]>> {
  return jikanFetch('/anime', { q: query, page: String(page), ...params });
}

// ─── Genres ──────────────────────────────────────────────────
export async function fetchAnimeGenres(): Promise<JikanResponse<{ mal_id: number; name: string }[]>> {
  return jikanFetch('/genres/anime');
}

// ─── Browse ──────────────────────────────────────────────────
export async function browseAnime(
  page = 1,
  params: Record<string, string> = {}
): Promise<JikanResponse<Anime[]>> {
  return jikanFetch('/anime', { page: String(page), ...params });
}
