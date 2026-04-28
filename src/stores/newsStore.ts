import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchAllFeeds } from '@/services/feedService'
import { defaultFeeds, type FeedSource } from '@/config/feeds'
import type { NewsItem } from '@/types/news'

const STORAGE_KEY_FEEDS = 'newsmix:feeds'
const STORAGE_KEY_NEWS = 'newsmix:cached-news'
const REFRESH_INTERVAL_MS = 10 * 60 * 1000 // 10 minutes

function loadFeedsFromStorage(): FeedSource[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FEEDS)
    return raw ? (JSON.parse(raw) as FeedSource[]) : defaultFeeds
  } catch {
    return defaultFeeds
  }
}

function loadCachedNews(): NewsItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NEWS)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Array<Omit<NewsItem, 'pubDate'> & { pubDate: string }>
    return parsed.map((n) => ({ ...n, pubDate: new Date(n.pubDate) }))
  } catch {
    return []
  }
}

export const useNewsStore = defineStore('news', () => {
  const feeds = ref<FeedSource[]>(loadFeedsFromStorage())
  const news = ref<NewsItem[]>(loadCachedNews())
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const activeSourceFilter = ref<string | null>(null)

  const filteredNews = computed(() => {
    let items = news.value
    if (activeSourceFilter.value) {
      items = items.filter((n) => n.sourceId === activeSourceFilter.value)
    }
    return items.slice().sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
  })

  async function refresh() {
    loading.value = true
    error.value = null
    try {
      const items = await fetchAllFeeds(feeds.value)
      news.value = items
      lastUpdated.value = new Date()
      localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(items))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unbekannter Fehler'
    } finally {
      loading.value = false
    }
  }

  function saveFeedConfig() {
    localStorage.setItem(STORAGE_KEY_FEEDS, JSON.stringify(feeds.value))
  }

  function addFeed(feed: FeedSource) {
    feeds.value.push(feed)
    saveFeedConfig()
  }

  function removeFeed(id: string) {
    feeds.value = feeds.value.filter((f) => f.id !== id)
    saveFeedConfig()
  }

  function toggleFeed(id: string) {
    const feed = feeds.value.find((f) => f.id === id)
    if (feed) {
      feed.enabled = !feed.enabled
      saveFeedConfig()
    }
  }

  function updateFeed(updated: FeedSource) {
    const idx = feeds.value.findIndex((f) => f.id === updated.id)
    if (idx !== -1) {
      feeds.value[idx] = updated
      saveFeedConfig()
    }
  }

  function startAutoRefresh() {
    refresh()
    setInterval(refresh, REFRESH_INTERVAL_MS)
  }

  return {
    feeds,
    news,
    loading,
    error,
    lastUpdated,
    activeSourceFilter,
    filteredNews,
    refresh,
    addFeed,
    removeFeed,
    toggleFeed,
    updateFeed,
    startAutoRefresh,
  }
})
