<template>
  <main
    class="max-w-7xl mx-auto px-4 pb-5 pt-[calc(env(safe-area-inset-top,0px)+1.25rem)]"
    @touchstart.passive="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- Pull-to-refresh indicator -->
    <div
      class="flex items-center justify-center overflow-hidden transition-[height,opacity] duration-200"
      :style="ptrStyle"
      aria-hidden="true"
    >
      <svg
        width="22" height="22" viewBox="0 0 24 24" fill="none"
        :style="{ transform: `rotate(${ptrRotation}deg)`, transition: isPulling ? 'none' : 'transform 0.3s' }"
      >
        <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <!-- Error banner -->
    <div v-if="store.error" class="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl text-red-500 bg-red-500/10 border border-red-500/20 text-sm" role="alert">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" class="shrink-0">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
        <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      {{ store.error }}
    </div>

    <!-- Skeleton loading -->
    <div v-if="store.loading && store.news.length === 0" class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
      <div v-for="n in 6" :key="n" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <div class="aspect-video bg-slate-100 dark:bg-slate-700 animate-pulse" />
        <div class="p-4 flex flex-col gap-2.5">
          <div class="h-3.5 w-2/5 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
          <div class="h-3.5 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
          <div class="h-3.5 w-3/4 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>
    </div>

    <!-- News grid -->
    <TransitionGroup v-else-if="store.filteredNews.length > 0" name="fade" tag="div" class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
      <NewsCard v-for="item in store.filteredNews" :key="item.id" :item="item" />
    </TransitionGroup>

    <!-- Empty state -->
    <div v-else-if="!store.loading" class="flex flex-col items-center gap-4 py-16 px-4 text-slate-400 dark:text-slate-600 text-center">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
        <path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <path d="M9 9h.01M15 9h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <p>Keine News gefunden.</p>
      <button
        class="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors"
        @click="store.refresh()"
      >Erneut versuchen</button>
    </div>

    <!-- Last updated -->
    <p v-if="store.lastUpdated" class="mt-6 text-center text-xs text-slate-400 dark:text-slate-600">
      Aktualisiert: {{ formatTime(store.lastUpdated) }}
    </p>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import NewsCard from '@/components/NewsCard.vue'
import { useNewsStore } from '@/stores/newsStore'

const store = useNewsStore()

// Pull-to-refresh
const PTR_THRESHOLD = 72
const touchStartY = ref(0)
const pullDistance = ref(0)
const isPulling = ref(false)
const triggered = ref(false)

function getScrollTop(): number {
  // Scroll-Container ist das div.flex-1.overflow-y-auto in App.vue
  return (document.querySelector('.overflow-y-auto') as HTMLElement)?.scrollTop ?? 0
}

function onTouchStart(e: TouchEvent) {
  if (getScrollTop() > 0 || !e.touches[0]) return
  touchStartY.value = e.touches[0].clientY
  isPulling.value = true
  triggered.value = false
}

function onTouchMove(e: TouchEvent) {
  if (!isPulling.value || !e.touches[0]) return
  const delta = e.touches[0].clientY - touchStartY.value
  if (delta < 0) { pullDistance.value = 0; return }
  pullDistance.value = Math.min(delta * 0.45, PTR_THRESHOLD + 20)
}

function onTouchEnd() {
  if (pullDistance.value >= PTR_THRESHOLD && !store.loading) {
    triggered.value = true
    store.refresh().finally(() => {
      triggered.value = false
      pullDistance.value = 0
    })
  } else {
    pullDistance.value = 0
  }
  isPulling.value = false
}

const ptrStyle = computed(() => ({
  height: `${pullDistance.value}px`,
  opacity: Math.min(pullDistance.value / PTR_THRESHOLD, 1),
  color: pullDistance.value >= PTR_THRESHOLD ? '#6366f1' : '#94a3b8',
}))

const ptrRotation = computed(() =>
  triggered.value ? 0 : Math.min((pullDistance.value / PTR_THRESHOLD) * 360, 360)
)

function formatTime(date: Date): string {
  return date.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-leave-to {
  opacity: 0;
}
</style>

