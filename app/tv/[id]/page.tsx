import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchTVDetails } from '@/lib/api/tmdb';
import { tmdbImage, FALLBACK_POSTER, FALLBACK_BACKDROP } from '@/lib/api/constants';
import { normalizeTV } from '@/lib/utils';
import MediaRow from '@/components/MediaRow';
import WatchlistButton from '@/components/WatchlistButton';
import StarRating from '@/components/StarRating';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const show = await fetchTVDetails(Number(id));
    return {
      title: `${show.name} — Cineverse`,
      description: show.overview?.slice(0, 160),
    };
  } catch {
    return { title: 'TV Show — Cineverse' };
  }
}

export default async function TVDetailPage({ params }: Props) {
  const { id } = await params;
  let show;
  try {
    show = await fetchTVDetails(Number(id));
  } catch {
    notFound();
  }

  const normalizedItem = normalizeTV(show);
  const cast = show.credits?.cast?.slice(0, 12) || [];
  const trailer = show.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );
  const recommendations = show.recommendations?.results?.slice(0, 15).map(normalizeTV) || [];

  return (
    <div className="page-content">
      {/* Backdrop */}
      <div className="detail-backdrop">
        <Image
          src={show.backdrop_path ? tmdbImage(show.backdrop_path, 'original') : FALLBACK_BACKDROP}
          alt={show.name}
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
          <div style={{ width: 260, flexShrink: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            <Image
              src={show.poster_path ? tmdbImage(show.poster_path, 'w500') : FALLBACK_POSTER}
              alt={show.name}
              width={260}
              height={390}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 8 }}>
              {show.name}
            </h1>

            {show.tagline && (
              <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: 16 }}>
                &ldquo;{show.tagline}&rdquo;
              </p>
            )}

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
              <div className="badge badge-rating" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--rating-color)">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {show.vote_average.toFixed(1)}
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>{show.first_air_date?.split('-')[0]}</span>
              {show.number_of_seasons && (
                <span style={{ color: 'var(--text-secondary)' }}>
                  {show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}
                </span>
              )}
              {show.status && <span className="badge badge-genre">{show.status}</span>}
            </div>

            {/* Genres */}
            {show.genres && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {show.genres.map((g) => (
                  <span key={g.id} className="badge badge-genre">{g.name}</span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
              {show.overview}
            </p>

            {/* Seasons */}
            {show.seasons && show.seasons.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Seasons</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {show.seasons.filter(s => s.season_number > 0).map((season) => (
                    <div
                      key={season.id}
                      className="badge badge-genre"
                      style={{ padding: '6px 12px' }}
                    >
                      S{season.season_number} · {season.episode_count} ep
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
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

        {/* Trailer */}
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
        <MediaRow title="Similar TV Shows" items={recommendations} />
      )}
    </div>
  );
}
