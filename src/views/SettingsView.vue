<template>
  <main class="max-w-2xl mx-auto px-4 pb-8 pt-[calc(env(safe-area-inset-top,0px)+1.25rem)]">

    <!-- Header -->
    <div class="mb-6">
      <RouterLink to="/" class="inline-flex items-center gap-1.5 min-h-11 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors no-underline">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Zurück
      </RouterLink>
      <h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-100 m-0">Quellen</h1>
    </div>

    <!-- Feed list -->
    <section v-if="store.feeds.length" :class="section">
      <TransitionGroup name="slide" tag="div" class="flex flex-col gap-2">
        <div v-for="feed in store.feeds" :key="feed.id"
          class="flex items-center gap-3 px-3 py-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl">

          <!-- Edit mode -->
          <template v-if="editingId === feed.id">
            <input
              v-model="editForm.color"
              type="color"
              aria-label="Farbe"
              class="w-10 h-10 shrink-0 border border-stone-200 dark:border-stone-700 rounded-lg cursor-pointer bg-transparent p-0.5"
            />
            <div class="flex-1 min-w-0 flex flex-col gap-1.5">
              <input v-model="editForm.name" type="text" aria-label="Name" placeholder="Name" required :class="input" />
              <input v-model="editForm.url" type="url" aria-label="RSS Feed URL" placeholder="RSS Feed URL" required :class="input" />
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button
                class="flex items-center justify-center w-10 h-10 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-80 transition-opacity"
                aria-label="Änderungen speichern"
                @click="saveEdit"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <button :class="iconBtn" aria-label="Bearbeitung abbrechen" @click="cancelEdit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </template>

          <!-- Display mode -->
          <template v-else>
            <div class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: feed.color }" aria-hidden="true" />
            <div class="flex-1 min-w-0 flex flex-col">
              <span class="font-medium text-[0.95rem] text-stone-900 dark:text-stone-100 truncate">{{ feed.name }}</span>
              <span class="text-xs text-stone-400 dark:text-stone-500 truncate">{{ feed.url }}</span>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <!-- Toggle -->
              <button
                role="switch"
                :aria-checked="feed.enabled"
                :aria-label="`${feed.name} aktiv`"
                class="flex items-center justify-center w-12 h-11 p-0 bg-transparent border-none cursor-pointer"
                @click="store.toggleFeed(feed.id)"
              >
                <span class="relative block w-10 h-[22px] rounded-full transition-colors duration-200"
                  :class="feed.enabled ? 'bg-stone-900 dark:bg-stone-100' : 'bg-stone-300 dark:bg-stone-700'">
                  <span class="absolute top-[3px] left-[3px] w-4 h-4 rounded-full shadow transition-transform duration-200"
                    :class="feed.enabled ? 'translate-x-[18px] bg-white dark:bg-stone-900' : 'bg-white dark:bg-stone-400'" />
                </span>
              </button>
              <button :class="iconBtn" aria-label="Quelle bearbeiten" @click="startEdit(feed)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <button :class="[iconBtn, 'hover:text-red-500!']" aria-label="Quelle entfernen" @click="removeFeed(feed.id)">
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
    <section :class="section">
      <h2 :class="label">Neue Quelle</h2>
      <form class="flex flex-col sm:flex-row sm:items-end gap-3" @submit.prevent="addFeed">
        <label class="flex-1 flex flex-col gap-1 text-xs text-stone-500 dark:text-stone-400">
          Name
          <input v-model="newFeed.name" type="text" placeholder="z.B. Heise Online" required :class="input" />
        </label>
        <label class="flex-1 flex flex-col gap-1 text-xs text-stone-500 dark:text-stone-400">
          RSS Feed URL
          <input v-model="newFeed.url" type="url" placeholder="https://…" required :class="input" />
        </label>
        <label class="flex flex-col gap-1 text-xs text-stone-500 dark:text-stone-400">
          Farbe
          <input
            v-model="newFeed.color"
            type="color"
            class="w-11 h-11 border border-stone-200 dark:border-stone-700 rounded-lg cursor-pointer bg-transparent p-0.5"
          />
        </label>
        <button
          type="submit"
          class="h-11 px-6 bg-stone-900 hover:bg-stone-700 dark:bg-stone-100 dark:hover:bg-stone-300 text-white dark:text-stone-900 rounded-full text-sm font-semibold cursor-pointer border-none transition-colors whitespace-nowrap"
        >Hinzufügen</button>
      </form>
    </section>

    <!-- Auto-Refresh -->
    <section :class="section">
      <h2 :class="label">Automatisch aktualisieren</h2>
      <div role="radiogroup" aria-label="Aktualisierungsintervall" class="flex p-1 gap-1 bg-stone-100 dark:bg-stone-950 rounded-full">
        <button
          v-for="option in [0, 1, 2, 5, 10]"
          :key="option"
          role="radio"
          :aria-checked="store.refreshIntervalMinutes === option"
          class="flex-1 h-10 rounded-full text-sm font-medium transition-colors"
          :class="store.refreshIntervalMinutes === option
            ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm'
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'"
          @click="store.setRefreshInterval(option)"
        >
          {{ option === 0 ? 'Aus' : `${option} min` }}
        </button>
      </div>
    </section>

    <!-- Import / Export -->
    <section :class="section">
      <h2 :class="label">Einstellungen sichern</h2>
      <p class="text-sm text-stone-500 dark:text-stone-400 m-0 mb-4">Quellen und Intervall als JSON-Datei exportieren oder importieren.</p>
      <div class="flex flex-wrap gap-2">
        <button :class="secBtn" @click="exportSettings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Exportieren
        </button>
        <button :class="secBtn" @click="triggerImport">
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
    <section :class="[section, 'flex flex-col gap-2 items-start']">
      <button :class="secBtn" @click="store.refresh()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        Alle Feeds aktualisieren
      </button>
      <button
        :disabled="clearing"
        class="inline-flex items-center gap-2 h-11 px-1 text-sm font-medium text-red-500 hover:text-red-600 cursor-pointer bg-transparent border-none disabled:opacity-50"
        @click="forceRefresh"
      >
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

// ── Shared Tailwind classes ──────────────────────────────────────────────────

const section = 'bg-white dark:bg-stone-900 rounded-2xl p-5 mb-4 shadow-sm'
const label = 'text-xs font-medium uppercase tracking-wide text-stone-400 dark:text-stone-500 m-0 mb-3'
const input = 'w-full h-11 px-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-base text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:border-stone-900 dark:focus:border-stone-300 outline-none transition-colors'
const iconBtn = 'flex items-center justify-center w-10 h-10 rounded-full bg-transparent text-stone-400 dark:text-stone-500 cursor-pointer hover:bg-stone-200/70 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors'
const secBtn = 'inline-flex items-center gap-2 h-11 px-5 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-full text-sm font-semibold cursor-pointer border-none hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors'

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
