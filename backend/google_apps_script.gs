/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  Geleceğin Dijital Sağlık Liderleri — Google Apps Script    ║
 * ║  Google Form → Backend Webhook Entegrasyonu                 ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * KURULUM:
 * 1. Google Form → "Yanıtlar" sekmesi → Google Sheets simgesi tıkla (yanıtları sheet'e aktar)
 * 2. Açılan Google Sheet'te: Uzantılar → Apps Script
 * 3. Bu kodu yapıştır ve BACKEND_URL'i güncelleyin
 * 4. Kaydet (Ctrl+S), ardından "Tetikleyici ekle" ile onFormSubmit tetikleyicisini kur
 *
 * MEVCUT KAYITLARI TOPLU YÜKLEME (ÖNEMLİ):
 * → tumYanitlariGonder() fonksiyonunu Apps Script'te seç ve ▶ Çalıştır
 *
 * SÜTUN EŞLEŞTİRMESİ (Google Sheets sütun sırası):
 * A (0): Zaman Damgası (otomatik)
 * B (1): Adınız
 * C (2): Soyadınız
 * D (3): E-posta Adresiniz
 * E (4): Telefon Numaranız
 * F (5): Okuduğunuz / Mezun Olduğunuz Üniversite
 * G (6): Sınıf
 * H (7): Sosyal medya adresleriniz (Instagram ve TikTok)
 * I (8): Daha önce içerik ürettiniz mi?
 * J (9): Program Takvimine Uyum ve Devamlılık Onayı
 */

// ── Yapılandırma ──────────────────────────────────────────────
var BACKEND_URL    = "https://YOUR_DOMAIN/api/google-form-webhook/";
var WEBHOOK_SECRET = "gdsl-2026-secret-key"; // backend/config/settings.py ile eşleşmeli

// ── Sütun indexleri (0-tabanlı) ───────────────────────────────
// Formunuzun sütun sırası farklıysa burayı güncelleyin.
var COL = {
  timestamp:      0,  // A
  ad:             1,  // B
  soyad:          2,  // C
  eposta:         3,  // D
  telefon:        4,  // E
  universite:     5,  // F
  sinif:          6,  // G
  sosyal_medya:   7,  // H
  icerik_uretimi: 8,  // I
  takvim_onay:    9,  // J
};

// ── Yardımcı: Ham satır dizisinden payload oluştur ─────────────
function satirdanPayload(row) {
  var sinifRaw = (row[COL.sinif] || "").toString().trim();
  var sinifMap = {
    "1. Sınıf": "1. Sinif",
    "2. Sınıf": "2. Sinif",
    "3. Sınıf": "3. Sinif",
    "4. Sınıf": "4. Sinif",
    "Mezun":    "Mezun"
  };
  var sinif = sinifMap[sinifRaw] || (sinifRaw ? "Diger" : null);

  // Checkbox/onay: dolu ise true
  var takvimRaw = (row[COL.takvim_onay] || "").toString().trim();
  var takvimOnay = takvimRaw.length > 0 && takvimRaw.toLowerCase() !== "false";

  var ad     = (row[COL.ad]     || "").toString().trim();
  var eposta = (row[COL.eposta] || "").toString().trim().toLowerCase();

  if (!ad || !eposta) return null; // Zorunlu alan eksik → atla

  return {
    ad:             ad,
    soyad:          (row[COL.soyad]          || "").toString().trim(),
    eposta:         eposta,
    telefon:        (row[COL.telefon]        || "").toString().trim() || null,
    universite:     (row[COL.universite]     || "").toString().trim() || null,
    sinif:          sinif,
    sosyal_medya:   (row[COL.sosyal_medya]   || "").toString().trim() || null,
    icerik_uretimi: (row[COL.icerik_uretimi] || "").toString().trim() || null,
    takvim_onay:    takvimOnay
  };
}

// ── Yardımcı: Backend'e tek bir payload gönder ─────────────────
function payloadGonder(payload) {
  var options = {
    method:             "post",
    contentType:        "application/json",
    headers:            { "X-Webhook-Secret": WEBHOOK_SECRET },
    payload:            JSON.stringify(payload),
    muteHttpExceptions: true
  };
  return UrlFetchApp.fetch(BACKEND_URL, options);
}

// ── Ana Fonksiyon: Yeni Form Gönderimini Yakala ───────────────
function onFormSubmit(e) {
  try {
    var row     = e.values; // ["timestamp", "ad", "soyad", ...]
    var payload = satirdanPayload(row);

    if (!payload) {
      Logger.log("Eksik zorunlu alan: ad veya eposta boş.");
      return;
    }

    var response = payloadGonder(payload);
    var code     = response.getResponseCode();
    var body     = response.getContentText();

    Logger.log("HTTP " + code + " | " + body);

    if (code !== 200 && code !== 201) {
      Logger.log("HATA: Backend yanıtı → " + code + " " + body);
    }

  } catch (err) {
    Logger.log("Webhook hatası: " + err.toString());
  }
}

// ══════════════════════════════════════════════════════════════
// ★  MEVCUT KAYITLARI TOPLU YÜKLEME  —  BİR KERE ÇALIŞTIR  ★
// ══════════════════════════════════════════════════════════════
/**
 * Google Sheets'teki TÜM mevcut form yanıtlarını backend'e gönderir.
 *
 * NASIL ÇALIŞTIRILIR:
 * 1. Apps Script editöründe üstteki fonksiyon seçiciden "tumYanitlariGonder" seç
 * 2. ▶ Çalıştır butonuna bas
 * 3. İzinleri onayla (ilk çalıştırmada gerekli)
 * 4. Görünüm → Günlükler'den sonuçları gör
 *
 * NOT: Aynı e-posta ile birden fazla satır varsa backend upsert yapar
 *       (günceller, hata vermez). Güvenle tekrar çalıştırılabilir.
 */
function tumYanitlariGonder() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data  = sheet.getDataRange().getValues();

  // İlk satır başlık → 1'den başla
  var basarili = 0;
  var hatali   = 0;
  var atlandi  = 0;

  Logger.log("══ Toplu Yükleme Başladı ══");
  Logger.log("Toplam satır (başlık dahil): " + data.length);
  Logger.log("Veri satırı sayısı: " + (data.length - 1));

  for (var i = 1; i < data.length; i++) {
    var row     = data[i];
    var payload = satirdanPayload(row);

    if (!payload) {
      atlandi++;
      Logger.log("Satır " + (i + 1) + ": ATLANDI — ad veya eposta boş");
      continue;
    }

    try {
      var response = payloadGonder(payload);
      var code     = response.getResponseCode();
      var body     = response.getContentText();

      if (code === 200 || code === 201) {
        basarili++;
        var result = JSON.parse(body);
        Logger.log("Satır " + (i + 1) + ": OK " + payload.eposta +
                   " → " + result.action + " (ID: " + result.aday_id + ")");
      } else {
        hatali++;
        Logger.log("Satır " + (i + 1) + ": HATA HTTP " + code + " | " + body);
      }
    } catch (err) {
      hatali++;
      Logger.log("Satır " + (i + 1) + ": ISTISNA → " + err.toString());
    }

    // Rate-limit aşmamak için 400ms bekle
    Utilities.sleep(400);
  }

  Logger.log("══ Toplu Yükleme Tamamlandı ══");
  Logger.log("Başarılı: " + basarili + " | Hatalı: " + hatali + " | Atlandı: " + atlandi);

  SpreadsheetApp.getUi().alert(
    "Toplu Yükleme Tamamlandı!\n\n" +
    "Başarılı : " + basarili + "\n" +
    "Hatalı   : " + hatali   + "\n" +
    "Atlandı  : " + atlandi  + "\n\n" +
    "Detaylar için: Görünüm → Günlükler"
  );
}

// ── Test: Manuel olarak tek bir test kaydı gönder ─────────────
function testManualEntry() {
  var testPayload = {
    ad:             "Test",
    soyad:          "Kullanıcı",
    eposta:         "test@example.com",
    telefon:        "5551234567",
    universite:     "Test Üniversitesi",
    sinif:          "3. Sinif",
    sosyal_medya:   "@test_hesabi",
    icerik_uretimi: "Instagram'da içerik üretiyorum.",
    takvim_onay:    true
  };

  var response = payloadGonder(testPayload);
  Logger.log("Test yanıtı → HTTP " + response.getResponseCode());
  Logger.log(response.getContentText());
}
