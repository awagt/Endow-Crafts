/* =====================================================================
   ENDOW CRAFTS — interactions & motion
   No libraries. Content comes from /content/*.json so it can be edited
   on GitHub without touching this file.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- constants ---------- */
  var WA = "97430140637";
  var GREETING = "Hello Endow Crafts! I'd like to ask about a personalised order.";
  var SM = ["corporate-gift-box", "cricut-studio", "cricut-workshop", "executive-gift-set", "home-gift-basket", "kids-party-favors", "laser-engraving", "personalized-everyday", "qatar-collection", "studio-packing", "wedding-keepsake"];
  var FILTERS = [
    ["all", "All"], ["personal", "Personalised"], ["corporate", "Corporate"], ["events", "Events & Parties"],
    ["qatar", "Qatar Collection"], ["accessories", "Accessories"], ["cricut", "Cricut Creations"], ["seasonal", "Seasonal"], ["kids", "Kids & School"]
  ];
  var CAT = {}; FILTERS.forEach(function (f) { CAT[f[0]] = f[1]; });

  var root = document.documentElement;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var waLink = function (t) { return "https://wa.me/" + WA + (t ? "?text=" + encodeURIComponent(t) : ""); };
  window.__ecReady = true;

  /* ---------- analytics (switched on from content/settings.json) ---------- */
  function track(name, params) { try { if (typeof window.gtag === "function") window.gtag("event", name, params || {}); } catch (e) { /* ignore */ } }
  function startAnalytics(id) {
    if (!/^G-[A-Z0-9]{4,20}$/.test(id || "")) return;
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date()); window.gtag("config", id);
  }

  /* ---------- small image helper (uses the 720px copies where they exist) ---------- */
  function img(src, alt, sizes, extra) {
    var base = (src || "").replace(/^images\//, "").replace(/\.webp$/, "");
    var hasSm = /^images\/[^/]+\.webp$/.test(src || "") && SM.indexOf(base) > -1;
    return '<img src="' + esc(hasSm ? "images/sm/" + base + ".webp" : src) + '"' +
      (hasSm ? ' srcset="images/sm/' + esc(base) + '.webp 720w, ' + esc(src) + ' 1400w" sizes="' + (sizes || "100vw") + '"' : "") +
      ' alt="' + esc(alt) + '" loading="lazy" decoding="async"' + (extra || "") + ">";
  }

  /* =====================================================================
     HERO: entrance, film, sound, ambient background
     ===================================================================== */
  var curtainOn = root.classList.contains("js") && !root.classList.contains("no-curtain") && !reduce;
  var base = curtainOn ? 1250 : 120;
  $$(".hero [data-hero]").forEach(function (el) { el.style.setProperty("--d", base + (+el.dataset.hero - 1) * 130); });
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add("is-ready"); }); });
  if (curtainOn) setTimeout(function () { var c = $("#curtain"); if (c) c.remove(); }, 2300); else { var c0 = $("#curtain"); if (c0) c0.remove(); }

  var film = $("#film"), sound = $("#sound"), ambient = $("[data-ambient]"), hero = $("#top");
  if (film) {
    if (reduce || saveData) {
      film.removeAttribute("autoplay"); film.pause();
      sound.setAttribute("aria-label", "Play the brand film with sound");
      $(".sound-label", sound).textContent = "Play film";
    }
    sound.addEventListener("click", function () {
      var on = film.muted || film.paused;
      film.muted = !on ? true : false;
      if (on) { var p = film.play(); if (p && p.catch) p.catch(function () {}); }
      sound.setAttribute("aria-pressed", String(on));
      sound.setAttribute("aria-label", on ? "Turn sound off" : "Turn sound on");
      $(".sound-label", sound).textContent = on ? "Sound on" : "Sound";
      if (on) track("film_sound_on");
    });
    if (ambient && !reduce && !saveData && matchMedia("(min-width: 900px)").matches) {
      $$("source", ambient).forEach(function (s) { s.src = s.dataset.src; });
      ambient.load();
      var ap = ambient.play(); if (ap && ap.catch) ap.catch(function () {});
    }
    /* pause both videos when the hero is off screen */
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        [film, ambient].forEach(function (v) {
          if (!v || !v.currentSrc) return;
          if (e.isIntersecting) { if (!reduce && !saveData) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
          else v.pause();
        });
      });
    }, { threshold: 0.05 }).observe(hero);
  }

  /* =====================================================================
     NAVIGATION, PROGRESS, MENU
     ===================================================================== */
  var nav = $("#nav"), burger = $("#burger"), menu = $("#menu"), progress = $("#progress"), toTop = $("#toTop");
  var lastY = scrollY, ticking = false;
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
    if (open) { nav.classList.remove("is-hidden"); setTimeout(function () { var a = $(".menu-links a", menu); if (a) a.focus({ preventScroll: true }); }, 350); }
  }
  burger.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setMenu(false); burger.focus(); } });
  toTop.addEventListener("click", function () { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* active link while scrolling */
  var navLinks = $$(".nav-links a");
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id && !a.dataset.filter); });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["top", "collections", "corporate", "workshops", "about", "founder", "contact"].forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });

  /* =====================================================================
     SPLIT HEADINGS, REVEALS, STATEMENT FILL
     ===================================================================== */
  function splitWords(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"); w.className = "w";
            var wi = document.createElement("span"); wi.className = "wi"; wi.textContent = part; wi.style.setProperty("--wi", i++);
            w.appendChild(wi); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
  }
  $$("[data-split]").forEach(splitWords);
  $$("[data-stagger]").forEach(function (g) { $$("[data-reveal]", g).forEach(function (el, k) { el.style.setProperty("--i", k); }); });

  var revealer = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); revealer.unobserve(e.target); } });
  }, { rootMargin: "0px 0px 8% 0px", threshold: 0 });
  function watch(scope) { $$("[data-reveal], [data-split]", scope).forEach(function (el) { if (!el.classList.contains("is-in")) revealer.observe(el); }); }
  watch(document);

  /* statement: words light up as it scrolls through */
  var fillEls = $$("[data-fill]").map(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="fw">' + esc(w) + "</span>"; }).join(" ");
    return { el: el, words: $$(".fw", el) };
  });

  /* =====================================================================
     PARALLAX + HORIZONTAL SHOWCASE (one scroll loop)
     ===================================================================== */
  var parallax = (!reduce && matchMedia("(min-width: 900px)").matches) ? $$("[data-parallax]") : [];
  var showcase = $("#collections"), track_ = $("#showTrack"), meter = $("#showMeter");
  var pinned = false, travel = 0;
  function layoutShowcase() {
    var want = false; /* pinned horizontal scroll switched off: it made the page feel long */
    showcase.classList.toggle("is-pinned", want);
    pinned = want;
    if (want) {
      track_.style.transform = "";
      travel = Math.max(0, track_.scrollWidth - innerWidth);
      showcase.style.height = (innerHeight + travel) + "px";
    } else {
      showcase.style.height = ""; track_.style.transform = "";
    }
  }
  track_.addEventListener("scroll", function () {
    if (pinned) return;
    var max = track_.scrollWidth - track_.clientWidth;
    meter.style.transform = "scaleX(" + (0.18 + 0.82 * (max ? track_.scrollLeft / max : 0)) + ")";
  }, { passive: true });

  function stepShow(d) {
    var card = $(".coll", track_); var w = card ? card.getBoundingClientRect().width + 24 : 320;
    track_.scrollBy({ left: d * w, behavior: reduce ? "auto" : "smooth" });
  }
  var sp = $("#showPrev"), sn = $("#showNext");
  if (sp) sp.addEventListener("click", function () { stepShow(-1); });
  if (sn) sn.addEventListener("click", function () { stepShow(1); });

  function onScroll() {
    var y = scrollY, vh = innerHeight, docH = document.documentElement.scrollHeight;
    progress.style.transform = "scaleX(" + clamp(y / Math.max(1, docH - vh), 0, 1) + ")";
    var heroEnd = hero.offsetHeight - 80;
    nav.classList.toggle("is-over-hero", y < heroEnd && !document.body.classList.contains("menu-open"));
    if (!document.body.classList.contains("menu-open")) {
      if (y > heroEnd && y > lastY + 6) nav.classList.add("is-hidden");
      else if (y < lastY - 6 || y < heroEnd) nav.classList.remove("is-hidden");
    }
    lastY = y;
    toTop.classList.toggle("show", y > vh * 1.4);

    parallax.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var mid = r.top + r.height / 2 - vh / 2;
      el.style.setProperty("--py", (mid * -parseFloat(el.dataset.parallax)).toFixed(1) + "px");
    });

    if (pinned) {
      var top = showcase.getBoundingClientRect().top;
      var p = travel ? clamp(-top / travel, 0, 1) : 0;
      track_.style.transform = "translate3d(" + (-p * travel).toFixed(1) + "px,0,0)";
      meter.style.transform = "scaleX(" + (0.18 + 0.82 * p) + ")";
    }

    fillEls.forEach(function (f) {
      var r = f.el.getBoundingClientRect();
      var p = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.38), 0, 1);
      var n = Math.round(p * f.words.length);
      f.words.forEach(function (w, k) { w.classList.toggle("on", k < n); });
    });
    ticking = false;
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  var rt; addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { layoutShowcase(); onScroll(); }, 150); });
  layoutShowcase(); onScroll();
  addEventListener("load", function () { layoutShowcase(); onScroll(); });

  /* =====================================================================
     STUDIO STORY (sticky image follows the steps)
     ===================================================================== */
  var storyImgs = $$(".story-frame img"), storyNow = $("#storyNow"), steps = $$(".story-step");
  var storyIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var k = +e.target.dataset.step;
      steps.forEach(function (s, j) { s.classList.toggle("is-on", j === k); });
      storyImgs.forEach(function (im, j) { im.classList.toggle("is-on", j === k); });
      if (storyNow) storyNow.textContent = pad(k + 1);
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach(function (s) { storyIO.observe(s); });

  /* =====================================================================
     CATALOGUE DRIFT (seamless loop)
     ===================================================================== */
  $$(".drift-track").forEach(function (t) { $$("img", t).forEach(function (im) { var c = im.cloneNode(); c.setAttribute("aria-hidden", "true"); t.appendChild(c); }); });

  /* =====================================================================
     MAGNETIC BUTTONS + CURSOR (fine pointers only)
     ===================================================================== */
  if (fine && !reduce) {
    $$("[data-magnetic]").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px " + ((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1) + "px";
      });
      b.addEventListener("mouseleave", function () { b.style.translate = ""; });
    });
    var cursor = $("#cursor"), cx = -200, cy = -200, raf = 0;
    addEventListener("mousemove", function (e) {
      cx = e.clientX; cy = e.clientY;
      if (!raf) raf = requestAnimationFrame(function () { cursor.style.setProperty("--cx", cx + "px"); cursor.style.setProperty("--cy", cy + "px"); raf = 0; });
    }, { passive: true });
    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest("[data-cursor]");
      cursor.classList.toggle("on", !!t);
      if (t) $("span", cursor).textContent = t.dataset.cursor;
    });
  }

  /* =====================================================================
     WORKSHOPS list
     ===================================================================== */
  var wsBtns = $$("#wsList button"), wsTopic = "";
  function pickWs(b) {
    wsBtns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    wsTopic = b.dataset.topic;
  }
  wsBtns.forEach(function (b) { b.addEventListener("click", function () { pickWs(b); }); });
  if (wsBtns[0]) pickWs(wsBtns[0]);

  /* =====================================================================
     CONTENT: gallery, featured, settings, testimonials
     ===================================================================== */
  var WORKS = [], visible = [], curFilter = "all";
  var gallery = $("#gallery"), filtersEl = $("#filters"), featList = $("#featList");

  function renderFilters() {
    filtersEl.innerHTML = FILTERS.map(function (f) {
      var n = f[0] === "all" ? WORKS.length : WORKS.filter(function (w) { return (w.categories || []).indexOf(f[0]) > -1; }).length;
      if (!n && f[0] !== "all") return "";
      return '<button class="filter" type="button" data-f="' + f[0] + '" aria-pressed="' + (f[0] === curFilter) + '">' + esc(f[1]) + "<sup>" + n + "</sup></button>";
    }).join("");
  }
  function renderGallery() {
    if (!WORKS.length) { gallery.innerHTML = '<p class="gal-empty">The gallery appears when the site is opened online.</p>'; return; }
    gallery.innerHTML = WORKS.map(function (w, i) {
      return '<button class="piece" type="button" data-i="' + i + '" data-cursor="View" aria-label="View ' + esc(w.title) + '">' +
        '<span class="ph">' + img(w.image, w.title + ", personalised by Endow Crafts in Qatar", "(min-width:1180px) 22vw, (min-width:760px) 30vw, 46vw") + "</span>" +
        '<span class="cap"><span class="no">No. ' + pad(i + 1) + '</span><span class="t">' + esc(w.title) + '</span><span class="m">' + esc(w.material) + "</span></span></button>";
    }).join("");
    applyFilter(curFilter, false);
  }
  function applyFilter(f, animate) {
    if (!CAT[f]) f = "all";
    var run = function () {
      curFilter = f; visible = [];
      $$(".filter", filtersEl).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.f === f)); });
      $$(".piece", gallery).forEach(function (el) {
        var w = WORKS[+el.dataset.i], show = f === "all" || (w.categories || []).indexOf(f) > -1;
        el.classList.toggle("is-hidden", !show); el.classList.remove("pop");
        if (show) {
          visible.push(+el.dataset.i);
          if (animate && !reduce && !document.startViewTransition) { el.style.setProperty("--i", visible.length - 1); void el.offsetWidth; el.classList.add("pop"); }
        }
      });
    };
    if (animate && !reduce && document.startViewTransition) document.startViewTransition(run); else run();
    if (animate) track("gallery_filter", { category: f });
  }
  filtersEl.addEventListener("click", function (e) { var b = e.target.closest(".filter"); if (b) applyFilter(b.dataset.f, true); });
  gallery.addEventListener("click", function (e) { var b = e.target.closest(".piece"); if (b) openLb(+b.dataset.i, visible.slice()); });

  function renderFeatured() {
    var list = WORKS.map(function (w, i) { return { w: w, i: i }; }).filter(function (x) { return x.w.featured; });
    if (!list.length) list = WORKS.slice(0, 4).map(function (w, i) { return { w: w, i: i }; });
    var idx = list.map(function (x) { return x.i; });
    var html = list.map(function (x, k) {
      var w = x.w, cats = (w.categories || []).map(function (c) { return CAT[c] || c; }).slice(0, 2).join(" · ");
      return '<article class="feat">' +
        '<figure class="feat-media" data-reveal="clip" data-cursor="View" data-open="' + x.i + '" role="button" tabindex="0" aria-label="View ' + esc(w.title) + '">' +
          img(w.image, w.title + ", personalised by Endow Crafts", "(min-width:900px) 56vw, 100vw") +
          '<span class="feat-no">No. ' + pad(x.i + 1) + "</span></figure>" +
        '<div class="feat-body">' +
          '<p class="feat-cat" data-reveal>' + esc(cats) + "</p>" +
          '<h3 data-split>' + esc(w.title) + "</h3>" +
          '<p class="feat-desc" data-reveal>' + esc(w.description) + "</p>" +
          '<dl class="feat-meta" data-reveal><dt>Materials</dt><dd>' + esc(w.material) + "</dd><dt>Occasion</dt><dd>" + esc(w.occasion) + "</dd></dl>" +
          '<ul class="tags tags--sm" data-reveal aria-label="Personalise with">' + (w.options || []).map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>" +
          '<div class="feat-actions" data-reveal>' +
            '<a class="btn btn-forest" href="' + waLink("Hello Endow Crafts! I'd like something similar to No. " + pad(x.i + 1) + " — " + w.title + ".") + '" target="_blank" rel="noopener noreferrer" data-track="request_similar" data-where="' + esc(w.title) + '"><svg aria-hidden="true"><use href="#i-wa"/></svg> Request Similar</a>' +
            '<button class="link-line" type="button" data-add="' + x.i + '">Add to my enquiry <svg aria-hidden="true"><use href="#i-plus"/></svg></button>' +
          "</div></div></article>";
    });
    featList.innerHTML = html[0] + (html.length > 1 ? '<div class="feat-grid">' + html.slice(1).join("") + "</div>" : "");
    $$("[data-split]", featList).forEach(splitWords);
    watch(featList);
    $$("[data-open]", featList).forEach(function (f) {
      var open = function () { openLb(+f.dataset.open, idx); };
      f.addEventListener("click", open);
      f.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    if (fine && !reduce) $$(".feat-media img", featList).forEach(function (im) { im.setAttribute("data-parallax", "0.05"); parallax.push(im); });
  }
  featList.addEventListener("click", function (e) { var b = e.target.closest("[data-add]"); if (b) addToEnquiry(+b.dataset.add); });

  function getJSON(url) { return fetch(url, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }

  getJSON("content/gallery.json").then(function (d) { WORKS = Array.isArray(d) ? d : []; })
    .catch(function () { WORKS = []; })
    .then(function () {
      renderFilters(); renderGallery(); renderFeatured();
      var pending = sessionStorage.getItem("ec-filter");
      if (pending) { sessionStorage.removeItem("ec-filter"); applyFilter(pending, false); }
      onScroll();
    });

  getJSON("content/settings.json").then(function (s) {
    if (s && s.google_analytics_id) startAnalytics(String(s.google_analytics_id).trim());
    if (s && s.founder_photo) {
      var ph = $(".founder-photo"), probe = new Image();
      probe.onload = function () { ph.src = s.founder_photo; ph.hidden = false; $(".founder-mono").hidden = true; };
      probe.src = s.founder_photo;
    }
  }).catch(function () {});

  /* testimonials: shown only when real (non-placeholder) reviews exist */
  getJSON("content/testimonials.json").then(function (d) {
    var real = (Array.isArray(d) ? d : []).filter(function (q) { return q && q.quote && !q.placeholder; });
    if (!real.length) return;
    var sec = $("#reviews"), box = $("#rev"), qi = 0, timer;
    sec.hidden = false; watch(sec);
    function show(k) {
      qi = (k + real.length) % real.length; var q = real[qi];
      box.innerHTML = '<div class="rev-item"><blockquote>“' + esc(q.quote) + '”</blockquote><div class="who"><b>' + esc(q.name) + "</b><span>" + esc(q.project || "") + "</span></div></div>" +
        (real.length > 1 ? '<div class="rev-nav"><button class="icon-btn" type="button" data-q="-1" aria-label="Previous review"><svg aria-hidden="true"><use href="#i-left"/></svg></button><button class="icon-btn" type="button" data-q="1" aria-label="Next review"><svg aria-hidden="true"><use href="#i-right"/></svg></button><span class="rev-dots">' + real.map(function (_, j) { return '<i class="' + (j === qi ? "on" : "") + '"></i>'; }).join("") + "</span></div>" : "");
      clearTimeout(timer); if (!reduce && real.length > 1) timer = setTimeout(function () { show(qi + 1); }, 8000);
    }
    box.addEventListener("click", function (e) { var b = e.target.closest("[data-q]"); if (b) show(qi + +b.dataset.q); });
    box.addEventListener("mouseenter", function () { clearTimeout(timer); });
    show(0);
  }).catch(function () {});

  /* =====================================================================
     LIGHTBOX
     ===================================================================== */
  var lb = $("#lb"), li = 0, lbList = [], lastFocus = null;
  function fillLb() {
    var w = WORKS[li]; if (!w) return;
    var im = $("#lbImg"); im.src = w.image; im.alt = w.title;
    $("#lbNo").textContent = "No. " + pad(li + 1) + ((w.categories || []).length ? " · " + w.categories.map(function (c) { return CAT[c] || c; }).join(" · ") : "");
    $("#lbTitle").textContent = w.title;
    $("#lbDesc").textContent = w.description || "";
    $("#lbOpts").innerHTML = (w.options || []).map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("");
    $("#lbOcc").textContent = w.occasion || "";
    $("#lbMat").textContent = w.material || "";
    $("#lbCount").textContent = (lbList.indexOf(li) + 1) + " / " + lbList.length;
    $("#lbWa").href = waLink("Hello Endow Crafts! I'd like something similar to No. " + pad(li + 1) + " — " + w.title + ".");
    $(".lb-nav", lb).hidden = lbList.length < 2;
  }
  function openLb(i, list) {
    li = i; lbList = list && list.length ? list : [i]; fillLb();
    lastFocus = document.activeElement; lb.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () { lb.classList.add("open"); });
    $("#lbClose").focus();
    track("portfolio_view", { item_name: WORKS[i] && WORKS[i].title });
  }
  function closeLb() {
    lb.classList.remove("open"); document.body.style.overflow = "";
    setTimeout(function () { lb.hidden = true; if (lastFocus) lastFocus.focus(); }, reduce ? 0 : 350);
  }
  function stepLb(d) { var p = lbList.indexOf(li); li = lbList[(p + d + lbList.length) % lbList.length]; fillLb(); }
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", function () { stepLb(-1); });
  $("#lbNext").addEventListener("click", function () { stepLb(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowRight") stepLb(1);
    else if (e.key === "ArrowLeft") stepLb(-1);
    else if (e.key === "Tab") {
      var f = $$("button, a[href]", lb).filter(function (x) { return x.offsetParent; }), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  var tx = null;
  $(".lb-media").addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  $(".lb-media").addEventListener("touchend", function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 45) stepLb(dx < 0 ? 1 : -1); tx = null; });
  $("#lbAdd").addEventListener("click", function () { var i = li; closeLb(); addToEnquiry(i); });

  /* =====================================================================
     ENQUIRY FORMS (validation → WhatsApp)
     ===================================================================== */
  var tabsEl = $(".form-tabs"), tabs = $$(".form-tabs [role=tab]"), forms = { quote: $("#form-quote"), corp: $("#form-corp"), workshop: $("#form-workshop") };
  var sent = $("#sent"), lastText = "";
  function openForm(which) {
    if (!forms[which]) which = "quote";
    tabsEl.dataset.active = which; tabsEl.hidden = false; sent.hidden = true;
    tabs.forEach(function (t) { var on = t.dataset.ft === which; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
    Object.keys(forms).forEach(function (k) { forms[k].hidden = k !== which; });
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { openForm(t.dataset.ft); }); });
  tabsEl.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    var k = tabs.findIndex(function (t) { return t.getAttribute("aria-selected") === "true"; });
    var n = tabs[(k + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    openForm(n.dataset.ft); n.focus();
  });
  function goEnquiry(focusSel) {
    var card = $("#enquiry");
    card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (focusSel) setTimeout(function () { var el = $(focusSel); if (el) el.focus({ preventScroll: true }); }, reduce ? 0 : 700);
  }
  function addToEnquiry(i) {
    var w = WORKS[i]; if (!w) return;
    openForm("quote");
    var m = $("#q-msg"), line = "I'm interested in something like No. " + pad(i + 1) + " — " + w.title + ".";
    if (m.value.indexOf(line) < 0) m.value = (m.value ? m.value + "\n" : "") + line;
    goEnquiry("#q-name");
  }

  /* links that open a form or a gallery filter */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-form], a[data-filter]");
    if (!a) return;
    if (a.dataset.filter && a.tagName === "A") {
      e.preventDefault();
      if (WORKS.length) applyFilter(a.dataset.filter, false); else sessionStorage.setItem("ec-filter", a.dataset.filter);
      if (document.body.classList.contains("menu-open")) setMenu(false);
      $("#work").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      return;
    }
    if (a.dataset.form) {
      e.preventDefault();
      openForm(a.dataset.form);
      if (a.dataset.form === "workshop" && wsTopic) { var s = $("#w-topic"); $$("option", s).forEach(function (o) { if (o.text === wsTopic) s.value = o.value || o.text; }); }
      goEnquiry(a.dataset.form === "corp" ? "#c-company" : a.dataset.form === "workshop" ? "#w-name" : "#q-name");
    }
  });
  /* collection cards and other buttons with data-filter */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-filter]"); if (!b) return;
    applyFilter(b.dataset.filter, true); $("#work").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });

  var todayISO = (function () { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); })();
  $$('input[type="date"]').forEach(function (d) { d.min = todayISO; });

  function check(el) {
    var box = el.closest(".f"); if (!box) return true;
    var msg = $(".msg", box), v = (el.value || "").trim(), err = "";
    var name = (($("label", box) || {}).textContent || "this field").replace("*", "").trim().toLowerCase();
    if (el.required && !v) err = el.tagName === "SELECT" ? "Please choose an option." : "Please enter your " + name + ".";
    else if (v && el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) err = "Enter an email like name@example.com.";
    else if (v && el.type === "tel" && v.replace(/\D/g, "").length < 8) err = "Enter a phone number with at least 8 digits.";
    else if (v && el.type === "number" && !(+v >= 1)) err = "Enter 1 or more.";
    else if (v && el.type === "date" && v < todayISO) err = "Choose today or a later date.";
    box.classList.toggle("err", !!err);
    if (msg) { msg.textContent = err; el.setAttribute("aria-describedby", msg.id); }
    el.setAttribute("aria-invalid", err ? "true" : "false");
    return !err;
  }
  Object.keys(forms).forEach(function (k) {
    var form = forms[k];
    $$("input, select, textarea", form).forEach(function (el) {
      el.addEventListener("blur", function () { if ((el.value || "").trim() || el.getAttribute("aria-invalid") === "true") check(el); });
      el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") check(el); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = $$("input, select, textarea", form), ok = fields.map(check).every(Boolean);
      if (!ok) { var bad = $('[aria-invalid="true"]', form); if (bad) bad.focus(); return; }
      var lines = ["Hello Endow Crafts! " + form.dataset.title + " from the website:", ""];
      fields.forEach(function (f) { var v = (f.value || "").trim(); if (v && f.name) lines.push(f.name + ": " + v); });
      lastText = lines.join("\n");
      var url = waLink(lastText), win = null;
      try { win = window.open(url, "_blank"); if (win) win.opener = null; } catch (err) { win = null; }
      $("#sentLink").href = url;
      $("#sentTitle").textContent = "Thank you — your " + form.dataset.title.toLowerCase() + " is ready";
      $("#sentText").textContent = win
        ? "WhatsApp has opened in a new tab with your details filled in. Press send there and we'll reply as soon as we can."
        : "Tap the button below to open WhatsApp with your details filled in, then press send.";
      Object.keys(forms).forEach(function (j) { forms[j].hidden = true; });
      tabsEl.hidden = true; sent.hidden = false;
      $("#sentLink").focus({ preventScroll: true });
      sent.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      track("generate_lead", { form_type: k });
    });
  });
  $("#sentBack").addEventListener("click", function () {
    var k = tabsEl.dataset.active || "quote"; forms[k].reset(); openForm(k);
    var first = $("input", forms[k]); if (first) first.focus();
  });
  $("#sentCopy").addEventListener("click", function () {
    var b = this;
    navigator.clipboard.writeText(lastText).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy my enquiry"; }, 1800); }, function () { b.textContent = "Copy not available"; });
  });
  openForm("quote");

  /* =====================================================================
     SMALL THINGS: WhatsApp links, copy buttons, tracking
     ===================================================================== */
  $$("a[data-wa]").forEach(function (a) { a.href = waLink(GREETING); });
  $$(".copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var done = function () { b.textContent = "Copied"; b.classList.add("ok"); setTimeout(function () { b.textContent = "Copy"; b.classList.remove("ok"); }, 1600); };
      var fallback = function () { var t = $(".c-tx a, .c-tx span", b.parentElement); if (t) { var r = document.createRange(); r.selectNodeContents(t); var s = getSelection(); s.removeAllRanges(); s.addRange(r); } b.textContent = "Selected"; };
      try { navigator.clipboard.writeText(b.dataset.copy).then(done, fallback); } catch (e) { fallback(); }
    });
  });
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]"); if (!a) return;
    var href = a.getAttribute("href") || "", where = a.dataset.where || ((a.closest("section, header, footer, .fab, .menu") || {}).id || (a.closest(".fab") ? "floating_button" : a.closest("footer") ? "footer" : "page"));
    if (a.dataset.track) track(a.dataset.track, { link_location: where });
    else if (href.indexOf("wa.me") > -1) track("whatsapp_click", { link_location: where });
    else if (href.indexOf("mailto:") === 0) track("email_click", { link_location: where });
  }, true);
})();
