'use client';

import { useState, useEffect, useCallback } from 'react';
import MediaCard from '@/components/MediaCard';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { normalizeTV } from '@/lib/utils';
import type { MediaItem, TVShow } from '@/types';

export default function TVShowsPage() {
  const [shows, setShows] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState<'popular' | 'top_rated' | 'on_the_air' | 'airing_today'>('popular');

  const fetchShows = useCallback(async (pageNum: number, cat: string, reset = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tv?page=${pageNum}&category=${cat}`);
      const data = await res.json();
      const items = (data.results || []).map((s: TVShow) => normalizeTV(s));
      setShows((prev) => reset ? items : [...prev, ...items]);
      setHasMore(pageNum < (data.total_pages || 1));
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchShows(1, category, true);
  }, [category, fetchShows]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchShows(nextPage, category);
    }
  };

  const categories = [
    { key: 'popular', label: 'Popular' },
    { key: 'top_rated', label: 'Top Rated' },
    { key: 'on_the_air', label: 'On The Air' },
    { key: 'airing_today', label: 'Airing Today' },
  ] as const;

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
          📺 TV Shows
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
          Discover popular, top rated, and currently airing TV shows
        </p>

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

        {shows.length > 0 ? (
          <div className="media-grid">
            {shows.map((show, i) => (
              <MediaCard key={`${show.id}-${i}`} item={show} index={i} />
            ))}
          </div>
        ) : !loading ? (
          <div className="empty-state"><p>No TV shows found</p></div>
        ) : null}

        {loading && <div style={{ marginTop: 24 }}><GridSkeleton count={12} /></div>}

        {hasMore && !loading && shows.length > 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <button className="btn btn-ghost" onClick={loadMore}>Load More</button>
          </div>
        )}
      </div>
    </div>
  );
}
