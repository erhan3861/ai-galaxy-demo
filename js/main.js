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
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
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

/* ---------- Dersten stüdyoya akış simülasyonu (AI-Stüdyo bölümü) ---------- */
(function () {
  var sim = document.getElementById("flowSim");
  if (!sim) return;
  var lesson = document.getElementById("fsLesson");
  var studio = document.getElementById("fsStudio");
  var vid = document.getElementById("fsVideo");
  var prog = document.getElementById("fsProg");
  var hint = document.querySelector(".fsl-hint");
  var openBtn = document.getElementById("fsOpen");
  var url = document.getElementById("fsUrl");
  var typed = document.getElementById("fsTyped");
  var send = document.getElementById("fsSend");
  var gen = document.getElementById("fsGen");
  var out = document.getElementById("fsOut");
  var tag = document.getElementById("fsTag");
  var steps = sim.querySelectorAll(".fs-step");

  var OUTS = [
    { p: "Lego bloklarından bir sahil şehri, minyatür kamera turu", v: "media/hero_out_lego.mp4", i: "media/poster_hero_out_lego.jpg" },
    { p: "Gün batımında palmiyeli bulvarda pembe klasik otomobil", v: "media/hero_out_araba.mp4", i: "media/poster_hero_out_araba.jpg" },
    { p: "Okyanusun derinliklerinde renkli bir mercan dünyası", v: "media/hero_out_okyanus.mp4", i: "media/poster_hero_out_okyanus.jpg" }
  ];
  var oi = 0;
  var visible = true;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
      if (!visible) { vid.pause(); out.pause(); }
    }, { threshold: 0.2 }).observe(sim);
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function waitVisible() {
    return new Promise(function (r) { (function c() { visible ? r() : setTimeout(c, 400); })(); });
  }
  function setStep(n) {
    for (var i = 0; i < steps.length; i++) steps[i].classList.toggle("on", i === n);
  }
  function type(text) {
    return new Promise(function (res) {
      var i = 0;
      typed.textContent = "";
      (function step() {
        if (i <= text.length) { typed.textContent = text.slice(0, i); i++; setTimeout(step, 16 + Math.random() * 20); }
        else res();
      })();
    });
  }

  async function runCycle() {
    var scene = OUTS[oi++ % OUTS.length];

    // 1) ders ekranı
    await waitVisible();
    setStep(0);
    url.textContent = "ai-galaxy.app/ders/hafta-2";
    studio.classList.remove("on");
    lesson.classList.add("on");
    hint.classList.remove("on");
    openBtn.classList.remove("pulse");
    tag.classList.remove("on");
    out.classList.remove("show");
    prog.style.width = "8%";
    try { vid.currentTime = 0; } catch (e) {}
    vid.play().catch(function () {});
    for (var s = 1; s <= 10; s++) { await wait(560); prog.style.width = (8 + s * 9) + "%"; }

    // 2) stüdyoya geçiş
    setStep(1);
    hint.classList.add("on");
    openBtn.classList.add("pulse");
    await wait(1400);
    vid.pause();
    lesson.classList.remove("on");
    url.textContent = "ai-galaxy.app/studio";
    studio.classList.add("on");
    await wait(600);

    // 3) üretim
    setStep(2);
    await type(scene.p);
    await wait(450);
    send.classList.add("pulse");
    await wait(500);
    send.classList.remove("pulse");
    out.classList.remove("show");
    gen.classList.add("on");
    await wait(1500);
    gen.classList.remove("on");
    out.poster = scene.i;
    out.src = scene.v;
    out.loop = true;
    out.classList.add("show");
    out.play().catch(function () {});
    await wait(500);
    tag.classList.add("on");
    await wait(4200);
    out.pause();
  }

  if (reduced) {
    // hareket azaltma: son kare olarak stüdyo çıktısını göster
    lesson.classList.remove("on");
    studio.classList.add("on");
    setStep(2);
    typed.textContent = OUTS[0].p;
    out.poster = OUTS[0].i;
    out.src = OUTS[0].v;
    out.classList.add("show");
    tag.classList.add("on");
    return;
  }
  (async function () { for (;;) { await runCycle(); } })();
})();
