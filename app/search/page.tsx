'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import MediaCard from '@/components/MediaCard';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { normalizeMovie, normalizeTV, normalizeAnime } from '@/lib/utils';
import type { MediaItem, Movie, TVShow, Anime } from '@/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv' | 'anime'>('all');
  const [searchInput, setSearchInput] = useState(query);

  const performSearch = useCallback(async (q: string, type: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${type}`);
      const data = await res.json();

      const items: MediaItem[] = [];

      // TMDB results
      if (data.tmdb) {
        data.tmdb.forEach((item: Movie & TVShow) => {
          if (item.media_type === 'movie' || item.title) {
            items.push(normalizeMovie(item as Movie));
          } else if (item.media_type === 'tv' || item.name) {
            items.push(normalizeTV(item as TVShow));
          }
        });
      }

      // Anime results
      if (data.anime) {
        data.anime.forEach((item: Anime) => {
          items.push(normalizeAnime(item));
        });
      }

      setResults(items);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      setSearchInput(query);
      performSearch(query, activeTab);
    }
  }, [query, activeTab, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.history.replaceState(null, '', `/search?q=${encodeURIComponent(searchInput.trim())}`);
      performSearch(searchInput.trim(), activeTab);
    }
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'movie', label: 'Movies' },
    { key: 'tv', label: 'TV Shows' },
    { key: 'anime', label: 'Anime' },
  ] as const;

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 24 }}>
          🔍 Search
        </h1>

        {/* Search Input */}
        <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: 24 }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search movies, TV shows, anime..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        {/* Tabs */}
        <div className="tab-nav" style={{ marginBottom: 32 }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {query && (
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>
            {loading ? 'Searching...' : `${results.length} results for "${query}"`}
          </p>
        )}

        {results.length > 0 ? (
          <div className="media-grid">
            {results.map((item, i) => (
              <MediaCard key={`${item.mediaType}-${item.id}-${i}`} item={item} index={i} showMediaType />
            ))}
          </div>
        ) : !loading && query ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>No results found</h3>
            <p>Try different keywords or check your spelling</p>
          </div>
        ) : !query ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>Start searching</h3>
            <p>Type a movie, TV show, or anime title above</p>
          </div>
        ) : null}

        {loading && <GridSkeleton count={12} />}
      </div>
    </div>
  );
}
