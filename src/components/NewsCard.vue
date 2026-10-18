<template>
  <article
    class="group relative flex flex-col bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-lg dark:hover:shadow-black/40"
  >
    <!-- Image -->
    <div class="relative aspect-[16/10] bg-stone-100 dark:bg-stone-800 overflow-hidden">
      <div
        v-if="item.imageUrl && !imgLoaded"
        class="absolute inset-0 animate-shimmer"
      />
      <img
        v-if="item.imageUrl"
        :src="item.imageUrl"
        alt=""
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover transition-[opacity,transform] duration-500 group-hover:scale-[1.03]"
        :class="imgLoaded ? 'opacity-100' : 'opacity-0'"
        @load="onImgLoad"
        @error="onImgError"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center text-stone-300 dark:text-stone-600">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5" />
          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5" />
          <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <!-- Body -->
    <div class="flex flex-col flex-1 gap-2 p-5">
      <div class="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
        <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: item.sourceColor }" aria-hidden="true" />
        <span class="font-medium truncate">{{ item.source }}</span>
        <time :datetime="item.pubDate.toISOString()" class="ml-auto shrink-0">
          {{ formatDate(item.pubDate) }}
        </time>
        <button
          type="button"
          class="relative z-10 -my-3 -mr-3 flex items-center justify-center w-11 h-11 rounded-full text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          :aria-label="`Artikel teilen: ${item.title}`"
          @click="shareArticle"
        >
          <svg v-if="!copied" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M8.5 13.5 15 10.5M15.5 15.5l-6-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" class="text-emerald-500">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="sr-only" aria-live="polite">{{ copied ? 'Link kopiert' : '' }}</span>
        </button>
      </div>

      <h2 class="text-[1.05rem] font-semibold leading-snug text-stone-900 dark:text-stone-100 line-clamp-3 m-0">
        <!-- Stretched link: die ganze Karte ist klickbar -->
        <a
          :href="item.link"
          target="_blank"
          rel="noopener noreferrer"
          class="no-underline text-inherit after:absolute after:inset-0 after:content-['']"
        >{{ item.title }}</a>
      </h2>
      <p v-if="item.summary" class="text-sm text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-3 m-0">
        {{ item.summary }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { NewsItem } from '@/types/news'

const props = defineProps<{ item: NewsItem }>()

const imgLoaded = ref(false)
const copied = ref(false)

function onImgLoad() {
  imgLoaded.value = true
}

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.style.display = 'none'
  imgLoaded.value = true  // Shimmer entfernen, damit SVG-Fallback sichtbar ist
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

async function shareArticle() {
  if (navigator.share) {
    await navigator.share({ title: props.item.title, url: props.item.link }).catch(() => {})
    return
  }
  try {
    await navigator.clipboard.writeText(props.item.link)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  } catch {
    alert(`Link: ${props.item.link}`)
  }
}
</script>
