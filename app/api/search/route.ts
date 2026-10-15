import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';
  const page = searchParams.get('page') || '1';

  if (!query) {
    return NextResponse.json({ tmdb: [], anime: [] });
  }

  const results: { tmdb: unknown[]; anime: unknown[] } = { tmdb: [], anime: [] };

  try {
    if (type === 'all' || type === 'movie' || type === 'tv') {
      const tmdbRes = await fetch(
        `${TMDB_BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
        { next: { revalidate: 3600 } } as RequestInit
      );
      const tmdbData = await tmdbRes.json();
      results.tmdb = tmdbData.results || [];
    }

    if (type === 'all' || type === 'anime') {
      const jikanRes = await fetch(
        `${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`,
        { next: { revalidate: 3600 } } as RequestInit
      );
      const jikanData = await jikanRes.json();
      results.anime = jikanData.data || [];
    }
  } catch {
    /* ignore */
  }

  return NextResponse.json(results);
}
