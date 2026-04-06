import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
