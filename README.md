# AI-GALAXY Website Demo

RAPOR.md'deki eleştiriler doğrultusunda hazırlanan tasarım demosu.

- `index.html` — Yetişkin landing (koyu premium). Hero, canlı stüdyo demosudur: prompt daktilo efektiyle yazılır, anatomi çipleri yanar, çıktı videoya dönüşür; arkada kayan üretim duvarı. Navbar'da menülerin solunda sade **Kids** linki. Program bölümünde 4 patika (ders içerikleri docx'lerinden) ve tıklanabilir haftalık kartlar.
- `kurs.html` — içinde **stüdyo katmanı** da vardır: etkinlikte "Stüdyoda Aç" gerçek AI-GALAXY adım ekranının (patikalar/53/adim/2066'dan modellenmiş) benzerini tam ekran açar — üst görev çubuğu + ilerleme, sol ikon rayı, "Ne üretmek istiyorsun?" prompt alanı, keşfet akışı, prompt yazıp "Üret" ile demo çıktı üretme, sağ altta "Soruyu Gör" penceresi. Sol üstteki ✕ kullanıcıyı tam kaldığı ders görünümüne döndürür.
- `kurs.html` — Udemy tarzı kurs ekranı: solda ders videosu veya uygulama etkinliği, sağda kapatılabilir müfredat (hafta → ders + etkinlik, ✓ işaretleri), Genel Bakış / Kaynaklar / Notlarım sekmeleri. İlerleme ve "kaldığın yerden devam" localStorage'da tutulur (tarayıcıya özeldir); index'teki program bölümünde devam çubuğu görünür.
- `kids/index.html` — 8–15 yaş AI okuryazarlığı arayüzü (talentcup.org ilhamı). 4 patika kartı (Gezegen 1–4, AI Coder dahil) `kids/patika.html?p=N`'e açılır.
- `kids/patika.html` — öğrenci patika haritası (talentcup ortaokul patikasından örneklenmiştir): hafta başlıkları, kıvrımlı görev düğümleri (ders/görev, tamamlandı/sıradaki/kilitli), BAŞLA rozeti, alt sayfa kartından kurs ekranına geçiş, final rozeti. İlerlemeyi kurs ekranıyla aynı `aig_kurs` localStorage kaydından okur. Sol üstteki ← kids kurslar bölümüne, kurstaki "← Patikaya dön" ise patikaya döndürür.
- `css/`, `js/` — saf HTML/CSS/JS, framework yok. `js/programs.js` ortak müfredat verisidir.
- `media/` — C:\ae_projects\assets içinden seçilip optimize edilmiş gerçek AI-GALAXY üretimleri (ffmpeg ile 720p / jpg poster). İnsan/atmosfer fotoğrafları Unsplash CDN'den gelir (internet gerektirir).
- `onizleme/` — Playwright ile alınan doğrulama ekran görüntüleri (masaüstü + mobil).

## Çalıştırma

Video ve fontların düzgün yüklenmesi için bir statik sunucuyla açın:

```
cd ai_galaxy_website_demo
python -m http.server 8080
# http://localhost:8080/       → yetişkin
# http://localhost:8080/kids/  → çocuk
```

## Notlar

- Videolar görünür olduklarında oynar, görünüm dışında durdurulur (performans). `prefers-reduced-motion` destekli.
- Kids videoları, gerçek yüz içeren "önce" bölümü atılarak stilize kısımdan başlayacak şekilde kırpıldı; posterler de stilize kareden üretildi. Yetişkin sayfasındaki dönüşüm videoları ise pedagojik olarak bilinçli bırakıldı.
- Video ileri sarma (seek) için sunucunun HTTP Range desteği gerekir; `python -m http.server` desteklemez ama videolar kısa olduğu için sorun çıkarmaz.
- Editör kaydında kullanıcı adlarının göründüğü akış bölümü CSS ile kırpıldı; canlıya çıkmadan önce temiz bir ekran kaydı alınması önerilir.
- Fiyat kartlarındaki metinler RAPOR.md'de tespit edilen hatalar düzeltilerek yazıldı (dönem ve kapsam tutarlı).
