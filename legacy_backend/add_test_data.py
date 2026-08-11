import urllib.request, json

test_adaylar = [
    {
        'ad': 'Mehmet', 'soyad': 'Demir', 'eposta': 'mehmet.demir@example.com',
        'telefon': '5551112233', 'universite': 'Istanbul Universitesi', 'sinif': '4. Sinif',
        'sosyal_medya': '@mehmet_saglik_dr', 'icerik_uretimi': 'YouTube kanalimda tip ogrencilerine yonelik videolar cekiyorum.',
        'takvim_onay': True
    },
    {
        'ad': 'Zeynep', 'soyad': 'Kaya', 'eposta': 'zeynep.kaya@example.com',
        'telefon': '5559998877', 'universite': 'Ankara Universitesi', 'sinif': 'Mezun',
        'sosyal_medya': '@zeynep_dijital', 'icerik_uretimi': None,
        'takvim_onay': False
    },
    {
        'ad': 'Ali', 'soyad': 'Ozturk', 'eposta': 'ali.ozturk@example.com',
        'telefon': '5554445566', 'universite': 'Ege Universitesi', 'sinif': '2. Sinif',
        'sosyal_medya': '@ali_hekim', 'icerik_uretimi': 'TikTok ve Reels formatinda icerikler urettim.',
        'takvim_onay': True
    },
]

for aday in test_adaylar:
    req = urllib.request.Request(
        'http://localhost:8000/api/google-form-webhook/',
        data=json.dumps(aday).encode(),
        headers={
            'Content-Type': 'application/json',
            'X-Webhook-Secret': 'gdsl-2026-secret-key'
        },
        method='POST'
    )
    try:
        resp = urllib.request.urlopen(req)
        result = json.loads(resp.read().decode())
        print('OK:', result['ad_soyad'], '-', result['action'], 'ID:', result['aday_id'])
    except Exception as e:
        print('ERROR:', aday['ad'], aday['soyad'], str(e))
