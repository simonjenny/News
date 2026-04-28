export interface NewsItem {
  id: string
  title: string
  summary: string
  imageUrl: string | null
  link: string
  pubDate: Date
  source: string
  sourceColor: string
  sourceId: string
}
