<template>
  <!-- Filter chips bar only – no header, no search -->
  <div class="sticky top-0 z-50 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 pt-[env(safe-area-inset-top,0px)]">
    <div class="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-hide max-w-7xl mx-auto">
      <button
        class="shrink-0 px-3.5 py-1 rounded-full border text-xs font-medium transition-all"
        :class="store.activeSourceFilter === null
          ? 'bg-indigo-500 border-indigo-500 text-white'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-500'"
        @click="store.activeSourceFilter = null"
      >
        Alle
      </button>
      <button
        v-for="feed in store.feeds.filter((f) => f.enabled)"
        :key="feed.id"
        class="shrink-0 px-3.5 py-1 rounded-full border text-xs font-medium transition-all"
        :class="store.activeSourceFilter === feed.id
          ? 'text-white border-transparent'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-500'"
        :style="store.activeSourceFilter === feed.id ? { background: feed.color, borderColor: feed.color } : {}"
        @click="store.activeSourceFilter = feed.id"
      >
        {{ feed.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNewsStore } from '@/stores/newsStore'
const store = useNewsStore()
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { scrollbar-width: none; }
</style>

