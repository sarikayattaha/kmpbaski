-- ============================================================
-- KMP BASKI — Admin Auth Migration (RLS kilitleme)
-- Supabase Dashboard > SQL Editor'da çalıştırın
-- Bu dosya supabase-setup.sql'i DEĞİŞTİRMEZ, üzerine ekler.
--
-- Amaç: anon key ile herkese açık INSERT/UPDATE/DELETE'i kapatıp
-- yalnızca authenticated (giriş yapmış admin) kullanıcıya açmak.
-- Public SELECT (okuma) politikaları AYNI KALIR — site herkese açık kalmalı.
--
-- ÖN KOŞUL: Bu script'i çalıştırmadan önce Supabase Dashboard >
-- Authentication > Users > Add User ile admin hesabını oluşturun
-- (e-posta: sarikayattaha@gmail.com, "Auto Confirm User" işaretli,
-- güçlü yeni bir şifre — eski "kmpbaski2024" KULLANMAYIN).
-- ============================================================

-- ----------------------------------------------------------------
-- 1) Bu tablolardaki TÜM mevcut policy'leri dinamik olarak sil
--    (products/categories/ambalaj_* dashboard'dan oluşturuldu,
--    mevcut policy isimleri repo'da kayıtlı değil — pg_policies
--    üzerinden bulup güvenle DROP ediyoruz)
-- ----------------------------------------------------------------
DO $$
DECLARE
  r RECORD;
  target_tables TEXT[] := ARRAY[
    'banners', 'ambalaj_banners', 'products', 'categories',
    'ambalaj_categories', 'ambalaj_products'
  ];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY target_tables LOOP
    FOR r IN
      SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = t
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, t);
    END LOOP;
  END LOOP;
END $$;

-- ----------------------------------------------------------------
-- 2) Her tablo için: herkese SELECT, sadece authenticated'e yazma
--    NOT: products/categories dashboard'dan oluşturulduysa RLS'in
--    zaten enable olduğunu kontrol edin (aşağıdaki ALTER TABLE
--    ENABLE satırları zaten enable ise no-op'tur, güvenli).
-- ----------------------------------------------------------------

-- banners
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read banners" ON public.banners
  FOR SELECT USING (true);
CREATE POLICY "Authenticated write banners" ON public.banners
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ambalaj_banners
ALTER TABLE public.ambalaj_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ambalaj_banners" ON public.ambalaj_banners
  FOR SELECT USING (true);
CREATE POLICY "Authenticated write ambalaj_banners" ON public.ambalaj_banners
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.products
  FOR SELECT USING (true);
CREATE POLICY "Authenticated write products" ON public.products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON public.categories
  FOR SELECT USING (true);
CREATE POLICY "Authenticated write categories" ON public.categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ambalaj_categories
ALTER TABLE public.ambalaj_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ambalaj_categories" ON public.ambalaj_categories
  FOR SELECT USING (true);
CREATE POLICY "Authenticated write ambalaj_categories" ON public.ambalaj_categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ambalaj_products
ALTER TABLE public.ambalaj_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ambalaj_products" ON public.ambalaj_products
  FOR SELECT USING (true);
CREATE POLICY "Authenticated write ambalaj_products" ON public.ambalaj_products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------
-- 3) STORAGE — banner-images bucket
--    (Eski policy adları supabase-setup.sql'den biliniyor, güvenle DROP edilir)
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "Public read banner images" ON storage.objects;
DROP POLICY IF EXISTS "Anon upload banner images" ON storage.objects;
DROP POLICY IF EXISTS "Anon delete banner images" ON storage.objects;

CREATE POLICY "Public read banner images" ON storage.objects
  FOR SELECT USING (bucket_id = 'banner-images');
CREATE POLICY "Authenticated upload banner images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'banner-images');
CREATE POLICY "Authenticated delete banner images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'banner-images');

-- ----------------------------------------------------------------
-- 4) STORAGE — product-images bucket
--    Bu bucket dashboard'dan oluşturulduğu için mevcut policy adları
--    BİLİNMİYOR. Aşağıdaki DROP'lar tahmini isimlerle yazıldı; eşleşmezse
--    Supabase Dashboard > Storage > Policies > product-images altındaki
--    gerçek policy adlarını görüp
--    DROP POLICY IF EXISTS "<gerçek ad>" ON storage.objects;
--    satırını elle ekleyip tekrar çalıştırın.
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
DROP POLICY IF EXISTS "Anon upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anon delete product images" ON storage.objects;

CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated upload product images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Authenticated delete product images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- ----------------------------------------------------------------
-- 6) TEMİZLİK — İlk çalıştırmada doğrulama sorgusu şu eski, herkese açık
--    storage policy'lerinin hâlâ durduğunu ortaya çıkardı (adları 3/4.
--    bölümdeki tahminlerle eşleşmediği için DROP edilmemişlerdi). Bunlar
--    yeni authenticated-only policy'lerin YANINDA durup Postgres RLS'te
--    "herhangi bir policy izin verirse geçer" mantığıyla storage'ı hâlâ
--    herkese açık bırakıyordu — bu bölüm onları temizler.
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "Banner Politikası 1uz6zi1_0" ON storage.objects;
DROP POLICY IF EXISTS "Banner Politikası 1uz6zi1_1" ON storage.objects;
DROP POLICY IF EXISTS "Banner Politikası 1uz6zi1_2" ON storage.objects;
DROP POLICY IF EXISTS "anon_upload_product_images" ON storage.objects;
DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
DROP POLICY IF EXISTS "anon_delete_product_images" ON storage.objects;

-- ----------------------------------------------------------------
-- 7) DOĞRULAMA — migration'dan sonra bu sorguyu çalıştırıp kontrol edin:
--    Her tabloda tam olarak 1 public SELECT + 1 authenticated-only
--    yazma policy'si kalmış olmalı.
-- ----------------------------------------------------------------
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename IN ('banners','ambalaj_banners','products','categories',
                     'ambalaj_categories','ambalaj_products')
   OR (tablename = 'objects' AND schemaname = 'storage')
ORDER BY tablename, cmd;
