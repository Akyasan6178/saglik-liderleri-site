-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: Create Profiles Table & Auth Trigger
-- Geleceğin Dijital Sağlık Liderleri (GDSL) - AUTH-01
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. TABLO OLUŞTURMA
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  role text NOT NULL CHECK (role IN ('admin', 'mentor', 'katilimci')),
  ad_soyad text,
  core_katilimci_id bigint NULL,
  core_mentor_id bigint NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. İNDEKSLER
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. SECURITY DEFINER HELPER (RECURSIVE POLICY ENGELLEME)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 4. RLS ETKİNLEŞTİRME & POLİTİKALAR
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Kullanici Kendi Profilini Okur" ON public.profiles;
DROP POLICY IF EXISTS "Admin Tum Profilleri Okur" ON public.profiles;
DROP POLICY IF EXISTS "Kullanici Kendi Profilini Gunceller" ON public.profiles;
DROP POLICY IF EXISTS "Admin veya Service Role Profile Ekler" ON public.profiles;

-- Kullanıcı kendi profilini okuyabilir
CREATE POLICY "Kullanici Kendi Profilini Okur"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Admin tüm profilleri okuyabilir
CREATE POLICY "Admin Tum Profilleri Okur"
ON public.profiles FOR SELECT
USING (public.is_admin());

-- Kullanıcı kendi profilini güncelleyebilir veya Admin güncelleyebilir
CREATE POLICY "Kullanici Kendi Profilini Gunceller"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR public.is_admin());

-- Admin / Service role profil ekleyebilir
CREATE POLICY "Admin veya Service Role Profile Ekler"
ON public.profiles FOR INSERT
WITH CHECK (true);

-- 5. YENİ KULLANICI İÇİN AUTOMATIC TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role text;
  user_name text;
BEGIN
  -- Meta veriden role al, yoksa varsayılan 'katilimci' yap
  assigned_role := COALESCE(new.raw_user_meta_data->>'role', 'katilimci');
  
  IF assigned_role NOT IN ('admin', 'mentor', 'katilimci') THEN
    assigned_role := 'katilimci';
  END IF;

  user_name := COALESCE(
    new.raw_user_meta_data->>'ad_soyad',
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1)
  );

  INSERT INTO public.profiles (id, email, role, ad_soyad)
  VALUES (new.id, new.email, assigned_role, user_name)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    ad_soyad = COALESCE(EXCLUDED.ad_soyad, public.profiles.ad_soyad),
    updated_at = now();

  RETURN new;
END;
$$;

-- Trigger tanımla
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
