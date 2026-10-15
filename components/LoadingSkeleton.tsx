'use client';

export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="skeleton" style={{ aspectRatio: '2/3', width: '100%' }} />
      <div className="skeleton" style={{ height: 16, width: '80%' }} />
      <div className="skeleton" style={{ height: 14, width: '50%' }} />
    </div>
  );
}

export function RowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="section">
      <div className="container">
        <div className="skeleton" style={{ height: 28, width: 200, marginBottom: 24 }} />
        <div className="media-row">
          {Array.from({ length: count }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div style={{ width: '100%', height: '70vh', position: 'relative' }}>
      <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 0 }} />
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          zIndex: 2,
        }}
      >
        <div className="skeleton" style={{ height: 40, width: 400, maxWidth: '70vw' }} />
        <div className="skeleton" style={{ height: 20, width: 300, maxWidth: '60vw' }} />
        <div className="skeleton" style={{ height: 16, width: 500, maxWidth: '80vw' }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="skeleton" style={{ height: 44, width: 140, borderRadius: 9999 }} />
          <div className="skeleton" style={{ height: 44, width: 120, borderRadius: 9999 }} />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="media-grid">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="page-content">
      <div className="skeleton" style={{ width: '100%', height: 500, borderRadius: 0 }} />
      <div className="container" style={{ marginTop: -120, position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', gap: 32 }}>
          <div className="skeleton" style={{ width: 260, height: 390, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="skeleton" style={{ height: 36, width: '60%' }} />
            <div className="skeleton" style={{ height: 20, width: '40%' }} />
            <div className="skeleton" style={{ height: 80, width: '100%' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="skeleton" style={{ height: 44, width: 140, borderRadius: 9999 }} />
              <div className="skeleton" style={{ height: 44, width: 120, borderRadius: 9999 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
