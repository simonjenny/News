export interface FeedSource {
  id: string
  name: string
  url: string
  color: string
  enabled: boolean
}

export const defaultFeeds: FeedSource[] = []
