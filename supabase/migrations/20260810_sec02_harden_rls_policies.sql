-- ─────────────────────────────────────────────────────────────────────────────
-- SEC-02: RLS Policy Güvenli Hale Getirme
-- Geleceğin Dijital Sağlık Liderleri (GDSL)
-- Tarih: 2026-08-10
-- Amaç: Gevşek USING(true) ve authenticated ALL policy'lerini
--        minimum yetki prensibiyle değiştir.
-- Kural: İdempotent — tekrar çalıştırılabilir. Veri değiştirmez.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═════════════════════════════════════════════════════════════════════════════
-- BÖLÜM 1: HELPER FUNCTIONS
-- Tüm SECURITY DEFINER fonksiyonlarında search_path = public sabitlendi.
-- ═════════════════════════════════════════════════════════════════════════════

-- 1-A. is_admin() — Auth kullanıcısının admin olup olmadığını döner
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

-- 1-B. current_profile_role() — Auth kullanıcısının profiles.role değerini döner
CREATE OR REPLACE FUNCTION public.current_profile_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 1-C. current_katilimci_id() — Auth kullanıcısının bağlı core_katilimci.id'sini döner
CREATE OR REPLACE FUNCTION public.current_katilimci_id()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT core_katilimci_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 1-D. current_mentor_id() — Auth kullanıcısının bağlı core_mentor.id'sini döner
CREATE OR REPLACE FUNCTION public.current_mentor_id()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT core_mentor_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 1-E. is_mentor_of_katilimci(target_katilimci_id bigint)
-- Mentörün hedef katılımcının takımına atanmış mentor olup olmadığını doğrular.
-- Zincir: profiles.core_mentor_id → core_takim.mentor_id → core_katilimci.takim_id
CREATE OR REPLACE FUNCTION public.is_mentor_of_katilimci(target_katilimci_id bigint)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.core_katilimci k
    JOIN public.core_takim t ON t.id = k.takim_id
    WHERE k.id = target_katilimci_id
      AND t.mentor_id = public.current_mentor_id()
      AND public.current_mentor_id() IS NOT NULL
  );
$$;

-- 1-F. is_mentor_of_teslim(target_teslim_id bigint)
-- Teslimin katılımcı veya takım ilişkisi üzerinden mentor yetkisini doğrular.
-- Zincir (katılımcı yolu): teslim.katilimci_id → core_katilimci.takim_id → core_takim.mentor_id
-- Zincir (takım yolu):     teslim.takim_id → core_takim.mentor_id
CREATE OR REPLACE FUNCTION public.is_mentor_of_teslim(target_teslim_id bigint)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.core_teslim ts
    LEFT JOIN public.core_katilimci k ON k.id = ts.katilimci_id
    LEFT JOIN public.core_takim t1 ON t1.id = k.takim_id
    LEFT JOIN public.core_takim t2 ON t2.id = ts.takim_id
    WHERE ts.id = target_teslim_id
      AND public.current_mentor_id() IS NOT NULL
      AND (
        t1.mentor_id = public.current_mentor_id()
        OR t2.mentor_id = public.current_mentor_id()
      )
  );
$$;


-- ═════════════════════════════════════════════════════════════════════════════
-- BÖLÜM 2: RİSKLİ POLİTİKALARI KALDIR
-- Mevcut gevşek policy'ler idempotent biçimde DROP edilir.
-- ═════════════════════════════════════════════════════════════════════════════

-- profiles
DROP POLICY IF EXISTS "Kullanici Kendi Profilini Gunceller" ON public.profiles;
DROP POLICY IF EXISTS "Admin veya Service Role Profile Ekler" ON public.profiles;

-- core_aday
DROP POLICY IF EXISTS "Aday Başvurusu Yapma"   ON public.core_aday;
DROP POLICY IF EXISTS "Aday Yönetimi Admin"     ON public.core_aday;
DROP POLICY IF EXISTS "Service Role Tam Yetki Aday" ON public.core_aday;

-- core_katilimci
DROP POLICY IF EXISTS "Katılımcı Kendi Profilini Görür" ON public.core_katilimci;
DROP POLICY IF EXISTS "Service Role Tam Yetki Katilimci" ON public.core_katilimci;

-- core_mentor
DROP POLICY IF EXISTS "Mentor Kendi Profilini Görür" ON public.core_mentor;
DROP POLICY IF EXISTS "Service Role Tam Yetki Mentor" ON public.core_mentor;

-- core_takim
DROP POLICY IF EXISTS "Public ve Anon Okuma"  ON public.core_takim;
DROP POLICY IF EXISTS "Service Role Tam Yetki Takim" ON public.core_takim;

-- core_gorev
DROP POLICY IF EXISTS "Public ve Anon Okuma"  ON public.core_gorev;
DROP POLICY IF EXISTS "Service Role Tam Yetki Gorev" ON public.core_gorev;

-- core_teslim
DROP POLICY IF EXISTS "Katılımcı Kendi Teslimini Görebilir" ON public.core_teslim;
DROP POLICY IF EXISTS "Katılımcı Teslim Gönderebilir"       ON public.core_teslim;
DROP POLICY IF EXISTS "Service Role Tam Yetki Teslim"       ON public.core_teslim;

-- core_icerikdnatesti
DROP POLICY IF EXISTS "Katılımcı Kendi DNA Raporunu Görebilir" ON public.core_icerikdnatesti;
DROP POLICY IF EXISTS "Service Role Tam Yetki DNA"             ON public.core_icerikdnatesti;

-- core_performanskriteri
DROP POLICY IF EXISTS "Public ve Anon Okuma" ON public.core_performanskriteri;

-- Önceki çalıştırmadan kalabilecek SEC-02 politikaları (tam idempotent için)
DROP POLICY IF EXISTS "SEC02 Profil Kendi Gunceller"                    ON public.profiles;
DROP POLICY IF EXISTS "SEC02 Profil Admin Ekler"                        ON public.profiles;
DROP POLICY IF EXISTS "SEC02 Profil Admin Siler"                        ON public.profiles;
DROP POLICY IF EXISTS "SEC02 Aday Anon Insert"                          ON public.core_aday;
DROP POLICY IF EXISTS "SEC02 Aday Admin Select"                         ON public.core_aday;
DROP POLICY IF EXISTS "SEC02 Aday Admin Update"                         ON public.core_aday;
DROP POLICY IF EXISTS "SEC02 Aday Admin Delete"                         ON public.core_aday;
DROP POLICY IF EXISTS "SEC02 Aday Service Role"                         ON public.core_aday;
DROP POLICY IF EXISTS "SEC02 Katilimci Select"                          ON public.core_katilimci;
DROP POLICY IF EXISTS "SEC02 Katilimci Admin Yonet"                     ON public.core_katilimci;
DROP POLICY IF EXISTS "SEC02 Katilimci Service Role"                    ON public.core_katilimci;
DROP POLICY IF EXISTS "SEC02 Mentor Select"                             ON public.core_mentor;
DROP POLICY IF EXISTS "SEC02 Mentor Admin Yonet"                        ON public.core_mentor;
DROP POLICY IF EXISTS "SEC02 Mentor Service Role"                       ON public.core_mentor;
DROP POLICY IF EXISTS "SEC02 Takim Select"                              ON public.core_takim;
DROP POLICY IF EXISTS "SEC02 Takim Admin Yonet"                         ON public.core_takim;
DROP POLICY IF EXISTS "SEC02 Takim Service Role"                        ON public.core_takim;
DROP POLICY IF EXISTS "SEC02 Gorev Authenticated Select"                ON public.core_gorev;
DROP POLICY IF EXISTS "SEC02 Gorev Admin Yonet"                         ON public.core_gorev;
DROP POLICY IF EXISTS "SEC02 Gorev Service Role"                        ON public.core_gorev;
DROP POLICY IF EXISTS "SEC02 Teslim Select"                             ON public.core_teslim;
DROP POLICY IF EXISTS "SEC02 Teslim Katilimci Insert"                   ON public.core_teslim;
DROP POLICY IF EXISTS "SEC02 Teslim Admin Update"                       ON public.core_teslim;
DROP POLICY IF EXISTS "SEC02 Teslim Mentor Update"                      ON public.core_teslim;
DROP POLICY IF EXISTS "SEC02 Teslim Admin Delete"                       ON public.core_teslim;
DROP POLICY IF EXISTS "SEC02 Teslim Service Role"                       ON public.core_teslim;
DROP POLICY IF EXISTS "SEC02 TeslimHareketi Select"                     ON public.core_teslimhareketi;
DROP POLICY IF EXISTS "SEC02 TeslimHareketi Admin Yonet"                ON public.core_teslimhareketi;
DROP POLICY IF EXISTS "SEC02 TeslimHareketi Service Role"               ON public.core_teslimhareketi;
DROP POLICY IF EXISTS "SEC02 DNA Select"                                ON public.core_icerikdnatesti;
DROP POLICY IF EXISTS "SEC02 DNA Katilimci Insert"                      ON public.core_icerikdnatesti;
DROP POLICY IF EXISTS "SEC02 DNA Admin Update"                          ON public.core_icerikdnatesti;
DROP POLICY IF EXISTS "SEC02 DNA Admin Delete"                          ON public.core_icerikdnatesti;
DROP POLICY IF EXISTS "SEC02 DNA Service Role"                          ON public.core_icerikdnatesti;
DROP POLICY IF EXISTS "SEC02 KatilimciPerformans Select"                ON public.core_katilimciperformans;
DROP POLICY IF EXISTS "SEC02 KatilimciPerformans Admin Yonet"           ON public.core_katilimciperformans;
DROP POLICY IF EXISTS "SEC02 KatilimciPerformans Service Role"          ON public.core_katilimciperformans;
DROP POLICY IF EXISTS "SEC02 PerformansNotu Select"                     ON public.core_katilimciperformansnotu;
DROP POLICY IF EXISTS "SEC02 PerformansNotu Admin Yonet"                ON public.core_katilimciperformansnotu;
DROP POLICY IF EXISTS "SEC02 PerformansNotu Service Role"               ON public.core_katilimciperformansnotu;
DROP POLICY IF EXISTS "SEC02 ToplantiKatilimi Select"                   ON public.core_toplantikatilimi;
DROP POLICY IF EXISTS "SEC02 ToplantiKatilimi Admin Yonet"              ON public.core_toplantikatilimi;
DROP POLICY IF EXISTS "SEC02 ToplantiKatilimi Service Role"             ON public.core_toplantikatilimi;
DROP POLICY IF EXISTS "SEC02 SosyalMedya Select"                        ON public.core_sosyalmedyaperformansi;
DROP POLICY IF EXISTS "SEC02 SosyalMedya Admin Yonet"                  ON public.core_sosyalmedyaperformansi;
DROP POLICY IF EXISTS "SEC02 SosyalMedya Service Role"                  ON public.core_sosyalmedyaperformansi;
DROP POLICY IF EXISTS "SEC02 PerformansKriteri Authenticated Select"    ON public.core_performanskriteri;
DROP POLICY IF EXISTS "SEC02 PerformansKriteri Admin Yonet"             ON public.core_performanskriteri;
DROP POLICY IF EXISTS "SEC02 PerformansKriteri Service Role"            ON public.core_performanskriteri;


-- ═════════════════════════════════════════════════════════════════════════════
-- BÖLÜM 3: RLS ETKİNLEŞTİRME (idempotent)
-- Tüm tablolarda RLS açık kalır.
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_aday                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_katilimci            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_mentor               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_takim                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_gorev                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_teslim               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_teslimhareketi       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_icerikdnatesti       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_katilimciperformans  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_katilimciperformansnotu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_toplantikatilimi     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_sosyalmedyaperformansi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_performanskriteri    ENABLE ROW LEVEL SECURITY;


-- ═════════════════════════════════════════════════════════════════════════════
-- BÖLÜM 4: GÜVENLİ POLİTİKALAR
-- ═════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- A. public.profiles
-- ─────────────────────────────────────────────────────────────────────────────
-- SELECT politikaları mevcut ve doğru: "Kullanici Kendi Profilini Okur" + "Admin Tum Profilleri Okur"

-- UPDATE: Sadece admin (kullanıcı kendi profilini güncelleyemez — SEC-02 talebi)
CREATE POLICY "SEC02 Profil Kendi Gunceller"
ON public.profiles FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- INSERT: Sadece trigger/service role (client insert kapalı)
CREATE POLICY "SEC02 Profil Admin Ekler"
ON public.profiles FOR INSERT
WITH CHECK (public.is_admin() OR auth.role() = 'service_role');

-- DELETE: Sadece admin
CREATE POLICY "SEC02 Profil Admin Siler"
ON public.profiles FOR DELETE
USING (public.is_admin());


-- ─────────────────────────────────────────────────────────────────────────────
-- B. public.core_aday
-- ─────────────────────────────────────────────────────────────────────────────

-- INSERT: Anon/herkes başvuru yapabilir (başvuru formu için)
CREATE POLICY "SEC02 Aday Anon Insert"
ON public.core_aday FOR INSERT
WITH CHECK (true);

-- SELECT: Sadece admin
CREATE POLICY "SEC02 Aday Admin Select"
ON public.core_aday FOR SELECT
USING (public.is_admin());

-- UPDATE: Sadece admin
CREATE POLICY "SEC02 Aday Admin Update"
ON public.core_aday FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- DELETE: Sadece admin
CREATE POLICY "SEC02 Aday Admin Delete"
ON public.core_aday FOR DELETE
USING (public.is_admin());

-- Service role (Edge Function / backend otomasyonu)
CREATE POLICY "SEC02 Aday Service Role"
ON public.core_aday FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- ─────────────────────────────────────────────────────────────────────────────
-- C. public.core_katilimci
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Admin + kendi kaydı + mentor takımındaki katılımcılar
CREATE POLICY "SEC02 Katilimci Select"
ON public.core_katilimci FOR SELECT
USING (
  public.is_admin()
  OR id = public.current_katilimci_id()
  OR public.is_mentor_of_katilimci(id)
);

-- INSERT / UPDATE / DELETE: Sadece admin
CREATE POLICY "SEC02 Katilimci Admin Yonet"
ON public.core_katilimci FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Service role
CREATE POLICY "SEC02 Katilimci Service Role"
ON public.core_katilimci FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- ─────────────────────────────────────────────────────────────────────────────
-- D. public.core_mentor
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Admin + kendi mentor kaydı
CREATE POLICY "SEC02 Mentor Select"
ON public.core_mentor FOR SELECT
USING (
  public.is_admin()
  OR id = public.current_mentor_id()
);

-- INSERT / UPDATE / DELETE: Sadece admin
CREATE POLICY "SEC02 Mentor Admin Yonet"
ON public.core_mentor FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Service role
CREATE POLICY "SEC02 Mentor Service Role"
ON public.core_mentor FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- ─────────────────────────────────────────────────────────────────────────────
-- E. public.core_takim
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Admin + katılımcı kendi takımı + mentor kendi takımları
CREATE POLICY "SEC02 Takim Select"
ON public.core_takim FOR SELECT
USING (
  public.is_admin()
  OR id = (
    SELECT takim_id FROM public.core_katilimci
    WHERE id = public.current_katilimci_id()
    LIMIT 1
  )
  OR mentor_id = public.current_mentor_id()
);

-- INSERT / UPDATE / DELETE: Sadece admin
CREATE POLICY "SEC02 Takim Admin Yonet"
ON public.core_takim FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Service role
CREATE POLICY "SEC02 Takim Service Role"
ON public.core_takim FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- ─────────────────────────────────────────────────────────────────────────────
-- F. public.core_gorev
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Sadece authenticated kullanıcılar (anon kapalı)
CREATE POLICY "SEC02 Gorev Authenticated Select"
ON public.core_gorev FOR SELECT
USING (auth.role() = 'authenticated');

-- INSERT / UPDATE / DELETE: Sadece admin
CREATE POLICY "SEC02 Gorev Admin Yonet"
ON public.core_gorev FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Service role
CREATE POLICY "SEC02 Gorev Service Role"
ON public.core_gorev FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- ─────────────────────────────────────────────────────────────────────────────
-- G. public.core_teslim
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Admin + kendi teslimi + mentor kendi takım teslimi
CREATE POLICY "SEC02 Teslim Select"
ON public.core_teslim FOR SELECT
USING (
  public.is_admin()
  OR katilimci_id = public.current_katilimci_id()
  OR public.is_mentor_of_teslim(id)
);

-- INSERT: Katılımcı sadece kendi adına teslim oluşturabilir
CREATE POLICY "SEC02 Teslim Katilimci Insert"
ON public.core_teslim FOR INSERT
WITH CHECK (
  public.is_admin()
  OR katilimci_id = public.current_katilimci_id()
  OR auth.role() = 'service_role'
);

-- UPDATE: Admin
-- NOT: Katılımcı kendi teslimini güncelleyemez — revizyon Edge Function üzerinden
CREATE POLICY "SEC02 Teslim Admin Update"
ON public.core_teslim FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- UPDATE: Mentor kendi takım teslimlerinde revizyon/değerlendirme yapabilir
CREATE POLICY "SEC02 Teslim Mentor Update"
ON public.core_teslim FOR UPDATE
USING (public.is_mentor_of_teslim(id))
WITH CHECK (public.is_mentor_of_teslim(id));

-- DELETE: Sadece admin
CREATE POLICY "SEC02 Teslim Admin Delete"
ON public.core_teslim FOR DELETE
USING (public.is_admin());

-- Service role
CREATE POLICY "SEC02 Teslim Service Role"
ON public.core_teslim FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- ─────────────────────────────────────────────────────────────────────────────
-- H. public.core_teslimhareketi
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Admin + katılımcı kendi teslim hareketleri + mentor kendi takım
CREATE POLICY "SEC02 TeslimHareketi Select"
ON public.core_teslimhareketi FOR SELECT
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.core_teslim t
    WHERE t.id = teslim_id
      AND t.katilimci_id = public.current_katilimci_id()
  )
  OR public.is_mentor_of_teslim(teslim_id)
);

-- INSERT / UPDATE / DELETE: Sadece admin / service role
-- (Client insert gereksinimi varsa DATA fazında Edge Function ile ele alınacak)
CREATE POLICY "SEC02 TeslimHareketi Admin Yonet"
ON public.core_teslimhareketi FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Service role
CREATE POLICY "SEC02 TeslimHareketi Service Role"
ON public.core_teslimhareketi FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- ─────────────────────────────────────────────────────────────────────────────
-- I. public.core_icerikdnatesti
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Admin + kendi DNA kaydı (mentor erişimi şimdilik kapalı)
CREATE POLICY "SEC02 DNA Select"
ON public.core_icerikdnatesti FOR SELECT
USING (
  public.is_admin()
  OR katilimci_id = public.current_katilimci_id()
);

-- INSERT: Katılımcı sadece kendi adına DNA testi başlatabilir
CREATE POLICY "SEC02 DNA Katilimci Insert"
ON public.core_icerikdnatesti FOR INSERT
WITH CHECK (
  public.is_admin()
  OR katilimci_id = public.current_katilimci_id()
  OR auth.role() = 'service_role'
);

-- UPDATE: SADECE admin veya service role
-- UYARI: rapor_json, rapor_metni, ai_model, prompt_versiyonu gibi sonuç alanları
-- client tarafından güncellenememeli. Client UPDATE tamamen kapalı.
-- DNA submit/regenerate → Edge Function veya service role.
CREATE POLICY "SEC02 DNA Admin Update"
ON public.core_icerikdnatesti FOR UPDATE
USING (public.is_admin() OR auth.role() = 'service_role')
WITH CHECK (public.is_admin() OR auth.role() = 'service_role');

-- DELETE: Sadece admin
CREATE POLICY "SEC02 DNA Admin Delete"
ON public.core_icerikdnatesti FOR DELETE
USING (public.is_admin());

-- Service role (tam yetki)
CREATE POLICY "SEC02 DNA Service Role"
ON public.core_icerikdnatesti FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- ─────────────────────────────────────────────────────────────────────────────
-- J. public.core_katilimciperformans
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Admin + kendi performansı + mentor kendi takım katılımcıları
CREATE POLICY "SEC02 KatilimciPerformans Select"
ON public.core_katilimciperformans FOR SELECT
USING (
  public.is_admin()
  OR katilimci_id = public.current_katilimci_id()
  OR public.is_mentor_of_katilimci(katilimci_id)
);

-- INSERT / UPDATE / DELETE: Sadece admin
-- KATILIMCı VE MENTOR UPDATE EDEMEMELİ
CREATE POLICY "SEC02 KatilimciPerformans Admin Yonet"
ON public.core_katilimciperformans FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Service role
CREATE POLICY "SEC02 KatilimciPerformans Service Role"
ON public.core_katilimciperformans FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- ─────────────────────────────────────────────────────────────────────────────
-- K. public.core_katilimciperformansnotu
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Admin + kendi notları + mentor kendi takım
CREATE POLICY "SEC02 PerformansNotu Select"
ON public.core_katilimciperformansnotu FOR SELECT
USING (
  public.is_admin()
  OR katilimci_id = public.current_katilimci_id()
  OR public.is_mentor_of_katilimci(katilimci_id)
);

-- INSERT / UPDATE / DELETE: Sadece admin
CREATE POLICY "SEC02 PerformansNotu Admin Yonet"
ON public.core_katilimciperformansnotu FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Service role
CREATE POLICY "SEC02 PerformansNotu Service Role"
ON public.core_katilimciperformansnotu FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- ─────────────────────────────────────────────────────────────────────────────
-- L. public.core_toplantikatilimi
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Admin + kendi kayıtları + mentor kendi takım
CREATE POLICY "SEC02 ToplantiKatilimi Select"
ON public.core_toplantikatilimi FOR SELECT
USING (
  public.is_admin()
  OR katilimci_id = public.current_katilimci_id()
  OR public.is_mentor_of_katilimci(katilimci_id)
);

-- INSERT / UPDATE / DELETE: Sadece admin
CREATE POLICY "SEC02 ToplantiKatilimi Admin Yonet"
ON public.core_toplantikatilimi FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Service role
CREATE POLICY "SEC02 ToplantiKatilimi Service Role"
ON public.core_toplantikatilimi FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- ─────────────────────────────────────────────────────────────────────────────
-- M. public.core_sosyalmedyaperformansi
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Admin + kendi kayıtları + mentor kendi takım
CREATE POLICY "SEC02 SosyalMedya Select"
ON public.core_sosyalmedyaperformansi FOR SELECT
USING (
  public.is_admin()
  OR katilimci_id = public.current_katilimci_id()
  OR public.is_mentor_of_katilimci(katilimci_id)
);

-- INSERT / UPDATE / DELETE: Sadece admin
CREATE POLICY "SEC02 SosyalMedya Admin Yonet"
ON public.core_sosyalmedyaperformansi FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Service role
CREATE POLICY "SEC02 SosyalMedya Service Role"
ON public.core_sosyalmedyaperformansi FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- ─────────────────────────────────────────────────────────────────────────────
-- N. public.core_performanskriteri
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Authenticated kullanıcılar (anon kapalı)
CREATE POLICY "SEC02 PerformansKriteri Authenticated Select"
ON public.core_performanskriteri FOR SELECT
USING (auth.role() = 'authenticated');

-- INSERT / UPDATE / DELETE: Sadece admin
CREATE POLICY "SEC02 PerformansKriteri Admin Yonet"
ON public.core_performanskriteri FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Service role
CREATE POLICY "SEC02 PerformansKriteri Service Role"
ON public.core_performanskriteri FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- ═════════════════════════════════════════════════════════════════════════════
-- BÖLÜM 5: DOĞRULAMA SORGULARI (READ-ONLY)
-- Bu sorgular migration sonrası SQL Editor'da çalıştırılabilir.
-- ═════════════════════════════════════════════════════════════════════════════

/*
-- Tüm aktif policy listesi:
SELECT
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- USING(true) kalan riskli policy kontrolü:
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND qual = 'true';

-- Helper function listesi:
SELECT proname, prosecdef, proconfig
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN (
    'is_admin',
    'current_profile_role',
    'current_katilimci_id',
    'current_mentor_id',
    'is_mentor_of_katilimci',
    'is_mentor_of_teslim'
  );
*/

-- ─────────────────────────────────────────────────────────────────────────────
-- Migration tamamlandı.
-- Tarih  : 2026-08-10
-- Görev  : SEC-02 RLS Policy Güvenli Hale Getirme
-- Notlar :
--   - core_icerikdnatesti client UPDATE kapalı → Edge Function gerekli
--   - core_teslimhareketi client INSERT kapalı → DATA fazında Edge Function
--   - core_teslim katılımcı UPDATE kapalı → revizyon Edge Function ile
--   - profiles UPDATE sadece admin (kullanıcı kendi profilini güncelleyemez)
-- ─────────────────────────────────────────────────────────────────────────────
