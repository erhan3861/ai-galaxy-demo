# Yedek — Udemy tarzı kurs ekranı (28 Eylül 2026)

Patika adım ekranına geçmeden önceki sürüm. Geri dönmek için:

```
cp yedek/kurs_udemy.html kurs.html
cp yedek/kurs_udemy.css css/kurs.css
cp yedek/kurs_udemy.js  js/kurs.js
```

## Eski hero: canlı stüdyo kartı (2026-09-28)

Ana sayfanın hero'sundaki "canlı stüdyo" kartı (prompt daktilo efekti, çipler,
çıktı videosu) yerini AE ile yapılan loop videoya (`media/aig_hero.*`) bıraktı.
Yedekler:

- `yedek/hero_studyo_blok.html`: yalnızca kartın HTML bloğu
- `yedek/index_hero_studyo.html`: değişiklikten önceki index.html'in tamamı

Geri dönmek için `index.html` içindeki `<div class="hero-video">…</div>` bloğunu
`hero_studyo_blok.html` içeriğiyle değiştirmek yeter. `.studio*` CSS kuralları
`css/main.css` içinde, simülasyon kodu `js/main.js` içinde durmaya devam ediyor;
ikisine de dokunulmadı. Kart yoksa simülasyon kodu kendini kapatıyor.
