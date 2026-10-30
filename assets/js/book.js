/*
 * Candidate pack flip book.
 *
 * Every page is designed at a fixed size (360 x 640, the shape of a phone screen)
 * and scaled to fit the screen, so a page never needs scrolling.
 *
 * URL parameters (all optional except e):
 *   e          company id from content.js: hometogo | smoobu | interhome | secra
 *   name       candidate first name
 *   role       role title
 *   hm         hiring manager name        hmTitle   hiring manager title
 *   team       team name                  size      team size (number)
 *   owns       what the team owns         why       why the role is open
 *   length     interview length in minutes
 *   format     interview format, e.g. "Video call"
 *   reply      working days until we reply after each stage
 *   recruiter  recruiter name             email     recruiter email
 *   office     overrides the office line  lang      overrides the language line
 *
 * Use builder.html to create these links without typing them.
 */
(function () {
  "use strict";

  var PACK = window.PACK;
  var app = document.getElementById("app");
  var q = new URLSearchParams(window.location.search);
  var PAGE_W = 360;
  var PAGE_H = 640;

  // Longest text each field may show without breaking the page layout.
  var LIMITS = { name: 30, role: 50, hm: 40, hmTitle: 50, team: 40, size: 4, owns: 90, why: 90, length: 3, format: 40, reply: 2, recruiter: 40, email: 60, office: 40, lang: 40 };

  function param(key) {
    return (q.get(key) || "").trim().slice(0, LIMITS[key] || 60);
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var ICONS = {
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chart: '<path d="M3 20h18M6 16v-5M11 16V7M16 16v-8"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    pulse: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    plane: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
    home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2 .7 3.5 2.6 3.5 6"/>',
    thumb: '<path d="M7 10v11H3V10z"/><path d="M7 10l4-8c1.7 0 3 1.3 3 3v4h5.5a2 2 0 0 1 2 2.3l-1.3 8A2 2 0 0 1 18.2 21H7"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/>',
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    left: '<path d="m15 6-6 6 6 6"/>',
    right: '<path d="m9 6 6 6-6 6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'
  };

  function icon(name, cls) {
    return '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }

  function icon3d(name, cls) {
    return '<img class="i3d ' + (cls || "") + '" src="assets/img/icons/' + esc(name) + '.png" alt="">';
  }

  /* ---------- Which book to show ----------
   * A candidate link uses ?e=smoobu (plus personal details).
   * Without it, a company picker opens; the choice is kept in the address as #smoobu.
   */

  var PREVIEW = !!window.PACK_PREVIEW; // set by the Claude preview page; hides the link builder
  var ACTIVE = 0;
  var onResize = null;

  function hasEntity(id) { return Object.prototype.hasOwnProperty.call(PACK.entities, id); }
  function setHash(h) {
    try { history.replaceState(null, "", h ? "#" + h : window.location.pathname + window.location.search); } catch (e) { /* some embedded views refuse; ignore */ }
  }

  var fromQuery = (q.get("e") || "").toLowerCase();
  var fromHash = (window.location.hash || "").replace("#", "").toLowerCase();
  var MODE = hasEntity(fromQuery) ? "link" : "browse";

  window.addEventListener("resize", function () { if (onResize) onResize(); });

  if (MODE === "link") startBook(fromQuery);
  else if (hasEntity(fromHash)) startBook(fromHash);
  else showPicker();

  function showPicker() {
    ACTIVE++;
    onResize = null;
    document.body.classList.add("is-picker");
    document.title = "Candidate packs · HomeToGo Group";
    var cards = Object.keys(PACK.entities).map(function (id) {
      var ent = PACK.entities[id];
      return '<button class="pick" type="button" data-entity="' + esc(id) + '">' +
        '<img src="' + esc(ent.photos.cover) + '" alt="">' +
        "<span>" + esc(ent.name) + (ent.status === "draft" ? " <em>draft</em>" : "") + "</span></button>";
    }).join("");
    app.innerHTML =
      '<main class="picker">' +
      '<img class="picker-logo" src="assets/img/brand/htg-white.png" alt="HomeToGo">' +
      '<p class="eyebrow on-dark">Talent Acquisition · HomeToGo Group</p>' +
      "<h1>Candidate packs</h1>" +
      "<p>Pick a company to open its pack. On a phone, swipe sideways to turn the pages.</p>" +
      '<div class="pick-grid">' + cards + "</div>" +
      (PREVIEW
        ? '<p class="picker-note">Preview. On the live site, each candidate gets a link with their name, hiring manager and interview details filled in.</p>'
        : '<p><a class="button-link" href="builder.html">Build a candidate link</a></p>') +
      "</main>";
    Array.prototype.forEach.call(app.querySelectorAll(".pick"), function (btn) {
      btn.addEventListener("click", function () { startBook(btn.getAttribute("data-entity")); });
    });
  }

  function startBook(entityId) {
    var token = ++ACTIVE;
    var E = PACK.entities[entityId];
    var S = PACK.shared;
    document.body.classList.remove("is-picker");
    document.title = "Candidate pack · " + E.name;

    var P = {};
    Object.keys(LIMITS).forEach(function (k) { P[k] = param(k); });
    var CONFIRM = "In your invitation";

    function head(eb, title, deco) {
      return '<header class="pg-head">' + (deco ? icon3d(deco, "head-deco") : "") +
        '<p class="eyebrow">' + esc(eb) + "</p><h2>" + esc(title) + "</h2></header>";
    }

    /* ---------- Pages (each fills one 360 x 640 page) ---------- */

    function pageCover() {
      var prepared = [P.name, P.role].filter(Boolean).map(esc).join(" · ");
      return {
        label: "Welcome", tone: "dark", folio: false,
        html:
          '<img class="cover-img" src="' + esc(E.photos.cover) + '" alt="">' +
          '<div class="cover-shade"></div>' +
          '<img class="logo-white" src="assets/img/brand/htg-white.png" alt="HomeToGo">' +
          (E.logo ? '<span class="ent-chip"><img src="' + esc(E.logo) + '" alt="">' + esc(E.name) + "</span>" : "") +
          '<div class="cover-body">' +
          '<p class="eyebrow on-dark">Candidate pack · ' + esc(E.name) + "</p>" +
          "<h1>You’re through to the next round.</h1>" +
          '<p class="lead">Everything you need for your conversation with the hiring manager, in one place.</p>' +
          (prepared ? '<p class="pill">Prepared for ' + prepared + "</p>" : "") +
          '<div class="cover-foot"><span class="grad-bar"></span><span class="hint">Swipe to turn the page ' + icon("arrow") + "</span></div>" +
          "</div>"
      };
    }

    function pageWelcome() {
      var at = entityId === "hometogo" ? "" : " at " + esc(E.name);
      var who = P.recruiter ? esc(P.recruiter) : "Your recruiter";
      var initial = P.recruiter ? esc(P.recruiter.charAt(0).toUpperCase()) : "";
      return {
        label: "A note from your recruiter", tone: "light",
        html:
          '<img class="band" src="' + esc(E.photos.welcome) + '" alt="">' +
          '<div class="welcome-body">' +
          '<p class="eyebrow">A note from your recruiter</p>' +
          "<h2>Hello " + (P.name ? esc(P.name) : "there") + ",</h2>" +
          "<p>Thank you for your time in our first conversation. We enjoyed it, and we’d like you to meet " +
          (P.hm ? esc(P.hm) : "the hiring manager") + ", who leads the team you’d join" + at + ".</p>" +
          "<p>This pack covers who we are, how the next steps work and what helps people do well. None of it is a test. Skim what you know, and send me any question that comes up.</p>" +
          '<div class="signature"><span class="avatar">' + (initial || icon("users")) + "</span>" +
          "<span><b>" + who + "</b><small>Talent Acquisition, HomeToGo Group</small></span></div>" +
          "</div>" + icon3d("hearts", "welcome-deco")
      };
    }

    function pageGroup() {
      var g = S.group;
      var stats = g.stats.map(function (s, i) {
        return '<div class="stat s' + i + '"><b>' + esc(s.value) + "</b><span>" + esc(s.label) + "</span></div>";
      }).join("");
      var biz = g.businesses.map(function (b) {
        return '<div class="biz">' + icon3d(b.icon) + '<div><p class="label">' + esc(b.label) + "</p><h3>" + esc(b.name) + "</h3><p>" + esc(b.text) + "</p></div></div>";
      }).join("");
      var tl = g.timeline.map(function (t) {
        return "<li><b>" + esc(t.year) + "</b><span>" + esc(t.text) + "</span></li>";
      }).join("");
      return {
        label: g.title, tone: "light",
        html: head(g.eyebrow, g.title) + '<div class="stats">' + stats + "</div>" +
          '<div class="biz-list">' + biz + "</div>" + '<ol class="timeline">' + tl + "</ol>"
      };
    }

    function chips(list, cls) {
      return '<div class="chips">' + list.map(function (c) { return '<span class="chip ' + (cls || "") + '">' + esc(c) + "</span>"; }).join("") + "</div>";
    }

    function pageBrands() {
      var b = S.brands;
      var groups = b.hosts.groups.map(function (gr) {
        return '<div class="bgroup"><h3>' + esc(gr.name) + "</h3>" + chips(gr.chips) + "<p>" + esc(gr.text) + "</p></div>";
      }).join("");
      return {
        label: b.title, tone: "lav",
        html: head(b.eyebrow, b.title) +
          '<section class="card dark travel">' + icon3d(b.travelers.icon, "card-deco") +
          '<p class="label">' + esc(b.travelers.label) + "</p><h3>" + esc(b.travelers.name) + "</h3>" +
          chips(b.travelers.chips, "on-dark") + "<p>" + esc(b.travelers.text) + "</p></section>" +
          '<section class="card hosts">' + icon3d(b.hosts.icon, "card-deco") +
          '<p class="label">' + esc(b.hosts.label) + "</p><h3>" + esc(b.hosts.name) + "</h3>" +
          '<div class="bgroups">' + groups + "</div>" +
          (b.hosts.more ? '<p class="more-line">' + esc(b.hosts.more) + " " + icon("arrow") + "</p>" : "") + "</section>"
      };
    }

    function pageOriginals() {
      var o = S.originals;
      var cos = o.companies.map(function (c) {
        return '<section class="card orig">' +
          '<span class="logo-tile"><img src="' + esc(c.logo) + '" alt=""></span>' +
          "<h3>" + esc(c.name) + '</h3><p class="since">' + esc(c.since) + "</p>" +
          '<ul class="orig-facts">' + c.facts.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul></section>";
      }).join("");
      return {
        label: o.title, tone: "light",
        html: head(o.eyebrow, o.title) +
          '<div class="orig-hero"><img src="assets/img/brand/originals-badges.png" alt="HomeToGo Originals badges for Interhome and Kraushaar"><p>' + esc(o.intro) + "</p></div>" +
          cos +
          '<section class="card dark works">' + icon3d("house", "card-deco") +
          '<p class="label">' + esc(o.works.label) + "</p><h3>" + esc(o.works.name) + "</h3><p>" + esc(o.works.text) + "</p></section>"
      };
    }

    function pageTeam() {
      var rows = [];
      if (P.team) rows.push(["Team", P.team]);
      if (P.hm) rows.push(["Hiring manager", P.hm + (P.hmTitle ? ", " + P.hmTitle : "")]);
      if (P.size) rows.push(["Team size", P.size + " people"]);
      if (P.owns) rows.push(["What the team owns", P.owns]);
      if (P.why) rows.push(["Why the role is open", P.why]);
      var teamHtml = rows.length
        ? '<dl class="facts">' + rows.map(function (r) { return "<dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("") + "</dl>"
        : "<p>Your recruiter will tell you who you’ll meet and why the role is open.</p>";
      var logo = E.logo
        ? '<span class="logo-tile"><img src="' + esc(E.logo) + '" alt=""></span>'
        : '<span class="logo-tile wide"><img src="assets/img/brand/htg-dark.png" alt=""></span>';
      return {
        label: "Your company and your team", tone: "light",
        html: head("Where you’d work · " + E.name, "Your company and your team") +
          (rows.length <= 2 ? '<img class="team-photo" src="' + esc(E.photos.cover) + '" alt="">' : "") +
          '<section class="card dark company">' + logo +
          '<p class="label">The company</p><h3>' + esc(E.company.title) + "</h3><p>" + esc(E.company.text) + "</p>" +
          '<dl class="facts on-dark"><dt>Office</dt><dd>' + esc(P.office || E.company.office) + "</dd><dt>Language</dt><dd>" + esc(P.lang || E.company.language) + "</dd></dl></section>" +
          '<section class="card team"><p class="label">Your future team</p>' + teamHtml + "</section>"
      };
    }

    function pagePrinciples() {
      var pr = S.principles;
      var items = pr.items.map(function (it) {
        return '<li>' + icon3d(it.icon) + "<div><h3>" + esc(it.name) + "</h3><p>" + esc(it.text) + "</p></div></li>";
      }).join("");
      return {
        label: pr.title, tone: "lav",
        html: head(pr.eyebrow, pr.title) + '<ul class="lp-list">' + items + "</ul>" + '<p class="note">' + esc(pr.note) + "</p>"
      };
    }

    function pageProcess() {
      var pc = S.process;
      var withWho = P.hm ? P.hm + (P.hmTitle ? ", " + P.hmTitle : "") : CONFIRM;
      var steps = pc.steps.map(function (st, i) {
        var text = st.text;
        if (text === null) text = P.reply ? "We reply within " + P.reply + " working days of each stage." : "Your recruiter will share the timeline.";
        var marker = st.state === "done" ? icon("check") : String(i + 1);
        var sr = st.state === "done" ? " (completed)" : st.state === "now" ? " (next step)" : "";
        return '<li class="step ' + (st.state || "") + '"><span class="marker" aria-hidden="true">' + marker + "</span>" +
          "<div><b>" + esc(st.name) + '<span class="sr-only">' + sr + "</span></b><span>" + esc(text) + "</span></div></li>";
      }).join("");
      return {
        label: pc.title, tone: "light",
        html: head(pc.eyebrow, pc.title) +
          '<section class="card dark next">' + icon3d("flag", "card-deco") + '<p class="pill small-pill">Up next</p><h3>Hiring manager interview</h3>' +
          '<dl class="facts on-dark">' +
          "<dt>With</dt><dd>" + esc(withWho) + "</dd>" +
          "<dt>Length</dt><dd>" + esc(P.length ? P.length + " minutes" : CONFIRM) + "</dd>" +
          "<dt>Format</dt><dd>" + esc(P.format || CONFIRM) + "</dd>" +
          "<dt>Focus</dt><dd>Your experience, how you’d tackle the role and your questions.</dd>" +
          "</dl>" + '<p class="adjust">' + esc(pc.adjustments) + "</p></section>" +
          '<ol class="steps">' + steps + "</ol>"
      };
    }

    function pagePrepare() {
      var pp = S.prepare;
      var items = pp.items.map(function (it, i) {
        var item = it.name === "TRY" ? E.tryTip : it;
        return '<li><span class="num" aria-hidden="true">0' + (i + 1) + "</span><div><h3>" + esc(item.name) + "</h3><p>" + esc(item.text) + "</p></div></li>";
      }).join("");
      return {
        label: pp.title, tone: "lav",
        html: head(pp.eyebrow, pp.title, "rocket") + '<ol class="tips">' + items + "</ol>" +
          '<section class="card dark callout"><p class="label">What we don’t expect</p><p>' + esc(pp.dontExpect) + "</p></section>"
      };
    }

    function pageOffer() {
      var o = E.offer;
      var tiles = o.items.map(function (it, i) {
        return '<div class="tile"><span class="tile-ico' + (i > 3 ? " warm" : "") + '">' + icon(it.icon) + "</span><h3>" + esc(it.name) + "</h3><p>" + esc(it.text) + "</p></div>";
      }).join("");
      return {
        label: o.title, tone: "light",
        html: head("What we offer · " + E.name, o.title, "plant") + '<div class="tiles">' + tiles + "</div>" + '<p class="note">' + esc(o.footnote) + "</p>"
      };
    }

    function pageClose() {
      var contact = P.recruiter || P.email
        ? '<p class="contact">' + (P.recruiter ? "<b>" + esc(P.recruiter) + "</b>" : "") +
          (P.email ? '<span class="mail">' + icon("mail") + '<a href="mailto:' + esc(P.email) + '">' + esc(P.email) + "</a></span>" : "") + "</p>"
        : '<p class="contact">Reply to your recruiter’s last email.</p>';
      var links = [];
      if (E.links.careers) links.push('<a href="' + esc(E.links.careers) + '" target="_blank" rel="noopener">Careers page</a>');
      if (E.links.linkedin) links.push('<a href="' + esc(E.links.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>');
      return {
        label: "Before you go", tone: "dark", folio: false, last: true,
        html:
          '<img class="close-img" src="' + esc(E.photos.close) + '" alt="">' +
          '<div class="cover-shade close-shade"></div>' +
          '<div class="close-body">' +
          '<p class="eyebrow on-dark">Before you go</p>' +
          "<h2>Good luck" + (P.name ? ", " + esc(P.name) : "") + ". We’re looking forward to meeting you.</h2>" +
          '<section class="card contact-card"><h3>Questions before your interview?</h3>' + contact +
          "<p>Nothing is too small to ask: logistics, the format, or who you’ll meet.</p></section>" +
          (links.length ? '<p class="links">See more of us: ' + links.join(" · ") + "</p>" : "") +
          '<div class="close-foot"><img src="assets/img/brand/htg-white.png" alt="HomeToGo"><span class="grad-bar"></span></div>' +
          "</div>"
      };
    }

    var PAGES = [pageCover(), pageWelcome(), pageGroup(), pageBrands(), pageOriginals(), pageTeam(), pagePrinciples(), pageProcess(), pagePrepare(), pageOffer(), pageClose()];
    var N = PAGES.length;

    /* ---------- Shell ---------- */

    var dots = PAGES.map(function (pg, i) {
      return '<button class="dot" type="button" data-go="' + i + '" aria-label="Page ' + (i + 1) + ": " + esc(pg.label) + '"></button>';
    }).join("");

    var pagesHtml = PAGES.map(function (pg, i) {
      var folio = pg.folio === false ? "" :
        '<footer class="folio"><span>HomeToGo Group · ' + esc(E.name) + "</span><span>" + (i + 1) + "</span></footer>";
      return '<section class="page" data-index="' + i + '" aria-label="Page ' + (i + 1) + " of " + N + ": " + esc(pg.label) + '">' +
        '<div class="face front"><div class="canvas"><div class="pg tone-' + pg.tone + " p-" + i + (pg.last ? " p-last" : "") + '">' + pg.html + folio + "</div></div></div>" +
        '<div class="face back" aria-hidden="true"></div></section>';
    }).join("");

    app.innerHTML =
      (E.status === "draft" ? '<div class="draft-banner" role="note">Draft · not ready for candidates</div>' : "") +
      '<header class="topbar"><span class="brand"><img src="assets/img/brand/htg-white.png" alt="HomeToGo"><span class="muted">' + esc(E.name) + "</span></span>" +
      '<span class="topbar-right">' + (MODE === "browse" ? '<button class="switch" type="button" id="switch">All companies</button>' : "") +
      '<span class="counter" id="counter"></span></span></header>' +
      '<main class="stage" id="stage"><div class="book" id="book" aria-roledescription="book">' +
      '<div class="pages" id="pages">' + pagesHtml + "</div></div></main>" +
      '<nav class="controls" aria-label="Pages">' +
      '<button class="nav" type="button" id="prev" aria-label="Previous page">' + icon("left") + "</button>" +
      '<div class="dots">' + dots + "</div>" +
      '<button class="nav" type="button" id="next" aria-label="Next page">' + icon("right") + "</button></nav>" +
      '<p class="sr-only" aria-live="polite" id="live"></p>';

    /* ---------- Fit the book to the screen ---------- */

    var stage = document.getElementById("stage");
    var book = document.getElementById("book");

    function fit() {
      var cs = getComputedStyle(stage);
      var aw = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 20; // room for the cover edges
      var ah = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 18;
      var s = Math.min(aw / PAGE_W, ah / PAGE_H);
      s = Math.max(0.45, Math.min(s, 1.7));
      book.style.width = Math.floor(PAGE_W * s) + "px";
      book.style.height = Math.floor(PAGE_H * s) + "px";
      book.style.setProperty("--s", String(s));
    }
    onResize = fit;
    fit();

    /* ---------- Page turning ---------- */

    var pageEls = Array.prototype.slice.call(document.querySelectorAll(".page"));
    var dotEls = Array.prototype.slice.call(document.querySelectorAll(".dot"));
    var counter = document.getElementById("counter");
    var live = document.getElementById("live");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var start = MODE === "link" ? parseInt((window.location.hash || "").replace("#", ""), 10) : 0;
    var cur = start >= 1 && start <= N ? start - 1 : 0;

    pageEls.forEach(function (el, i) {
      el.style.setProperty("--z", String(N - i));
      if (i < cur) el.classList.add("flipped", "gone");
    });

    function instant(el, fn) {
      el.classList.add("no-anim");
      fn();
      void el.offsetWidth;
      el.classList.remove("no-anim");
    }

    function afterFlip(el, fn) {
      var done = false;
      function finish() {
        if (done) return;
        done = true;
        el.removeEventListener("transitionend", onEnd);
        fn();
      }
      function onEnd(ev) { if (ev.target === el) finish(); }
      el.addEventListener("transitionend", onEnd);
      setTimeout(finish, reduceMotion ? 400 : 1100);
    }

    function sync() {
      pageEls.forEach(function (el, i) {
        var active = i === cur;
        el.setAttribute("aria-hidden", active ? "false" : "true");
        if ("inert" in el) el.inert = !active;
      });
      dotEls.forEach(function (d, i) {
        d.classList.toggle("on", i === cur);
        if (i === cur) d.setAttribute("aria-current", "page"); else d.removeAttribute("aria-current");
      });
      counter.textContent = (cur + 1) + " / " + N;
      live.textContent = "Page " + (cur + 1) + " of " + N + ": " + PAGES[cur].label;
      document.getElementById("prev").disabled = cur === 0;
      document.getElementById("next").disabled = cur === N - 1;
      setHash(MODE === "link" ? String(cur + 1) : entityId);
    }

    function go(n) {
      n = Math.max(0, Math.min(N - 1, n));
      if (n === cur) return;
      var el;
      if (n > cur) {
        for (var i = cur + 1; i < n; i++) {
          (function (p) { instant(p, function () { p.classList.add("flipped", "gone"); }); })(pageEls[i]);
        }
        el = pageEls[cur];
        el.style.zIndex = String(N + 5);
        el.classList.add("flipped");
        afterFlip(el, function () {
          if (el.classList.contains("flipped")) el.classList.add("gone");
          el.style.zIndex = "";
        });
      } else {
        for (var j = n + 1; j < cur; j++) {
          (function (p) { instant(p, function () { p.classList.remove("flipped", "gone"); }); })(pageEls[j]);
        }
        el = pageEls[n];
        el.style.zIndex = String(N + 5);
        el.classList.remove("gone");
        void el.offsetWidth;
        el.classList.remove("flipped");
        afterFlip(el, function () { el.style.zIndex = ""; });
      }
      cur = n;
      sync();
    }

    function next() { go(cur + 1); }
    function prev() { go(cur - 1); }

    document.getElementById("next").addEventListener("click", next);
    document.getElementById("prev").addEventListener("click", prev);
    dotEls.forEach(function (d) {
      d.addEventListener("click", function () { go(parseInt(d.getAttribute("data-go"), 10)); });
    });

    document.addEventListener("keydown", function (ev) {
      if (token !== ACTIVE) return; // an older book that has been closed
      if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
      var k = ev.key;
      if (k === "ArrowDown" || k === "ArrowRight" || k === "PageDown" || (k === " " && !ev.shiftKey)) { ev.preventDefault(); next(); }
      else if (k === "ArrowUp" || k === "ArrowLeft" || k === "PageUp" || (k === " " && ev.shiftKey)) { ev.preventDefault(); prev(); }
      else if (k === "Home") { ev.preventDefault(); go(0); }
      else if (k === "End") { ev.preventDefault(); go(N - 1); }
    });

    // Mouse wheel and trackpad
    var wheelAcc = 0;
    var wheelLock = 0;
    stage.addEventListener("wheel", function (ev) {
      ev.preventDefault();
      var now = Date.now();
      if (now < wheelLock) return;
      wheelAcc += Math.abs(ev.deltaX) > Math.abs(ev.deltaY) ? ev.deltaX : ev.deltaY;
      if (Math.abs(wheelAcc) > 60) {
        if (wheelAcc > 0) next(); else prev();
        wheelAcc = 0;
        wheelLock = now + 900;
      }
    }, { passive: false });

    /* ---------- Touch: the page follows your finger ---------- */

    var touch = null;

    stage.addEventListener("touchstart", function (ev) {
      if (ev.touches.length !== 1) { touch = null; return; }
      touch = { x: ev.touches[0].clientX, y: ev.touches[0].clientY, t: Date.now(), mode: null, el: null, dir: 0 };
    }, { passive: true });

    stage.addEventListener("touchmove", function (ev) {
      if (!touch || ev.touches.length !== 1) return;
      var dx = ev.touches[0].clientX - touch.x;
      var dy = ev.touches[0].clientY - touch.y;

      if (touch.mode === null) {
        if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          touch.dir = dx < 0 ? 1 : -1;
          var idx = touch.dir === 1 ? cur : cur - 1;
          if ((touch.dir === 1 && cur >= N - 1) || idx < 0) { touch.mode = "none"; return; }
          touch.mode = "drag";
          touch.el = pageEls[idx];
          touch.el.classList.remove("gone");
          touch.el.classList.add("dragging");
          touch.el.style.zIndex = String(N + 5);
        } else if (Math.abs(dy) > 10) {
          touch.mode = "none";
        }
      }

      if (touch.mode === "drag") {
        ev.preventDefault();
        if (reduceMotion) return;
        var w = book.clientWidth;
        var progress = Math.min(1, Math.max(0, (touch.dir === 1 ? -dx : dx) / w));
        var angle = touch.dir === 1 ? -180 * progress : -180 * (1 - progress);
        touch.el.style.transform = "rotateY(" + angle + "deg)";
      }
    }, { passive: false });

    function endTouch(ev) {
      if (!touch) return;
      var t = touch;
      touch = null;
      if (t.mode !== "drag") return;

      var p = ev.changedTouches && ev.changedTouches[0];
      var dx = p ? p.clientX - t.x : 0;
      var moved = (t.dir === 1 ? -dx : dx) / book.clientWidth;
      var quick = Date.now() - t.t < 300 && Math.abs(dx) > 30;
      var commit = moved > 0.3 || quick;
      var el = t.el;

      el.classList.remove("dragging");
      void el.offsetWidth;
      el.style.transform = "";

      if (t.dir === 1) {
        if (commit) {
          el.classList.add("flipped");
          cur += 1;
          afterFlip(el, function () { if (el.classList.contains("flipped")) el.classList.add("gone"); el.style.zIndex = ""; });
          sync();
        } else {
          afterFlip(el, function () { el.style.zIndex = ""; });
        }
      } else {
        if (commit) {
          el.classList.remove("flipped");
          cur -= 1;
          afterFlip(el, function () { el.style.zIndex = ""; });
          sync();
        } else {
          afterFlip(el, function () { el.classList.add("gone"); el.style.zIndex = ""; });
        }
      }
    }
    stage.addEventListener("touchend", endTouch, { passive: true });
    stage.addEventListener("touchcancel", endTouch, { passive: true });

    /* ---------- Tap the page edges to turn ---------- */

    book.addEventListener("click", function (ev) {
      if (ev.target.closest("a, button")) return;
      var r = book.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width;
      if (x > 0.8) next();
      else if (x < 0.15) prev();
    });

    var sw = document.getElementById("switch");
    if (sw) sw.addEventListener("click", function () { setHash(""); showPicker(); });

    sync();
  }
})();
