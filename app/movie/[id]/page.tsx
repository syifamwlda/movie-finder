import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchMovieDetails } from '@/lib/api/tmdb';
import { tmdbImage, FALLBACK_POSTER, FALLBACK_BACKDROP } from '@/lib/api/constants';
import { formatRuntime, formatCurrency, normalizeMovie } from '@/lib/utils';
import MediaRow from '@/components/MediaRow';
import WatchlistButton from '@/components/WatchlistButton';
import StarRating from '@/components/StarRating';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await fetchMovieDetails(Number(id));
    return {
      title: `${movie.title} — Cineverse`,
      description: movie.overview?.slice(0, 160),
    };
  } catch {
    return { title: 'Movie — Cineverse' };
  }
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  let movie;
  try {
    movie = await fetchMovieDetails(Number(id));
  } catch {
    notFound();
  }

  const normalizedItem = normalizeMovie(movie);
  const director = movie.credits?.crew?.find((c) => c.job === 'Director');
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );
  const recommendations = movie.recommendations?.results?.slice(0, 15).map(normalizeMovie) || [];

  return (
    <div className="page-content">
      {/* Backdrop */}
      <div className="detail-backdrop">
        <Image
          src={movie.backdrop_path ? tmdbImage(movie.backdrop_path, 'original') : FALLBACK_BACKDROP}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Main Content */}
      <div className="container" style={{ marginTop: -200, position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Poster */}
          <div
            style={{
              width: 260,
              flexShrink: 0,
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <Image
              src={movie.poster_path ? tmdbImage(movie.poster_path, 'w500') : FALLBACK_POSTER}
              alt={movie.title}
              width={260}
              height={390}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 8 }}>
              {movie.title}
            </h1>

            {movie.tagline && (
              <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: 16 }}>
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
              <div className="badge badge-rating" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--rating-color)">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {movie.vote_average.toFixed(1)}
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>{movie.release_date?.split('-')[0]}</span>
              {movie.runtime && <span style={{ color: 'var(--text-secondary)' }}>{formatRuntime(movie.runtime)}</span>}
              {movie.status && <span className="badge badge-genre">{movie.status}</span>}
            </div>

            {/* Genres */}
            {movie.genres && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {movie.genres.map((g) => (
                  <span key={g.id} className="badge badge-genre">{g.name}</span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
              {movie.overview}
            </p>

            {/* Director */}
            {director && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Director:</strong> {director.name}
              </p>
            )}

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 24 }}>
              {movie.budget ? (
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Budget</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{formatCurrency(movie.budget)}</p>
                </div>
              ) : null}
              {movie.revenue ? (
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Revenue</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{formatCurrency(movie.revenue)}</p>
                </div>
              ) : null}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <WatchlistButton item={normalizedItem} />
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
                  </svg>
                  Watch Trailer
                </a>
              )}
            </div>

            {/* Your Rating */}
            <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Your Rating</p>
              <StarRating rating={0} />
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>Cast</h2>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
              {cast.map((person) => (
                <div key={person.id} style={{ flexShrink: 0, textAlign: 'center', width: 100 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 8px', background: 'var(--bg-card)' }}>
                    <Image
                      src={person.profile_path ? tmdbImage(person.profile_path, 'w185') : FALLBACK_POSTER}
                      alt={person.name}
                      width={80}
                      height={80}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <p className="line-clamp-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{person.name}</p>
                  <p className="line-clamp-1" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trailer Embed */}
        {trailer && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>Trailer</h2>
            <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <MediaRow title="Recommended Movies" items={recommendations} />
      )}
    </div>
  );
}
