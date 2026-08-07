import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { katilimci_id, form_yanitlari } = await req.json()

    // OpenAI veya Gemini API Çağrısı
    const apiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('GEMINI_API_KEY')
    
    let rapor = "İçerik DNA Analiz Raporu oluşturuldu."
    if (apiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Dijital Sağlık Liderleri için İçerik DNA Analistisin.' },
            { role: 'user', content: JSON.stringify(form_yanitlari) }
          ]
        })
      })
      const data = await response.json()
      rapor = data.choices?.[0]?.message?.content || rapor
    }

    // Veritabanına kaydet
    const { data: dbData, error: dbError } = await supabase
      .from('core_icerikdnatesti')
      .upsert({
        katilimci_id,
        form_yanitlari,
        rapor_metni: rapor,
        tamamlandi: true,
        olusturulma_tarihi: new Date().toISOString()
      })

    if (dbError) throw dbError

    return new Response(
      JSON.stringify({ success: true, rapor, data: dbData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
