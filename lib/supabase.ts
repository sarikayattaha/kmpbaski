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

export type Category = {
  id: string
  name: string
  show_in_navbar: boolean
  navbar_order: number
  created_at: string
}

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

export type Review = {
  name: string
  rating: number
  date: string
  comment: string
}

export type Product = {
  id: string
  name: string
  slug: string
  image_url: string
  category: string
  price: string          // görüntülenecek fiyat metni (Ör: "₺120", "120,00 ₺")
  features: string       // satır satır özellikler (newline ile ayrılmış)
  is_featured: boolean
  is_price_on_request: boolean  // true ise fiyat yerine "Fiyat Alınız" gösterilir
  reviews: Review[]
  images: string[]
  created_at: string
}

export type Profile = {
  id: string
  full_name: string
  phone: string
  address: string
  email: string
  created_at: string
}

export type AmbalajCategory = {
  id: string
  name: string
  slug: string
  cover_image: string
  order_index: number
  created_at: string
}

export type AmbalajProduct = {
  id: string
  category_id: string
  name: string
  description: string
  image_url: string
  created_at: string
}
