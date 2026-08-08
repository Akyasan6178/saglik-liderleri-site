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
  return data || []
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
  return data || []
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
  return data || []
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
  return data || []
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
  return data || []
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

// ─── İÇERİK DNA ────────────────────────────────────────────────────────────────
export async function submitIcerikDna(katilimci_id, form_yanitlari) {
  // Edge Function çağır
  const response = await fetch('https://wczupupflxvfnjbjkfrj.supabase.co/functions/v1/ai-content-dna', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ katilimci_id, form_yanitlari })
  })
  return await response.json()
}
