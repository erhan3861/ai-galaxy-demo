/* Galaxy — sade editör simülasyonu (ai-galaxy.app/galaxy yapısı) */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  var FEED = [
    { img: "media/poster_sty_vangogh.jpg", like: 109 },
    { vid: "media/hero_out_okyanus.mp4", img: "media/poster_hero_out_okyanus.jpg", like: 70 },
    { img: "media/poster_tpl_kurum.jpg", like: 70 },
    { img: "media/pos_bina3d.jpg", like: 69 },
    { vid: "media/hero_out_lego.mp4", img: "media/poster_hero_out_lego.jpg", like: 67 },
    { img: "media/poster_sty_popart.jpg", like: 62 },
    { img: "media/img_cikartma.jpg", like: 62 },
    { img: "media/poster_kids_korsan.jpg", like: 60 },
    { vid: "media/hero_out_araba.mp4", img: "media/poster_hero_out_araba.jpg", like: 56 },
    { img: "media/poster_sty_kubist.jpg", like: 55 },
    { img: "media/pos_kagitkesme.jpg", like: 51 },
    { img: "media/poster_sty_barok.jpg", like: 51 },
    { img: "media/img_vlog.jpg", like: 49 },
    { img: "media/poster_kids_epik.jpg", like: 46 },
    { img: "media/poster_hero_out_metro.jpg", like: 45 },
    { img: "media/poster_kids_denizalti.jpg", like: 44 }
  ];
  var GEN = [
    { vid: "media/hero_out_lego.mp4", img: "media/poster_hero_out_lego.jpg" },
    { vid: "media/hero_out_araba.mp4", img: "media/poster_hero_out_araba.jpg" },
    { vid: "media/hero_out_metro.mp4", img: "media/poster_hero_out_metro.jpg" },
    { vid: "media/hero_sty_vangogh.mp4", img: "media/poster_hero_sty_vangogh.jpg" }
  ];
  var MODELS = { Metin: "DeepSeek V4 Flash · Free", "Görsel": "GPT Image 2 · 4 kredi", Ses: "ElevenLabs · 2 kredi", Video: "Veo 3 Fast · 20 kredi" };
  var CHAT = {
    metin: { title: "Metin Geçmişi", w: "Merhaba! Ben AI-LA", s: "Sana nasıl yardımcı olabilirim?", m: "Metin",
      sug: ["Kendi Dünyamı İnşa Et", "Kendi Hikayemin Kahramanı Olmak", "Kendi Video Oyunumu Yapmak İstiyorum", "Zorlandığım Dersi Bir Süper Güce Dönüştür"], hist: [] },
    gorsel: { title: "Görsel Geçmişi", w: "Görsel Yaratalım!", s: "Hayal ettiğini tarif et, birlikte çizelim", m: "Görsel",
      sug: ["Sinematik Film Afişi", "Animasyon ve Hayal Gücü", "Sosyal Hayat ve Gündelik", "Hobiler ve Teknoloji"],
      hist: ["A 3D animated character portrait in the style of…", "A photorealistic cinematic portrait of a real hu…", "Place the character from the uploaded image i…", "Yağmurlu bir İstanbul gecesinde neon ışıklar…"] },
    ses: { title: "Ses Geçmişi", w: "Sesini Duyalım!", s: "Metinden gerçekçi sesler oluşturalım", m: "Ses",
      sug: ["Kendi Hit Şarkımı Bestele", "Film Stüdyomu Kur", "Ders Çalışma Müziği Üret!", "Hayallerimi Konuştur"], hist: [] },
    video: { title: "Video Geçmişi", w: "Videonu Canlandıralım!", s: "Bir sahneyi tarif et, hareketlendirelim", m: "Video",
      sug: ["Sinematik Kısa Sahne", "Ürün Tanıtım Videosu", "Karakterimi Hareket Ettir", "Zaman Yolculuğu Sahnesi"],
      hist: ["A cinematic, highly detailed, photorealistic 8k vi…", "Young scientist kid inside a futuristic glowing la…", "Energetic kid suddenly discovering they ha…"] }
  };
  var gi = 0;

  function tile(it, extra) {
    var f = document.createElement("figure");
    f.className = "gx-tile";
    if (it.vid) {
      var v = document.createElement("video");
      v.muted = true; v.loop = true; v.playsInline = true; v.src = it.vid; v.poster = it.img;
      v.play().catch(function () {});
      f.appendChild(v);
    } else {
      var im = document.createElement("img");
      im.src = it.img; im.alt = ""; im.loading = "lazy";
      f.appendChild(im);
    }
    if (extra === "col") f.insertAdjacentHTML("beforeend", '<span class="gx-tag">✓ Keşfette</span>');
    else f.insertAdjacentHTML("beforeend", '<span class="gx-like"><svg class="ic"><use href="#i-heart"/></svg> ' + (it.like || 1) + "</span>");
    if (extra === "new") f.insertAdjacentHTML("beforeend", '<span class="gx-new">✓ AI ile üretildi · senin</span>');
    return f;
  }

  // keşfet akışı
  var feed = $("gxFeed");
  FEED.forEach(function (it) { feed.appendChild(tile(it)); });
  // koleksiyon
  var col = $("gxCol");
  FEED.slice(0, 12).forEach(function (it) { col.appendChild(tile(it, "col")); });

  // mod sekmeleri
  document.querySelectorAll(".gx-mode").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".gx-mode").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
      $("gxModel").textContent = MODELS[b.dataset.m];
    });
  });

  // keşfetten üret
  function generate() {
    var g = document.createElement("figure");
    g.className = "gx-tile gx-gen";
    g.innerHTML = '<div><div class="gx-spin"></div>Üretiliyor…</div>';
    feed.prepend(g);
    feed.scrollIntoView({ block: "start", behavior: "smooth" });
    setTimeout(function () { feed.replaceChild(tile(GEN[gi++ % GEN.length], "new"), g); }, 1400);
    $("gxPrompt").value = "";
  }
  $("gxSend").addEventListener("click", generate);
  $("gxPrompt").addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); } });

  // sol ray: görünümler
  var curChat = null;
  function show(view) {
    document.querySelectorAll(".gx-r").forEach(function (r) { r.classList.toggle("on", r.dataset.view === view); });
    $("v-kesfet").hidden = view !== "kesfet";
    $("v-koleksiyon").hidden = view !== "koleksiyon";
    var isChat = !!CHAT[view];
    $("v-sohbet").hidden = !isChat;
    document.querySelectorAll(".gx-view video").forEach(function (v) { v.pause(); });
    if (view === "kesfet") feed.querySelectorAll("video").forEach(function (v) { v.play().catch(function () {}); });
    if (isChat) openChat(view);
  }
  function openChat(k) {
    curChat = k;
    var c = CHAT[k];
    $("ghTitle").textContent = c.title;
    $("ghCount").textContent = c.hist.length + " sohbet";
    var list = $("ghList");
    list.innerHTML = c.hist.length ? "" : '<p class="gh-empty">Henüz sohbet yok<br>Yeni bir sohbet başlatarak AI ile konuşmaya başla!</p>';
    c.hist.forEach(function (h) { var a = document.createElement("a"); a.className = "gh-item"; a.href = "#"; a.textContent = h; list.appendChild(a); });
    $("gwTitle").textContent = c.w;
    $("gwSub").textContent = c.s;
    $("gxChatModel").textContent = MODELS[c.m];
    var sugs = $("gwSugs");
    sugs.innerHTML = "";
    c.sug.forEach(function (s) {
      var b = document.createElement("button");
      b.className = "gw-sug"; b.textContent = s;
      b.addEventListener("click", function () { $("gxChatIn").value = s; send(); });
      sugs.appendChild(b);
    });
    $("gxWelcome").hidden = false;
    $("gxThread").hidden = true;
    $("gxThread").innerHTML = "";
  }
  function send() {
    var inp = $("gxChatIn"), t = inp.value.trim();
    if (!t) return;
    var th = $("gxThread");
    $("gxWelcome").hidden = true; th.hidden = false;
    var me = document.createElement("div"); me.className = "gx-msg me"; me.textContent = t; th.appendChild(me);
    var ai = document.createElement("div"); ai.className = "gx-msg ai"; ai.innerHTML = '<div class="gx-spin"></div>'; th.appendChild(ai);
    inp.value = "";
    setTimeout(function () {
      var c = CHAT[curChat];
      if (c.m === "Metin") {
        ai.textContent = "Harika bir başlangıç! Amacını, hedef kitleni ve istediğin çıktı biçimini de yazarsan cevabımı tam ihtiyacına göre kurarım.";
      } else if (c.m === "Ses") {
        ai.innerHTML = "Sesin hazır ✓<br><small>Demo: gerçek üretim uygulamada yapılır.</small>";
      } else {
        var g = GEN[gi++ % GEN.length];
        ai.innerHTML = c.m === "Video" ? "Videon hazır ✓" : "Görselin hazır ✓";
        var v = document.createElement("video");
        v.muted = true; v.loop = true; v.playsInline = true; v.src = g.vid; v.poster = g.img;
        v.play().catch(function () {});
        ai.appendChild(v);
      }
      th.scrollTop = th.scrollHeight;
    }, 1200);
  }
  $("gxChatSend").addEventListener("click", send);
  $("gxChatIn").addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });

  document.querySelectorAll(".gx-r").forEach(function (r) { r.addEventListener("click", function () { show(r.dataset.view); }); });
  document.querySelectorAll(".gx-seg").forEach(function (seg) {
    seg.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      seg.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
    });
  });

  var start = new URLSearchParams(location.search).get("v");
  if (start && (CHAT[start] || start === "koleksiyon")) show(start);
})();
