import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import { TOURNAMENT_NAME } from '@/data/tournament';

export const metadata: Metadata = {
  title: 'World Cup Predictions',
  description: `Predict the ${TOURNAMENT_NAME} bracket and climb the leaderboard. Just for fun.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="container">{children}</main>
        <footer className="footer">
          {TOURNAMENT_NAME} prediction game · just for fun, no money involved.
        </footer>
      </body>
    </html>
  );
}
