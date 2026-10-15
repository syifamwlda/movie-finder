'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/tv-shows', label: 'TV Shows' },
  { href: '/anime', label: 'Anime' },
  { href: '/watchlist', label: 'Watchlist' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        setSearchOpen(false);
        setSearchQuery('');
      }
    },
    [searchQuery]
  );

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
              <path d="M10 8l6 4-6 4V8z" fill="white" />
              <path d="M16 16l6 4-6 4v-8z" fill="white" opacity="0.7" />
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#7c3aed" />
                  <stop offset="1" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              <span className="gradient-text">Cine</span>verse
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            <div style={{ display: 'flex', gap: 4 }}>
              {NAV_LINKS.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: isActive ? 'white' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Search Button */}
            <button
              className="btn-icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>

          {/* Mobile: Search + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="mobile-nav">
            <button className="btn-icon" onClick={() => setSearchOpen(true)} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <button className="btn-icon" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <path d="M4 6h16" />
                    <path d="M4 12h16" />
                    <path d="M4 18h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: 'var(--navbar-height)',
            zIndex: 99,
            background: 'rgba(10, 10, 15, 0.97)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 24px',
            gap: 8,
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div
            style={{ maxWidth: 680, width: '100%', margin: '80px auto 0' }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder="Search movies, TV shows, anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
            <p style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Press Enter to search · ESC to close
            </p>
          </div>
        </div>
      )}

      {/* CSS for responsive nav */}
      <style jsx global>{`
        .desktop-nav { display: none !important; }
        .mobile-nav { display: flex !important; }
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
