(function () {
  "use strict";

  var CATS = window.AS_CATEGORIES;
  var PRODUCTS = window.AS_PRODUCTS;
  var SPECS = window.AS_SPECS || { _default: [] };

  var $search = document.getElementById("search");
  var $filters = document.getElementById("filters");
  var $grid = document.getElementById("grid");
  var $empty = document.getElementById("empty");
  var $result = document.getElementById("result-label");
  var $toggle = document.getElementById("menu-toggle");
  var $menu = document.getElementById("mobile-menu");
  var $detail = document.getElementById("detail");

  var state = { cat: "Alle", query: "", openName: null };

  // Restore category from URL hash (#produkter?kat=Tilbehør) so filters are shareable.
  var params = new URLSearchParams(window.location.search);
  if (params.get("kat") && CATS.indexOf(params.get("kat")) !== -1) state.cat = params.get("kat");
  if (params.get("q")) state.query = params.get("q");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderFilters() {
    $filters.innerHTML = CATS.map(function (c) {
      var on = c === state.cat;
      return '<button type="button" class="chip' + (on ? " is-active" : "") + '" data-cat="' + esc(c) + '" aria-pressed="' + on + '">' + esc(c) + "</button>";
    }).join("");
  }

  function cardHTML(p) {
    var doc = p.doc
      ? '<a class="link-ul link-ul--accent" href="' + esc(p.docHref) + '" target="_blank" rel="noopener">' + esc(p.doc) + "</a>"
      : "";
    return (
      '<article class="card">' +
        (p.img
          ? '<a class="card__tile card__tile--photo" href="' + esc(p.href) + '" target="_blank" rel="noopener" aria-label="' + esc(p.name) + '">' +
              '<img class="card__img" src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">' +
            "</a>"
          : '<a class="card__tile" href="' + esc(p.href) + '" target="_blank" rel="noopener" aria-label="' + esc(p.name) + '">' +
              '<span class="card__tile-brand">' + esc(p.brand) + "</span>" +
              '<span class="card__code">' + esc(p.code) + "</span>" +
            "</a>") +
        '<div class="card__body">' +
          '<div class="card__meta">' +
            '<span class="card__brand">' + esc(p.brand) + "</span>" +
            '<span class="card__dot"></span>' +
            '<span class="card__cat">' + esc(p.cat) + "</span>" +
          "</div>" +
          '<h3 class="card__title"><a href="' + esc(p.href) + '" target="_blank" rel="noopener">' + esc(p.name) + "</a></h3>" +
          '<p class="card__desc">' + esc(p.desc) + "</p>" +
          '<div class="card__links">' +
            '<button type="button" class="link-ul link-ul--btn" data-open="' + esc(p.name) + '">Detaljer</button>' + doc +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function detailHTML(p) {
    var specs = SPECS[p.name] || SPECS._default;
    var img = p.img
      ? '<div class="drawer__img"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + '"></div>'
      : "";
    var doc = p.doc
      ? '<a class="btn btn--ghost" href="' + esc(p.docHref) + '" target="_blank" rel="noopener"><span>' + esc(p.doc) + "</span></a>"
      : "";
    return (
      '<div class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">' +
        '<div class="drawer__backdrop" data-close></div>' +
        '<aside class="drawer__panel">' +
          '<div class="drawer__head">' +
            "<div>" +
              '<div class="drawer__meta">' + esc(p.brand) + " · " + esc(p.cat) + "</div>" +
              '<h2 class="drawer__title" id="drawer-title">' + esc(p.name) + "</h2>" +
            "</div>" +
            '<button type="button" class="drawer__close" data-close aria-label="Lukk">×</button>' +
          "</div>" +
          '<div class="drawer__body">' +
            img +
            '<p class="drawer__desc">' + esc(p.desc) + "</p>" +
            '<div class="drawer__label">Teknisk</div>' +
            '<dl class="specs">' +
              specs.map(function (x) {
                return '<div class="specs__row"><dt>' + esc(x.k) + "</dt><dd>" + esc(x.v) + "</dd></div>";
              }).join("") +
            "</dl>" +
            '<div class="drawer__actions">' +
              '<a class="btn btn--accent" href="mailto:post@automasjonsikkerhet.no?subject=' + encodeURIComponent("Tilbud: " + p.name) + '">Be om tilbud på dette</a>' +
              '<a class="btn btn--outline" href="' + esc(p.href) + '" target="_blank" rel="noopener">Produsentens produktside</a>' +
              doc +
            "</div>" +
            '<p class="drawer__foot">Usikker på om dette er riktig produkt? Ring 918 27 371 — du får svar fra en som skal levere jobben.</p>' +
          "</div>" +
        "</aside>" +
      "</div>"
    );
  }

  function renderDetail() {
    var p = state.openName && PRODUCTS.filter(function (x) { return x.name === state.openName; })[0];
    $detail.innerHTML = p ? detailHTML(p) : "";
    if (p) {
      var close = $detail.querySelector(".drawer__close");
      if (close) close.focus();
    }
  }

  function openDetail(name) { state.openName = name; renderDetail(); }
  function closeDetail() { state.openName = null; renderDetail(); }

  function render() {
    var q = state.query.trim().toLowerCase();
    var visible = PRODUCTS.filter(function (p) {
      var inCat = state.cat === "Alle" || p.cat === state.cat;
      var hay = (p.name + " " + p.desc + " " + p.brand + " " + p.cat + " " + p.code).toLowerCase();
      return inCat && (!q || hay.indexOf(q) !== -1);
    });

    $grid.innerHTML = visible.map(cardHTML).join("");
    $empty.classList.toggle("is-visible", visible.length === 0);
    $result.textContent =
      visible.length + (visible.length === 1 ? " produkt" : " produkter") + (state.cat === "Alle" ? "" : " · " + state.cat);
    renderFilters();
  }

  $grid.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-open]");
    if (btn) openDetail(btn.getAttribute("data-open"));
  });
  $detail.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) closeDetail();
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && state.openName) closeDetail();
  });

  $filters.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.cat = btn.getAttribute("data-cat");
    render();
  });

  $search.value = state.query;
  $search.addEventListener("input", function () {
    state.query = $search.value;
    render();
  });

  $toggle.addEventListener("click", function () {
    var open = $menu.classList.toggle("is-open");
    $toggle.setAttribute("aria-expanded", String(open));
  });
  $menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      $menu.classList.remove("is-open");
      $toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.getElementById("year").textContent = String(new Date().getFullYear());

  render();
})();
