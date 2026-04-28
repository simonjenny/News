export interface FeedSource {
  id: string
  name: string
  url: string
  color: string
  enabled: boolean
}

export const defaultFeeds: FeedSource[] = [
  {
    id: 't3n',
    name: 't3n',
    url: 'https://t3n.de/rss.xml',
    color: '#e8372c',
    enabled: true,
  },
  {
    id: 'inside-it',
    name: 'inside-it.ch',
    url: 'https://www.inside-it.ch/rss.xml',
    color: '#0057a8',
    enabled: true,
  },
]
