'use client';

import { useState, useEffect, useCallback } from 'react';
import MediaCard from '@/components/MediaCard';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { normalizeMovie } from '@/lib/utils';
import type { MediaItem, Movie } from '@/types';

export default function MoviesPage() {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState<'popular' | 'top_rated' | 'upcoming' | 'now_playing'>('popular');

  const fetchMovies = useCallback(async (pageNum: number, cat: string, reset = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/movies?page=${pageNum}&category=${cat}`);
      const data = await res.json();
      const items = (data.results || []).map((m: Movie) => normalizeMovie(m));
      setMovies((prev) => reset ? items : [...prev, ...items]);
      setHasMore(pageNum < (data.total_pages || 1));
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchMovies(1, category, true);
  }, [category, fetchMovies]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage, category);
    }
  };

  const categories = [
    { key: 'popular', label: 'Popular' },
    { key: 'top_rated', label: 'Top Rated' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'now_playing', label: 'Now Playing' },
  ] as const;

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
          🎬 Movies
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
          Explore popular, top rated, and upcoming movies
        </p>

        {/* Category Tabs */}
        <div className="tab-nav" style={{ marginBottom: 32 }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`tab-btn ${category === cat.key ? 'active' : ''}`}
              onClick={() => setCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {movies.length > 0 ? (
          <div className="media-grid">
            {movies.map((movie, i) => (
              <MediaCard key={`${movie.id}-${i}`} item={movie} index={i} />
            ))}
          </div>
        ) : !loading ? (
          <div className="empty-state">
            <p>No movies found</p>
          </div>
        ) : null}

        {loading && <div style={{ marginTop: 24 }}><GridSkeleton count={12} /></div>}

        {/* Load More */}
        {hasMore && !loading && movies.length > 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <button className="btn btn-ghost" onClick={loadMore}>
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
