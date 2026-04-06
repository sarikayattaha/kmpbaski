import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')
  _client = createClient(url, key)
  return _client
}

// Geriye dönük uyumluluk için — yalnızca tarayıcıda/runtime'da çağrıldığında güvenli
export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    return (getSupabase() as never)[prop]
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
