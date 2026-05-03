# AGENTS.md — NewsPWA (B65)

This file provides context for AI coding agents working on this repository.

## Project Overview

**B65** is a personal tech/IT news aggregator Progressive Web App (PWA). It fetches multiple RSS feeds via a backend proxy API, aggregates the articles, and presents them as a modern card-based newsboard. The app is installable on mobile and desktop devices.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Language | TypeScript (strict) |
| Build Tool | Vite |
| Routing | Vue Router |
| State Management | Pinia |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) |
| HTTP | Native `fetch` API |
| PWA | `vite-plugin-pwa` + Workbox |
| XML Parsing | Browser-native `DOMParser` |

## Repository Structure

```
src/
├── main.ts                  # App entry point — mounts Vue app, registers Pinia + Router
├── App.vue                  # Root component — layout, FAB scroll-to-top button
├── assets/                  # Global CSS (base.css, main.css) and logo SVG
├── components/
│   ├── AppHeader.vue        # Sticky filter chips bar (filter by feed source)
│   └── NewsCard.vue         # Individual news card (image, title, source badge, timestamp)
├── config/
│   └── feeds.ts             # Default RSS feed definitions (name, url, color)
├── router/
│   └── index.ts             # Routes: / (HomeView) and /settings (SettingsView)
├── services/
│   └── feedService.ts       # RSS fetching via proxy, XML parsing, response normalization
├── stores/
│   └── newsStore.ts         # Pinia store: articles state, localStorage caching, auto-refresh
├── types/
│   └── news.ts              # NewsItem TypeScript interface
└── views/
    ├── HomeView.vue          # News feed grid + pull-to-refresh
    └── SettingsView.vue      # Feed management (add/remove/toggle), cache clearing
```

## Key Architectural Decisions

- **CORS Proxy**: RSS feeds are fetched through a backend proxy (`VITE_API_BASE_URL`). The proxy accepts `?url=<encoded-rss-url>` and returns raw XML. Never call RSS feeds directly from the frontend.
- **State & Caching**: The Pinia store (`newsStore.ts`) persists both feed configuration and cached articles to `localStorage`. Always use the store for reading/writing state — do not mutate `localStorage` directly elsewhere.
- **Auto-refresh**: Configured in the store; intervals: 0 (disabled), 1, 2, 5, or 10 minutes.
- **PWA**: Service Worker is registered via `vite-plugin-pwa` with Workbox. The SW uses NetworkFirst for API calls and CacheFirst for images.
- **TypeScript**: Strict mode is enabled. All new code must be fully typed. Use the `NewsItem` interface from `src/types/news.ts` for article objects.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL for the RSS proxy API (e.g. `https://www.b65.ch/api`) |
| `RSYNC_DEST` | rsync deploy target (e.g. `user@host:/path/to/dir`) |

Create `.env` (production) and `.env.development` files — both are gitignored.

## Development Commands

```sh
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Type-check + production build → dist/
npm run preview      # Preview the production build locally
```

## Coding Conventions

- **Vue SFCs**: Use `<script setup lang="ts">` for all components.
- **Composables / Stores**: Business logic belongs in Pinia stores or composable functions, not in component `<script setup>` blocks.
- **CSS**: Use Tailwind utility classes. Avoid writing custom CSS unless there is no Tailwind equivalent.
- **Imports**: Use the `@/` alias for `src/` (e.g. `import { useNewsStore } from '@/stores/newsStore'`).
- **Formatting**: Follow the existing code style. The project does not enforce a linter/formatter via npm scripts, so match the surrounding code style manually.
- **No unused scaffold files**: The files `HelloWorld.vue`, `TheWelcome.vue`, `WelcomeItem.vue`, and `src/components/icons/` are Vue scaffold leftovers and are unused. Do not import or modify them; they can be deleted if they cause confusion.

## Testing

There are currently no automated tests in this project. When asked to add tests, use **Vitest** (already compatible with the Vite setup) and **Vue Test Utils**.

## Common Tasks

### Adding a new RSS feed source
1. Add a new entry to `src/config/feeds.ts` with `id`, `name`, `url`, and `color`.
2. The Pinia store will pick it up on next initialization if no persisted config exists.

### Adding a new view/page
1. Create the component in `src/views/`.
2. Register the route in `src/router/index.ts`.
3. Add navigation to `AppHeader.vue` or `App.vue` as appropriate.

### Changing the proxy API endpoint
Set `VITE_API_BASE_URL` in `.env` or `.env.development`. The value is consumed in `src/services/feedService.ts`.

## Notes for Agents

- The app title displayed to users is **B65**, not "News" — keep this consistent in UI strings.
- `index.html` sets `lang="de"` — the UI copy is in German.
- Keep the `dist/` directory out of scope; it is gitignored and regenerated by `npm run build`.
- Do not commit `.env` or `.env.development` — they are gitignored and contain secrets.
