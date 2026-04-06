-- ============================================================
-- KMP BASKI — Supabase Kurulum SQL
-- Supabase Dashboard > SQL Editor'da çalıştırın
-- ============================================================

-- 1) BANNERS TABLOSU
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

-- 3) STORAGE BUCKET (Dashboard > Storage > New Bucket ile de yapılabilir)
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
