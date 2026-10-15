'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWatchlistStore } from '@/store/watchlistStore';
import { useRatingStore } from '@/store/ratingStore';
import { getDetailUrl } from '@/lib/utils';
import { FALLBACK_POSTER } from '@/lib/api/constants';
import StarRating from '@/components/StarRating';
import type { WatchStatus } from '@/types';

const STATUS_LABELS: Record<WatchStatus, string> = {
  watching: '👀 Watching',
  plan_to_watch: '📋 Plan to Watch',
  completed: '✅ Completed',
};

const STATUS_COLORS: Record<WatchStatus, string> = {
  watching: '#3b82f6',
  plan_to_watch: '#f59e0b',
  completed: '#10b981',
};

export default function WatchlistPage() {
  const { items, removeItem, updateStatus } = useWatchlistStore();
  const { getRating, setRating } = useRatingStore();
  const [filter, setFilter] = useState<WatchStatus | 'all'>('all');

  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter);

  const statusCounts = {
    all: items.length,
    watching: items.filter((i) => i.status === 'watching').length,
    plan_to_watch: items.filter((i) => i.status === 'plan_to_watch').length,
    completed: items.filter((i) => i.status === 'completed').length,
  };

  const filters = [
    { key: 'all', label: `All (${statusCounts.all})` },
    { key: 'watching', label: `Watching (${statusCounts.watching})` },
    { key: 'plan_to_watch', label: `Plan to Watch (${statusCounts.plan_to_watch})` },
    { key: 'completed', label: `Completed (${statusCounts.completed})` },
  ] as const;

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
          📚 My Watchlist
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
          Track what you&apos;re watching and plan to watch
        </p>

        {/* Filter Tabs */}
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

        {/* Watchlist Items */}
        {filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((item) => {
              const userRating = getRating(item.id, item.mediaType);
              return (
                <div key={`${item.mediaType}-${item.id}`} className="watchlist-card">
                  {/* Poster */}
                  <Link
                    href={getDetailUrl(item.mediaType, item.id)}
                    style={{ width: 70, height: 105, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}
                  >
                    <Image
                      src={item.posterUrl || FALLBACK_POSTER}
                      alt={item.title}
                      width={70}
                      height={105}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Link>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={getDetailUrl(item.mediaType, item.id)}>
                      <h3 className="line-clamp-1" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>
                        {item.title}
                      </h3>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.year}</span>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--accent-gradient)',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: 'white',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.mediaType}
                      </span>
                      {item.rating > 0 && (
                        <div className="badge badge-rating">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--rating-color)">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          {item.rating.toFixed(1)}
                        </div>
                      )}
                    </div>

                    {/* Status Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, item.mediaType, e.target.value as WatchStatus)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-secondary)',
                          border: `1px solid ${STATUS_COLORS[item.status]}`,
                          color: STATUS_COLORS[item.status],
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-sans)',
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>My Rating:</span>
                      <StarRating
                        rating={userRating}
                        onRate={(r) => setRating(item.id, item.mediaType, r)}
                        size={16}
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    className="btn-icon"
                    onClick={() => removeItem(item.id, item.mediaType)}
                    style={{ alignSelf: 'flex-start', flexShrink: 0 }}
                    title="Remove from Watchlist"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6L6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>
              {filter === 'all' ? 'Your watchlist is empty' : `No items with status "${filter.replace('_', ' ')}"`}
            </h3>
            <p>Start adding movies, TV shows, and anime to your watchlist</p>
            <Link href="/" className="btn btn-primary" style={{ marginTop: 20 }}>
              Browse Content
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
