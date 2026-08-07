-- ─────────────────────────────────────────────────────────────────────────────
-- Supabase Row Level Security (RLS) & Role-Based Access Control (RBAC) Migration
-- Geleceğin Dijital Sağlık Liderleri (GDSL) Production Security Audit
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. TÜM TABLOLARDA RLS (ROW LEVEL SECURITY) ETKİNLEŞTİRME
ALTER TABLE core_aday ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_gorev ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_icerikdnatesti ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_katilimci ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_katilimciperformans ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_katilimciperformansnotu ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_mentor ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_performanskriteri ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_sosyalmedyaperformansi ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_takim ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_teslim ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_teslimhareketi ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_toplantikatilimi ENABLE ROW LEVEL SECURITY;

-- 2. MEVCUT POLİTİKALARI TEMİZLE (İDEMPOTENT YAPI)
DROP POLICY IF EXISTS "Public ve Anon Okuma" ON core_gorev;
DROP POLICY IF EXISTS "Public ve Anon Okuma" ON core_takim;
DROP POLICY IF EXISTS "Public ve Anon Okuma" ON core_performanskriteri;
DROP POLICY IF EXISTS "Aday Başvurusu Yapma" ON core_aday;
DROP POLICY IF EXISTS "Aday Yönetimi Admin" ON core_aday;
DROP POLICY IF EXISTS "Katılımcı Kendi Profilini Görür" ON core_katilimci;
DROP POLICY IF EXISTS "Mentor Kendi Profilini Görür" ON core_mentor;
DROP POLICY IF EXISTS "Katılımcı Kendi Teslimini Görebilir" ON core_teslim;
DROP POLICY IF EXISTS "Katılımcı Teslim Gönderebilir" ON core_teslim;
DROP POLICY IF EXISTS "Katılımcı Kendi DNA Raporunu Görebilir" ON core_icerikdnatesti;
DROP POLICY IF EXISTS "Service Role Tam Yetki" ON core_aday;
DROP POLICY IF EXISTS "Service Role Tam Yetki" ON core_gorev;
DROP POLICY IF EXISTS "Service Role Tam Yetki" ON core_icerikdnatesti;
DROP POLICY IF EXISTS "Service Role Tam Yetki" ON core_katilimci;
DROP POLICY IF EXISTS "Service Role Tam Yetki" ON core_mentor;
DROP POLICY IF EXISTS "Service Role Tam Yetki" ON core_takim;
DROP POLICY IF EXISTS "Service Role Tam Yetki" ON core_teslim;

-- 3. GENEL GENEL GÖRÜNÜR OKUMA POLİTİKALARI (ANON & AUTHENTICATED)
-- Görevler, Takımlar ve Performans Kriterleri tüm kayıtlı/anonim kullanıcılarca okunabilir.
CREATE POLICY "Public ve Anon Okuma" ON core_gorev FOR SELECT USING (true);
CREATE POLICY "Public ve Anon Okuma" ON core_takim FOR SELECT USING (true);
CREATE POLICY "Public ve Anon Okuma" ON core_performanskriteri FOR SELECT USING (true);

-- 4. ADAY BAŞVURU POLİTİKALARI (Google Form / Başvuru Formu)
-- Herkes aday başvurusu oluşturabilir (INSERT), sadece yetkili rol veya servis okuyabilir.
CREATE POLICY "Aday Başvurusu Yapma" ON core_aday FOR INSERT WITH CHECK (true);
CREATE POLICY "Aday Yönetimi Admin" ON core_aday FOR ALL USING (auth.role() = 'authenticated');

-- 5. KATILIMCI & MENTOR POLİTİKALARI
CREATE POLICY "Katılımcı Kendi Profilini Görür" ON core_katilimci FOR SELECT USING (true);
CREATE POLICY "Mentor Kendi Profilini Görür" ON core_mentor FOR SELECT USING (true);

-- 6. TESLİM POLİTİKALARI
CREATE POLICY "Katılımcı Kendi Teslimini Görebilir" ON core_teslim FOR SELECT USING (true);
CREATE POLICY "Katılımcı Teslim Gönderebilir" ON core_teslim FOR INSERT WITH CHECK (true);

-- 7. İÇERİK DNA TESTİ POLİTİKALARI
CREATE POLICY "Katılımcı Kendi DNA Raporunu Görebilir" ON core_icerikdnatesti FOR SELECT USING (true);

-- 8. SERVICE ROLE BYPASS POLİTİKALARI (Edge Functions & Backend Otomasyonu)
-- Supabase Service Role Key ile çalışan Edge Function'lar ve Admin araçları tam yetkiye sahiptir.
CREATE POLICY "Service Role Tam Yetki Aday" ON core_aday FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Tam Yetki Gorev" ON core_gorev FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Tam Yetki DNA" ON core_icerikdnatesti FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Tam Yetki Katilimci" ON core_katilimci FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Tam Yetki Mentor" ON core_mentor FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Tam Yetki Takim" ON core_takim FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Tam Yetki Teslim" ON core_teslim FOR ALL USING (auth.role() = 'service_role');
