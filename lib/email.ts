import nodemailer from 'nodemailer';

type SendResult = { delivered: boolean };

/**
 * Sends a passwordless sign-in link. If no SMTP server is configured the link
 * is logged to the server console and reported as "not delivered" so the
 * caller can show it on screen instead (handy for a just-for-fun deployment).
 */
export async function sendMagicLink(
  email: string,
  link: string,
): Promise<SendResult> {
  const host = process.env.SMTP_HOST;

  if (!host) {
    console.log(`[magic-link] sign-in link for ${email}: ${link}`);
    return { delivered: false };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  await transporter.sendMail({
    from:
      process.env.SMTP_FROM ||
      'World Cup Predictions <no-reply@worldcup.local>',
    to: email,
    subject: 'Your World Cup Predictions sign-in link',
    text: `Sign in to World Cup Predictions: ${link}\n\nThis link expires in 15 minutes.`,
    html: `
      <p>Tap the link below to sign in to <strong>World Cup Predictions</strong>:</p>
      <p><a href="${link}">${link}</a></p>
      <p style="color:#888">This link expires in 15 minutes.</p>
    `,
  });

  return { delivered: true };
}
