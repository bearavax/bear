import { NextRequest, NextResponse } from 'next/server';
import { createMagicToken } from '@/lib/auth';
import { sendMagicLink } from '@/lib/email';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }

  const token = createMagicToken(email);
  const base = process.env.APP_URL || req.nextUrl.origin;
  const link = `${base}/api/auth/verify?token=${token}`;

  const { delivered } = await sendMagicLink(email, link);

  return NextResponse.json({
    ok: true,
    delivered,
    // In dev mode (no SMTP configured) we hand the link back so the player
    // can sign in without an email server.
    devLink: delivered ? undefined : link,
  });
}
