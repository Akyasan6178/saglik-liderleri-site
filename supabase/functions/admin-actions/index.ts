import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function jsonRes(data, status = 200) {
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
    if (!authHeader) return jsonRes({ ok: false, error: 'Yetkilendirme basIIgI eksik.' }, 401)

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
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || !profile) return jsonRes({ ok: false, error: 'Profil bulunamadI.' }, 403)
    if (profile.role !== 'admin') return jsonRes({ ok: false, error: 'Bu islem icin admin yetkisi gereklidir.' }, 403)

    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { action, payload } = await req.json()

    if (action === 'approve_candidate') {
      const { aday_id } = payload
      if (!aday_id) return jsonRes({ ok: false, error: 'aday_id zorunludur.' }, 400)

      const { data: aday, error: adayErr } = await adminClient
        .from('core_aday').select('*').eq('id', aday_id).maybeSingle()
      if (adayErr || !aday) return jsonRes({ ok: false, error: 'Aday bulunamadI.' }, 404)

      const { error: updateErr } = await adminClient
        .from('core_aday').update({ basvuru_durumu: 'ONAYLANDI' }).eq('id', aday_id)
      if (updateErr) return jsonRes({ ok: false, error: 'Aday durumu guncellenemedi.' }, 500)

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
        if (kErr) return jsonRes({ ok: false, error: 'Katilimci kaydi olusturulamadI.' }, 500)
        katilimci = kData

        await adminClient.from('core_katilimciperformans').insert({
          katilimci_id: kData.id,
          bireysel_puan: 0, gorev_puani: 0, toplanti_katilim_puani: 0,
          etkilesim_bonus_puani: 0, manuel_puan: 0,
        })
      }

      return jsonRes({ ok: true, data: { aday_id, katilimci, action: 'approve_candidate' } })
    }

    if (action === 'reject_candidate') {
      const { aday_id } = payload
      if (!aday_id) return jsonRes({ ok: false, error: 'aday_id zorunludur.' }, 400)

      const { error: updateErr } = await adminClient
        .from('core_aday').update({ basvuru_durumu: 'REDDEDILDI' }).eq('id', aday_id)
      if (updateErr) return jsonRes({ ok: false, error: 'Aday durumu guncellenemedi.' }, 500)

      return jsonRes({ ok: true, data: { aday_id, action: 'reject_candidate' } })
    }

    if (action === 'create_mentor') {
      const { ad_soyad, eposta, uzmanlik, gecici_sifre } = payload
      if (!ad_soyad || !eposta) return jsonRes({ ok: false, error: 'ad_soyad ve eposta zorunludur.' }, 400)

      const password = gecici_sifre || Math.random().toString(36).slice(-10) + 'A1!'
      const { data: authUser, error: authErr } = await adminClient.auth.admin.createUser({
        email: eposta, password, email_confirm: true,
        user_metadata: { ad_soyad, uzmanlik },
      })

      if (authErr) {
        const msg = authErr.message || ''
        if (msg.includes('already registered') || msg.includes('already exists')) {
          return jsonRes({ ok: false, error: 'Bu e-posta adresi zaten kayItlIdIr.' }, 409)
        }
        return jsonRes({ ok: false, error: 'Auth kullanicisi olusturulamadI.' }, 500)
      }

      const newUserId = authUser.user?.id
      if (!newUserId) return jsonRes({ ok: false, error: 'Auth ID alinamadI.' }, 500)

      const { data: mentorData, error: mentorErr } = await adminClient
        .from('core_mentor')
        .insert({ ad_soyad, eposta, uzmanlik: uzmanlik || '' })
        .select().single()
      if (mentorErr) return jsonRes({ ok: false, error: 'Mentor kaydi olusturulamadI.' }, 500)

      await adminClient.from('profiles').upsert({
        id: newUserId, email: eposta, role: 'mentor', ad_soyad, core_mentor_id: mentorData.id,
      }, { onConflict: 'id' })

      return jsonRes({ ok: true, data: { mentor: mentorData, action: 'create_mentor' } })
    }

    if (action === 'delete_mentor') {
      const { mentor_id } = payload
      if (!mentor_id) return jsonRes({ ok: false, error: 'mentor_id zorunludur.' }, 400)

      await adminClient.from('core_takim').update({ mentor_id: null }).eq('mentor_id', mentor_id)

      const { error: delErr } = await adminClient.from('core_mentor').delete().eq('id', mentor_id)
      if (delErr) return jsonRes({ ok: false, error: 'Mentor silinemedi.' }, 500)

      await adminClient.from('profiles').update({ core_mentor_id: null }).eq('core_mentor_id', mentor_id)

      return jsonRes({ ok: true, data: { mentor_id, action: 'delete_mentor' } })
    }

    return jsonRes({ ok: false, error: 'Bilinmeyen action: ' + action }, 400)

  } catch (err) {
    console.error('admin-actions error:', err)
    return jsonRes({ ok: false, error: 'Sunucu hatasI olustu.' }, 500)
  }
})
