import type { MediaItem, Movie, TVShow, Anime, MediaType } from '@/types';
import { tmdbImage, MOVIE_GENRES, TV_GENRES } from './api/constants';

/**
 * Normalize a TMDB Movie into a unified MediaItem.
 */
export function normalizeMovie(movie: Movie): MediaItem {
  return {
    id: movie.id,
    title: movie.title || movie.original_title,
    posterUrl: movie.poster_path ? tmdbImage(movie.poster_path, 'w500') : null,
    backdropUrl: movie.backdrop_path ? tmdbImage(movie.backdrop_path, 'w1280') : null,
    rating: Math.round(movie.vote_average * 10) / 10,
    year: movie.release_date ? movie.release_date.split('-')[0] : 'TBA',
    overview: movie.overview || '',
    mediaType: 'movie',
    genreIds: movie.genre_ids,
    genres: movie.genres?.map((g) => g.name) || movie.genre_ids?.map((id) => MOVIE_GENRES[id]).filter(Boolean),
  };
}

/**
 * Normalize a TMDB TV Show into a unified MediaItem.
 */
export function normalizeTV(show: TVShow): MediaItem {
  return {
    id: show.id,
    title: show.name || show.original_name,
    posterUrl: show.poster_path ? tmdbImage(show.poster_path, 'w500') : null,
    backdropUrl: show.backdrop_path ? tmdbImage(show.backdrop_path, 'w1280') : null,
    rating: Math.round(show.vote_average * 10) / 10,
    year: show.first_air_date ? show.first_air_date.split('-')[0] : 'TBA',
    overview: show.overview || '',
    mediaType: 'tv',
    genreIds: show.genre_ids,
    genres: show.genres?.map((g) => g.name) || show.genre_ids?.map((id) => TV_GENRES[id]).filter(Boolean),
  };
}

/**
 * Normalize a Jikan Anime into a unified MediaItem.
 */
export function normalizeAnime(anime: Anime): MediaItem {
  return {
    id: anime.mal_id,
    title: anime.title_english || anime.title,
    posterUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || null,
    backdropUrl: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || null,
    rating: anime.score ? Math.round(anime.score * 10) / 10 : 0,
    year: anime.year ? String(anime.year) : anime.aired?.from ? anime.aired.from.split('-')[0] : 'TBA',
    overview: anime.synopsis || '',
    mediaType: 'anime',
    genres: anime.genres?.map((g) => g.name),
  };
}

/**
 * Normalize a TMDB trending result (can be movie or TV).
 */
export function normalizeTrending(item: Movie & TVShow): MediaItem {
  const mediaType = (item.media_type === 'tv' ? 'tv' : 'movie') as MediaType;
  if (mediaType === 'tv') {
    return normalizeTV(item as TVShow);
  }
  return normalizeMovie(item as Movie);
}

/**
 * Format runtime to human readable string.
 */
export function formatRuntime(minutes: number): string {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/**
 * Format large numbers with commas.
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format currency.
 */
export function formatCurrency(amount: number): string {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

/**
 * Build detail page URL from media type and id.
 */
export function getDetailUrl(mediaType: MediaType, id: number): string {
  switch (mediaType) {
    case 'movie': return `/movie/${id}`;
    case 'tv': return `/tv/${id}`;
    case 'anime': return `/anime/${id}`;
    default: return '/';
  }
}
