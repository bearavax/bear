import { NextRequest, NextResponse } from 'next/server';
import { getResults, saveResults, sanitizePrediction } from '@/lib/predictions';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ results: getResults() });
}

export async function POST(req: NextRequest) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json(
      { error: 'Admin is disabled — set ADMIN_TOKEN in the environment.' },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    token?: unknown;
    results?: unknown;
  } | null;

  if (!body || body.token !== adminToken) {
    return NextResponse.json(
      { error: 'Invalid admin token.' },
      { status: 401 },
    );
  }

  const results = sanitizePrediction(body.results);
  saveResults(results);

  return NextResponse.json({ ok: true, results });
}
