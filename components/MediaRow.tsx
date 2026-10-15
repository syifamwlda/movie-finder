'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { MediaItem } from '@/types';
import MediaCard from './MediaCard';

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  href?: string;
  showMediaType?: boolean;
}

export default function MediaRow({ title, items, href, showMediaType = false }: MediaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="section" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <div className="container">
        <div className="section-title">
          <h2 style={{ fontSize: '1.3rem' }}>{title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Scroll Arrows */}
            <button
              className="btn-icon"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              style={{ width: 32, height: 32 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              className="btn-icon"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              style={{ width: 32, height: 32 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            {href && (
              <Link href={href} style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--accent-primary)' }}>
                See All →
              </Link>
            )}
          </div>
        </div>

        <div className="media-row" ref={scrollRef}>
          {items.map((item, i) => (
            <MediaCard key={`${item.mediaType}-${item.id}`} item={item} index={i} showMediaType={showMediaType} />
          ))}
        </div>
      </div>
    </div>
  );
}
