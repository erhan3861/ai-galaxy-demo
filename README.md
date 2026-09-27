# AI-GALAXY Website Demo

RAPOR.md'deki eleştiriler doğrultusunda hazırlanan tasarım demosu.

- `index.html` — Yetişkin landing (koyu premium). Hero, canlı stüdyo demosudur: prompt daktilo efektiyle yazılır, anatomi çipleri yanar, çıktı videoya dönüşür; arkada kayan üretim duvarı. Navbar'da menülerin solunda sade **Kids** linki. AI-Stüdyo bölümünde gerçek editör ekran kaydı montajı (`media/editor_ders.mp4`) ve yanında 8 haftalık ders videosu montajı (`media/dersler_montaj.mp4`). Program bölümünde 4 patika (ders içerikleri docx'lerinden) ve tıklanabilir haftalık kartlar.
- `kurs.html` — içinde **stüdyo katmanı** da vardır: etkinlikte "Stüdyoda Aç" gerçek AI-GALAXY adım ekranının (patikalar/53/adim/2066'dan modellenmiş) benzerini tam ekran açar — üst görev çubuğu + ilerleme, sol ikon rayı, "Ne üretmek istiyorsun?" prompt alanı, keşfet akışı, prompt yazıp "Üret" ile demo çıktı üretme, sağ altta "Soruyu Gör" penceresi. Sol üstteki ✕ kullanıcıyı tam kaldığı ders görünümüne döndürür.
- `kurs.html` — Udemy tarzı kurs ekranı: solda ders videosu veya uygulama etkinliği, sağda kapatılabilir müfredat (hafta → ders + etkinlik, ✓ işaretleri). İlerleme ve "kaldığın yerden devam" localStorage'da tutulur (tarayıcıya özeldir); index'teki program bölümünde devam çubuğu görünür.
- `kids/index.html` — 8–15 yaş AI okuryazarlığı arayüzü (talentcup.org ilhamı). 4 patika kartı (Gezegen 1–4, AI Coder dahil) `kids/patika.html?p=N`'e açılır.
- `kids/patika.html` — öğrenci patika haritası (talentcup ortaokul patikasından örneklenmiştir): hafta başlıkları, kıvrımlı görev düğümleri (ders/görev, tamamlandı/sıradaki/kilitli), BAŞLA rozeti, alt sayfa kartından kurs ekranına geçiş, final rozeti. İlerlemeyi kurs ekranıyla aynı `aig_kurs` localStorage kaydından okur. Sol üstteki ← kids kurslar bölümüne, kurstaki "← Patikaya dön" ise patikaya döndürür.
- `css/`, `js/` — saf HTML/CSS/JS, framework yok. `js/programs.js` ortak müfredat verisidir.
- `media/` — C:\ae_projects\assets içinden seçilip optimize edilmiş gerçek AI-GALAXY üretimleri (ffmpeg ile 720p / jpg poster). İnsan/atmosfer fotoğrafları Unsplash CDN'den gelir (internet gerektirir).
- `onizleme/` — Playwright ile alınan doğrulama ekran görüntüleri (masaüstü + mobil).

## Üye (giriş yapılmış) uygulama görünümü — ai-galaxy.app yapısından örneklendi

- **Ücretsiz Giriş** (anasayfa) → demo giriş penceresi (hazır `selin@ornek.com`) → `patikalar.html`. Üyelik yalnızca tarayıcıda `aig_user` anahtarında tutulur; profil menüsünden Çıkış.
- Ortak üst bar (`js/appbar.js`): Öğrenme Patikaları · Galaxy · Templates · 1.000 Kredi · Profil menüsü.
- `patikalar.html` — patika kartları, seviye filtresi ve açılıp kapanan arama.
- `patika.html?p=N` — kıvrımlı adım haritası; düğüm üzerine gelince adım kartı (numara, başlık, tür, puan, "Başla +5 puan"), tıklayınca doğrudan adıma girer. Sağda ilerleme halkası ve "Sıradaki adım".
- Adım ekranı `kurs.html?...&studio=1` — AI-GALAXY editörü: üstte görev başlığı + ilerleme çubuğu + **Öğrenme Yolculuğu** düğmesi (adımlar arasında geçiş yapılan açılır/kapanır çekmece), sağ altta tutorial penceresi (Soru / İpucu, 1x–2x hız, slaytlar, şifre + Gönder). Doğru şifre adımı tamamlar, +5 puan verir ve sıradaki adıma geçer. Demo şifreleri son slaytta yazar.
- `galaxy.html` — sade editör (tutorial yok): Keşfet akışı ve üretim, Koleksiyon, Metin/Görsel/Ses/Video sohbet ekranları.
- `sablonlar.html` — Templates: arama, Şablonlar/Koleksiyonum, kategori filtreleri, üzerine gelince oynayan şablon kartları, detay penceresi.
- Eski Udemy tarzı kurs ekranı `yedek/` klasöründe saklı (geri dönüş için `yedek/OKU.md`).

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
