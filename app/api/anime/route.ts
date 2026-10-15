import { NextRequest, NextResponse } from 'next/server';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const filter = searchParams.get('filter') || 'bypopularity';
  const q = searchParams.get('q') || '';

  try {
    let url: string;
    if (q) {
      url = `${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(q)}&page=${page}`;
    } else {
      url = `${JIKAN_BASE_URL}/top/anime?page=${page}&filter=${filter}`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } } as RequestInit);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ data: [], pagination: { has_next_page: false } }, { status: 500 });
  }
}
