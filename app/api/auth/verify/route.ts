import { NextRequest, NextResponse } from 'next/server';
import {
  consumeMagicToken,
  createSession,
  upsertUser,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing', req.url));
  }

  const email = consumeMagicToken(token);
  if (!email) {
    return NextResponse.redirect(new URL('/login?error=invalid', req.url));
  }

  const user = upsertUser(email);
  const session = createSession(user.id);

  const res = NextResponse.redirect(new URL('/predict', req.url));
  res.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
