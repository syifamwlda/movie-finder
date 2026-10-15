import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-color)',
        padding: '48px 0 32px',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 40,
            marginBottom: 40,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#footer-grad)" />
                <path d="M10 8l6 4-6 4V8z" fill="white" />
                <path d="M16 16l6 4-6 4v-8z" fill="white" opacity="0.7" />
                <defs>
                  <linearGradient id="footer-grad" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#7c3aed" />
                    <stop offset="1" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
              <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                <span className="gradient-text">Cine</span>verse
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Your ultimate destination for discovering movies, TV shows, and anime.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Explore
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { href: '/movies', label: 'Movies' },
                { href: '/tv-shows', label: 'TV Shows' },
                { href: '/anime', label: 'Anime' },
                { href: '/watchlist', label: 'Watchlist' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: '0.85rem', color: 'var(--text-muted)', transition: 'color var(--transition-fast)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Data Sources */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Data Sources
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                TMDB API
              </a>
              <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Jikan API
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Cineverse. Built with Next.js.
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
