import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchAllFeeds } from '@/services/feedService'
import { defaultFeeds, type FeedSource } from '@/config/feeds'
import type { NewsItem } from '@/types/news'

const STORAGE_KEY_FEEDS = 'newsmix:feeds'
const STORAGE_KEY_NEWS = 'newsmix:cached-news'
const STORAGE_KEY_INTERVAL = 'newsmix:refresh-interval'
const DEFAULT_INTERVAL_MINUTES = 2

function loadIntervalFromStorage(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INTERVAL)
    if (raw === null) return DEFAULT_INTERVAL_MINUTES
    const parsed = parseInt(raw, 10)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_INTERVAL_MINUTES
  } catch {
    return DEFAULT_INTERVAL_MINUTES
  }
}

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
  const refreshIntervalMinutes = ref<number>(loadIntervalFromStorage())
  let _timerId: ReturnType<typeof setInterval> | null = null

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

  function setFeeds(newFeeds: FeedSource[]) {
    feeds.value = newFeeds
    saveFeedConfig()
  }

  function _startTimer() {
    if (_timerId !== null) {
      clearInterval(_timerId)
      _timerId = null
    }
    if (refreshIntervalMinutes.value > 0) {
      _timerId = setInterval(refresh, refreshIntervalMinutes.value * 60 * 1000)
    }
  }

  function setRefreshInterval(minutes: number) {
    refreshIntervalMinutes.value = minutes
    localStorage.setItem(STORAGE_KEY_INTERVAL, String(minutes))
    _startTimer()
  }

  function startAutoRefresh() {
    refresh()
    _startTimer()
  }

  return {
    feeds,
    news,
    loading,
    error,
    lastUpdated,
    activeSourceFilter,
    refreshIntervalMinutes,
    filteredNews,
    refresh,
    addFeed,
    removeFeed,
    toggleFeed,
    updateFeed,
    setFeeds,
    setRefreshInterval,
    startAutoRefresh,
  }
})
