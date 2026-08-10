import { supabase } from '../config/supabaseClient'

// ─── AUTH ──────────────────────────────────────────────────────────────────────
export async function loginUser(email, password) {
  const cleanEmail = email.trim().toLowerCase()

  // 1. Supabase Auth ile gerçek e-posta ve şifre doğrulaması
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: password,
  })

  if (error) {
    if (
      error.message.includes('Invalid login credentials') ||
      error.message.includes('invalid_credentials') ||
      error.status === 400
    ) {
      throw new Error('E-posta adresi veya şifre hatalı.')
    }
    throw new Error(error.message || 'Giriş yapılırken bir hata oluştu.')
  }

  const user = data?.user
  const session = data?.session

  if (!user || !session) {
    throw new Error('Oturum başlatılamadı.')
  }

  // 2. Profiles tablosundan kullanıcının rol ve profil bilgilerini çek
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    console.error('Profile query error:', profileError)
    await supabase.auth.signOut()
    throw new Error('Kullanıcı profili okunurken veritabanı hatası oluştu.')
  }

  if (!profile || !profile.role) {
    await supabase.auth.signOut()
    throw new Error('Kullanıcı profil kaydı bulunamadı. Lütfen sistem yöneticiniz ile iletişime geçin.')
  }

  return {
    access: session.access_token,
    refresh: session.refresh_token,
    role: profile.role.toLowerCase(),
    username: profile.ad_soyad || user.email.split('@')[0],
    email: user.email,
    user_id: user.id,
    core_katilimci_id: profile.core_katilimci_id,
    core_mentor_id: profile.core_mentor_id,
  }
}

export async function logoutUser() {
  try {
    await supabase.auth.signOut()
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    localStorage.clear()
  }
}

// ─── ADAYLAR ───────────────────────────────────────────────────────────────────
export async function getAdaylar() {
  const { data, error } = await supabase.from('core_aday').select('*').order('id', { ascending: false })
  if (error) throw error
  return (data || []).map(a => ({
    ...a,
    ad_soyad: a.ad_soyad || `${a.ad || ''} ${a.soyad || ''}`.trim()
  }))
}

export async function createAday(adayData) {
  const { data, error } = await supabase.from('core_aday').insert([adayData]).select().single()
  if (error) throw error
  return data
}

export async function updateAday(id, updates) {
  const { data, error } = await supabase.from('core_aday').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteAday(id) {
  const { error } = await supabase.from('core_aday').delete().eq('id', id)
  if (error) throw error
  return true
}

// ─── TAKIMLAR ──────────────────────────────────────────────────────────────────
export async function getTakimlar() {
  const { data, error } = await supabase.from('core_takim').select('*').order('id', { ascending: false })
  if (error) throw error
  return (data || []).map(t => ({
    ...t,
    mentor: t.mentor_id
  }))
}

export async function createTakim(takimData) {
  const { data, error } = await supabase.from('core_takim').insert([takimData]).select().single()
  if (error) throw error
  return data
}

export async function updateTakim(id, updates) {
  const { data, error } = await supabase.from('core_takim').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteTakim(id) {
  const { error } = await supabase.from('core_takim').delete().eq('id', id)
  if (error) throw error
  return true
}

// ─── KATILIMCILAR ──────────────────────────────────────────────────────────────
export async function getKatilimcilar() {
  const { data, error } = await supabase.from('core_katilimci').select('*').order('id', { ascending: false })
  if (error) throw error
  return (data || []).map(k => ({
    ...k,
    takim: k.takim_id,
    aday: k.aday_id
  }))
}

export async function createKatilimci(katilimciData) {
  const { data, error } = await supabase.from('core_katilimci').insert([katilimciData]).select().single()
  if (error) throw error
  return data
}

export async function updateKatilimci(id, updates) {
  const { data, error } = await supabase.from('core_katilimci').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteKatilimci(id) {
  const { error } = await supabase.from('core_katilimci').delete().eq('id', id)
  if (error) throw error
  return true
}

// ─── GÖREVLER ──────────────────────────────────────────────────────────────────
export async function getGorevler() {
  const { data, error } = await supabase.from('core_gorev').select('*').order('id', { ascending: false })
  if (error) throw error
  return (data || []).map(g => ({
    ...g,
    hedef_katilimci: g.hedef_katilimci_id,
    hedef_takim: g.hedef_takim_id
  }))
}

export async function createGorev(gorevData) {
  const { data, error } = await supabase.from('core_gorev').insert([gorevData]).select().single()
  if (error) throw error
  return data
}

export async function updateGorev(id, updates) {
  const { data, error } = await supabase.from('core_gorev').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteGorev(id) {
  const { error } = await supabase.from('core_gorev').delete().eq('id', id)
  if (error) throw error
  return true
}

// ─── TESLİMLER ─────────────────────────────────────────────────────────────────
export async function getTeslimler() {
  const { data, error } = await supabase.from('core_teslim').select('*').order('id', { ascending: false })
  if (error) throw error
  return (data || []).map(t => ({
    ...t,
    katilimci: t.katilimci_id,
    takim: t.takim_id,
    gorev: t.gorev_id
  }))
}

export async function submitTeslim(teslimData) {
  const { data, error } = await supabase.from('core_teslim').insert([{
    ...teslimData,
    teslim_tarihi: new Date().toISOString(),
    durum: 'BEKLIYOR'
  }]).select().single()
  if (error) throw error
  return data
}

export async function evaluateTeslim(id, evaluationData) {
  const { data, error } = await supabase.from('core_teslim').update(evaluationData).eq('id', id).select().single()
  if (error) throw error
  return data
}

// ─── MENTORLAR ─────────────────────────────────────────────────────────────────
export async function getMentorlar() {
  const { data, error } = await supabase.from('core_mentor').select('*').order('id', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createMentor(mentorData) {
  const { data, error } = await supabase.from('core_mentor').insert([mentorData]).select().single()
  if (error) throw error
  return data
}

export async function updateMentor(id, updates) {
  const { data, error } = await supabase.from('core_mentor').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteMentor(id) {
  const { error } = await supabase.from('core_mentor').delete().eq('id', id)
  if (error) throw error
  return true
}

export async function submitIcerikDna(cevaplar) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session?.access_token) {
    throw new Error('Oturum geçersiz veya süresi dolmuş.')
  }

  const { data, error } = await supabase.functions.invoke('ai-content-dna', {
    body: { cevaplar },
    headers: {
      Authorization: `Bearer ${session.access_token}`
    }
  })

  if (error) {
    let msg = error.message || 'İçerik DNA testi gönderilemedi.'
    if (error.context && typeof error.context.json === 'function') {
      try {
        const body = await error.context.json()
        if (body?.error) msg = body.error
      } catch (_) {}
    }
    throw new Error(msg)
  }
  if (!data?.ok) {
    throw new Error(data?.error || 'İçerik DNA testi işlenirken bir hata oluştu.')
  }
  return data.data
}

// ─── KATILIMCI ÖZEL SORGULARI ──────────────────────────────────────────────────
export async function getKatilimciMe() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session?.user) throw new Error('Oturum geçersiz.')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle()

  if (profileError) throw profileError
  if (!profile) throw new Error('Profil bulunamadı.')

  let katilimciId = profile.core_katilimci_id
  let katilimciData = null

  if (katilimciId) {
    const { data: kData, error: kError } = await supabase
      .from('core_katilimci')
      .select('*')
      .eq('id', katilimciId)
      .maybeSingle()
    if (!kError) katilimciData = kData
  }

  if (!katilimciData) {
    const { data: kData, error: kError } = await supabase
      .from('core_katilimci')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle()
    if (!kError && kData) {
      katilimciData = kData
      katilimciId = kData.id
    }
  }

  let takimData = null
  if (katilimciData && katilimciData.takim_id) {
    const { data: tData } = await supabase
      .from('core_takim')
      .select('*')
      .eq('id', katilimciData.takim_id)
      .maybeSingle()
    if (tData) takimData = tData
  }

  return {
    profile,
    katilimci: katilimciData ? {
      ...katilimciData,
      takim: katilimciData.takim_id,
      takim_adi: takimData ? takimData.takim_adi : null,
      toplam_puan: takimData ? takimData.toplam_puan : 0
    } : null,
    takim: takimData
  }
}

export async function getKatilimciPerformansMe(katilimciId) {
  if (!katilimciId) return null
  const { data, error } = await supabase
    .from('core_katilimciperformans')
    .select('*')
    .eq('katilimci_id', katilimciId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getKatilimciDnaMe(katilimciId) {
  if (!katilimciId) return null
  const { data, error } = await supabase
    .from('core_icerikdnatesti')
    .select('*')
    .eq('katilimci_id', katilimciId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getKatilimciTeslimlerMe(katilimciId) {
  if (!katilimciId) return []
  const { data, error } = await supabase
    .from('core_teslim')
    .select('*')
    .eq('katilimci_id', katilimciId)
    .order('id', { ascending: false })
  if (error) throw error
  return (data || []).map(t => ({
    ...t,
    katilimci: t.katilimci_id,
    takim: t.takim_id,
    gorev: t.gorev_id
  }))
}

// ─── MENTOR ÖZEL SORGULARI ───────────────────────────────────────────────────
export async function getMentorMe() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session?.user) throw new Error('Oturum geçersiz.')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle()

  if (profileError) throw profileError
  if (!profile) throw new Error('Profil bulunamadı.')

  let mentorId = profile.core_mentor_id
  let mentorData = null

  if (mentorId) {
    const { data: mData, error: mError } = await supabase
      .from('core_mentor')
      .select('*')
      .eq('id', mentorId)
      .maybeSingle()
    if (!mError) mentorData = mData
  }

  if (!mentorData) {
    const { data: mData, error: mError } = await supabase
      .from('core_mentor')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle()
    if (!mError && mData) {
      mentorData = mData
      mentorId = mData.id
    }
  }

  return {
    profile,
    mentor: mentorData ? {
      ...mentorData,
      id: mentorData.id,
      ad_soyad: mentorData.ad_soyad,
      eposta: mentorData.eposta,
      uzmanlik: mentorData.uzmanlik
    } : null
  }
}

export async function getMentorTakimlarim(mentorId) {
  const { data, error } = await supabase
    .from('core_takim')
    .select('*')
    .order('id', { ascending: false })
  if (error) throw error
  return (data || []).map(t => ({
    ...t,
    mentor: t.mentor_id
  }))
}

export async function getMentorKatilimcilarim(mentorId) {
  const { data, error } = await supabase
    .from('core_katilimci')
    .select('*')
    .order('id', { ascending: false })
  if (error) throw error
  return (data || []).map(k => ({
    ...k,
    takim: k.takim_id,
    aday: k.aday_id
  }))
}

export async function getMentorTeslimler(mentorId) {
  const { data, error } = await supabase
    .from('core_teslim')
    .select('*')
    .order('id', { ascending: false })
  if (error) throw error
  return (data || []).map(t => ({
    ...t,
    katilimci: t.katilimci_id,
    takim: t.takim_id,
    gorev: t.gorev_id
  }))
}

// ─── ADMIN EDGE FUNCTION ÇAĞRISI ─────────────────────────────────────────────
const ADMIN_ACTIONS_URL = 'https://wczupupflxvfnjbjkfrj.supabase.co/functions/v1/admin-actions'

export async function callAdminAction(action, payload = {}) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session?.access_token) {
    throw new Error('Oturum geçersiz veya süresi dolmuş.')
  }

  const res = await fetch(ADMIN_ACTIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ action, payload }),
  })

  const data = await res.json()
  if (!res.ok || !data.ok) {
    throw new Error(data.error || `Edge Function HTTP ${res.status}`)
  }
  return data
}

// ─── MENTOR EDGE FUNCTION ÇAĞRISI ────────────────────────────────────────────
export async function requestRevision(teslim_id, revizyon_notu) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session?.access_token) {
    throw new Error('Oturum geçersiz veya süresi dolmuş.')
  }

  const { data, error } = await supabase.functions.invoke('mentor-actions', {
    body: {
      action: 'request_revision',
      payload: { teslim_id, revizyon_notu }
    },
    headers: {
      Authorization: `Bearer ${session.access_token}`
    }
  })

  if (error) {
    let msg = error.message || 'Revizyon isteği iletilemedi.'
    if (error.context && typeof error.context.json === 'function') {
      try {
        const body = await error.context.json()
        if (body?.error) msg = body.error
      } catch (_) {}
    }
    throw new Error(msg)
  }

  if (!data?.ok) {
    throw new Error(data?.error || 'Revizyon isteği işlenirken bir hata oluştu.')
  }
  return data.data
}

export async function evaluateDelivery(teslim_id, alinan_puan, mentor_yorumu) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session?.access_token) {
    throw new Error('Oturum geçersiz veya süresi dolmuş.')
  }

  const { data, error } = await supabase.functions.invoke('mentor-actions', {
    body: {
      action: 'evaluate_delivery',
      payload: { teslim_id, alinan_puan, mentor_yorumu }
    },
    headers: {
      Authorization: `Bearer ${session.access_token}`
    }
  })

  if (error) {
    let msg = error.message || 'Değerlendirme kaydedilemedi.'
    if (error.context && typeof error.context.json === 'function') {
      try {
        const body = await error.context.json()
        if (body?.error) msg = body.error
      } catch (_) {}
    }
    throw new Error(msg)
  }

  if (!data?.ok) {
    throw new Error(data?.error || 'Nihai değerlendirme işlenirken bir hata oluştu.')
  }
  return data.data
}


