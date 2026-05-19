import type { NewsItem } from '@/types/news'
import type { FeedSource } from '@/config/feeds'

// Backend API base URL — set VITE_API_BASE_URL in .env or as a CI secret.
// Using || instead of ?? so an empty string (e.g. unset GitHub Actions secret)
// also falls back to the default rather than producing broken relative URLs.
const API_BASE: string = import.meta.env.VITE_API_BASE_URL || '/api'

function extractImage(item: Element): string | null {
  // media:content
  const media = item.querySelector('content')
  if (media?.getAttribute('url')) return media.getAttribute('url')

  // enclosure
  const enclosure = item.querySelector('enclosure')
  if (enclosure?.getAttribute('url')?.match(/\.(jpg|jpeg|png|webp|gif)/i)) {
    return enclosure.getAttribute('url')
  }

  // og:image in description HTML
  const desc = item.querySelector('description')?.textContent ?? ''
  const imgMatch = desc.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (imgMatch) return imgMatch[1] ?? null

  return null
}

function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseFeedXml(xml: string, source: FeedSource): NewsItem[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'application/xml')
  const items = Array.from(doc.querySelectorAll('item'))

  return items.map((item, index) => {
    const titleRaw = item.querySelector('title')?.textContent?.trim() ?? 'Kein Titel'
    const title = decodeHtmlEntities(titleRaw)
    const link = item.querySelector('link')?.textContent?.trim() ?? '#'
    const pubDateRaw = item.querySelector('pubDate')?.textContent ?? ''
    const description = item.querySelector('description')?.textContent ?? ''
    const summary = stripHtml(description).slice(0, 200)
    const guid = item.querySelector('guid')?.textContent?.trim() ?? null

    return {
      id: `${source.id}-${index}-${Date.now()}`,
      guid,
      title,
      summary,
      imageUrl: extractImage(item),
      link,
      pubDate: new Date(pubDateRaw),
      source: source.name,
      sourceColor: source.color,
      sourceId: source.id,
    }
  })
}

export async function fetchFeed(source: FeedSource): Promise<NewsItem[]> {
  // The Laravel backend exposes a proxy endpoint to avoid CORS issues:
  // GET /api/feed?url=<encoded-feed-url>
  const proxyUrl = `${API_BASE}/feed?url=${encodeURIComponent(source.url)}`

  const response = await fetch(proxyUrl, {
    headers: { Accept: 'application/xml, text/xml, */*' },
  })

  if (!response.ok) {
    throw new Error(`Feed konnte nicht geladen werden: ${source.name} (${response.status})`)
  }

  const xml = await response.text()
  return parseFeedXml(xml, source)
}

export async function fetchAllFeeds(sources: FeedSource[]): Promise<NewsItem[]> {
  const enabled = sources.filter((s) => s.enabled)

  const results = await Promise.allSettled(enabled.map((s) => fetchFeed(s)))

  const items: NewsItem[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') {
      items.push(...result.value)
    }
  }

  // Sort by date descending, then deduplicate within each source
  const sorted = items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
  return deduplicateItems(sorted)
}

function normalizeTitle(title: string): Set<string> {
  return new Set(
    title.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean)
  )
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  const intersection = new Set([...a].filter(x => b.has(x)))
  const union = new Set([...a, ...b])
  return union.size === 0 ? 1 : intersection.size / union.size
}

function deduplicateItems(items: NewsItem[]): NewsItem[] {
  const bySource = new Map<string, NewsItem[]>()
  for (const item of items) {
    const group = bySource.get(item.sourceId) ?? []
    group.push(item)
    bySource.set(item.sourceId, group)
  }

  const result: NewsItem[] = []
  for (const group of bySource.values()) {
    // Already sorted newest-first; first match we keep is always the latest version
    const kept: NewsItem[] = []
    for (const candidate of group) {
      const isDuplicate = kept.some(existing => {
        if (candidate.guid && existing.guid === candidate.guid) return true
        if (candidate.imageUrl && existing.imageUrl === candidate.imageUrl) return true
        return jaccardSimilarity(normalizeTitle(existing.title), normalizeTitle(candidate.title)) >= 0.65
      })
      if (!isDuplicate) kept.push(candidate)
    }
    result.push(...kept)
  }
  return result
}
