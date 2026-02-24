import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://rinse-it.vercel.app', lastModified: new Date(), priority: 1 },
    { url: 'https://rinse-it.vercel.app/search', lastModified: new Date(), priority: 0.8 },
    { url: 'https://rinse-it.vercel.app/login', lastModified: new Date(), priority: 0.5 },
    { url: 'https://rinse-it.vercel.app/register', lastModified: new Date(), priority: 0.5 },
  ]
}
