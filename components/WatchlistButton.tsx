'use client';

import type { MediaItem } from '@/types';
import { useWatchlistStore } from '@/store/watchlistStore';

interface WatchlistButtonProps {
  item: MediaItem;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export default function WatchlistButton({ item, size = 'md', showLabel = true }: WatchlistButtonProps) {
  const { isInWatchlist, addItem, removeItem } = useWatchlistStore();
  const inWatchlist = isInWatchlist(item.id, item.mediaType);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeItem(item.id, item.mediaType);
    } else {
      addItem(item);
    }
  };

  const iconSize = size === 'sm' ? 16 : 20;

  return (
    <button
      onClick={handleToggle}
      className={size === 'sm' ? 'btn-icon' : 'btn btn-ghost'}
      style={
        size === 'sm'
          ? {
              width: 36,
              height: 36,
              background: inWatchlist ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.1)',
              borderColor: inWatchlist ? 'rgba(124, 58, 237, 0.4)' : 'var(--border-color)',
              color: inWatchlist ? 'var(--accent-primary)' : 'var(--text-secondary)',
            }
          : {
              color: inWatchlist ? 'var(--accent-primary)' : 'var(--text-primary)',
              borderColor: inWatchlist ? 'rgba(124, 58, 237, 0.4)' : 'var(--border-color)',
              background: inWatchlist ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
            }
      }
      title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    >
      {inWatchlist ? (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ) : (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      )}
      {showLabel && size !== 'sm' && (
        <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
      )}
    </button>
  );
}
