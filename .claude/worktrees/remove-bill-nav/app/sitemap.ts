import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/business'
import { BLOG_POSTS } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    { url: SITE_URL,                    lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${SITE_URL}/services`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/contact`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/blog`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    ...blogEntries,
  ]
}
