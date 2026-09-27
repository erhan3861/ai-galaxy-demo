/* Üye görünümü: patika listesi (ai-galaxy.app/patikalar yapısı) */
(function () {
  "use strict";
  var PROGRAMS = window.AIG_PROGRAMS || [];
  var META = [
    { ico: "i-sparkle", thumb: "media/poster_sty_vangogh.jpg" },
    { ico: "i-layers", thumb: "media/poster_out_okyanus.jpg" },
    { ico: "i-film", thumb: "media/poster_tpl_kurum.jpg" },
    { ico: "i-zap", thumb: "media/pos_bina3d.jpg" }
  ];
  var PUAN = 100;

  function kursState() {
    try { return JSON.parse(localStorage.getItem("aig_kurs") || "null") || {}; } catch (e) { return {}; }
  }

  function render() {
    var grid = document.getElementById("patikaGrid");
    if (!grid) return;
    var st = kursState();
    grid.innerHTML = "";
    PROGRAMS.forEach(function (prg, i) {
      var m = META[i] || META[0];
      var done = ((st.progs && st.progs[i] && st.progs[i].done) || []).length;
      var pct = Math.round(done / 16 * 100);
      var a = document.createElement("a");
      a.className = "pcard";
      a.dataset.lvl = prg.level;
      a.href = "patika.html?p=" + i;
      a.innerHTML =
        '<span class="pc-bg" style="background-image:url(' + m.thumb + ')"></span>' +
        '<span class="pc-head"><span class="pc-ring"><svg class="ic"><use href="#' + m.ico + '"/></svg></span>' +
        '<span class="pc-lvlno">SEVİYE 0' + (i + 1) + "</span></span>" +
        "<h3></h3>" +
        '<span class="pc-tags"><span class="pc-tag">' + prg.level + '</span><span class="pc-tag">17 adım</span>' +
        '<span class="pc-tag gold">' + PUAN + ' puan</span></span>' +
        '<span class="pc-prog"><span class="pc-prog-top">İlerleme<b>' + done + "/16 adım · %" + pct + "</b></span>" +
        '<span class="pc-bar"><i style="width:' + Math.max(pct, 2) + '%"></i></span></span>' +
        '<span class="pc-go">' + (done ? "Patikaya devam et" : "Patikaya başla") + " →</span>";
      a.querySelector("h3").textContent = prg.title;
      grid.appendChild(a);
    });
  }

  render();
  document.addEventListener("aig:login", render);
  document.addEventListener("aig:logout", render);

  // seviye filtresi + açılır arama birlikte çalışır
  var lvl = "hepsi", query = "";
  function applyFilter() {
    var q = query.toLocaleLowerCase("tr").trim();
    var shown = 0;
    document.querySelectorAll("#patikaGrid .pcard").forEach(function (c, i) {
      var prg = PROGRAMS[i];
      var hay = (prg.title + " " + prg.level + " " + prg.weeks.map(function (w) { return w.t; }).join(" ")).toLocaleLowerCase("tr");
      var ok = (lvl === "hepsi" || c.dataset.lvl === lvl) && (!q || hay.indexOf(q) !== -1);
      c.hidden = !ok;
      if (ok) shown++;
    });
    var grid = document.getElementById("patikaGrid");
    var empty = grid.querySelector(".p-empty");
    if (!shown && !empty) {
      empty = document.createElement("p");
      empty.className = "p-empty";
      empty.textContent = "Bu aramaya uyan patika yok.";
      grid.appendChild(empty);
    } else if (shown && empty) empty.remove();
  }
  var f = document.getElementById("lvlFilter");
  if (f) f.addEventListener("click", function (e) {
    var b = e.target.closest(".lvl");
    if (!b) return;
    f.querySelectorAll(".lvl").forEach(function (x) { x.classList.remove("on"); });
    b.classList.add("on");
    lvl = b.dataset.lvl;
    applyFilter();
  });
  var sBox = document.getElementById("pSearch"), sBtn = document.getElementById("pSearchBtn"), sIn = document.getElementById("pSearchIn");
  if (sBox) {
    sBtn.addEventListener("click", function () {
      var open = !sBox.classList.contains("open");
      sBox.classList.toggle("open", open);
      if (open) sIn.focus();
      else { sIn.value = ""; query = ""; applyFilter(); }
    });
    sIn.addEventListener("input", function () { query = sIn.value; applyFilter(); });
    sIn.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { sIn.value = ""; query = ""; applyFilter(); sBox.classList.remove("open"); }
    });
  }
})();
