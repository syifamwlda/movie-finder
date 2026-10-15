'use client';

import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export default function StarRating({ rating, onRate, size = 20, readonly = false }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRate?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            style={{
              background: 'none',
              border: 'none',
              cursor: readonly ? 'default' : 'pointer',
              padding: 2,
              transition: 'transform var(--transition-fast)',
              transform: hover === star ? 'scale(1.2)' : 'scale(1)',
            }}
            aria-label={`Rate ${star} stars`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? 'var(--rating-color)' : 'none'}
              stroke={filled ? 'var(--rating-color)' : 'var(--text-muted)'}
              strokeWidth="1.5"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
