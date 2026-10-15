import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const category = searchParams.get('category') || 'popular';

  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/tv/${category}?api_key=${API_KEY}&page=${page}`,
      { next: { revalidate: 3600 } } as RequestInit
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ results: [], total_pages: 0 }, { status: 500 });
  }
}
