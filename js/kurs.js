/* AI-GALAXY kurs ekranı: müfredat, ilerleme, kaldığın yerden devam */
(function () {
  "use strict";

  var PROGRAMS = window.AIG_PROGRAMS || [];
  var MEDIA = window.AIG_WEEK_MEDIA || [];
  if (!PROGRAMS.length) return;

  // ---------- durum ----------
  var KEY = "aig_kurs";
  var state = { last: null, progs: {}, notes: {} };
  try {
    var raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (raw && typeof raw === "object") state = Object.assign(state, raw);
  } catch (e) {}
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  // ---------- konum: url > kaldığın yer > baştan ----------
  var params = new URLSearchParams(location.search);
  var cur = {
    p: parseInt(params.get("p"), 10),
    w: parseInt(params.get("w"), 10),
    i: params.get("i") === "a" ? "a" : "v"
  };
  if (isNaN(cur.p) || !PROGRAMS[cur.p]) {
    if (state.last && PROGRAMS[state.last.p]) cur = Object.assign({}, state.last);
    else cur = { p: 0, w: 1, i: "v" };
  }
  if (isNaN(cur.w) || cur.w < 1 || cur.w > 8) cur.w = 1;

  // kids modu: yalnızca kids sayfasından açık parametreyle gelindiyse
  // ya da parametresiz "kaldığın yerden devam"da son oturum kids ise
  var kidsMode = params.get("kids") === "1" ||
    (params.get("p") === null && !!(state.last && state.last.kids));
  // stüdyo modu: patikadaki adımdan gelindiğinde doğrudan stüdyo ekranı açılır
  var studioOnly = params.get("studio") === "1";
  var patikaBack = "kids/patika.html?p=" + cur.p;
  if (!kidsMode) {
    var aBackTop = document.querySelector(".ktop-back");
    var aBackFoot = document.querySelector(".kside-foot a");
    if (aBackTop) aBackTop.href = patikaBack.replace("kids/", "");
    if (aBackFoot) { aBackFoot.href = patikaBack.replace("kids/", ""); aBackFoot.textContent = "← Patikaya dön"; }
  }
  if (kidsMode) {
    var backTop = document.querySelector(".ktop-back");
    var backFoot = document.querySelector(".kside-foot a");
    var patikaUrl = patikaBack;
    if (backTop) backTop.href = patikaUrl;
    if (backFoot) { backFoot.href = patikaUrl; backFoot.textContent = "← Patikaya dön"; }
  }

  // ---------- elemanlar ----------
  var $ = function (id) { return document.getElementById(id); };
  var layout = $("klayout"), curric = $("curriculum");
  var courseTitle = $("courseTitle"), progressBar = $("progressBar"), progressText = $("progressText");
  var playerWrap = $("playerWrap"), lessonVid = $("lessonVid");
  var activityWrap = $("activityWrap"), actTitle = $("actTitle"), actDesc = $("actDesc"), actOut = $("actOut");
  var lessonWeek = $("lessonWeek"), lessonTitle = $("lessonTitle");
  var btnDone = $("btnDone");

  function prog() { return PROGRAMS[cur.p]; }
  function doneList() {
    if (!state.progs[cur.p]) state.progs[cur.p] = { done: [] };
    return state.progs[cur.p].done;
  }
  function itemKey(w, i) { return w + i; }
  function isDone(w, i) { return doneList().indexOf(itemKey(w, i)) !== -1; }

  // ---------- müfredat (sağ menü) ----------
  function renderCurriculum() {
    curric.innerHTML = "";
    prog().weeks.forEach(function (wk, idx) {
      var w = idx + 1;
      var g = document.createElement("div");
      g.className = "cw-group" + (w === cur.w ? " open" : "");
      var dv = isDone(w, "v"), da = isDone(w, "a");
      g.innerHTML =
        '<button class="cw-head"><span class="no">' + w + '</span>' +
        '<span class="t"></span><span class="st">' + ((dv ? 1 : 0) + (da ? 1 : 0)) + "/2</span>" +
        '<span class="chev">▶</span></button>' +
        '<div class="cw-items">' +
        '<button class="cw-item" data-w="' + w + '" data-i="v"><span class="chk">✓</span><svg class="ic"><use href="#i-play"/></svg> Ders videosu<span class="len">8 dk</span></button>' +
        '<button class="cw-item" data-w="' + w + '" data-i="a"><span class="chk">✓</span><svg class="ic"><use href="#i-tool"/></svg> Uygulama etkinliği<span class="len">55 dk</span></button>' +
        "</div>";
      g.querySelector(".t").textContent = "Hafta " + w + " · " + wk.t;
      var items = g.querySelectorAll(".cw-item");
      if (dv) items[0].classList.add("done");
      if (da) items[1].classList.add("done");
      if (w === cur.w) items[cur.i === "v" ? 0 : 1].classList.add("active");
      g.querySelector(".cw-head").addEventListener("click", function () {
        g.classList.toggle("open");
      });
      items.forEach(function (btn) {
        btn.addEventListener("click", function () {
          cur.w = parseInt(btn.dataset.w, 10);
          cur.i = btn.dataset.i;
          renderLesson();
          setSide(false);
        });
      });
      curric.appendChild(g);
    });
  }

  // ---------- ilerleme ----------
  function renderProgress() {
    var pct = Math.round(doneList().length / 16 * 100);
    progressBar.style.width = pct + "%";
    progressText.textContent = "%" + pct + " tamamlandı";
  }

  // ---------- ders ----------
  function renderLesson() {
    var wk = prog().weeks[cur.w - 1];
    courseTitle.textContent = prog().title;
    document.title = prog().title + " · Hafta " + cur.w + " — AI-GALAXY";
    lessonWeek.textContent = "Hafta " + cur.w + " / 8 · " + (cur.i === "v" ? "Ders videosu" : "Uygulama etkinliği");
    lessonTitle.textContent = wk.t;

    if (cur.i === "v") {
      playerWrap.hidden = false;
      activityWrap.hidden = true;
      var m = MEDIA[(cur.w - 1) % MEDIA.length];
      lessonVid.src = m.v;
      lessonVid.poster = m.p;
      lessonVid.loop = true;
    } else {
      lessonVid.pause();
      playerWrap.hidden = true;
      activityWrap.hidden = false;
      actTitle.textContent = wk.t;
      actDesc.textContent = wk.d;
      actOut.textContent = wk.out;
    }

    var done = isDone(cur.w, cur.i);
    btnDone.classList.toggle("done", done);
    btnDone.textContent = done ? "✓ Tamamlandı" : "✓ Tamamla ve ilerle";

    // kaldığın yeri kaydet
    state.last = { p: cur.p, w: cur.w, i: cur.i, kids: kidsMode };
    save();

    // url'i sessizce güncelle
    try {
      history.replaceState(null, "", "kurs.html?p=" + cur.p + "&w=" + cur.w + "&i=" + cur.i + (kidsMode ? "&kids=1" : "") + (studioOnly ? "&studio=1" : ""));
    } catch (e) {}

    renderCurriculum();
    renderProgress();
    window.scrollTo({ top: 0 });
  }

  // ---------- tamamla ve ilerle ----------
  btnDone.addEventListener("click", function () {
    var k = itemKey(cur.w, cur.i);
    if (doneList().indexOf(k) === -1) doneList().push(k);
    // sıradaki içerik: video → etkinlik → sonraki hafta
    if (cur.i === "v") cur.i = "a";
    else if (cur.w < 8) { cur.w++; cur.i = "v"; }
    save();
    renderLesson();
  });

  // ---------- sağ menü aç/kapat ----------
  var shade = $("ksideShade");
  function setSide(open) {
    layout.classList.toggle("side-hidden", !open);
    if (shade) shade.hidden = !open;
  }
  function toggleSide() { setSide(layout.classList.contains("side-hidden")); }
  $("sideToggle").addEventListener("click", toggleSide);
  $("sideClose").addEventListener("click", function () { setSide(false); });
  if (shade) shade.addEventListener("click", function () { setSide(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !layout.classList.contains("side-hidden")) setSide(false);
  });
  setSide(false); // çekmece varsayılan olarak kapalı

  // ================= STÜDYO KATMANI (AI-GALAXY adım ekranı) =================
  var sov = $("studioOverlay");
  var sovFeed = $("sovFeed");
  var sovPrompt = $("sovPrompt");
  var backBase = kidsMode ? "kids/patika.html?p=" : "patika.html?p=";
  var DEMO_FEED = [
    { img: "media/poster_sty_vangogh.jpg", like: 106 },
    { vid: "media/hero_out_okyanus.mp4", img: "media/poster_hero_out_okyanus.jpg", like: 98 },
    { img: "media/poster_sty_popart.jpg", like: 91 },
    { img: "media/img_cikartma.jpg", like: 88 },
    { vid: "media/hero_out_bilim.mp4", img: "media/poster_hero_out_bilim.jpg", like: 84 },
    { img: "media/poster_sty_kubist.jpg", like: 77 },
    { img: "media/poster_kids_korsan.jpg", like: 74 },
    { img: "media/poster_sty_barok.jpg", like: 69 },
    { img: "media/pos_kagitkesme.jpg", like: 66 },
    { img: "media/poster_tpl_kurum.jpg", like: 61 },
    { img: "media/img_vlog.jpg", like: 58 },
    { img: "media/pos_bina3d.jpg", like: 55 }
  ];
  var DEMO_GEN = [
    { vid: "media/hero_out_lego.mp4", img: "media/poster_hero_out_lego.jpg" },
    { vid: "media/hero_out_araba.mp4", img: "media/poster_hero_out_araba.jpg" },
    { vid: "media/hero_out_okyanus.mp4", img: "media/poster_hero_out_okyanus.jpg" },
    { vid: "media/kids_epik.mp4", img: "media/poster_kids_epik.jpg" }
  ];
  // her haftanın "şifre avı" kelimesi (demo)
  var FLAGS = ["PROMPT", "NET", "BAGLAM", "STUDYO", "KARAKTER", "HABER", "SES", "FORMAT"];
  var PUAN = 5;
  var genIdx = 0;

  function allSteps() {
    var list = [];
    prog().weeks.forEach(function (wk, wi) {
      list.push({ w: wi + 1, i: "v", tur: "Ders", t: wk.t });
      list.push({ w: wi + 1, i: "a", tur: "Alıştırma", t: wk.t });
    });
    return list;
  }
  function stepIndex(w, i) { return (w - 1) * 2 + (i === "a" ? 1 : 0); }
  function firstOpenIndex() {
    var s = allSteps();
    for (var k = 0; k < s.length; k++) if (!isDone(s[k].w, s[k].i)) return k;
    return s.length;
  }
  function flagFor(w, i) { return FLAGS[(w - 1) % FLAGS.length] + (i === "a" ? "2" : ""); }
  function norm(t) {
    return String(t || "").replace(/[İı]/g, "I").toUpperCase().replace(/[^A-Z0-9]/g, "");
  }

  function feedTile(item, isNew) {
    var t = document.createElement("figure");
    t.className = "sf-tile";
    if (item.vid) {
      t.innerHTML = '<video muted loop playsinline></video>';
      var v = t.querySelector("video");
      v.src = item.vid; v.poster = item.img;
      v.play().catch(function () {});
    } else {
      var im = document.createElement("img");
      im.src = item.img; im.alt = "";
      t.appendChild(im);
    }
    var like = document.createElement("span");
    like.className = "sf-like";
    like.textContent = "♥ " + (item.like || 1);
    t.appendChild(like);
    if (isNew) {
      var n = document.createElement("span");
      n.className = "sf-new";
      n.textContent = "✓ AI ile üretildi · senin";
      t.appendChild(n);
    }
    return t;
  }
  function renderFeed() {
    sovFeed.innerHTML = "";
    DEMO_FEED.forEach(function (it) { sovFeed.appendChild(feedTile(it)); });
  }

  // ---------- tutorial slaytları ----------
  var slides = [], slideIdx = 0, speed = 1;
  function buildSlides() {
    var wk = prog().weeks[cur.w - 1];
    var m = MEDIA[(cur.w - 1) % MEDIA.length] || {};
    var g = DEMO_GEN[(cur.w - 1) % DEMO_GEN.length];
    slides = [
      { img: "media/ai_galaxy_clean_image.jpg", cap: wk.d },
      { vid: m.v, poster: m.p, cap: "Örnek: bu haftanın tekniği editörde böyle uygulanır." },
      { vid: g.vid, poster: g.img, cap: "Hedef çıktı: " + wk.out },
      { flag: flagFor(cur.w, cur.i), cap: "Şifreyi aşağıya yaz, adımı tamamla." }
    ];
    slideIdx = 0;
  }
  function renderSlide() {
    var s = slides[slideIdx];
    var box = $("tutMedia");
    box.innerHTML = "";
    if (s.flag) {
      box.innerHTML = '<div class="tut-flagbox"><div><small>Bu dersin şifresi</small><b></b></div></div>';
      box.querySelector("b").textContent = s.flag;
    } else if (s.vid) {
      var v = document.createElement("video");
      v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
      v.src = s.vid; if (s.poster) v.poster = s.poster;
      box.appendChild(v);
      v.playbackRate = speed;
      v.play().catch(function () {});
    } else {
      var im = document.createElement("img");
      im.src = s.img; im.alt = "";
      box.appendChild(im);
    }
    $("tutCap").textContent = s.cap;
    $("tutPage").textContent = (slideIdx + 1) + " / " + slides.length;
    $("tutLine").style.width = ((slideIdx + 1) / slides.length * 100) + "%";
    $("tutPrev").disabled = slideIdx === 0;
    $("tutNext").disabled = slideIdx === slides.length - 1;
  }
  $("tutPrev").addEventListener("click", function () { if (slideIdx > 0) { slideIdx--; renderSlide(); } });
  $("tutNext").addEventListener("click", function () { if (slideIdx < slides.length - 1) { slideIdx++; renderSlide(); } });
  $("tutSpeed").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    $("tutSpeed").querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); });
    b.classList.add("on");
    speed = parseFloat(b.dataset.r) || 1;
    var v = $("tutMedia").querySelector("video");
    if (v) v.playbackRate = speed;
  });
  document.querySelectorAll(".tut-tab").forEach(function (t) {
    t.addEventListener("click", function () {
      document.querySelectorAll(".tut-tab").forEach(function (x) { x.classList.remove("on"); });
      t.classList.add("on");
      var ipucu = t.dataset.tab === "ipucu";
      $("tutSoru").hidden = ipucu;
      $("tutIpucu").hidden = !ipucu;
    });
  });

  // ---------- Öğrenme Yolculuğu çekmecesi ----------
  var journey = $("sovJourney"), jShade = $("sjShade"), jBtn = $("sovJourneyBtn");
  function setJourney(open) {
    journey.classList.toggle("open", open);
    jShade.hidden = !open;
    jBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  jBtn.addEventListener("click", function () { setJourney(!journey.classList.contains("open")); });
  $("sjClose").addEventListener("click", function () { setJourney(false); });
  jShade.addEventListener("click", function () { setJourney(false); });

  function renderJourney() {
    var list = $("sjList");
    var steps = allSteps();
    var open = firstOpenIndex();
    $("sjTitle").textContent = prog().title;
    $("sjBar").style.width = (doneList().length / 16 * 100) + "%";
    list.innerHTML = "";
    prog().weeks.forEach(function (wk, wi) {
      var w = wi + 1;
      var grp = document.createElement("div");
      grp.className = "sj-week" + (w === cur.w ? " open" : "");
      var dn = (isDone(w, "v") ? 1 : 0) + (isDone(w, "a") ? 1 : 0);
      grp.innerHTML = '<button class="sj-whead"><span class="sj-wno">' + w + '</span><span class="sj-wt"></span>' +
        '<span class="sj-wst">' + dn + '/2</span><span class="sj-chev">▶</span></button><div class="sj-steps"></div>';
      grp.querySelector(".sj-wt").textContent = wk.t;
      grp.querySelector(".sj-whead").addEventListener("click", function () { grp.classList.toggle("open"); });
      var box = grp.querySelector(".sj-steps");
      ["v", "a"].forEach(function (i) {
        var idx = stepIndex(w, i);
        var done = isDone(w, i);
        var isCur = w === cur.w && i === cur.i;
        var locked = !done && idx > open;
        var b = document.createElement("button");
        b.className = "sj-step" + (done ? " done" : "") + (isCur ? " cur" : "");
        b.disabled = locked && !isCur;
        b.innerHTML = '<span class="sj-dot"><svg class="ic"><use href="#i-' + (done ? "check" : locked ? "lock" : "play") + '"/></svg></span>' +
          '<span></span><small>+' + PUAN + '</small>';
        b.querySelector("span:nth-child(2)").textContent = (idx + 1) + ". " + (i === "v" ? "Ders" : "Alıştırma");
        b.addEventListener("click", function () { goStep(w, i); setJourney(false); });
        box.appendChild(b);
      });
      list.appendChild(grp);
    });
  }

  function goStep(w, i) {
    cur.w = w; cur.i = i;
    renderLesson();          // url + kaldığın yer güncellenir
    openStudio();
  }

  function toast(msg) {
    var t = document.querySelector(".sov-toast");
    if (!t) { t = document.createElement("div"); t.className = "sov-toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove("on"); }, 1800);
  }

  function openStudio() {
    var wk = prog().weeks[cur.w - 1];
    var idx = stepIndex(cur.w, cur.i);
    var d = doneList().length;
    $("sovTask").textContent = (idx + 1) + ". " + wk.t + (cur.i === "a" ? " — alıştırma" : "");
    $("sovCount").textContent = "Patika " + d + " / 16";
    document.querySelector(".sov-prog i").style.width = Math.max(4, d / 16 * 100) + "%";
    $("sqNum").textContent = idx + 1;
    $("sqTitle").textContent = wk.t;
    $("sqSub").textContent = prog().title + " · " + (cur.i === "v" ? "Ders " : "Alıştırma ") + cur.w;
    $("sqText").textContent = wk.d;
    $("sqOut").textContent = wk.out;
    $("tutFlagIn").value = "";
    $("tutMsg").textContent = ""; $("tutMsg").className = "tut-msg";
    buildSlides(); renderSlide();
    renderJourney();
    if (!sovFeed.children.length) renderFeed();
    sovPrompt.value = "";
    sov.hidden = false;
    // tutorial penceresi kapalı başlar; "Soruyu Gör" ile açılır
    $("sovQWrap").hidden = true;
    $("sovQuestion").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeStudio() {
    if (studioOnly) { location.href = backBase + cur.p; return; }
    sov.hidden = true;
    setJourney(false);
    document.body.style.overflow = "";
    sov.querySelectorAll("video").forEach(function (v) { v.pause(); });
    renderLesson();
  }

  // şifre gönderimi → adımı tamamla, sıradakine geç
  $("tutFlag").addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = $("tutMsg");
    var val = norm($("tutFlagIn").value);
    if (!val) { msg.textContent = "Önce şifreyi yaz."; msg.className = "tut-msg err"; return; }
    if (val !== norm(flagFor(cur.w, cur.i))) {
      msg.textContent = "Şifre tutmadı — İpucu sekmesine ya da son slayta bak.";
      msg.className = "tut-msg err";
      var f = $("tutFlag"); f.classList.remove("shake"); void f.offsetWidth; f.classList.add("shake");
      return;
    }
    var k = itemKey(cur.w, cur.i);
    if (doneList().indexOf(k) === -1) doneList().push(k);
    save();
    toast("+" + PUAN + " puan · adım tamamlandı");
    var s = allSteps(), n = stepIndex(cur.w, cur.i) + 1;
    setTimeout(function () {
      if (n < s.length) goStep(s[n].w, s[n].i);
      else location.href = backBase + cur.p;
    }, 700);
  });

  $("btnStudio").addEventListener("click", openStudio);
  $("sovClose").addEventListener("click", closeStudio);
  if (studioOnly) {
    document.body.classList.add("studio-only");
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || sov.hidden) return;
    if (journey.classList.contains("open")) setJourney(false);
    else if (!$("sovQWrap").hidden) { $("sovQWrap").hidden = true; $("sovQuestion").hidden = false; }
    else closeStudio();
  });

  // üretim simülasyonu
  function generate() {
    var gen = document.createElement("figure");
    gen.className = "sf-tile sf-gen";
    gen.innerHTML = '<div><div class="spin"></div>Üretiliyor...</div>';
    sovFeed.prepend(gen);
    gen.scrollIntoView({ block: "nearest" });
    setTimeout(function () {
      var item = DEMO_GEN[genIdx++ % DEMO_GEN.length];
      sovFeed.replaceChild(feedTile({ vid: item.vid, img: item.img, like: 1 }, true), gen);
    }, 1400);
    sovPrompt.value = "";
  }
  $("sovSend").addEventListener("click", generate);
  sovPrompt.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); }
  });
  document.querySelectorAll(".sa-tab").forEach(function (t) {
    t.addEventListener("click", function () {
      document.querySelectorAll(".sa-tab").forEach(function (x) { x.classList.remove("on"); });
      t.classList.add("on");
    });
  });

  // tutorial penceresi: küçült / aç
  $("sovQuestion").addEventListener("click", function () { $("sovQWrap").hidden = false; $("sovQuestion").hidden = true; });
  $("sovQClose").addEventListener("click", function () { $("sovQWrap").hidden = true; $("sovQuestion").hidden = false; });

  renderLesson();
  if (studioOnly) openStudio();
})();
