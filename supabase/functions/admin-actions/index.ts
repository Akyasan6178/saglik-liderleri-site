import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGINS = [
  'https://gelecegin-saglik-liderleri.omerkarapinar.workers.dev',
  'http://localhost:5173',
  'http://localhost:3000',
]

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || ''
  const isAllowed = ALLOWED_ORIGINS.includes(origin)
  const allowedOrigin = isAllowed ? origin : ALLOWED_ORIGINS[0]

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

function jsonRes(req: Request, data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
  })
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''))
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''))
  return result
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.get('origin') || ''
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response(JSON.stringify({ ok: false, error: 'CORS yetkisi reddedildi.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return new Response('ok', { headers: getCorsHeaders(req) })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return jsonRes(req, { ok: false, error: 'Yetkilendirme başlığı eksik.' }, 401)

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) return jsonRes(req, { ok: false, error: 'Oturum doğrulanamadı.' }, 401)

    const { data: profile, error: profileError } = await userClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || !profile) return jsonRes(req, { ok: false, error: 'Profil bulunamadı.' }, 403)
    if (profile.role !== 'admin') return jsonRes(req, { ok: false, error: 'Bu işlem için admin yetkisi gereklidir.' }, 403)

    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { action, payload } = await req.json()

    if (action === 'approve_candidate') {
      const { aday_id } = payload
      if (!aday_id) return jsonRes(req, { ok: false, error: 'aday_id zorunludur.' }, 400)

      const { data: aday, error: adayErr } = await adminClient
        .from('core_aday').select('*').eq('id', aday_id).maybeSingle()
      if (adayErr || !aday) return jsonRes(req, { ok: false, error: 'Aday bulunamadı.' }, 404)

      const { error: updateErr } = await adminClient
        .from('core_aday').update({ basvuru_durumu: 'ONAYLANDI' }).eq('id', aday_id)
      if (updateErr) return jsonRes(req, { ok: false, error: 'Aday durumu güncellenemedi.' }, 500)

      const { data: existing } = await adminClient
        .from('core_katilimci').select('id').eq('aday_id', aday_id).maybeSingle()

      let katilimci = existing
      if (!existing) {
        const { data: kData, error: kErr } = await adminClient
          .from('core_katilimci')
          .insert({
            aday_id: aday_id,
            kabul_durumu: true,
            kabul_tarihi: new Date().toISOString().split('T')[0],
            program_katilim_durumu: 'AKTIF',
          })
          .select().single()
        if (kErr) return jsonRes(req, { ok: false, error: 'Katılımcı kaydı oluşturulamadı.' }, 500)
        katilimci = kData

        await adminClient.from('core_katilimciperformans').insert({
          katilimci_id: kData.id,
          bireysel_puan: 0, gorev_puani: 0, toplanti_katilim_puani: 0,
          etkilesim_bonus_puani: 0, manuel_puan: 0,
        })
      }

      return jsonRes(req, { ok: true, data: { aday_id, katilimci, action: 'approve_candidate' } })
    }

    if (action === 'reject_candidate') {
      const { aday_id } = payload
      if (!aday_id) return jsonRes(req, { ok: false, error: 'aday_id zorunludur.' }, 400)

      const { error: updateErr } = await adminClient
        .from('core_aday').update({ basvuru_durumu: 'REDDEDILDI' }).eq('id', aday_id)
      if (updateErr) return jsonRes(req, { ok: false, error: 'Aday durumu güncellenemedi.' }, 500)

      return jsonRes(req, { ok: true, data: { aday_id, action: 'reject_candidate' } })
    }

    if (action === 'create_mentor') {
      const { ad_soyad, eposta, uzmanlik, gecici_sifre } = payload
      if (!ad_soyad || !eposta) return jsonRes(req, { ok: false, error: 'ad_soyad ve eposta zorunludur.' }, 400)

      const { data: existingMentor } = await adminClient
        .from('core_mentor')
        .select('*')
        .eq('eposta', eposta)
        .maybeSingle()

      if (existingMentor && existingMentor.aktif === false) {
        const { data: reactivatedMentor, error: reactErr } = await adminClient
          .from('core_mentor')
          .update({ aktif: true, silinme_tarihi: null, ad_soyad, uzmanlik: uzmanlik || existingMentor.uzmanlik })
          .eq('id', existingMentor.id)
          .select()
          .single()

        if (reactErr) return jsonRes(req, { ok: false, error: 'Pasif mentor tekrar aktifleştirilemedi.' }, 500)

        const { data: pRow } = await adminClient.from('profiles').select('id').eq('email', eposta).maybeSingle()
        if (pRow) {
          await adminClient.from('profiles').update({
            role: 'mentor', ad_soyad, core_mentor_id: existingMentor.id
          }).eq('id', pRow.id)
        }

        return jsonRes(req, { ok: true, data: { mentor: reactivatedMentor, action: 'create_mentor', reactivated: true } })
      }

      const password = gecici_sifre || Math.random().toString(36).slice(-10) + 'A1!'
      const { data: authUser, error: authErr } = await adminClient.auth.admin.createUser({
        email: eposta, password, email_confirm: true,
        user_metadata: { ad_soyad, uzmanlik },
      })

      if (authErr) {
        const msg = authErr.message || ''
        if (msg.includes('already registered') || msg.includes('already exists')) {
          return jsonRes(req, { ok: false, error: 'Bu e-posta adresi zaten kayıtlıdır.' }, 409)
        }
        return jsonRes(req, { ok: false, error: 'Auth kullanıcısı oluşturulamadı.' }, 500)
      }

      const newUserId = authUser.user?.id
      if (!newUserId) return jsonRes(req, { ok: false, error: 'Auth ID alınamadı.' }, 500)

      const { data: mentorData, error: mentorErr } = await adminClient
        .from('core_mentor')
        .insert({ ad_soyad, eposta, uzmanlik: uzmanlik || '', aktif: true })
        .select().single()
      if (mentorErr) return jsonRes(req, { ok: false, error: 'Mentor kaydı oluşturulamadı.' }, 500)

      await adminClient.from('profiles').upsert({
        id: newUserId, email: eposta, role: 'mentor', ad_soyad, core_mentor_id: mentorData.id,
      }, { onConflict: 'id' })

      return jsonRes(req, { ok: true, data: { mentor: mentorData, action: 'create_mentor' } })
    }

    if (action === 'delete_mentor') {
      const { mentor_id } = payload
      if (!mentor_id) return jsonRes(req, { ok: false, error: 'mentor_id zorunludur.' }, 400)

      const now = new Date().toISOString()

      const { error: softDelErr } = await adminClient
        .from('core_mentor')
        .update({ aktif: false, silinme_tarihi: now })
        .eq('id', mentor_id)

      if (softDelErr) {
        console.error('Soft delete mentor error:', softDelErr)
        return jsonRes(req, { ok: false, error: 'Mentor pasif hale getirilemedi.' }, 500)
      }

      await adminClient.from('core_takim').update({ mentor_id: null }).eq('mentor_id', mentor_id)

      return jsonRes(req, { ok: true, data: { mentor_id, action: 'delete_mentor', soft_deleted: true } })
    }

    if (action === 'import_candidates_csv') {
      const { csv_text, filename } = payload
      if (!csv_text || typeof csv_text !== 'string' || !csv_text.trim()) {
        return jsonRes(req, { ok: false, error: 'CSV metni boş olamaz.' }, 400)
      }

      const rawLines = csv_text.split(/\r?\n/).filter(line => line.trim().length > 0)
      if (rawLines.length < 2) {
        return jsonRes(req, { ok: false, error: 'CSV dosyası başlık ve en az 1 veri satırı içermelidir.' }, 400)
      }

      if (rawLines.length > 501) {
        return jsonRes(req, { ok: false, error: 'Bir defada en fazla 500 satır içe aktarılabilir.' }, 400)
      }

      const headers = parseCsvLine(rawLines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9_]/g, ''))

      function getColIndex(possibleNames: string[]): number {
        return headers.findIndex(h => possibleNames.includes(h))
      }

      const colAd = getColIndex(['ad', 'first_name', 'firstname', 'name', 'isim'])
      const colSoyad = getColIndex(['soyad', 'last_name', 'lastname', 'surname', 'soyisim'])
      const colEposta = getColIndex(['eposta', 'email', 'e_posta', 'mail'])
      const colTelefon = getColIndex(['telefon', 'phone', 'tel', 'mobile'])
      const colUniversite = getColIndex(['universite', 'university', 'okul'])
      const colSinif = getColIndex(['sinif', 'class', 'grade', 'yil'])
      const colKaynak = getColIndex(['kaynak', 'source'])
      const colAdSoyadCombined = headers.indexOf('ad_soyad')

      if (colEposta === -1 || (colAd === -1 && colSoyad === -1 && colAdSoyadCombined === -1)) {
        return jsonRes(req, { ok: false, error: 'CSV dosyasında en az eposta ve ad/soyad kolonları bulunmalıdır.' }, 400)
      }

      const { data: existingAdaylar } = await adminClient.from('core_aday').select('eposta')
      const existingEmails = new Set((existingAdaylar || []).map(a => (a.eposta || '').trim().toLowerCase()))

      const nowIso = new Date().toISOString()
      const rowsToInsert: any[] = []
      const errors: string[] = []
      let skippedCount = 0

      for (let i = 1; i < rawLines.length; i++) {
        const cols = parseCsvLine(rawLines[i])
        if (cols.length === 0 || (cols.length === 1 && !cols[0])) continue

        let email = colEposta !== -1 ? (cols[colEposta] || '').trim().toLowerCase() : ''
        let ad = colAd !== -1 ? (cols[colAd] || '').trim() : ''
        let soyad = colSoyad !== -1 ? (cols[colSoyad] || '').trim() : ''

        if (!ad && !soyad && colAdSoyadCombined !== -1) {
          const parts = (cols[colAdSoyadCombined] || '').trim().split(' ')
          ad = parts[0] || ''
          soyad = parts.slice(1).join(' ') || ''
        }

        const rowNum = i + 1
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email || !emailRegex.test(email)) {
          errors.push(`Satır ${rowNum}: Geçersiz veya boş e-posta adresi ("${email}")`)
          continue
        }

        if (!ad) {
          errors.push(`Satır ${rowNum}: Ad alanı boş`)
          continue
        }

        if (existingEmails.has(email)) {
          skippedCount++
          continue
        }

        const telefon = colTelefon !== -1 ? (cols[colTelefon] || '').trim() : null
        const universite = colUniversite !== -1 ? (cols[colUniversite] || '').trim() : null
        const sinif = colSinif !== -1 ? (cols[colSinif] || '').trim() : null
        const kaynakVal = colKaynak !== -1 && cols[colKaynak] ? cols[colKaynak].trim() : 'Admin CSV Import'

        existingEmails.add(email)
        rowsToInsert.push({
          ad,
          soyad: soyad || ad,
          eposta: email,
          telefon: telefon || null,
          universite: universite || null,
          sinif: sinif || null,
          kaynak: kaynakVal,
          basvuru_tarihi: nowIso,
          basvuru_durumu: 'BEKLIYOR',
          takvim_onay: false,
        })
      }

      let insertedCount = 0
      if (rowsToInsert.length > 0) {
        const { data: insertedData, error: insertErr } = await adminClient
          .from('core_aday')
          .insert(rowsToInsert)
          .select()

        if (insertErr) {
          console.error('CSV Bulk Insert Error:', insertErr)
          return jsonRes(req, { ok: false, error: 'Adaylar veritabanına eklenirken hata oluştu: ' + insertErr.message }, 500)
        }
        insertedCount = insertedData ? insertedData.length : rowsToInsert.length
      }

      return jsonRes(req, {
        ok: true,
        data: {
          inserted: insertedCount,
          skipped: skippedCount,
          total: rawLines.length - 1,
          errors: errors,
          filename: filename || 'adaylar.csv'
        }
      })
    }

    return jsonRes(req, { ok: false, error: 'Bilinmeyen action: ' + action }, 400)

  } catch (err) {
    console.error('admin-actions error:', err)
    return jsonRes(req, { ok: false, error: 'Sunucu hatası oluştu.' }, 500)
  }
})
