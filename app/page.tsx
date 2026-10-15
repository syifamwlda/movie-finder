import HeroSection from '@/components/HeroSection';
import MediaRow from '@/components/MediaRow';
import { fetchTopAnime, fetchTopAiringAnime, fetchUpcomingAnime } from '@/lib/api/jikan';
import { fetchTrending, fetchTopRatedMovies, fetchPopularTV } from '@/lib/api/tmdb';
import { normalizeAnime, normalizeMovie, normalizeTV, normalizeTrending } from '@/lib/utils';

export default async function HomePage() {
  // Fetch data in parallel
  const [trendingRes, topMoviesRes, popularTVRes, topAnimeRes, airingAnimeRes, upcomingAnimeRes] =
    await Promise.allSettled([
      fetchTrending('all', 'week').catch(() => null),
      fetchTopRatedMovies().catch(() => null),
      fetchPopularTV().catch(() => null),
      fetchTopAnime(1, 'bypopularity').catch(() => null),
      fetchTopAiringAnime().catch(() => null),
      fetchUpcomingAnime().catch(() => null),
    ]);

  const trending = trendingRes.status === 'fulfilled' && trendingRes.value
    ? trendingRes.value.results.slice(0, 10).map(normalizeTrending)
    : [];

  const topMovies = topMoviesRes.status === 'fulfilled' && topMoviesRes.value
    ? topMoviesRes.value.results.slice(0, 20).map(normalizeMovie)
    : [];

  const popularTV = popularTVRes.status === 'fulfilled' && popularTVRes.value
    ? popularTVRes.value.results.slice(0, 20).map(normalizeTV)
    : [];

  const topAnime = topAnimeRes.status === 'fulfilled' && topAnimeRes.value
    ? topAnimeRes.value.data.slice(0, 20).map(normalizeAnime)
    : [];

  const airingAnime = airingAnimeRes.status === 'fulfilled' && airingAnimeRes.value
    ? airingAnimeRes.value.data.slice(0, 20).map(normalizeAnime)
    : [];

  const upcomingAnime = upcomingAnimeRes.status === 'fulfilled' && upcomingAnimeRes.value
    ? upcomingAnimeRes.value.data.slice(0, 20).map(normalizeAnime)
    : [];

  // For hero, combine trending and top anime
  const heroItems = [...trending.slice(0, 3), ...topAnime.slice(0, 2)].filter(
    (item) => item.backdropUrl || item.posterUrl
  );

  return (
    <div className="page-content">
      {/* Hero Banner */}
      {heroItems.length > 0 && <HeroSection items={heroItems} />}

      {/* Trending Now */}
      {trending.length > 0 && (
        <MediaRow title="🔥 Trending Now" items={trending} showMediaType />
      )}

      {/* Top Rated Movies */}
      {topMovies.length > 0 && (
        <MediaRow title="🎬 Top Rated Movies" items={topMovies} href="/movies" />
      )}

      {/* Popular TV Shows */}
      {popularTV.length > 0 && (
        <MediaRow title="📺 Popular TV Shows" items={popularTV} href="/tv-shows" />
      )}

      {/* Popular Anime */}
      {topAnime.length > 0 && (
        <MediaRow title="⭐ Popular Anime" items={topAnime} href="/anime" />
      )}

      {/* Currently Airing Anime */}
      {airingAnime.length > 0 && (
        <MediaRow title="📡 Currently Airing" items={airingAnime} href="/anime" />
      )}

      {/* Upcoming Anime */}
      {upcomingAnime.length > 0 && (
        <MediaRow title="🗓️ Upcoming Anime" items={upcomingAnime} href="/anime" />
      )}
    </div>
  );
}
