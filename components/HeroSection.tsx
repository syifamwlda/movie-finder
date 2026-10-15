'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { MediaItem } from '@/types';
import { getDetailUrl } from '@/lib/utils';

interface HeroSectionProps {
  items: MediaItem[];
}

export default function HeroSection({ items }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const item = items[currentIndex];

  return (
    <div className="hero">
      {/* Backdrop */}
      <div className="hero-backdrop">
        {item.backdropUrl && (
          <Image
            src={item.backdropUrl}
            alt={item.title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>
      <div className="hero-overlay" />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-content animate-fade-in-up">
          {/* Media Type Badge */}
          <div
            style={{
              display: 'inline-flex',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-gradient)',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}
          >
            {item.mediaType === 'tv' ? 'TV Show' : item.mediaType === 'anime' ? 'Anime' : 'Movie'}
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.03em' }}>
            {item.title}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            {item.rating > 0 && (
              <div className="badge badge-rating" style={{ fontSize: '0.85rem', padding: '5px 12px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--rating-color)">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {item.rating.toFixed(1)}
              </div>
            )}
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.year}</span>
            {item.genres && item.genres.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {item.genres.slice(0, 3).map((genre) => (
                  <span key={genre} className="badge badge-genre">{genre}</span>
                ))}
              </div>
            )}
          </div>

          {/* Overview */}
          <p
            className="line-clamp-3"
            style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 600, marginBottom: 24, lineHeight: 1.7 }}
          >
            {item.overview}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href={getDetailUrl(item.mediaType, item.id)} className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
              </svg>
              View Details
            </Link>
          </div>

          {/* Dots */}
          {items.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 32 }}>
              {items.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  style={{
                    width: currentIndex === i ? 32 : 8,
                    height: 8,
                    borderRadius: 'var(--radius-full)',
                    background: currentIndex === i ? 'var(--accent-primary)' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
