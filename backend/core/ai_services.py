"""
ai_services.py
==============
İçerik DNA Testi için AI rapor üretme servisi.

Çalışma modu (AI_PROVIDER env değişkeni ile seçilir):
  - AI_PROVIDER=openai  (varsayılan)
      . OPENAI_API_KEY VAR  -> OpenAI API ile gercek rapor üretir.
      . OPENAI_API_KEY YOK  -> Placeholder rapor döner (fallback).
  - AI_PROVIDER=gemini
      . GEMINI_API_KEY VAR  -> Google Gemini API ile gercek rapor üretir.
      . GEMINI_API_KEY YOK  -> HATA: 'GEMINI_API_KEY tanimli degil.'

Ortam degiskenleri .env dosyasindan (settings.py araciligiyla) veya sistem
environment'indan okunur. API key kesinlikle bu dosyaya yazilmamalidir.

Gemini SDK: google-genai (pip install google-genai) — yeni resmi SDK.
"""

import os

# ─── Ortam değişkenleri ────────────────────────────────────────────────────────
# Not: Bu satırlar settings.py yüklendikten SONRA çalıştığından,
# .env'den load_dotenv ile yüklenen değişkenler burada görünür.
AI_PROVIDER    = os.environ.get('AI_PROVIDER', 'openai').strip().lower()

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '').strip()
OPENAI_MODEL   = os.environ.get('OPENAI_MODEL', '').strip() or 'gpt-4.1-mini'

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '').strip()
GEMINI_MODEL   = os.environ.get('GEMINI_MODEL', '').strip() or 'gemini-2.5-flash'

# ─── Soru Metinleri ───────────────────────────────────────────────────────────
QUESTION_LABELS: dict[str, str] = {
    "soru_1":  "İçerik üretme amacın nedir?",
    "soru_2":  "En çok hangi konularda içerik üretmek istiyorsun?",
    "soru_3":  "İçeriklerini en çok hangi formatta/tarzda üretmeyi düşünüyorsun?",
    "soru_4":  "İçeriklerinde seni en iyi anlatan iletişim dili hangisi?",
    "soru_5":  "Bir konuyu anlatırken kendini en rahat hissettiğin video süresi hangisi?",
    "soru_6":  "Kamera karşısındaki konuşma temponu nasıl tanımlarsın?",
    "soru_7":  "Videolarına başlamayı en çok hangi şekilde seversin?",
    "soru_8":  "Videonun sonunda (CTA) izleyiciden en çok hangi davranışı beklemek istersin?",
    "soru_9":  "Kamera karşısında kendini nasıl hissediyorsun?",
    "soru_10": "Bir video hazırlarken en çok zorlandığın konu nedir?",
    "soru_11": "Videolarında seni en çok hangisi temsil eder?",
    "soru_12": "Video hazırlarken seni en çok motive eden şey nedir?",
    "soru_13": "Bir kriz anında (haksız eleştiri vs.) ilk tepkin ne olur?",
    "soru_14": "Kendi mesai yoğunluğunda haftada kaç içerik üretmeyi gerçekçi buluyorsun?",
    "soru_15": "Kendini içerik üretimi konusunda bugün hangi seviyede görüyorsun?",
    "soru_16": (
        "Şu an sosyal medyada (Instagram/TikTok) başarılı olan sağlık içerik üreticilerini "
        "incelediğimizde 4 ana tarz (arketip) öne çıkıyor. Sen bu tarzlardan hangisine daha "
        "yakın olmak istersin?"
    ),
    "soru_17": (
        "Sosyal medyada içerik tarzını beğendiğin veya örnek aldığın 1-3 sağlık içerik "
        "üreticisi / hesap var mı?"
    ),
    "soru_18": "İçeriklerinde kendi markanı yansıtacak en fazla 3 kelime yaz.",
    "soru_19": (
        "İnsanların seni düşündüğünde akıllarına gelmesini istediğin, hedeflediğin en fazla "
        "3 kelime nedir?"
    ),
    "soru_20": (
        "Program sonunda insanların seni ve sayfanı tek cümleyle nasıl tanımlamasını istersin?"
    ),
}


def _soru_etiketi(soru_key: str) -> str:
    """soru_1 → 'İçerik üretme amacın nedir?'"""
    return QUESTION_LABELS.get(soru_key) or soru_key.replace('_', ' ').capitalize()


# ─── Sistem Promptu ────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """\
Sen sağlık profesyonelleri için İçerik DNA Analiz Uzmanısın.

Görevin: Bir sağlık profesyonelinin İçerik DNA Testine verdiği cevapları \
analiz ederek kişiye özel, profesyonel ve uygulanabilir bir rapor üretmek.

ZORUNLU KURALLAR:
1. Yalnızca katılımcının verdiği cevaplardan çıkarım yap. \
   Veriye dayanmayan bilgi uydurma ve varsayımda bulunma.
2. KVKK kapsamındaki kişisel verilerden (kimlik, hasta adı, klinik kayıt vb.) \
   içerik üretme veya bu verileri referans alma.
3. TİTCK reklam mevzuatı gereği: tanı, tedavi vaadi, hasta kazanımı vaadi, \
   ürün/hizmet reklamı veya endoresman içeren ifadeler kullanma.
4. Hasta mahremiyeti ilkelerine uy; vaka paylaşımı veya sağlık verisi \
   yayınlamasını önermeden önce ilgili mevzuat uyarısını ekle.
5. Gereksiz övgü, dolgu cümle ve tekrar kullanma.
6. Dil: Türkçe, doğrudan, profesyonel ve kısa.

ZORUNLU ÇIKTI YAPISI (bu başlık sırasını ve ## formatını koru):
## İÇERİK DNA SKOR KARTI
## İçerik Üretici Arketipi
## İletişim Dili ve Karakter
## Teknik İçerik Reçetesi
## Kişiselleştirilmiş İçerik Serileri
## Rol Model ve Benchmark
## Operasyonel Risk ve Gelişim Haritası
## Kişiye Özel Yol Haritası
"""


def _format_cevap_degeri(val) -> str:
    """Tek bir cevap değerini (string, list, int, None vb.) okunabilir stringe çevirir."""
    if val is None:
        return '—'
    if isinstance(val, (list, tuple)):
        clean_items = [str(item).strip() for item in val if item and str(item).strip()]
        if not clean_items:
            return '—'
        if len(clean_items) == 1:
            return clean_items[0]
        return "\n" + "\n".join(f"  - {item}" for item in clean_items)
    s = str(val).strip()
    return s or '—'


# ─── Yardımcı: Cevapları okunabilir formata çevir ─────────────────────────────
def _cevaplari_formatla(cevaplar: dict) -> str:
    """
    Cevapları AI modeline sunulmak üzere numaralandırıp formatlar.
    Dizi (array) cevapları madde madde (- Opsiyon) şeklinde düzenler.
    """
    bloklar = []

    def get_sort_key(k: str):
        try:
            return int(k.replace('soru_', ''))
        except ValueError:
            return 999

    for soru_key in sorted(cevaplar.keys(), key=get_sort_key):
        num = soru_key.replace('soru_', '')
        etiket = _soru_etiketi(soru_key)
        cevap_str = _format_cevap_degeri(cevaplar[soru_key])
        if cevap_str.startswith("\n"):
            bloklar.append(f"Soru {num}: {etiket}\nCevap:{cevap_str}")
        else:
            bloklar.append(f"Soru {num}: {etiket}\nCevap: {cevap_str}")
    return "\n\n".join(bloklar)


def _kullanici_metni(cevaplar: dict) -> str:
    """Her iki provider için ortak kullanıcı mesajını oluşturur."""
    return (
        f"Aşağıda bir sağlık profesyonelinin İçerik DNA Testine verdiği "
        f"{len(cevaplar)} cevap bulunmaktadır.\n"
        "Bu cevaplara dayanarak kişiye özel İçerik DNA Raporu oluştur.\n\n"
        "--- CEVAPLAR ---\n"
        f"{_cevaplari_formatla(cevaplar)}\n"
        "--- CEVAPLAR SONU ---\n\n"
        "Raporu sistem talimatlarında belirtilen başlık sırasına ve ## formatına "
        "kesinlikle uy. Türkçe yaz."
    )


# ─── Placeholder Fallback ─────────────────────────────────────────────────────
def _placeholder_rapor(cevaplar: dict) -> dict:
    """
    OPENAI_API_KEY tanımlı değilken dönen örnek rapor.
    Veri akışını ve frontend görüntülemeyi test etmeye yarar.
    """
    rapor_json = {
        'mod':          'placeholder',
        'cevap_sayisi': len(cevaplar),
        'uyari':        'OPENAI_API_KEY tanımlanmadığı için placeholder rapor gösterilmektedir.',
    }
    basliklar = [
        'İÇERİK DNA SKOR KARTI',
        'İçerik Üretici Arketipi',
        'İletişim Dili ve Karakter',
        'Teknik İçerik Reçetesi',
        'Kişiselleştirilmiş İçerik Serileri',
        'Rol Model ve Benchmark',
        'Operasyonel Risk ve Gelişim Haritası',
        'Kişiye Özel Yol Haritası',
    ]
    satirlar = [
        "## İÇERİK DNA SKOR KARTI",
        "_OPENAI_API_KEY tanımlı olmadığı için bu alan placeholder verisi göstermektedir._",
    ]
    for baslik in basliklar[1:]:
        satirlar.append(f"\n## {baslik}")
        satirlar.append("Placeholder: Gerçek AI analizi etkinleştirildiğinde doldurulacak.")

    return {'rapor_json': rapor_json, 'rapor_metni': "\n".join(satirlar) + "\n"}


# ─── Gerçek OpenAI Çağrısı ────────────────────────────────────────────────────
def _openai_rapor(cevaplar: dict) -> dict:
    """
    OpenAI API kullanarak gerçek rapor üretir.

    - API çağrısı başarısız olursa Exception fırlatır (views.py HATA'ya alır).
    - Yanıt metni alınırsa ancak JSON parse edilemezse rapor_metni kaydedilir,
      rapor_json içine parse_error eklenir — endpoint patlamaz.
    """
    try:
        from openai import OpenAI
    except ImportError:
        raise ImportError(
            "openai paketi kurulu değil. "
            "'pip install openai' komutunu çalıştırın veya "
            "requirements.txt'ten yükleyin."
        )

    client = OpenAI(api_key=OPENAI_API_KEY)

    # OpenAI API çağrısı — başarısızsa exception fırlar, views.py yakalar
    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        temperature=0.3,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": _kullanici_metni(cevaplar)},
        ],
    )

    rapor_metni = (response.choices[0].message.content or '').strip()

    # rapor_json: model meta verisi (parse edilemezse rapor_metni yine kaydedilir)
    rapor_json: dict = {
        'mod':          'openai',
        'model':        OPENAI_MODEL,
        'cevap_sayisi': len(cevaplar),
    }
    try:
        kullanim = response.usage
        rapor_json['kullanim'] = {
            'prompt_tokens':     kullanim.prompt_tokens,
            'completion_tokens': kullanim.completion_tokens,
            'total_tokens':      kullanim.total_tokens,
        }
    except Exception as meta_exc:
        rapor_json['parse_error'] = f"Kullanım meta verisi alınamadı: {meta_exc}"

    return {'rapor_json': rapor_json, 'rapor_metni': rapor_metni}


# ─── Gerçek Gemini Çağrısı ────────────────────────────────────────────────────
def _gemini_rapor(cevaplar: dict) -> dict:
    """
    Google Gemini API kullanarak gerçek rapor üretir.
    Kullanılan SDK: google-genai (resmi güncel SDK, v2.x+)

    - GEMINI_API_KEY tanımlı değilse ValueError fırlatır (views.py HATA'ya alır).
    - API çağrısı başarısız olursa Exception fırlatır.
    - Yanıt düz metin olsa bile rapor_metni kaydedilir, endpoint patlamaz.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY tanımlı değil.")

    try:
        from google import genai
        from google.genai import types as genai_types
    except ImportError:
        raise ImportError(
            "google-genai paketi kurulu değil. "
            "'pip install google-genai' komutunu çalıştırın veya "
            "requirements.txt'ten yükleyin."
        )

    # Client oluştur — key değeri asla loglanmaz
    client = genai.Client(api_key=GEMINI_API_KEY)

    # Gemini API çağrısı — başarısızsa exception fırlar, views.py yakalar
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=_kullanici_metni(cevaplar),
        config=genai_types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.3,
        ),
    )

    rapor_metni = ''
    try:
        rapor_metni = (response.text or '').strip()
    except Exception:
        # Bazı hata durumlarında .text erişimi exception fırlatabilir
        try:
            rapor_metni = response.candidates[0].content.parts[0].text.strip()
        except Exception:
            rapor_metni = ''

    rapor_json: dict = {
        'mod':          'gemini',
        'model':        GEMINI_MODEL,
        'cevap_sayisi': len(cevaplar),
    }

    # Kullanım istatistikleri (varsa)
    try:
        usage = response.usage_metadata
        rapor_json['kullanim'] = {
            'prompt_tokens':     usage.prompt_token_count,
            'completion_tokens': usage.candidates_token_count,
            'total_tokens':      usage.total_token_count,
        }
    except Exception as meta_exc:
        rapor_json['parse_error'] = f"Kullanım meta verisi alınamadı: {meta_exc}"

    return {'rapor_json': rapor_json, 'rapor_metni': rapor_metni}


# ─── Ana Giriş Noktası ────────────────────────────────────────────────────────
def generate_icerik_dna_report(cevaplar: dict) -> dict:
    """
    views.py tarafından çağrılan tek giriş noktası.

    Provider seçimi AI_PROVIDER env değişkeni ile yapılır:
      - AI_PROVIDER=openai (varsayılan): OpenAI çalışır; key yoksa placeholder döner.
      - AI_PROVIDER=gemini: Gemini çalışır; key yoksa kontrollü HATA verir.

    Returns:
        {'rapor_json': dict, 'rapor_metni': str}

    Raises:
        Exception: API çağrısı tamamen başarısız olursa.
                   views.py bunu HATA durumuna alır.
    """
    if AI_PROVIDER == 'gemini':
        return _gemini_rapor(cevaplar)

    # Varsayılan: openai
    if not OPENAI_API_KEY:
        return _placeholder_rapor(cevaplar)

    return _openai_rapor(cevaplar)
