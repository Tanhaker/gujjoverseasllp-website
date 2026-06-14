import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gujjoverseasllp.com'
  const supabase = await createClient()

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic products
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_visible', true)

  if (products) {
    products.forEach((product) => {
      routes.push({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updated_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  }

  // Dynamic categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, created_at')
    .eq('is_visible', true)

  if (categories) {
    categories.forEach((category) => {
      routes.push({
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: new Date(category.created_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })
  }

  return routes
}
