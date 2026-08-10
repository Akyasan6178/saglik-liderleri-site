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

    // User-scoped client to verify JWT token and role
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
    if (profile.role !== 'mentor' && profile.role !== 'admin') {
      return jsonRes({ ok: false, error: 'Bu işlem için mentor veya admin yetkisi gereklidir.' }, 403)
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { action, payload } = await req.json()

    // ─────────────────────────────────────────────────────────────────────────
    // ACTION: request_revision (Revizyon İsteme - DATA-07A)
    // ─────────────────────────────────────────────────────────────────────────
    if (action === 'request_revision') {
      const { teslim_id, revizyon_notu } = payload
      if (!teslim_id) return jsonRes({ ok: false, error: 'teslim_id zorunludur.' }, 400)
      if (!revizyon_notu || !revizyon_notu.trim()) {
        return jsonRes({ ok: false, error: 'Revizyon notu eksiksiz yazılmalıdır.' }, 400)
      }

      // 1. Teslim kaydını oku
      const { data: teslim, error: teslimErr } = await adminClient
        .from('core_teslim')
        .select('*')
        .eq('id', teslim_id)
        .maybeSingle()

      if (teslimErr || !teslim) return jsonRes({ ok: false, error: 'Teslim bulunamadı.' }, 404)

      // 2. Yetki Kontrolü
      if (profile.role !== 'admin') {
        let callerMentorId = profile.core_mentor_id

        if (!callerMentorId) {
          const { data: mData } = await adminClient
            .from('core_mentor')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle()
          if (mData) callerMentorId = mData.id
        }

        if (!callerMentorId) {
          return jsonRes({ ok: false, error: 'Mentor kaydı eşleştirilemedi.' }, 403)
        }

        let isAuthorized = false

        if (teslim.takim_id) {
          const { data: takim } = await adminClient
            .from('core_takim')
            .select('mentor_id')
            .eq('id', teslim.takim_id)
            .maybeSingle()
          if (takim && takim.mentor_id === callerMentorId) {
            isAuthorized = true
          }
        }

        if (!isAuthorized && teslim.katilimci_id) {
          const { data: katilimci } = await adminClient
            .from('core_katilimci')
            .select('takim_id')
            .eq('id', teslim.katilimci_id)
            .maybeSingle()

          if (katilimci && katilimci.takim_id) {
            const { data: takim } = await adminClient
              .from('core_takim')
              .select('mentor_id')
              .eq('id', katilimci.takim_id)
              .maybeSingle()
            if (takim && takim.mentor_id === callerMentorId) {
              isAuthorized = true
            }
          }
        }

        if (!isAuthorized) {
          return jsonRes({ ok: false, error: 'Bu teslim üzerinde yetkiniz bulunmamaktadır.' }, 403)
        }
      }

      // 3. core_teslim güncelle
      const now = new Date().toISOString()
      const { data: updatedTeslim, error: updateErr } = await adminClient
        .from('core_teslim')
        .update({
          durum: 'REVIZYON_ISTENDI',
          revizyon_istendi: true,
          mentor_yorumu: revizyon_notu.trim()
        })
        .eq('id', teslim_id)
        .select()
        .single()

      if (updateErr) {
        console.error('core_teslim update error:', updateErr)
        return jsonRes({ ok: false, error: 'Teslim durumu güncellenemedi.' }, 500)
      }

      // 4. core_teslimhareketi kaydı oluştur
      const { data: insertedHareket, error: hareketErr } = await adminClient
        .from('core_teslimhareketi')
        .insert({
          teslim_id: teslim_id,
          islem_tipi: 'REVIZYON_ISTENDI',
          aciklama: revizyon_notu.trim(),
          revizyon_notu: revizyon_notu.trim(),
          mentor_yorumu: revizyon_notu.trim(),
          olusturulma_tarihi: now
        })
        .select()
        .single()

      if (hareketErr) {
        console.error('core_teslimhareketi insert error:', hareketErr)
      }

      return jsonRes({
        ok: true,
        data: {
          teslim: updatedTeslim,
          hareket: insertedHareket
        }
      })
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ACTION: evaluate_delivery (Nihai Değerlendirme / Puanlama - DATA-07B)
    // ─────────────────────────────────────────────────────────────────────────
    if (action === 'evaluate_delivery') {
      const { teslim_id, alinan_puan, mentor_yorumu } = payload
      if (!teslim_id) return jsonRes({ ok: false, error: 'teslim_id zorunludur.' }, 400)

      const pVal = parseInt(String(alinan_puan))
      if (isNaN(pVal) || pVal < 0) {
        return jsonRes({ ok: false, error: 'Geçerli bir puan giriniz.' }, 400)
      }

      // 1. Teslim kaydını oku
      const { data: teslim, error: teslimErr } = await adminClient
        .from('core_teslim')
        .select('*')
        .eq('id', teslim_id)
        .maybeSingle()

      if (teslimErr || !teslim) return jsonRes({ ok: false, error: 'Teslim bulunamadı.' }, 404)

      // 2. Maksimum Puan Kontrolü (Görev bazlı)
      let maxPuan = 100
      if (teslim.gorev_id) {
        const { data: gorev } = await adminClient
          .from('core_gorev')
          .select('maksimum_puan')
          .eq('id', teslim.gorev_id)
          .maybeSingle()
        if (gorev && gorev.maksimum_puan) maxPuan = gorev.maksimum_puan
      }

      if (pVal > maxPuan) {
        return jsonRes({ ok: false, error: `Puan maksimum (${maxPuan}) değerinden büyük olamaz.` }, 400)
      }

      // 3. Yetki Kontrolü
      if (profile.role !== 'admin') {
        let callerMentorId = profile.core_mentor_id

        if (!callerMentorId) {
          const { data: mData } = await adminClient
            .from('core_mentor')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle()
          if (mData) callerMentorId = mData.id
        }

        if (!callerMentorId) {
          return jsonRes({ ok: false, error: 'Mentor kaydı eşleştirilemedi.' }, 403)
        }

        let isAuthorized = false

        if (teslim.takim_id) {
          const { data: takim } = await adminClient
            .from('core_takim')
            .select('mentor_id')
            .eq('id', teslim.takim_id)
            .maybeSingle()
          if (takim && takim.mentor_id === callerMentorId) {
            isAuthorized = true
          }
        }

        if (!isAuthorized && teslim.katilimci_id) {
          const { data: katilimci } = await adminClient
            .from('core_katilimci')
            .select('takim_id')
            .eq('id', teslim.katilimci_id)
            .maybeSingle()

          if (katilimci && katilimci.takim_id) {
            const { data: takim } = await adminClient
              .from('core_takim')
              .select('mentor_id')
              .eq('id', katilimci.takim_id)
              .maybeSingle()
            if (takim && takim.mentor_id === callerMentorId) {
              isAuthorized = true
            }
          }
        }

        if (!isAuthorized) {
          return jsonRes({ ok: false, error: 'Bu teslim üzerinde yetkiniz bulunmamaktadır.' }, 403)
        }
      }

      // 4. core_teslim güncelle
      const now = new Date().toISOString()
      const yrmText = (mentor_yorumu || '').trim()

      const { data: updatedTeslim, error: updateErr } = await adminClient
        .from('core_teslim')
        .update({
          durum: 'TAMAMLANDI',
          degerlendirildi: true,
          revizyon_istendi: false,
          alinan_puan: pVal,
          mentor_yorumu: yrmText
        })
        .eq('id', teslim_id)
        .select()
        .single()

      if (updateErr) {
        console.error('core_teslim evaluation update error:', updateErr)
        return jsonRes({ ok: false, error: 'Teslim değerlendirmesi güncellenemedi.' }, 500)
      }

      // 5. Katılımcı Performans Güncelleme / Yeniden Hesaplama
      let updatedPerf = null
      if (teslim.katilimci_id) {
        const { data: catTeslimler } = await adminClient
          .from('core_teslim')
          .select('alinan_puan')
          .eq('katilimci_id', teslim.katilimci_id)
          .eq('degerlendirildi', true)

        const totalGorevPuani = (catTeslimler || []).reduce((acc, t) => acc + (t.alinan_puan || 0), 0)

        const { data: existingPerf } = await adminClient
          .from('core_katilimciperformans')
          .select('*')
          .eq('katilimci_id', teslim.katilimci_id)
          .maybeSingle()

        if (existingPerf) {
          const newBireysel = totalGorevPuani + (existingPerf.toplanti_katilim_puani || 0) + (existingPerf.etkilesim_bonus_puani || 0) + (existingPerf.manuel_puan || 0)
          const { data: pRes } = await adminClient
            .from('core_katilimciperformans')
            .update({
              gorev_puani: totalGorevPuani,
              bireysel_puan: newBireysel,
              guncellenme_tarihi: now
            })
            .eq('id', existingPerf.id)
            .select()
            .single()
          updatedPerf = pRes
        } else {
          const { data: pRes } = await adminClient
            .from('core_katilimciperformans')
            .insert({
              katilimci_id: teslim.katilimci_id,
              gorev_puani: totalGorevPuani,
              bireysel_puan: totalGorevPuani,
              toplanti_katilim_puani: 0,
              etkilesim_bonus_puani: 0,
              manuel_puan: 0,
              admin_ici_not: '',
              katilimciya_gorunen_not: '',
              olusturulma_tarihi: now,
              guncellenme_tarihi: now
            })
            .select()
            .single()
          updatedPerf = pRes
        }
      }

      // 6. core_teslimhareketi kaydı oluştur
      const { data: insertedHareket, error: hareketErr } = await adminClient
        .from('core_teslimhareketi')
        .insert({
          teslim_id: teslim_id,
          islem_tipi: 'NIHAI_DEGERLENDIRME',
          aciklama: yrmText || 'Nihai değerlendirme yapıldı.',
          puan: pVal,
          mentor_yorumu: yrmText,
          olusturulma_tarihi: now
        })
        .select()
        .single()

      if (hareketErr) {
        console.error('core_teslimhareketi insert error:', hareketErr)
      }

      return jsonRes({
        ok: true,
        data: {
          teslim: updatedTeslim,
          performans: updatedPerf,
          hareket: insertedHareket
        }
      })
    }

    return jsonRes({ ok: false, error: `Bilinmeyen action: ${action}` }, 400)
  } catch (err: any) {
    console.error('mentor-actions error:', err)
    return jsonRes({ ok: false, error: 'Sunucu hatası oluştu.' }, 500)
  }
})
