import { NextRequest, NextResponse } from 'next/server';
import { destroySession, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get(SESSION_COOKIE)?.value;
  if (sessionId) destroySession(sessionId);

  const res = NextResponse.redirect(new URL('/', req.url), { status: 303 });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
