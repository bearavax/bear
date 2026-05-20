# Team1 World Cup Predictions

A free-for-fun **FIFA World Cup 2026** bracket game for team1. Sign up with
your email, predict the bracket, climb the leaderboard. No money — just
bragging rights.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. With no email server set up, the sign-in link
appears right on the login page — just click it.

## Scoring

| Result             | Points |
| ------------------ | ------ |
| Group winner       | +3     |
| Group runner-up    | +2     |
| Each semi-finalist | +5     |
| Each finalist      | +8     |
| Champion           | +20    |

## Notes

- To enter real results, set `ADMIN_TOKEN` in `.env.local` and visit `/admin`.
- The team1 brand styling is documented in [`BRAND.md`](BRAND.md).
