export interface NewsItem {
  id: string
  guid: string | null
  title: string
  summary: string
  imageUrl: string | null
  link: string
  pubDate: Date
  source: string
  sourceColor: string
  sourceId: string
}
