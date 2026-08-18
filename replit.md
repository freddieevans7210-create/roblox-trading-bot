# Limited Lounge | Roblox Trading — Discord Bot

A feature-rich Discord bot for the "Limited Lounge | Roblox Trading" server. Handles scammer tracking, trade logging, vouch system, staff applications, tickets, Roblox verification, economy, music, moderation, and more.

## Run & Operate

- **Discord Bot workflow** — runs `PORT=3000 node artifacts/discord-bot/bot.mjs`
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- Required secrets: `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`
- Required env: `DATABASE_URL` — Postgres (auto-provisioned by Replit)

## Stack

- Discord.js 14, @discordjs/voice, play-dl (music)
- PostgreSQL (22 tables) — created via `executeSql` directly (no Drizzle push needed)
- Express 5 (API server + bot dashboard routes)
- pnpm workspaces, Node.js 24

## Where things live

- `artifacts/discord-bot/bot.mjs` — the full bundled bot (single file)
- `artifacts/api-server/` — Express API server
- `scripts/start-prod.sh` — production startup script (runs bot + API server together)
- DB tables: users, scammers, scammer_reports, trades, vouches, mod_cases, mod_logs, verified_users, verified_trader_applications, middlemen, suggestions, tickets, ticket_counters, mod_points, mod_point_logs, counting, counting_stats, economy_wallets, economy_transactions, economy_shop, economy_inventory, guild_config

## User preferences

- Always use `ll_*` custom branded emojis (ll_shield, ll_bolt, ll_star, ll_crown, ll_verify, ll_warn, ll_report, ll_ticket, ll_trade, ll_ban, ll_mute, ll_kick, ll_scam, ll_watch, ll_trust) in all bot messages, embeds, and panels — never plain Unicode emoji substitutes when a custom one exists. Resolve via `ensureServerEmojis(guild)` → `E.ll_*`.

## Architecture decisions

- Bot is a pre-compiled bundle (`bot.mjs`) — not TypeScript source. Edit the bundle directly for quick fixes.
- Staff application submissions route to channel ID `1535469085096419418` (hardcoded in `findReviewChannel`). Change that ID in the bundle to redirect submissions elsewhere.
- Deployment is VM (always-on) — required for Discord bots which need a persistent connection.
- Production starts both services via `scripts/start-prod.sh`: Discord bot on port 3001, API server on port 8080 (health check target).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The bot bundle has inline MIME type data that was slightly corrupted during paste — already fixed. Do not re-paste the bundle without verifying syntax.
- Missing bot avatar/banner assets (`artifacts/assets/bot-pfp.png`, `artifacts/assets/server-banner.jpg`) are non-fatal — bot runs fine without them.
- `DATABASE_URL` is runtime-managed by Replit — do not set it manually.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
