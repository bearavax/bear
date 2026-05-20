import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import { TOURNAMENT_NAME } from '@/data/tournament';

export const metadata: Metadata = {
  title: 'Team1 World Cup Predictions',
  description: `Predict the ${TOURNAMENT_NAME} bracket and climb the team1 leaderboard. Just for fun.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* team1 brand typeface — Kanit (Light 300 body, Medium 500 headings) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <main className="container">{children}</main>
        <footer className="footer">
          Team1 {TOURNAMENT_NAME} prediction game · just for fun, no money
          involved.
        </footer>
      </body>
    </html>
  );
}
