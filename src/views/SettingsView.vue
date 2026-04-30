<template>
  <main class="max-w-2xl mx-auto px-4 pb-5 pt-[calc(env(safe-area-inset-top,0px)+1.25rem)]">

    <!-- Header -->
    <div class="mb-6">
      <RouterLink to="/" class="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors mb-3 no-underline">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Zurück
      </RouterLink>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 m-0">Quellen konfigurieren</h1>
    </div>

    <!-- Feed list -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
      <TransitionGroup name="slide" tag="div" class="flex flex-col gap-2.5">
        <div v-for="feed in store.feeds" :key="feed.id"
          class="flex items-center gap-3.5 px-3 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
          <div class="w-3 h-3 rounded-full shrink-0" :style="{ background: feed.color }" />
          <div class="flex-1 min-w-0 flex flex-col gap-0.5">
            <span class="font-semibold text-[0.9rem] text-slate-900 dark:text-slate-100">{{ feed.name }}</span>
            <span class="text-xs text-slate-400 dark:text-slate-500 truncate">{{ feed.url }}</span>
          </div>
          <div class="flex items-center gap-2">
            <!-- Toggle -->
            <button
              class="p-0 bg-transparent border-none cursor-pointer"
              :aria-label="feed.enabled ? 'Deaktivieren' : 'Aktivieren'"
              @click="store.toggleFeed(feed.id)"
            >
              <span class="relative block w-10 h-[22px] rounded-full transition-colors duration-200"
                :class="feed.enabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'">
                <span class="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                  :class="{ 'translate-x-[18px]': feed.enabled }" />
              </span>
            </button>
            <!-- Delete -->
            <button
              class="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-400 dark:text-slate-500 cursor-pointer hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 transition-all"
              aria-label="Quelle entfernen"
              @click="removeFeed(feed.id)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </section>

    <!-- Add feed -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100 m-0 mb-4">Neue Quelle hinzufügen</h2>
      <form class="flex flex-wrap gap-2 items-end" @submit.prevent="addFeed">
        <input
          v-model="newFeed.name"
          type="text"
          placeholder="Name (z.B. Heise Online)"
          required
          class="flex-1 min-w-40 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
        />
        <input
          v-model="newFeed.url"
          type="url"
          placeholder="RSS Feed URL"
          required
          class="flex-1 min-w-40 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
        />
        <div class="flex flex-col gap-1">
          <label for="feed-color" class="text-xs text-slate-400">Farbe</label>
          <input
            id="feed-color"
            v-model="newFeed.color"
            type="color"
            class="w-10 h-[34px] border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer bg-transparent p-0.5"
          />
        </div>
        <button
          type="submit"
          class="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold cursor-pointer border-none transition-colors whitespace-nowrap"
        >Hinzufügen</button>
      </form>
    </section>

    <!-- Auto-Refresh -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden mb-4" style="box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
      <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <p class="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide m-0">Automatisch aktualisieren</p>
      </div>
      <div class="flex items-center divide-x divide-slate-100 dark:divide-slate-700">
        <button
          v-for="option in [0, 1, 2, 5, 10]"
          :key="option"
          class="flex-1 py-3 text-sm font-medium transition-colors"
          :class="store.refreshIntervalMinutes === option ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-500'"
          @click="store.setRefreshInterval(option)"
        >
          {{ option === 0 ? 'Aus' : `${option} min` }}
        </button>
      </div>
    </div>

    <!-- Actions -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-3">
      <button
        class="inline-flex items-center gap-2 px-5 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm font-semibold cursor-pointer hover:border-indigo-500 transition-colors"
        @click="store.refresh()"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        Alle Feeds aktualisieren
      </button>
      <button
        :disabled="clearing"
        class="inline-flex items-center gap-2 px-5 py-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-sm font-semibold cursor-pointer hover:bg-red-500/20 transition-colors disabled:opacity-50"
        @click="forceRefresh"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ clearing ? 'Wird geleert…' : 'App-Cache leeren &amp; neu laden' }}
      </button>
    </section>

  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useNewsStore } from '@/stores/newsStore'
import type { FeedSource } from '@/config/feeds'

const store = useNewsStore()
const clearing = ref(false)

async function forceRefresh() {
  clearing.value = true
  try {
    if ('caches' in window) {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    }
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations()
      await Promise.all(regs.map((r) => r.unregister()))
    }
    localStorage.removeItem('newsmix:cached-news')
  } finally {
    window.location.reload()
  }
}

const newFeed = reactive({ name: '', url: '', color: '#6366f1' })

function addFeed() {
  const feed: FeedSource = {
    id: newFeed.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
    name: newFeed.name,
    url: newFeed.url,
    color: newFeed.color,
    enabled: true,
  }
  store.addFeed(feed)
  newFeed.name = ''
  newFeed.url = ''
  newFeed.color = '#6366f1'
}

function removeFeed(id: string) {
  if (confirm('Quelle wirklich entfernen?')) {
    store.removeFeed(id)
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
