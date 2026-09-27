/* AI-GALAXY — ortak program/müfredat verisi (ders içerikleri docx'lerinden) */
window.AIG_PROGRAMS = [
  {
    id: "temel-ai-creator",
    title: "Temel AI Creator",
    level: "Başlangıç",
    final: "Benim AI Hikâyem — prompt seti, görsel seri, seslendirme ve 60–90 sn video",
    meta: ["8 hafta", "16 saat", "Başlangıç"],
    weeks: [
      { t: "AI ile fikir geliştirme", d: "AI ile güvenli ve yaratıcı çalışma; fikir havuzu oluşturma.", out: "Fikir kartı + 3 iyileştirilmiş prompt" },
      { t: "İyi prompt yazma", d: "Amaç, bağlam, rol ve çıktı formatını tek promptta kurma.", out: "Kendi prompt şablonun" },
      { t: "Görsel üretim", d: "Bir fikri görsel kompozisyona dönüştürme ve seçim yapma.", out: "3 görselden seçilmiş kapak" },
      { t: "Tutarlı karakter ve dünya", d: "Aynı karakteri farklı sahnelerde koruma.", out: "4 karelik görsel seri" },
      { t: "Kısa hikâye kurma", d: "Başlangıç, sorun, çözüm yapısıyla görselleri hikâyeye bağlama.", out: "600 kelimelik hikâye + sahne listesi" },
      { t: "Ses ve anlatım", d: "Metni uygun ses, vurgu ve atmosferle anlatma.", out: "Seslendirilmiş hikâye" },
      { t: "Basit video", d: "Görsel ve sesi zaman çizelgesinde birleştirme.", out: "60–90 sn taslak video" },
      { t: "Final sunumu", d: "Ürünü düzenleme, telif ve güvenlik kontrolü, sunma.", out: "Final video + proje sunumu" }
    ]
  },
  {
    id: "orta-ai-creator",
    title: "Orta AI Creator",
    level: "Orta",
    final: "AI Mini Evren — karakteri, dünyası, sesi ve kurgusu olan 90–120 sn içerik",
    meta: ["8 hafta", "16 saat", "Orta"],
    weeks: [
      { t: "Proje fikri ve yaratıcı brif", d: "Tek bir proje fikrini hedef kitle ve formatla netleştirme.", out: "Proje brifi + üretim takvimi" },
      { t: "Prompt mühendisliği", d: "Değişkenler ve örneklerle tekrar üretilebilir prompt kurma.", out: "Prompt kütüphanesi" },
      { t: "Karakter tasarımı", d: "Karakter kimliğini, görünümünü ve davranışını tutarlı tanımlama.", out: "Karakter bible + model sayfası" },
      { t: "Mekân ve stil", d: "Aynı görsel dünyada farklı mekânlar üretme.", out: "Stil rehberi + 5 mekân görseli" },
      { t: "Sahne ve kamera dili", d: "Görsel hikâyeyi planlı çekimlere bölme.", out: "Storyboard + shot list" },
      { t: "Ses dünyası", d: "Karakter sesi, atmosfer ve efektleri anlatı amacıyla seçme.", out: "Ses paketi + diyalog kaydı" },
      { t: "Video ve kurgu", d: "Sahneleri ritim ve süreklilik gözeterek birleştirme.", out: "90–120 sn rough cut" },
      { t: "İçerik yayın paketi", d: "Finali eleştiriyle iyileştirme ve sunulabilir hâle getirme.", out: "Final içerik + kapak + açıklama" }
    ]
  },
  {
    id: "ileri-ai-filmmaker",
    title: "İleri AI Filmmaker",
    level: "İleri",
    final: "AI Short Film Studio — senaryo, storyboard, sahneler, ses ve 2–3 dk final film",
    meta: ["8 hafta", "16 saat", "İleri"],
    weeks: [
      { t: "Yönetmen vizyonu ve fikir", d: "Tema, hedef duygu ve formatı olan film fikri geliştirme.", out: "Logline + yönetmen notu" },
      { t: "Senaryo ve karakter", d: "Kısa film yapısında karakter hedefi ve dönüşümü kurma.", out: "Senaryo taslağı" },
      { t: "Storyboard ve shot list", d: "Senaryoyu çekilebilir planlara ayırma.", out: "Storyboard + ayrıntılı shot list" },
      { t: "Görsel yönetmenlik", d: "Renk, ışık, kostüm ve mekân sürekliliği oluşturma.", out: "Lookbook + referans kareler" },
      { t: "Sinematik sahne üretimi", d: "Kontrollü sahne ve kamera hareketleri deneme.", out: "3 sinematik sahne" },
      { t: "Ses ve dramatik ritim", d: "Diyalog, müzik ve efektleri duyguya göre tasarlama.", out: "Ses tasarımı + müzik planı" },
      { t: "Kurgu ve reklam dili", d: "Sahneleri ritim, süreklilik ve mesaj doğrultusunda kurgulama.", out: "İlk final kurgu + fragman" },
      { t: "Gösterim ve portfolyo", d: "Filmi eleştiriyle sonlandırıp profesyonel biçimde sunma.", out: "2–3 dk film veya reklam" }
    ]
  },
  {
    id: "ileri-ai-coder",
    title: "İleri AI Coder",
    level: "İleri",
    final: "AI destekli dijital ürün — web uygulaması, 3D oyun veya simülasyon",
    meta: ["8 hafta", "16 saat", "İleri"],
    weeks: [
      { t: "Ürün fikri ve plan", d: "Kullanıcı, problem ve başarı ölçütünü tanımlama.", out: "Ürün brifi + görev listesi" },
      { t: "Prompt ile kod üretme", d: "AI'dan anlaşılır, küçük ve test edilebilir kod isteme.", out: "Çalışan ilk prototip" },
      { t: "Web arayüzü", d: "Bilgi mimarisi ve erişilebilir bir arayüz kurma.", out: "Çalışan web sayfası" },
      { t: "Etkileşim ve veri", d: "Kullanıcı girdisini alıp anlamlı tepki üretme.", out: "Etkileşimli mini uygulama" },
      { t: "3D oyun mekaniği", d: "Oyuncu amacı, kurallar ve geri bildirim döngüsü tasarlama.", out: "Oynanabilir 3D prototip" },
      { t: "Simülasyon ve hata ayıklama", d: "Modeli gözlemleyip hatayı izole etme ve düzeltme.", out: "Test raporu + hata düzeltmeleri" },
      { t: "Geliştirme ve kullanıcı testi", d: "Kullanıcı geri bildirimiyle özelliği iyileştirme.", out: "Revize edilmiş beta ürün" },
      { t: "Final ürün ve demo", d: "Ürünü paketleme, anlatma ve canlı demo yapma.", out: "Çalışan dijital ürün + demo sunumu" }
    ]
  }
];

/* Hafta başına yer tutucu ders videosu (demo medyasından) */
window.AIG_WEEK_MEDIA = [
  { v: "media/ui_typing.mp4", p: "media/poster_ui_typing.jpg" },
  { v: "media/sketch_to_image.mp4", p: "media/poster_sketch_to_image.jpg" },
  { v: "media/sty_vangogh.mp4", p: "media/poster_sty_vangogh.jpg" },
  { v: "media/out_bilim.mp4", p: "media/poster_out_bilim.jpg" },
  { v: "media/tpl_kurum.mp4", p: "media/poster_tpl_kurum.jpg" },
  { v: "media/out_okyanus.mp4", p: "media/poster_out_okyanus.jpg" },
  { v: "media/sty_barok.mp4", p: "media/poster_sty_barok.jpg" },
  { v: "media/tpl_canlanan.mp4", p: "media/poster_tpl_canlanan.jpg" }
];
