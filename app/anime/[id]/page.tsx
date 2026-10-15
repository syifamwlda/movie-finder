import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchAnimeDetails, fetchAnimeCharacters, fetchAnimeRecommendations } from '@/lib/api/jikan';
import { normalizeAnime } from '@/lib/utils';
import { FALLBACK_POSTER } from '@/lib/api/constants';
import MediaRow from '@/components/MediaRow';
import WatchlistButton from '@/components/WatchlistButton';
import StarRating from '@/components/StarRating';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetchAnimeDetails(Number(id));
    const anime = res.data;
    return {
      title: `${anime.title_english || anime.title} — Cineverse`,
      description: anime.synopsis?.slice(0, 160),
    };
  } catch {
    return { title: 'Anime — Cineverse' };
  }
}

export default async function AnimeDetailPage({ params }: Props) {
  const { id } = await params;

  let anime;
  try {
    const res = await fetchAnimeDetails(Number(id));
    anime = res.data;
  } catch {
    notFound();
  }

  const normalizedItem = normalizeAnime(anime);

  // Fetch characters and recommendations (with delay for Jikan rate limit)
  let characters: Awaited<ReturnType<typeof fetchAnimeCharacters>>['data'] = [];
  let recommendations: ReturnType<typeof normalizeAnime>[] = [];

  try {
    await new Promise((r) => setTimeout(r, 400));
    const charRes = await fetchAnimeCharacters(Number(id));
    characters = charRes.data?.slice(0, 12) || [];
  } catch { /* ignore */ }

  try {
    await new Promise((r) => setTimeout(r, 400));
    const recRes = await fetchAnimeRecommendations(Number(id));
    recommendations = recRes.data?.slice(0, 15).map((r) => normalizeAnime(r.entry)) || [];
  } catch { /* ignore */ }

  return (
    <div className="page-content">
      {/* Backdrop */}
      <div className="detail-backdrop">
        <Image
          src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || FALLBACK_POSTER}
          alt={anime.title}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
        />
      </div>

      {/* Main Content */}
      <div className="container" style={{ marginTop: -200, position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Poster */}
          <div style={{ width: 260, flexShrink: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            <Image
              src={anime.images?.jpg?.large_image_url || FALLBACK_POSTER}
              alt={anime.title}
              width={260}
              height={390}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 4 }}>
              {anime.title_english || anime.title}
            </h1>

            {anime.title_english && anime.title !== anime.title_english && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                {anime.title}
                {anime.title_japanese && ` · ${anime.title_japanese}`}
              </p>
            )}

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
              {anime.score && (
                <div className="badge badge-rating" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--rating-color)">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {anime.score.toFixed(1)}
                </div>
              )}
              <span style={{ color: 'var(--text-secondary)' }}>{anime.year || 'TBA'}</span>
              <span className="badge badge-genre">{anime.type}</span>
              {anime.episodes && (
                <span style={{ color: 'var(--text-secondary)' }}>{anime.episodes} episodes</span>
              )}
              <span className="badge badge-genre">{anime.status}</span>
            </div>

            {/* Genres */}
            {anime.genres && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {anime.genres.map((g) => (
                  <span key={g.mal_id} className="badge badge-genre">{g.name}</span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
              {anime.synopsis || 'No synopsis available.'}
            </p>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 24 }}>
              {anime.studios && anime.studios.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Studio</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{anime.studios.map(s => s.name).join(', ')}</p>
                </div>
              )}
              {anime.source && (
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Source</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{anime.source}</p>
                </div>
              )}
              {anime.duration && (
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Duration</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{anime.duration}</p>
                </div>
              )}
              {anime.rating && (
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Rating</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{anime.rating}</p>
                </div>
              )}
              {anime.aired?.string && (
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Aired</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{anime.aired.string}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <WatchlistButton item={normalizedItem} />
              {anime.trailer?.youtube_id && (
                <a
                  href={`https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`}
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

        {/* Characters */}
        {characters.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>Characters</h2>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
              {characters.map((char) => (
                <div key={char.character.mal_id} style={{ flexShrink: 0, textAlign: 'center', width: 100 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 8px', background: 'var(--bg-card)' }}>
                    <Image
                      src={char.character.images?.jpg?.image_url || FALLBACK_POSTER}
                      alt={char.character.name}
                      width={80}
                      height={80}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <p className="line-clamp-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{char.character.name}</p>
                  <p className="line-clamp-1" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{char.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trailer */}
        {anime.trailer?.youtube_id && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>Trailer</h2>
            <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <iframe
                src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                title={`${anime.title} trailer`}
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
        <MediaRow title="Recommended Anime" items={recommendations} />
      )}
    </div>
  );
}
