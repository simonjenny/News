# B65 — GitHub Copilot Instructions

## Project Context

**B65** is a Vue 3 + TypeScript PWA that aggregates RSS feeds through a CORS proxy and displays them as a card-based newsboard. UI copy is in **German**. The displayed app name is **B65**.

## Tech Stack

- **Vue 3** with `<script setup lang="ts">` (Composition API)
- **TypeScript** strict mode
- **Pinia** for state management and localStorage persistence
- **Vue Router** for client-side routing
- **Tailwind CSS 4** for styling
- **Vite** as build tool
- **vite-plugin-pwa** + Workbox for PWA capabilities

## Coding Standards

### Components
- Always use `<script setup lang="ts">` — no Options API
- Import with the `@/` alias: `import { useNewsStore } from '@/stores/newsStore'`
- Business logic belongs in Pinia stores or composables, not in components

### TypeScript
- Strict mode — every value must be typed
- Article objects must use the `NewsItem` interface from `@/types/news.ts`

### Styling
- Use Tailwind utility classes; avoid raw CSS

### Data & State
- RSS feeds must be fetched through the CORS proxy (`VITE_API_BASE_URL?url=<encoded>`) — never call feed URLs directly
- State and localStorage access belongs exclusively in `src/stores/newsStore.ts`

## Key Files

| File | Purpose |
|---|---|
| `src/types/news.ts` | `NewsItem` interface |
| `src/config/feeds.ts` | Default feed definitions |
| `src/services/feedService.ts` | Proxy fetch + XML parsing |
| `src/stores/newsStore.ts` | Pinia store (state, caching, refresh) |
| `src/views/HomeView.vue` | Feed grid + pull-to-refresh |
| `src/views/SettingsView.vue` | Feed management |
| `src/components/AppHeader.vue` | Sticky source filter chips |
| `src/components/NewsCard.vue` | Article card component |

## Environment Variables

- `VITE_API_BASE_URL` — proxy API base URL (e.g. `https://www.b65.ch/api`)
- `RSYNC_DEST` — rsync deploy target

Never commit `.env` or `.env.development`.

## Commands

```sh
npm run dev          # Dev server at http://localhost:5173
npm run build        # Type-check + production build
npm run type-check   # vue-tsc only
```
