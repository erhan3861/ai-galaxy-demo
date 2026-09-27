/* Şablonlar — ai-galaxy.app/sablonlar yapısı */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var CATS = ["Tümü", "Viral", "Social Media", "E-commerce", "Marketing & Tech", "Fashion", "Personal Branding", "Decoration", "Business", "AI Avatar", "Life", "Art", "Pop Culture"];
  var TPL = [
    { t: "Kâğıt Kesme Efekti", d: "Fotoğrafını fiziksel kâğıt kolaj görünümünde hareketli bir animasyona dönüştür.", c: "Viral", k: 150, img: "media/pos_kagitkesme.jpg" },
    { t: "Canlanan Nesneler", d: "Videondaki seçtiğin nesneye göz, ağız ve kişilik ver.", c: "Viral", k: 150, vid: "media/tpl_canlanan.mp4", img: "media/poster_tpl_canlanan.jpg" },
    { t: "Kurumsal Tanıtım", d: "Okulunu ya da markanı sinematik bir tanıtım filmine çevir.", c: "Business", k: 200, vid: "media/tpl_kurum.mp4", img: "media/poster_tpl_kurum.jpg" },
    { t: "3D Mimari Canlandırma", d: "Bina fotoğrafını üç boyutlu, hareketli bir sunuma dönüştür.", c: "Decoration", k: 180, img: "media/pos_bina3d.jpg" },
    { t: "Van Gogh Portresi", d: "Portreni yıldızlı gece fırça dokusuyla yeniden çiz.", c: "Art", k: 60, vid: "media/sty_vangogh.mp4", img: "media/poster_sty_vangogh.jpg" },
    { t: "Barok Işık", d: "Fotoğrafına klasik tablo ışığı ve kompozisyonu ekle.", c: "Art", k: 60, vid: "media/sty_barok.mp4", img: "media/poster_sty_barok.jpg" },
    { t: "Pop Art Poster", d: "Kendini canlı renkli bir pop art posterine taşı.", c: "Pop Culture", k: 60, vid: "media/sty_popart.mp4", img: "media/poster_sty_popart.jpg" },
    { t: "Kübist Biçim", d: "Yüz hatlarını geometrik kübist bir kompozisyona böl.", c: "Art", k: 60, vid: "media/sty_kubist.mp4", img: "media/poster_sty_kubist.jpg" },
    { t: "Çıkartma Seti", d: "Karakterinden duygu çıkartmaları paketi üret.", c: "Social Media", k: 80, img: "media/img_cikartma.jpg" },
    { t: "Vlog Kapağı", d: "Videon için dikkat çekici bir vlog kapağı tasarla.", c: "Personal Branding", k: 40, img: "media/img_vlog.jpg" },
    { t: "3D Karakter", d: "Kendi 3D animasyon karakterini oluştur.", c: "AI Avatar", k: 90, img: "media/img_karakter3d.jpg" },
    { t: "Film Evreni", d: "Sahneni sinematik bir film karesine dönüştür.", c: "Viral", k: 150, vid: "media/hero_out_metro.mp4", img: "media/poster_hero_out_metro.jpg" },
    { t: "Lego Dünyası", d: "Şehrini ya da sahneni lego bloklarından yeniden kur.", c: "Life", k: 150, vid: "media/hero_out_lego.mp4", img: "media/poster_hero_out_lego.jpg" },
    { t: "Retro Reklam", d: "Ürününü 80'ler reklam filmi estetiğinde canlandır.", c: "Marketing & Tech", k: 150, vid: "media/hero_out_araba.mp4", img: "media/poster_hero_out_araba.jpg" },
    { t: "Okyanus Keşfi", d: "Çocuk karakterini renkli bir mercan dünyasına götür.", c: "Life", k: 120, vid: "media/hero_out_okyanus.mp4", img: "media/poster_hero_out_okyanus.jpg" },
    { t: "Moda Çizimi", d: "Kıyafet fotoğrafını moda illüstrasyonuna çevir.", c: "Fashion", k: 60, img: "media/poster_kids_epik.jpg" }
  ];
  var cat = "Tümü", q = "", mine = false;
  var SAVED = [1, 4, 12];

  var cats = $("tpCats");
  CATS.forEach(function (c, i) {
    var b = document.createElement("button");
    b.className = "tp-cat" + (i === 0 ? " on" : "");
    b.textContent = c;
    b.addEventListener("click", function () {
      cats.querySelectorAll(".tp-cat").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on"); cat = c; render();
    });
    cats.appendChild(b);
  });

  function card(t, i) {
    var a = document.createElement("button");
    a.className = "tp-card";
    a.innerHTML = '<span class="tp-media"></span><span class="tp-badge">STANDART</span>' +
      '<span class="tp-body"><b></b><span class="tp-desc"></span>' +
      '<span class="tp-foot"><span class="tp-catlbl"></span><span class="tp-cost">' + t.k + " kredi →</span></span></span>";
    a.querySelector("b").textContent = t.t;
    a.querySelector(".tp-desc").textContent = t.d;
    a.querySelector(".tp-catlbl").textContent = t.c;
    var m = a.querySelector(".tp-media");
    var im = document.createElement("img"); im.src = t.img; im.alt = ""; im.loading = "lazy"; m.appendChild(im);
    if (t.vid) {
      var v = document.createElement("video");
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = "none"; v.src = t.vid;
      m.appendChild(v);
      a.addEventListener("mouseenter", function () { v.play().catch(function () {}); a.classList.add("playing"); });
      a.addEventListener("mouseleave", function () { v.pause(); a.classList.remove("playing"); });
    }
    a.addEventListener("click", function () { openTpl(t); });
    return a;
  }

  function render() {
    var g = $("tpGrid"); g.innerHTML = "";
    var qq = q.toLocaleLowerCase("tr").trim(), n = 0;
    TPL.forEach(function (t, i) {
      if (mine && SAVED.indexOf(i) === -1) return;
      if (cat !== "Tümü" && t.c !== cat) return;
      if (qq && (t.t + " " + t.d + " " + t.c).toLocaleLowerCase("tr").indexOf(qq) === -1) return;
      g.appendChild(card(t, i)); n++;
    });
    if (!n) g.innerHTML = '<p class="p-empty">Bu filtreye uyan şablon yok.</p>';
  }

  $("tpSearch").addEventListener("input", function (e) { q = e.target.value; render(); });
  document.querySelectorAll(".tp-seg button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".tp-seg button").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on"); mine = b.dataset.s === "mine"; render();
    });
  });

  // detay penceresi
  var modal = $("tpModal");
  function openTpl(t) {
    $("tpmTitle").textContent = t.t;
    $("tpmDesc").textContent = t.d;
    $("tpmCost").textContent = t.k;
    $("tpMsg").textContent = "";
    var m = $("tpmMedia"); m.innerHTML = "";
    if (t.vid) {
      var v = document.createElement("video");
      v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.src = t.vid; v.poster = t.img;
      m.appendChild(v); v.play().catch(function () {});
    } else { var im = document.createElement("img"); im.src = t.img; im.alt = ""; m.appendChild(im); }
    modal.hidden = false; document.body.style.overflow = "hidden";
  }
  function close() { modal.hidden = true; document.body.style.overflow = ""; var v = modal.querySelector("video"); if (v) v.pause(); }
  $("tpX").addEventListener("click", close);
  modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) close(); });
  $("tpGo").addEventListener("click", function () {
    $("tpMsg").textContent = "Üretim kuyruğa alındı ✓ — sonuç Galaxy > Koleksiyon'a düşecek (demo).";
  });

  render();
})();
