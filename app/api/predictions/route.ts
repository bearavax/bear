import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import {
  getPrediction,
  savePrediction,
  sanitizePrediction,
} from '@/lib/predictions';
import { predictionsOpen } from '@/data/tournament';

export const runtime = 'nodejs';

export async function GET() {
  const user = currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }
  return NextResponse.json({ prediction: getPrediction(user.id) });
}

export async function POST(req: NextRequest) {
  const user = currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  if (!predictionsOpen()) {
    return NextResponse.json(
      { error: 'Predictions are locked — the tournament has started.' },
      { status: 403 },
    );
  }

  const body = await req.json().catch(() => null);
  const prediction = sanitizePrediction(body);
  savePrediction(user.id, prediction);

  return NextResponse.json({ ok: true, prediction });
}
