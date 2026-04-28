<template>
  <article
    class="flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 active:translate-y-0"
    @click="openLink"
  >
    <!-- Image -->
    <div class="relative aspect-video bg-slate-100 dark:bg-slate-700 overflow-hidden">
      <img
        v-if="item.imageUrl"
        :src="item.imageUrl"
        :alt="item.title"
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        @error="onImgError"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-600">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5" />
          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5" />
          <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <!-- Body -->
    <div class="flex flex-col flex-1 gap-2 p-4">
      <div class="flex items-center gap-2 flex-wrap">
        <span
          class="text-[0.7rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
          :style="{ background: `color-mix(in srgb, ${item.sourceColor} 15%, transparent)`, color: item.sourceColor }"
        >
          {{ item.source }}
        </span>
        <time :datetime="item.pubDate.toISOString()" class="text-xs text-slate-400 dark:text-slate-500 ml-auto">
          {{ formatDate(item.pubDate) }}
        </time>
      </div>

      <h2 class="text-base font-semibold leading-snug text-slate-900 dark:text-slate-100 line-clamp-3 m-0">
        {{ item.title }}
      </h2>
      <p v-if="item.summary" class="text-[0.85rem] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 m-0">
        {{ item.summary }}
      </p>
    </div>

    <!-- Footer -->
    <div class="px-4 py-3 border-t border-slate-100 dark:border-slate-700">
      <span class="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-indigo-500 dark:text-indigo-400">
        Lesen
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { NewsItem } from '@/types/news'

const props = defineProps<{ item: NewsItem }>()

function openLink() {
  window.open(props.item.link, '_blank', 'noopener,noreferrer')
}

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.style.display = 'none'
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Gerade eben'
  if (minutes < 60) return `vor ${minutes} Min.`
  if (hours < 24) return `vor ${hours} Std.`
  if (days < 7) return `vor ${days} Tag${days > 1 ? 'en' : ''}`

  return date.toLocaleDateString('de-CH', { day: 'numeric', month: 'short' })
}
</script>
