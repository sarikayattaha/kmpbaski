-- ============================================================
-- KMP BASKI — Supabase Kurulum SQL
-- Supabase Dashboard > SQL Editor'da çalıştırın
-- ============================================================

-- 1) BANNERS TABLOSU (ana sayfa)
CREATE TABLE IF NOT EXISTS public.banners (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT        NOT NULL,
  subtitle     TEXT,
  image_url    TEXT,
  button_text  TEXT        DEFAULT 'Hemen Sipariş Ver',
  button_link  TEXT        DEFAULT '#',
  order_index  INTEGER     DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- 2) RLS — Herkes okuyabilir, anon key ile yazabilir (geliştirme ortamı)
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read banners"   ON public.banners;
DROP POLICY IF EXISTS "Anon write banners"    ON public.banners;

CREATE POLICY "Public read banners"
  ON public.banners FOR SELECT USING (true);

CREATE POLICY "Anon write banners"
  ON public.banners FOR ALL USING (true) WITH CHECK (true);

-- 3) AMBALAJ BANNERS TABLOSU
-- Yeni kurulum için:
CREATE TABLE IF NOT EXISTS public.ambalaj_banners (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT        NOT NULL,
  subtitle     TEXT,
  images       TEXT[]      DEFAULT '{}',
  button_text  TEXT,
  button_link  TEXT,
  order_index  INTEGER     DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ambalaj_banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read ambalaj_banners" ON public.ambalaj_banners;
DROP POLICY IF EXISTS "Anon write ambalaj_banners"  ON public.ambalaj_banners;

CREATE POLICY "Public read ambalaj_banners"
  ON public.ambalaj_banners FOR SELECT USING (true);

CREATE POLICY "Anon write ambalaj_banners"
  ON public.ambalaj_banners FOR ALL USING (true) WITH CHECK (true);

-- Mevcut tabloyu güncellemek için (eski kolonlar varsa):
-- ALTER TABLE public.ambalaj_banners ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
-- ALTER TABLE public.ambalaj_banners DROP COLUMN IF EXISTS badge;
-- ALTER TABLE public.ambalaj_banners DROP COLUMN IF EXISTS highlight;
-- ALTER TABLE public.ambalaj_banners DROP COLUMN IF EXISTS wa_text;
-- ALTER TABLE public.ambalaj_banners DROP COLUMN IF EXISTS from_color;
-- ALTER TABLE public.ambalaj_banners DROP COLUMN IF EXISTS to_color;
-- ALTER TABLE public.ambalaj_banners DROP COLUMN IF EXISTS image_url;
-- ALTER TABLE public.ambalaj_banners DROP COLUMN IF EXISTS is_active;

-- 4) STORAGE BUCKET (Dashboard > Storage > New Bucket ile de yapılabilir)
-- Aşağıdaki satır Storage bucket oluşturur. Dashboard'dan da eklenebilir:
--   Bucket adı : banner-images
--   Public     : ✅ (açık)
INSERT INTO storage.buckets (id, name, public)
VALUES ('banner-images', 'banner-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: herkes okuyabilir, anon key ile yükleyebilir
DROP POLICY IF EXISTS "Public read banner images"   ON storage.objects;
DROP POLICY IF EXISTS "Anon upload banner images"   ON storage.objects;
DROP POLICY IF EXISTS "Anon delete banner images"   ON storage.objects;

CREATE POLICY "Public read banner images"
  ON storage.objects FOR SELECT USING (bucket_id = 'banner-images');

CREATE POLICY "Anon upload banner images"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banner-images');

CREATE POLICY "Anon delete banner images"
  ON storage.objects FOR DELETE USING (bucket_id = 'banner-images');

-- Fırsat etiketi ve sürükle-bırak sıralama için yeni kolonlar
-- Supabase Dashboard > SQL Editor'da çalıştırın
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_firsat BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sort_order INTEGER;
