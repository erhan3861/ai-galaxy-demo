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
  function toggleSide() { layout.classList.toggle("side-hidden"); }
  $("sideToggle").addEventListener("click", toggleSide);
  $("sideClose").addEventListener("click", toggleSide);
  if (window.innerWidth < 900) layout.classList.add("side-hidden");

  // ================= STÜDYO KATMANI =================
  var sov = $("studioOverlay");
  var sovFeed = $("sovFeed");
  var sovPrompt = $("sovPrompt");
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
    { vid: "media/hero_sty_vangogh.mp4", img: "media/poster_hero_sty_vangogh.jpg" },
    { vid: "media/hero_out_bilim.mp4", img: "media/poster_hero_out_bilim.jpg" },
    { vid: "media/hero_out_okyanus.mp4", img: "media/poster_hero_out_okyanus.jpg" },
    { vid: "media/kids_epik.mp4", img: "media/poster_kids_epik.jpg" }
  ];
  var genIdx = 0;

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

  function openStudio() {
    var wk = prog().weeks[cur.w - 1];
    $("sovTask").textContent = cur.w + ". " + wk.t;
    $("sovCount").textContent = "Patika " + doneList().length + " / 16";
    document.querySelector(".sov-prog i").style.width = Math.max(6, doneList().length / 16 * 100) + "%";
    // soru penceresi içeriği
    $("sqNum").textContent = cur.w;
    $("sqTitle").textContent = wk.t;
    $("sqSub").textContent = prog().title + " · Hafta " + cur.w;
    $("sqText").textContent = wk.d;
    $("sqOut").textContent = wk.out;
    sovPrompt.value = "";
    renderFeed();
    sov.hidden = false;
    document.body.style.overflow = "hidden";
    sovPrompt.focus();
  }
  function closeStudio() {
    if (studioOnly) { location.href = patikaBack; return; }
    sov.hidden = true;
    $("sovQWrap").hidden = true;
    document.body.style.overflow = "";
    // videoları durdur
    sovFeed.querySelectorAll("video").forEach(function (v) { v.pause(); });
  }

  $("btnStudio").addEventListener("click", openStudio);
  if (studioOnly) {
    document.body.classList.add("studio-only");
    var sovDone = $("sovDone");
    if (sovDone) sovDone.addEventListener("click", function () {
      var k = itemKey(cur.w, cur.i);
      if (doneList().indexOf(k) === -1) doneList().push(k);
      save();
      location.href = patikaBack;
    });
    openStudio();
  }
  $("sovClose").addEventListener("click", closeStudio);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !sov.hidden) {
      if (!$("sovQWrap").hidden) $("sovQWrap").hidden = true;
      else closeStudio();
    }
  });

  // üretim simülasyonu
  function generate() {
    var gen = document.createElement("figure");
    gen.className = "sf-tile sf-gen";
    gen.innerHTML = '<div><div class="spin"></div>Üretiliyor...<br><small>' +
      (sovPrompt.value.trim() ? "" : "") + "</small></div>";
    sovFeed.prepend(gen);
    gen.scrollIntoView({ block: "nearest" });
    setTimeout(function () {
      var item = DEMO_GEN[genIdx++ % DEMO_GEN.length];
      var t = feedTile({ vid: item.vid, img: item.img, like: 1 }, true);
      sovFeed.replaceChild(t, gen);
    }, 1400);
    sovPrompt.value = "";
  }
  $("sovSend").addEventListener("click", generate);
  sovPrompt.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); }
  });

  // sekmeler (görsel amaçlı)
  document.querySelectorAll(".sa-tab").forEach(function (t) {
    t.addEventListener("click", function () {
      document.querySelectorAll(".sa-tab").forEach(function (x) { x.classList.remove("on"); });
      t.classList.add("on");
    });
  });

  // soruyu gör
  $("sovQuestion").addEventListener("click", function () { $("sovQWrap").hidden = false; });
  $("sovQClose").addEventListener("click", function () { $("sovQWrap").hidden = true; });
  $("sovQWrap").addEventListener("click", function (e) {
    if (e.target === $("sovQWrap")) $("sovQWrap").hidden = true;
  });

  renderLesson();
})();
