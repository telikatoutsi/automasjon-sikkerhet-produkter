(function () {
  "use strict";

  var CATS = window.AS_CATEGORIES;
  var PRODUCTS = window.AS_PRODUCTS;

  var $search = document.getElementById("search");
  var $filters = document.getElementById("filters");
  var $grid = document.getElementById("grid");
  var $empty = document.getElementById("empty");
  var $result = document.getElementById("result-label");
  var $toggle = document.getElementById("menu-toggle");
  var $menu = document.getElementById("mobile-menu");

  var state = { cat: "Alle", query: "" };

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
        '<a class="card__tile" href="' + esc(p.href) + '" target="_blank" rel="noopener" aria-label="' + esc(p.name) + '">' +
          '<span class="card__tile-brand">' + esc(p.brand) + "</span>" +
          '<span class="card__code">' + esc(p.code) + "</span>" +
        "</a>" +
        '<div class="card__body">' +
          '<div class="card__meta">' +
            '<span class="card__brand">' + esc(p.brand) + "</span>" +
            '<span class="card__dot"></span>' +
            '<span class="card__cat">' + esc(p.cat) + "</span>" +
          "</div>" +
          '<h3 class="card__title"><a href="' + esc(p.href) + '" target="_blank" rel="noopener">' + esc(p.name) + "</a></h3>" +
          '<p class="card__desc">' + esc(p.desc) + "</p>" +
          '<div class="card__links">' +
            '<a class="link-ul" href="' + esc(p.href) + '" target="_blank" rel="noopener">Produktside</a>' + doc +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

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
