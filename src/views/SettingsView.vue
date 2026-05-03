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
          class="flex items-center gap-3 px-3 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl">

          <!-- Edit mode -->
          <template v-if="editingId === feed.id">
            <input
              v-model="editForm.color"
              type="color"
              class="w-8 h-8 shrink-0 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer bg-transparent p-0.5"
            />
            <div class="flex-1 min-w-0 flex flex-col gap-1.5">
              <input
                v-model="editForm.name"
                type="text"
                placeholder="Name"
                required
                class="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors"
              />
              <input
                v-model="editForm.url"
                type="url"
                placeholder="RSS Feed URL"
                required
                class="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button
                class="flex items-center justify-center w-8 h-8 rounded-lg border border-indigo-500 bg-indigo-500 text-white cursor-pointer hover:bg-indigo-600 transition-all"
                aria-label="Änderungen speichern"
                @click="saveEdit"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <button
                class="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-400 dark:text-slate-500 cursor-pointer hover:border-slate-400 transition-all"
                aria-label="Bearbeitung abbrechen"
                @click="cancelEdit"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </template>

          <!-- Display mode -->
          <template v-else>
            <div class="w-3 h-3 rounded-full shrink-0" :style="{ background: feed.color }" />
            <div class="flex-1 min-w-0 flex flex-col gap-0.5">
              <span class="font-semibold text-[0.9rem] text-slate-900 dark:text-slate-100">{{ feed.name }}</span>
              <span class="text-xs text-slate-400 dark:text-slate-500 truncate">{{ feed.url }}</span>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
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
              <!-- Edit -->
              <button
                class="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-400 dark:text-slate-500 cursor-pointer hover:bg-indigo-500/10 hover:border-indigo-500 hover:text-indigo-500 transition-all"
                aria-label="Quelle bearbeiten"
                @click="startEdit(feed)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
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
          </template>

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

    <!-- Import / Export -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100 m-0 mb-1">Einstellungen sichern</h2>
      <p class="text-xs text-slate-400 dark:text-slate-500 m-0 mb-4">Quellen und Intervall als JSON-Datei exportieren oder importieren.</p>
      <div class="flex flex-wrap gap-2">
        <button
          class="inline-flex items-center gap-2 px-5 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm font-semibold cursor-pointer hover:border-indigo-500 transition-colors"
          @click="exportSettings"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Exportieren
        </button>
        <button
          class="inline-flex items-center gap-2 px-5 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm font-semibold cursor-pointer hover:border-indigo-500 transition-colors"
          @click="triggerImport"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Importieren
        </button>
        <input
          ref="importInputRef"
          type="file"
          accept="application/json,.json"
          class="hidden"
          @change="onImportFile"
        />
      </div>
    </section>

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

// ── Cache clear ──────────────────────────────────────────────────────────────

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

// ── Add feed ─────────────────────────────────────────────────────────────────

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

// ── Edit feed ────────────────────────────────────────────────────────────────

const editingId = ref<string | null>(null)
const editForm = reactive({ name: '', url: '', color: '#6366f1' })

function startEdit(feed: FeedSource) {
  editingId.value = feed.id
  editForm.name = feed.name
  editForm.url = feed.url
  editForm.color = feed.color
}

function saveEdit() {
  if (!editingId.value) return
  const existing = store.feeds.find((f) => f.id === editingId.value)
  if (!existing) return
  store.updateFeed({
    ...existing,
    name: editForm.name,
    url: editForm.url,
    color: editForm.color,
  })
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}

// ── Export / Import ──────────────────────────────────────────────────────────

function exportSettings() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    feeds: store.feeds,
    refreshIntervalMinutes: store.refreshIntervalMinutes,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `b65-settings-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const importInputRef = ref<HTMLInputElement | null>(null)

function triggerImport() {
  importInputRef.value?.click()
}

function isValidFeed(f: unknown): f is FeedSource {
  if (typeof f !== 'object' || f === null) return false
  const feed = f as Record<string, unknown>
  return (
    typeof feed.id === 'string' &&
    typeof feed.name === 'string' &&
    typeof feed.url === 'string' &&
    typeof feed.color === 'string' &&
    typeof feed.enabled === 'boolean'
  )
}

async function onImportFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const text = await file.text()
    const data = JSON.parse(text) as Record<string, unknown>
    if (!Array.isArray(data.feeds) || !data.feeds.every(isValidFeed)) {
      throw new Error('Ungültiges Format')
    }
    if (!confirm(`${data.feeds.length} Quellen importieren und aktuelle Einstellungen ersetzen?`)) return
    store.setFeeds(data.feeds)
    if (typeof data.refreshIntervalMinutes === 'number') {
      store.setRefreshInterval(data.refreshIntervalMinutes)
    }
  } catch {
    alert('Fehler beim Import: Ungültige oder beschädigte Datei.')
  } finally {
    if (importInputRef.value) importInputRef.value.value = ''
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
