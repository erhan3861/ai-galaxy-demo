/* AI-GALAXY demo — etkileşimler */
(function () {
  "use strict";

  // Nav: scroll gölgesi
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobil menü
  var burger = document.getElementById("burger");
  var links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal animasyonları
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          ro.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { ro.observe(el); });
    window.AIG_REVEAL = function () {
      document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { ro.observe(el); });
    };
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
    window.AIG_REVEAL = function () {
      document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { el.classList.add("in"); });
    };
  }

  // Videolar: görünürken oynat, görünmeyince durdur (performans)
  var autoVids = document.querySelectorAll("video[data-autoplay]");
  if ("IntersectionObserver" in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting && !reduced) {
          v.play().catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    autoVids.forEach(function (v) { vo.observe(v); });
  }

  // Hover'da oynayan videolar (şablon kartları)
  document.querySelectorAll("video[data-hoverplay]").forEach(function (v) {
    var card = v.closest(".tpl-card") || v;
    card.addEventListener("mouseenter", function () {
      if (!reduced) v.play().catch(function () {});
    });
    card.addEventListener("mouseleave", function () {
      v.pause();
      v.currentTime = 0;
    });
  });

  // ---------- Program: patikalar ve haftalık içerik ----------
  var PROGRAMS = window.AIG_PROGRAMS || [];

  var PATIKA_META = [
    { ico: "i-sparkle", thumb: "media/poster_sty_vangogh.jpg", puan: 100 },
    { ico: "i-layers", thumb: "media/poster_out_okyanus.jpg", puan: 100 },
    { ico: "i-film", thumb: "media/poster_tpl_kurum.jpg", puan: 100 },
    { ico: "i-zap", thumb: "media/pos_bina3d.jpg", puan: 100 }
  ];

  function kursState() {
    try { return JSON.parse(localStorage.getItem("aig_kurs") || "null") || {}; } catch (e) { return {}; }
  }
  function doneCount(st, i) {
    return ((st.progs && st.progs[i] && st.progs[i].done) || []).length;
  }

  function renderPatikalar() {
    var grid = document.getElementById("patikaGrid");
    if (!grid || !PROGRAMS.length) return;
    var st = kursState();
    var member = !!(window.AIG_AUTH && window.AIG_AUTH.user());
    grid.innerHTML = "";
    PROGRAMS.forEach(function (prg, i) {
      var meta = PATIKA_META[i] || PATIKA_META[0];
      var done = doneCount(st, i);
      var pct = Math.round(done / 16 * 100);
      var a = document.createElement("a");
      a.className = "pcard reveal";
      a.dataset.lvl = prg.level;
      a.href = "patika.html?p=" + i;
      a.innerHTML =
        '<span class="pc-bg" style="background-image:url(' + meta.thumb + ')"></span>' +
        '<span class="pc-head">' +
          '<span class="pc-ring"><svg class="ic"><use href="#' + meta.ico + '"/></svg></span>' +
          '<span class="pc-lvlno">SEVİYE 0' + (i + 1) + '</span>' +
        "</span>" +
        "<h3></h3>" +
        '<span class="pc-tags"><span class="pc-tag">' + prg.level + '</span>' +
          '<span class="pc-tag">17 adım</span><span class="pc-tag gold">' + meta.puan + ' puan</span></span>' +
        '<span class="pc-prog"><span class="pc-prog-top">İlerleme<b>' + done + "/16 adım · %" + pct + "</b></span>" +
          '<span class="pc-bar"><i style="width:' + Math.max(pct, 2) + '%"></i></span></span>' +
        '<span class="pc-go">' + (done ? "Patikaya devam et" : "Patikaya başla") + " →</span>";
      a.querySelector("h3").textContent = prg.title;
      if (!member) a.classList.add("pc-guest");
      grid.appendChild(a);
    });
    if (window.AIG_REVEAL) window.AIG_REVEAL();
  }

  renderPatikalar();
  document.addEventListener("aig:login", renderPatikalar);
  document.addEventListener("aig:logout", renderPatikalar);

  // seviye filtresi + açılır arama
  var lvlSel = "hepsi", query = "";
  function applyFilter() {
    var q = query.toLocaleLowerCase("tr").trim();
    document.querySelectorAll("#patikaGrid .pcard").forEach(function (c, i) {
      var prg = PROGRAMS[i];
      var hay = (prg.title + " " + prg.level + " " + prg.weeks.map(function (w) { return w.t; }).join(" ")).toLocaleLowerCase("tr");
      c.hidden = !((lvlSel === "hepsi" || c.dataset.lvl === lvlSel) && (!q || hay.indexOf(q) !== -1));
    });
  }
  var lvlWrap = document.getElementById("lvlFilter");
  if (lvlWrap) lvlWrap.addEventListener("click", function (e) {
    var b = e.target.closest(".lvl");
    if (!b) return;
    lvlWrap.querySelectorAll(".lvl").forEach(function (x) { x.classList.remove("on"); });
    b.classList.add("on");
    lvlSel = b.dataset.lvl;
    applyFilter();
  });
  var sBox = document.getElementById("pSearch"), sBtn = document.getElementById("pSearchBtn"), sIn = document.getElementById("pSearchIn");
  if (sBox) {
    sBtn.addEventListener("click", function () {
      var open = !sBox.classList.contains("open");
      sBox.classList.toggle("open", open);
      if (open) sIn.focus(); else { sIn.value = ""; query = ""; applyFilter(); }
    });
    sIn.addEventListener("input", function () { query = sIn.value; applyFilter(); });
  }

  if (PROGRAMS.length) {

    // Kaldığı yerden devam çubuğu
    try {
      var saved = JSON.parse(localStorage.getItem("aig_kurs") || "null");
      if (saved && saved.last) {
        var lp = PROGRAMS[saved.last.p];
        var done = (saved.progs && saved.progs[saved.last.p] && saved.progs[saved.last.p].done || []).length;
        var row = document.getElementById("resumeRow");
        if (lp && row) {
          row.innerHTML =
            '<a class="resume-chip" href="kurs.html">▶ Kaldığın yerden devam et: <b></b>' +
            '<span class="rc-meta">Hafta ' + saved.last.w + " · %" + Math.round(done / 16 * 100) + " tamamlandı</span></a>";
          row.querySelector("b").textContent = lp.title;
        }
      }
    } catch (e) {}
  }

  // ---------- Hero: canlı stüdyo demosu ----------
  var typedEl = document.getElementById("typed");
  var chipsEl = document.getElementById("chips");
  var genEl = document.getElementById("genState");
  var vidEl = document.getElementById("outVid");
  var tagEl = document.getElementById("outTag");
  if (!typedEl || !vidEl) return;

  var ICONS = { amac: "i-crosshair", baglam: "i-compass", stil: "i-edit", kisit: "i-slash" };
  var SCENES = [
    {
      prompt: "Gün batımında palmiyeli bulvarda ilerleyen pembe klasik Cadillac",
      chips: [
        { c: "amac", t: "Amaç: aksiyon sahnesi" },
        { c: "baglam", t: "Bağlam: neon bulvar, gün batımı" },
        { c: "stil", t: "Stil: retro sinematik, alçak kamera" }
      ],
      video: "media/hero_out_araba.mp4",
      poster: "media/poster_hero_out_araba.jpg"
    },
    {
      prompt: "Lego bloklarından kurulmuş bir sahil şehri, minyatür kamera turu",
      chips: [
        { c: "amac", t: "Amaç: dünya tasarımı" },
        { c: "baglam", t: "Bağlam: sahil caddesi, şehir silueti" },
        { c: "stil", t: "Stil: stop-motion, minyatür" }
      ],
      video: "media/hero_out_lego.mp4",
      poster: "media/poster_hero_out_lego.jpg"
    },
    {
      prompt: "Metro peronunda tren bekleyen bir karakter, soğuk ışık",
      chips: [
        { c: "amac", t: "Amaç: karakter sahnesi" },
        { c: "baglam", t: "Bağlam: gece metrosu, bekleyiş" },
        { c: "kisit", t: "Kısıt: tek çekim, sakin kamera" }
      ],
      video: "media/hero_out_metro.mp4",
      poster: "media/poster_hero_out_metro.jpg"
    }
  ];

  var si = 0;
  var heroVisible = true;
  var studioEl = document.getElementById("studio");
  if ("IntersectionObserver" in window && studioEl) {
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 }).observe(studioEl);
  }

  function setChips(scene) {
    chipsEl.innerHTML = "";
    scene.chips.forEach(function (ch) {
      var s = document.createElement("span");
      s.className = "p-chip " + ch.c;
      s.innerHTML = '<svg class="ic"><use href="#' + (ICONS[ch.c] || "i-sparkle") + '"/></svg> ';
      s.appendChild(document.createTextNode(ch.t));
      chipsEl.appendChild(s);
    });
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function waitVisible() {
    return new Promise(function (r) {
      (function check() { heroVisible ? r() : setTimeout(check, 500); })();
    });
  }

  function typeText(text) {
    return new Promise(function (resolve) {
      var i = 0;
      typedEl.textContent = "";
      (function step() {
        if (i <= text.length) {
          typedEl.textContent = text.slice(0, i);
          i++;
          setTimeout(step, 15 + Math.random() * 18);
        } else resolve();
      })();
    });
  }

  function showScene(scene) {
    vidEl.poster = scene.poster;
    vidEl.src = scene.video;
    vidEl.loop = true;
    vidEl.classList.add("show");
    vidEl.play().catch(function () {});
  }

  async function runScene(scene) {
    await waitVisible();
    // önceki çıktı görünmeye devam eder; alan hiç boş kalmaz
    tagEl.classList.remove("on");
    setChips(scene);

    await typeText(scene.prompt);
    var chips = chipsEl.children;
    for (var i = 0; i < chips.length; i++) {
      await wait(220);
      chips[i].classList.add("on");
    }
    await wait(200);
    genEl.classList.add("on");
    await wait(900);
    genEl.classList.remove("on");
    showScene(scene);
    await wait(450);
    tagEl.classList.add("on");
    await wait(3800);
  }

  async function loopScenes() {
    for (;;) {
      await runScene(SCENES[si % SCENES.length]);
      si++;
    }
  }

  // Açılışta alan dolu gelsin: son sahnenin çıktısı hemen görünür
  var initScene = SCENES[SCENES.length - 1];
  showScene(initScene);
  tagEl.classList.add("on");

  if (reduced) {
    // hareket azaltılmış: ilk sahneyi statik göster
    var s0 = SCENES[0];
    typedEl.textContent = s0.prompt;
    setChips(s0);
    Array.prototype.forEach.call(chipsEl.children, function (c) { c.classList.add("on"); });
    showScene(s0);
  } else {
    loopScenes();
  }
})();

/* Hero videosu: hareket azaltma tercihinde poster kalır; ekran dışındayken durur */
(function () {
  var v = document.querySelector(".hero-vid");
  if (!v) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) {
    v.removeAttribute("autoplay"); v.pause();
    return;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.15 }).observe(v);
  }
})();
