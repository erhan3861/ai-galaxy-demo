/* Demo üyelik durumu — tüm sayfalarda ortak.
   Gerçek bir kimlik doğrulama değildir; yalnızca tarayıcıda tutulur. */
(function () {
  var KEY = "aig_user";

  function get() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
  }
  function set(u) {
    try { localStorage.setItem(KEY, JSON.stringify(u)); } catch (e) {}
  }
  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) {}
  }
  function nameFromMail(mail) {
    var n = (mail || "").split("@")[0].replace(/[._-]+/g, " ").trim() || "Misafir";
    return n.charAt(0).toLocaleUpperCase("tr") + n.slice(1);
  }

  function paint() {
    var u = get();
    var btn = document.getElementById("authBtn");
    var chip = document.getElementById("userChip");
    if (btn) btn.hidden = !!u;
    if (chip) {
      chip.hidden = !u;
      if (u) {
        var ava = document.getElementById("ucAva"), nm = document.getElementById("ucName");
        if (ava) ava.textContent = u.name.charAt(0).toLocaleUpperCase("tr");
        if (nm) nm.textContent = u.name;
      }
    }
    var appGo = document.getElementById("appGo");
    if (appGo) appGo.hidden = !u;
    document.body.classList.toggle("is-member", !!u);
  }

  window.AIG_AUTH = {
    user: get,
    login: function (mail) {
      var u = { name: nameFromMail(mail), mail: mail || "selin@ornek.com", credits: 1000, since: Date.now() };
      set(u); paint();
      return u;
    },
    logout: function () { clear(); paint(); },
    paint: paint
  };

  document.addEventListener("DOMContentLoaded", function () {
    paint();

    var wrap = document.getElementById("loginWrap");
    var btn = document.getElementById("authBtn");
    function open(e) { if (e) e.preventDefault(); if (!wrap) return; wrap.hidden = false; document.body.style.overflow = "hidden"; }
    function close() { if (!wrap) return; wrap.hidden = true; document.body.style.overflow = ""; }

    if (btn && wrap) btn.addEventListener("click", open);
    var x = document.getElementById("loginX");
    if (x) x.addEventListener("click", close);
    if (wrap) wrap.addEventListener("click", function (e) { if (e.target === wrap) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && wrap && !wrap.hidden) close(); });

    var go = document.getElementById("loginGo");
    if (go) go.addEventListener("click", function () {
      var mail = (document.getElementById("loginMail") || {}).value;
      window.AIG_AUTH.login(mail);
      close();
      document.dispatchEvent(new CustomEvent("aig:login"));
      // üye görünümü: uygulama kabuğuna geç
      if (!/patikalar\.html|patika\.html|kurs\.html/.test(location.pathname)) {
        location.href = "patikalar.html";
      }
    });

    var out = document.getElementById("logoutBtn");
    if (out) out.addEventListener("click", function () {
      window.AIG_AUTH.logout();
      document.dispatchEvent(new CustomEvent("aig:logout"));
    });
  });
})();
