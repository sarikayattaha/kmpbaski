import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  _client = createClient(url, key)
  return _client
}

// Yalnızca tarayıcıda/runtime'da çağrıldığında güvenli; env var yoksa no-op döner
export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    const client = getSupabase()
    if (!client) {
      // Env var eksikse tüm method çağrılarını sessizce yoksay
      return () => ({ data: null, error: null, then: (fn: (v: unknown) => unknown) => fn({ data: null, error: null }) })
    }
    return (client as never)[prop]
  },
})

export type Banner = {
  id: string
  title: string
  subtitle: string
  image_url: string
  button_text: string
  button_link: string
  order_index: number
  created_at: string
}

export type PriceMatrixGroup = {
  label: string
  color: string
  rows: string[][]
  rowImages?: string[]   // her satıra özel görsel URL (opsiyonel, geriye dönük uyumlu)
}

export type PriceMatrix = {
  columns: string[]
  groups: PriceMatrixGroup[]
}

export type Product = {
  id: string
  name: string
  description: string
  slug: string
  image_url: string
  category: string
  price_matrix: PriceMatrix | null
  is_featured: boolean
  created_at: string
}
