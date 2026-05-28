// src/utils/seo.ts — SEO 工具（Schema.org 生成、OG 标签数据）

export interface SeoMeta {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: 'website' | 'article'
  canonical?: string
  hreflang?: { lang: string; url: string }[]
  schema?: SchemaOrgData
}

export interface SchemaOrgData {
  '@context': 'https://schema.org'
  '@type': string
  name: string
  description: string
  [key: string]: unknown
}

// 生成 SoftwareApplication Schema
export function buildAppSchema(): SchemaOrgData {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Excalidraw Hub',
    description: 'Free online whiteboard and diagramming tool',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: 'https://excalidraw-hub.com',
  }
}

// 生成 ItemList Schema（模板列表页）
export function buildItemListSchema(items: { name: string; url: string }[]): SchemaOrgData {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Whiteboard Templates',
    description: 'Collection of free whiteboard templates',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  }
}
