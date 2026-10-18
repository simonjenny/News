<template>
  <!-- Filter chips bar only – no header, no search -->
  <div class="sticky top-0 z-40 bg-stone-50/85 dark:bg-stone-950/85 backdrop-blur-md pt-[env(safe-area-inset-top,0px)]">
    <div class="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide max-w-7xl mx-auto chip-fade">
      <button
        class="shrink-0 h-9 px-4 rounded-full text-sm font-medium transition-colors"
        :class="store.activeSourceFilter === null ? chipActive : chipIdle"
        :aria-pressed="store.activeSourceFilter === null"
        @click="store.activeSourceFilter = null"
      >
        Alle
      </button>
      <button
        v-for="feed in store.feeds.filter((f) => f.enabled)"
        :key="feed.id"
        class="shrink-0 h-9 px-4 inline-flex items-center gap-2 rounded-full text-sm font-medium transition-colors"
        :class="store.activeSourceFilter === feed.id ? chipActive : chipIdle"
        :aria-pressed="store.activeSourceFilter === feed.id"
        @click="store.activeSourceFilter = feed.id"
      >
        <span class="w-1.5 h-1.5 rounded-full" :style="{ background: feed.color }" aria-hidden="true" />
        {{ feed.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNewsStore } from '@/stores/newsStore'
const store = useNewsStore()

const chipActive = 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
const chipIdle = 'bg-stone-200/60 text-stone-600 hover:bg-stone-200 dark:bg-stone-800/70 dark:text-stone-400 dark:hover:bg-stone-800'
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { scrollbar-width: none; }
.chip-fade {
  mask-image: linear-gradient(to right, transparent, #000 1rem, #000 calc(100% - 1.5rem), transparent);
}
</style>
