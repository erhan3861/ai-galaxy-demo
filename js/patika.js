/* Yetişkin öğrenme patikası haritası — ai-galaxy.app/patikalar yapısından örneklenmiştir */
(function () {
  "use strict";
  var PROGRAMS = window.AIG_PROGRAMS || [];
  var params = new URLSearchParams(location.search);
  var P = parseInt(params.get("p"), 10);
  if (isNaN(P) || !PROGRAMS[P]) P = 0;
  var prog = PROGRAMS[P];
  var PUAN = 5;            // adım başına
  var PUAN_FINAL = 20;

  var KEY = "aig_kurs";
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || "null") || {}; } catch (e) {}
  var done = (state.progs && state.progs[P] && state.progs[P].done) || [];

  // adım listesi: her hafta ders + alıştırma
  var STEPS = [];
  prog.weeks.forEach(function (wk, wi) {
    STEPS.push({ w: wi + 1, i: "v", tur: "Ders", t: wk.t, d: wk.d, out: wk.out });
    STEPS.push({ w: wi + 1, i: "a", tur: "Alıştırma", t: wk.t, d: wk.d, out: wk.out });
  });

  var doneN = STEPS.filter(function (s) { return done.indexOf(s.w + s.i) !== -1; }).length;
  var curIdx = STEPS.findIndex(function (s) { return done.indexOf(s.w + s.i) === -1; });
  if (curIdx === -1) curIdx = STEPS.length; // hepsi bitti → final

  function ic(n) { return '<svg class="ic"><use href="#i-' + n + '"/></svg>'; }
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function stepUrl(s) { return "kurs.html?p=" + P + "&w=" + s.w + "&i=" + s.i + "&studio=1"; }

  // ---- başlık ----
  document.getElementById("ptTitle").textContent = prog.title;
  document.title = prog.title + " — AI-GALAXY patikası";
  document.getElementById("ptSteps").textContent = STEPS.length + 1 + " adım";
  document.getElementById("ptPoints").textContent = (STEPS.length * PUAN + PUAN_FINAL) + " puan";
  document.getElementById("ptDone").textContent = doneN + "/" + STEPS.length + " tamamlandı";

  // ---- harita ----
  var map = document.getElementById("ptMap");
  var head = document.createElement("div");
  head.className = "pm-head";
  head.innerHTML = '<span>AI PATİKASI</span><b></b>';
  head.querySelector("b").textContent = prog.title;
  map.appendChild(head);

  STEPS.forEach(function (s, idx) {
    var isDone = done.indexOf(s.w + s.i) !== -1;
    var isCur = idx === curIdx;
    var locked = !isDone && !isCur;

    var wrap = document.createElement("div");
    wrap.className = "pm-slot";
    wrap.style.transform = "translateX(" + Math.round(Math.sin(idx * 0.85) * 120) + "px)";

    var node = document.createElement(locked ? "span" : "a");
    node.className = "pm-node " + (isDone ? "done" : isCur ? "cur" : "locked");
    if (!locked) node.href = stepUrl(s);
    node.innerHTML = ic(isDone ? "check" : isCur ? "zap" : "lock");
    node.setAttribute("aria-label", idx + 1 + ". " + s.t);

    var card = document.createElement("div");
    card.className = "pm-card";
    card.innerHTML =
      "<b>" + (idx + 1) + ". " + esc(s.t) + "</b>" +
      "<span class='pm-sub'>" + s.tur + " · " + PUAN + " puan</span>" +
      "<span class='pm-cta'>" + (locked ? "Önceki adımı bitir" : isDone ? "Tekrar aç" : "Başla +" + PUAN + " puan") + "</span>";

    if (isCur) {
      var flag = document.createElement("span");
      flag.className = "pm-flag";
      flag.textContent = "BAŞLA";
      wrap.appendChild(flag);
    }
    wrap.appendChild(node);
    wrap.appendChild(card);
    map.appendChild(wrap);
  });

  // final
  var fWrap = document.createElement("div");
  fWrap.className = "pm-slot pm-final-slot";
  var finalDone = doneN === STEPS.length;
  var fNode = document.createElement("span");
  fNode.className = "pm-node final " + (finalDone ? "cur" : "locked");
  fNode.innerHTML = ic("award");
  var fCard = document.createElement("div");
  fCard.className = "pm-card";
  fCard.innerHTML = "<b>Final projesi</b><span class='pm-sub'>Sunum · " + PUAN_FINAL + " puan</span>" +
    "<span class='pm-cta'>" + (finalDone ? "Projeni yükle" : "16 adımı bitir") + "</span>";
  fWrap.appendChild(fNode);
  fWrap.appendChild(fCard);
  var fLabel = document.createElement("span");
  fLabel.className = "pm-final-label";
  fLabel.textContent = "Final";
  map.appendChild(fWrap);
  map.appendChild(fLabel);

  // ---- yan panel ----
  var pct = Math.round(doneN / STEPS.length * 100);
  document.getElementById("ptPct").textContent = "%" + pct;
  document.getElementById("ptStatSteps").textContent = doneN + " / " + STEPS.length;
  document.getElementById("ptStatPuan").textContent = (doneN * PUAN) + " / " + (STEPS.length * PUAN + PUAN_FINAL);
  var ring = document.getElementById("ptRing");
  var C = 2 * Math.PI * 52;
  ring.style.strokeDasharray = C;
  ring.style.strokeDashoffset = C * (1 - pct / 100);
  var next = document.getElementById("ptNext");
  if (curIdx < STEPS.length) {
    next.href = stepUrl(STEPS[curIdx]);
    next.textContent = (doneN ? "Sıradaki adım: " : "Patikaya başla: ") + (curIdx + 1) + ". adım →";
  } else {
    next.href = "#";
    next.textContent = "Final projesine geç →";
  }
  document.getElementById("ptFinal").textContent = "Final ürün: " + prog.final;
})();
