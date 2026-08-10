import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function jsonRes(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return jsonRes({ ok: false, error: 'Yetkilendirme başlığı eksik.' }, 401)

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) return jsonRes({ ok: false, error: 'Oturum doğrulanamadı.' }, 401)

    const { data: profile, error: profileError } = await userClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || !profile) return jsonRes({ ok: false, error: 'Profil bulunamadı.' }, 403)
    if (profile.role !== 'katilimci' && profile.role !== 'admin') {
      return jsonRes({ ok: false, error: 'Bu işlem için katılımcı yetkisi gereklidir.' }, 403)
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { cevaplar, katilimci_id: targetKatilimciId } = await req.json()

    let katilimciId = profile.core_katilimci_id
    if (profile.role === 'admin' && targetKatilimciId) {
      katilimciId = targetKatilimciId
    }

    if (!katilimciId) {
      const { data: kData } = await adminClient
        .from('core_katilimci')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()
      if (kData) katilimciId = kData.id
    }

    if (!katilimciId) return jsonRes({ ok: false, error: 'Katılımcı kaydı eşleştirilemedi.' }, 400)

    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    let raporMetni = ""
    let aiModel = geminiKey ? "Gemini 2.5 Flash" : "Standart Analiz Şablonu"
    let promptVersiyonu = "v1.0"

    if (geminiKey) {
      try {
        const prompt = `Dijital Sağlık Liderleri programı için İçerik DNA Analistisisiniz. Aşağıdaki form yanıtlarına dayanarak katılımcı için detaylı, ilham verici ve yapılandırılmış bir İçerik DNA Analiz Raporu hazırlayın. Raporu şu markdown başlıklarıyla oluşturun:
## 1. Genel Strateji & Marka Kimliği
## 2. Skor Kriterleri ve Performans Göstergeleri
## 3. Önerilen İçerik Serileri ve Format Reçetesi
## 4. Riskler ve Gelişim Haritası
## 5. Yol Haritası ve Aksiyon Adımları

Katılımcı Yanıtları:
${JSON.stringify(cevaplar, null, 2)}`

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        })

        if (geminiRes.ok) {
          const gData = await geminiRes.json()
          raporMetni = gData.candidates?.[0]?.content?.parts?.[0]?.text || ""
        } else {
          console.error('Gemini API call failed with status:', geminiRes.status)
        }
      } catch (err) {
        console.error('Gemini API call exception:', err)
      }
    }

    if (!raporMetni) {
      raporMetni = `## 1. Genel Strateji & Marka Kimliği
**Sağlık ve Dijital İçerik Odağı**: Yanıtlarınız doğrultusunda bilimsel, güvenilir ve sürdürülebilir bir dijital sağlık liderliği kimliği hedeflenmektedir.
**Arketip & Ton**: Bilgi verici, pratik ve samimi anlatım dili.

## 2. Skor Kriterleri ve Performans Göstergeleri
- **İçerik Üretim Seviyesi**: ${cevaplar?.soru_15 || 'Orta Seviye'}
- **Haftalık Kapasite**: ${cevaplar?.soru_14 || '2-3 İçerik'} / Hafta
- **Kamera Rahatlığı**: ${cevaplar?.soru_9 || '4'}/5
- **İletişim Odak Noktası**: ${cevaplar?.soru_11 || 'Fayda & Bilgi'}

## 3. Önerilen İçerik Serileri ve Format Reçetesi
### 1. İçerik Serisi: 1 Dakikada Doğru Bilinen Yanlışlar
- **Format**: Reels / Shorts / TikTok Video
- **Odak**: Sağlık mitleri ve etken madde bazlı pratik uyarılar.

### 2. İçerik Serisi: Banko Arkası Sık Sorulanlar
- **Format**: Soru-Cevap & Carousel Görsel
- **Odak**: Eczane / klinik pratiğinde en sık karşılaşılan hasta soruları.

### 3. İçerik Serisi: Günlük Sağlık İpuçları
- **Format**: Samimi Anlatım Video
- **Odak**: Yaşam tarzı ve koruyucu sağlık önerileri.

## 4. Riskler ve Gelişim Haritası
- **Operasyonel Riskler**: TİTCK ve mevzuat kurallarına uyum, etken madde tavsiyelerinde sorumluluk reddi ekleme.
- **Gelişim Adımları**: İlk cümlede güçlü kanca (hook) kullanımı ve düzenli içerik takvimi.

## 5. Yol Haritası ve Aksiyon Adımları
- **Aşama 1**: Marka vizyon kelimelerinin kapak görsellerine yansıtılması.
- **Aşama 2**: İlk 3 video serisinin çekimi ve kurgusu.
- **Aşama 3**: Etkileşim analizi ve mentor değerlendirmesi.`
    }

    const now = new Date().toISOString()
    const { data: existing } = await adminClient
      .from('core_icerikdnatesti')
      .select('id')
      .eq('katilimci_id', katilimciId)
      .maybeSingle()

    let dbData = null
    let dbErr = null

    if (existing) {
      const res = await adminClient
        .from('core_icerikdnatesti')
        .update({
          cevaplar,
          rapor_metni: raporMetni,
          durum: 'TAMAMLANDI',
          ai_model: aiModel,
          prompt_versiyonu: promptVersiyonu,
          gonderim_tarihi: now,
          guncellenme_tarihi: now,
          hata_mesaji: null
        })
        .eq('id', existing.id)
        .select()
        .single()
      dbData = res.data
      dbErr = res.error
    } else {
      const res = await adminClient
        .from('core_icerikdnatesti')
        .insert({
          katilimci_id: katilimciId,
          cevaplar,
          rapor_metni: raporMetni,
          durum: 'TAMAMLANDI',
          ai_model: aiModel,
          prompt_versiyonu: promptVersiyonu,
          gonderim_tarihi: now,
          olusturulma_tarihi: now,
          guncellenme_tarihi: now,
        })
        .select()
        .single()
      dbData = res.data
      dbErr = res.error
    }

    if (dbErr) {
      console.error('DB Write Error:', dbErr)
      return jsonRes({ ok: false, error: 'DNA testi sonuçları veritabanına kaydedilemedi.' }, 500)
    }

    return jsonRes({ ok: true, data: dbData })
  } catch (err: any) {
    console.error('ai-content-dna error:', err)
    return jsonRes({ ok: false, error: 'Sunucu hatası oluştu.' }, 500)
  }
})
