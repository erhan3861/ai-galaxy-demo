/* Üye uygulama üst barı — patikalar, patika, galaxy ve şablonlar sayfalarında ortak.
   <header class="appbar" id="appbar" data-active="patikalar|galaxy|sablonlar"></header> */
(function () {
  "use strict";
  var SPRITE =
    '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' +
    '<symbol id="ab-compass" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></symbol>' +
    '<symbol id="ab-sparkle" viewBox="0 0 24 24"><path d="M12 3l2 5.5L19.5 10 14 12l-2 5.5L10 12 4.5 10 10 8.5 12 3z"/></symbol>' +
    '<symbol id="ab-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></symbol>' +
    '<symbol id="ab-zap" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></symbol>' +
    '<symbol id="ab-user" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></symbol>' +
    '<symbol id="ab-out" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></symbol>' +
    '<symbol id="ab-down" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></symbol>' +
    "</svg>";

  function ic(id) { return '<svg class="ic"><use href="#ab-' + id + '"/></svg>'; }

  function render() {
    var host = document.getElementById("appbar");
    if (!host) return;
    var act = host.dataset.active || "";
    var u = window.AIG_AUTH && window.AIG_AUTH.user();
    var nm = u ? u.name : "Misafir";
    var ini = nm.charAt(0).toLocaleUpperCase("tr");
    host.innerHTML = SPRITE +
      '<div class="appbar-in">' +
        '<a class="ab-brand" href="' + (u ? "patikalar.html" : "index.html") + '"><span class="ab-logo">✦</span> AI-GALAXY</a>' +
        '<nav class="ab-nav">' +
          '<a class="ab-link' + (act === "patikalar" ? " on" : "") + '" href="patikalar.html">' + ic("compass") + " <span>Öğrenme Patikaları</span></a>" +
          '<a class="ab-link' + (act === "galaxy" ? " on" : "") + '" href="galaxy.html">' + ic("sparkle") + " <span>Galaxy</span></a>" +
          '<a class="ab-link' + (act === "sablonlar" ? " on" : "") + '" href="sablonlar.html">' + ic("grid") + " <span>Templates</span></a>" +
          (u
            ? '<a class="ab-credit" href="index.html#fiyat">' + ic("zap") + " 1.000 Kredi</a>" +
              '<div class="ab-prof"><button class="ab-user" id="abUser" aria-expanded="false">' +
                '<span class="ab-ava">' + ini + "</span><b></b>" + ic("down") + "</button>" +
                '<div class="ab-menu" id="abMenu" hidden>' +
                  '<div class="abm-head"><b></b><span>1.000 kredi</span></div>' +
                  '<a href="#" class="abm-item">' + ic("user") + " Hesap Ayarları</a>" +
                  '<button class="abm-item" id="abLogout">' + ic("out") + " Çıkış</button>" +
                "</div></div>"
            : '<a class="ab-credit" href="index.html">Giriş yap</a>') +
        "</nav>" +
      "</div>";
    if (u) {
      host.querySelector(".ab-user b").textContent = nm;
      host.querySelector(".abm-head b").textContent = nm;
      var btn = document.getElementById("abUser"), menu = document.getElementById("abMenu");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        menu.hidden = !menu.hidden;
        btn.setAttribute("aria-expanded", menu.hidden ? "false" : "true");
      });
      document.addEventListener("click", function (e) {
        if (!menu.hidden && !menu.contains(e.target)) { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); }
      });
      document.getElementById("abLogout").addEventListener("click", function () {
        window.AIG_AUTH.logout();
        location.href = "index.html";
      });
    }
  }
  document.addEventListener("DOMContentLoaded", render);
})();
