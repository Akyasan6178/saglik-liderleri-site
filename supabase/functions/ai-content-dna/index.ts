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
    if (!authHeader) return jsonRes({ ok: false, error: 'Yetkilendirme basligiD eksik.' }, 401)

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) return jsonRes({ ok: false, error: 'Oturum dogrulanamadI.' }, 401)

    const { data: profile, error: profileError } = await userClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || !profile) return jsonRes({ ok: false, error: 'Profil bulunamadI.' }, 403)
    if (profile.role !== 'katilimci' && profile.role !== 'admin') {
      return jsonRes({ ok: false, error: 'Bu islem icin katilimci yetkisi gereklidir.' }, 403)
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

    if (!katilimciId) return jsonRes({ ok: false, error: 'Katilimci kaydI eslestirilemedi.' }, 400)

    const geminiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('OPENAI_API_KEY')
    let raporMetni = ""
    let aiModel = "Gemini 2.5 Flash"
    let promptVersiyonu = "v1.0"

    if (geminiKey) {
      try {
        const prompt = `Dijital Saglik Liderleri programi icin Icerik DNA Analistisisiniz. Asagidaki form yanitlarina dayanarak katilimci icin detayli, ilham verici ve yapilandirilmis bir Icerik DNA Analiz Raporu hazirlayin. Raporu su markdown basliklariyla olusturun:
## 1. Genel Strateji & Marka Kimligi
## 2. Skor Kriterleri ve Performans Gostergeleri
## 3. Onerilen Icerik Serileri ve Format Recetesi
## 4. Riskler ve Gelisim Haritasi
## 5. Yol Haritasi ve Aksiyon Adimlari

Katilimci Yanitlari:
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
        }
      } catch (err) {
        console.error('Gemini API call error:', err)
      }
    }

    if (!raporMetni) {
      raporMetni = `## 1. Genel Strateji & Marka Kimligi
**Saglik ve Dijital Icerik Odagi**: Yanitlariniz dogrultusunda bilimsel, guvenilir ve sürdürülebilir bir dijital saglik liderligi kimligi hedeflenmektedir.
**Arketip & Ton**: Bilgi verici, pratik ve samimi anlatim dili.

## 2. Skor Kriterleri ve Performans Gostergeleri
- **Icerik Uretim Seviyesi**: ${cevaplar?.soru_15 || 'Orta Seviye'}
- **Haftalik Kapasite**: ${cevaplar?.soru_14 || '2-3 Icerik'} / Hafta
- **Kamera Rahatligi**: ${cevaplar?.soru_9 || '4'}/5
- **Iletisim Odak Noktasi**: ${cevaplar?.soru_11 || 'Fayda & Bilgi'}

## 3. Onerilen Icerik Serileri ve Format Recetesi
### 1. Icerik Serisi: 1 Dakikada Dogru Bilinen Yanlislar
- **Format**: Reels / Shorts / TikTok Video
- **Odak**: Saglik mitleri ve etken madde bazli pratik uyarilar.

### 2. Icerik Serisi: Banko Arkasi Sik Sorulanlar
- **Format**: Soru-Cevap & Carousel Gorsel
- **Odak**: Eczane / klinik pratiginde en sik karsilasilan hasta sorulari.

### 3. Icerik Serisi: Gunluk Saglik Ipuclari
- **Format**: Samimi Anlatim Video
- **Odak**: Yasam tarzi ve koruyucu saglik onerileri.

## 4. Riskler ve Gelisim Haritasi
- **Operasyonel Riskler**: TITCK ve mevzuat kurallarina uyum, etken madde tavsiyelerinde sorumluluk reddi ekleme.
- **Gelisim Adimlari**: Ilk cümlede guclü kanca (hook) kullanimi ve düzenli icerik takvimi.

## 5. Yol Haritasi ve Aksiyon Adimlari
- **Asama 1**: Marka vizyon kelimelerinin kapak gorsellerine yansitilmasi.
- **Asama 2**: Ilk 3 video serisinin cekimi ve kurgusu.
- **Asama 3**: Etkilesim analizi ve mentor degerlendirmesi.`
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
      return jsonRes({ ok: false, error: 'DNA testi sonuclari veritabanina kaydedilemedi.' }, 500)
    }

    return jsonRes({ ok: true, data: dbData })
  } catch (err: any) {
    console.error('ai-content-dna error:', err)
    return jsonRes({ ok: false, error: 'Sunucu hatasi olustu.' }, 500)
  }
})
