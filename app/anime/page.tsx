'use client';

import { useState, useEffect, useCallback } from 'react';
import MediaCard from '@/components/MediaCard';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { normalizeAnime } from '@/lib/utils';
import type { MediaItem, Anime } from '@/types';

export default function AnimePage() {
  const [animeList, setAnimeList] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<'bypopularity' | 'airing' | 'upcoming' | 'favorite'>('bypopularity');

  const fetchAnime = useCallback(async (pageNum: number, f: string, reset = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/anime?page=${pageNum}&filter=${f}`);
      const data = await res.json();
      const items = (data.data || []).map((a: Anime) => normalizeAnime(a));
      setAnimeList((prev) => reset ? items : [...prev, ...items]);
      setHasMore(data.pagination?.has_next_page ?? false);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchAnime(1, filter, true);
  }, [filter, fetchAnime]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAnime(nextPage, filter);
    }
  };

  const filters = [
    { key: 'bypopularity', label: 'Popular' },
    { key: 'airing', label: 'Airing' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'favorite', label: 'Favorites' },
  ] as const;

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
          ⭐ Anime
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
          Browse popular, airing, and upcoming anime series
        </p>

        <div className="tab-nav" style={{ marginBottom: 32 }}>
          {filters.map((f) => (
            <button
              key={f.key}
              className={`tab-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {animeList.length > 0 ? (
          <div className="media-grid">
            {animeList.map((anime, i) => (
              <MediaCard key={`${anime.id}-${i}`} item={anime} index={i} />
            ))}
          </div>
        ) : !loading ? (
          <div className="empty-state"><p>No anime found</p></div>
        ) : null}

        {loading && <div style={{ marginTop: 24 }}><GridSkeleton count={12} /></div>}

        {hasMore && !loading && animeList.length > 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <button className="btn btn-ghost" onClick={loadMore}>Load More</button>
          </div>
        )}
      </div>
    </div>
  );
}
