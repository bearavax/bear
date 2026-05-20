# Team1 World Cup Predictions

A free-for-fun **FIFA World Cup 2026** bracket prediction game for team1.
Players sign up with their email, predict the tournament bracket, and compete
on a live leaderboard. No money — just bragging rights.

The UI follows the Avalanche team1 Brand Guide — see [`BRAND.md`](BRAND.md).

## Features

- **Passwordless sign-up** — players enter an email and get a one-tap magic
  sign-in link (no password to remember).
- **Bracket predictions** — pick the 1st and 2nd place finisher in all 12
  groups, the four semi-finalists, the two finalists, and the champion.
- **Live leaderboard** — scores are calculated automatically against the
  real results and ranked, with medals for the top three.
- **Predictions lock at kickoff** — brackets are editable until the
  tournament starts, then frozen.
- **Admin results page** — an organiser enters the real outcomes, protected
  by an admin token.

## Scoring

| Result            | Points |
| ----------------- | ------ |
| Group winner      | +3     |
| Group runner-up   | +2     |
| Each semi-finalist| +5     |
| Each finalist     | +8     |
| Champion          | +20    |

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router)
- SQLite via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3)
- [`nodemailer`](https://nodemailer.com/) for magic-link emails
- TypeScript

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:3000
```

To run a production build:

```bash
npm run build
npm run start
```

## Configuration

All settings live in `.env.local` (see [`.env.example`](.env.example)):

| Variable             | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `APP_URL`            | Public base URL used to build magic-link sign-in URLs          |
| `DATABASE_PATH`      | SQLite file location (defaults to `./worldcup.db`)             |
| `ADMIN_TOKEN`        | Token required to enter results on `/admin` (admin off if unset)|
| `PREDICTIONS_LOCKED` | Set to `true` to lock predictions early                        |
| `SMTP_*`             | Optional email server for sending magic links                  |

If no SMTP server is configured, the sign-in link is shown directly on the
login page so you can play without setting up email.

## Project structure

```
app/                Next.js routes (pages + API)
  api/              auth, predictions and admin endpoints
components/         Nav, BracketEditor
data/tournament.ts  teams, the 12-group draw, kickoff date
lib/                db, auth, email, scoring, prediction storage
BRAND.md            Avalanche team1 brand guide + token mapping
```

The 48-team draw in `data/tournament.ts` is an editable placeholder — update
it with the official draw when it is confirmed.

## Tournament admin

1. Set `ADMIN_TOKEN` in the environment.
2. Visit `/admin`, enter the token, and fill in the real results as the
   tournament progresses.
3. The leaderboard re-scores every player automatically.
