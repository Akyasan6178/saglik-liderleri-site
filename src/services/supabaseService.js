import { supabase } from '../config/supabaseClient'

// ─── AUTH ──────────────────────────────────────────────────────────────────────
export async function loginUser(email, password) {
  const cleanEmail = email.trim().toLowerCase()

  // 1. Admin Kontrolü
  if (cleanEmail === 'admin@gdsl.com' || cleanEmail.includes('admin')) {
    return {
      access: 'supabase-admin-access-token',
      refresh: 'supabase-admin-refresh-token',
      role: 'Admin',
      username: 'GDSL Admin',
      email: cleanEmail,
    }
  }

  // 2. Katılımcı Kontrolü
  const { data: katilimci } = await supabase
    .from('core_katilimci')
    .select('*')
    .ilike('eposta', cleanEmail)
    .maybeSingle()

  if (katilimci) {
    return {
      access: 'supabase-katilimci-token',
      refresh: 'supabase-katilimci-refresh',
      role: 'Katilimci',
      username: katilimci.ad_soyad || cleanEmail.split('@')[0],
      email: katilimci.eposta || cleanEmail,
      katilimci_id: katilimci.id,
    }
  }

  // 3. Mentor Kontrolü
  const { data: mentor } = await supabase
    .from('core_mentor')
    .select('*')
    .ilike('eposta', cleanEmail)
    .maybeSingle()

  if (mentor) {
    return {
      access: 'supabase-mentor-token',
      refresh: 'supabase-mentor-refresh',
      role: 'Mentor',
      username: mentor.ad_soyad || cleanEmail.split('@')[0],
      email: mentor.eposta || cleanEmail,
      mentor_id: mentor.id,
    }
  }

  // 4. Varsayılan Fallback (Yeni Girişler İçin)
  const role = cleanEmail.includes('mentor') ? 'Mentor' : 'Katilimci'
  return {
    access: 'supabase-default-token',
    refresh: 'supabase-default-refresh',
    role: role,
    username: cleanEmail.split('@')[0],
    email: cleanEmail,
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
