'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { MediaItem } from '@/types';
import { getDetailUrl } from '@/lib/utils';
import { FALLBACK_POSTER } from '@/lib/api/constants';

interface MediaCardProps {
  item: MediaItem;
  index?: number;
  showMediaType?: boolean;
}

export default function MediaCard({ item, index = 0, showMediaType = false }: MediaCardProps) {
  const [imgError, setImgError] = useState(false);

  const mediaTypeLabel = {
    movie: 'Movie',
    tv: 'TV',
    anime: 'Anime',
  }[item.mediaType];

  return (
    <Link
      href={getDetailUrl(item.mediaType, item.id)}
      className="animate-fade-in"
      style={{
        display: 'block',
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'backwards',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-glow)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Poster */}
      <div style={{ position: 'relative', aspectRatio: '2/3', background: 'var(--bg-card)' }}>
        <Image
          src={imgError || !item.posterUrl ? FALLBACK_POSTER : item.posterUrl}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 200px"
          style={{ objectFit: 'cover' }}
          onError={() => setImgError(true)}
        />

        {/* Hover Overlay */}
        <div
          className="card-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.4) 50%, transparent 100%)',
            opacity: 0,
            transition: 'opacity var(--transition-base)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 12,
          }}
        >
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }} className="line-clamp-3">
            {item.overview || 'No description available.'}
          </p>
        </div>

        {/* Rating Badge */}
        {item.rating > 0 && (
          <div
            className="badge badge-rating"
            style={{ position: 'absolute', top: 8, left: 8 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--rating-color)">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {item.rating.toFixed(1)}
          </div>
        )}

        {/* Media Type Badge */}
        {showMediaType && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-gradient)',
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {mediaTypeLabel}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 4px 4px' }}>
        <h3
          className="line-clamp-1"
          style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 2 }}
        >
          {item.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>{item.year}</span>
          {item.genres && item.genres.length > 0 && (
            <>
              <span>·</span>
              <span className="line-clamp-1">{item.genres.slice(0, 2).join(', ')}</span>
            </>
          )}
        </div>
      </div>

      {/* CSS for hover overlay */}
      <style jsx>{`
        a:hover .card-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </Link>
  );
}
