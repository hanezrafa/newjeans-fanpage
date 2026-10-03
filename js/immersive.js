/* =========================================================
   NewJeans fan page - immersive layer (Y2K / Powerpuff)
   A custom bead cursor, a floating field of pink / blue / lime
   beads that drift gently and push away from the pointer, hero
   parallax, and a smooth section-jump via the View Transitions API.

   Everything is CSS/JS authored - no third-party art. All of it
   is skipped under prefers-reduced-motion and on touch devices.
   ========================================================= */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------------------------------------------------
     Custom bead cursor (pointer devices only)
     --------------------------------------------------------- */
  function initCursor() {
    var cursor = document.getElementById('y2k-cursor');
    if (!cursor || !finePointer || reduce) return;

    var dot = cursor.querySelector('.y2k-cursor__dot');
    var ring = cursor.querySelector('.y2k-cursor__ring');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    document.body.classList.add('has-y2k-cursor');

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      // the dot follows the pointer exactly (no lag)
      dot.style.setProperty('--cx', mx + 'px');
      dot.style.setProperty('--cy', my + 'px');
      var hot = e.target.closest('a, button, .shot__btn, .tape-btn, input');
      cursor.classList.toggle('is-hot', !!hot);
    });

    (function loop() {
      // the ring trails well behind - a clear Y2K lag
      rx += (mx - rx) * 0.17;
      ry += (my - ry) * 0.17;
      ring.style.setProperty('--rx', rx + 'px');
      ring.style.setProperty('--ry', ry + 'px');
      requestAnimationFrame(loop);
    })();
  }

  /* ---------------------------------------------------------
     Powerpuff bead field: beads drift, and push away from pointer
     --------------------------------------------------------- */
  function initBeads() {
    var field = document.getElementById('beadfield');
    if (!field || reduce) return;

    var KINDS = ['blossom', 'bubbles', 'buttercup'];
    var beads = [];
    var mx = -9999, my = -9999;   // pointer, in document coordinates

    // the field scrolls with the page, so scatter the beads down the whole
    // document, not just the first screen
    function pageH() { return Math.max(document.documentElement.scrollHeight, window.innerHeight); }
    var vh = window.innerHeight;
    var COUNT = Math.round(pageH() / vh) * (finePointer ? 12 : 8);

    function build() {
      field.innerHTML = '';
      beads.length = 0;
      var w = document.documentElement.clientWidth;
      var h = pageH() - 40;
      for (var i = 0; i < COUNT; i++) {
        var b = document.createElement('span');
        var kind = KINDS[i % 3];
        b.className = 'bead bead--' + kind;
        var size = 10 + Math.random() * 22;
        b.style.width = size + 'px';
        b.style.height = size + 'px';
        field.appendChild(b);
        var hx = Math.random() * w;
        var hy = 20 + Math.random() * h;
        beads.push({
          el: b,
          homeX: hx, homeY: hy,   // the spot the bead floats around (document coords)
          x: hx, y: hy,           // current (pushed) spot
          r: size / 2,
          // each bead drifts on its own gentle path, so the field feels alive
          amp: 6 + Math.random() * 14,       // how far it wanders
          spd: 0.25 + Math.random() * 0.4,   // how fast
          ph: Math.random() * Math.PI * 2     // start phase, so they are out of step
        });
      }
    }
    build();

    if (finePointer) {
      document.addEventListener('mousemove', function (e) {
        // beads live in document space, so fold in the scroll offset
        mx = e.clientX + window.scrollX;
        my = e.clientY + window.scrollY;
      });
    }

    var paused = false;
    document.addEventListener('visibilitychange', function () {
      paused = document.hidden;
    });

    // the first pass can run before the page has its full height (fonts,
    // images). once everything is loaded, and on resize, re-scatter so the
    // bead count matches the real page length.
    var lastH = pageH();
    function resettle() {
      var nh = pageH();
      if (nh !== lastH) {
        lastH = nh;
        COUNT = Math.round(nh / vh) * (finePointer ? 12 : 8);
        build();
      }
    }
    window.addEventListener('resize', resettle, { passive: true });
    window.addEventListener('load', resettle);
    setTimeout(resettle, 400);

    var t0 = performance.now();
    (function loop(now) {
      requestAnimationFrame(loop);
      if (paused) return;
      var t = (now - t0) / 1000;
      for (var i = 0; i < beads.length; i++) {
        var o = beads[i];
        // gentle float around the home spot, from a sine path so it never
        // wanders off; the home stays fixed so scroll behaviour is unchanged
        var fx = o.homeX + Math.sin(t * o.spd + o.ph) * o.amp;
        var fy = o.homeY + Math.cos(t * o.spd * 0.8 + o.ph) * o.amp * 0.7;
        // ease the bead towards that moving float point
        o.x += (fx - o.x) * 0.06;
        o.y += (fy - o.y) * 0.06;
        // push away from the pointer
        var ddx = o.x - mx, ddy = o.y - my;
        var d2 = ddx * ddx + ddy * ddy;
        if (d2 < 16000 && d2 > 0.01) {
          var d = Math.sqrt(d2);
          var force = (1 - d / 126) * 1.4;
          o.x += (ddx / d) * force;
          o.y += (ddy / d) * force;
        }
        o.el.style.transform = 'translate(' + o.x.toFixed(1) + 'px,' + o.y.toFixed(1) + 'px)';
      }
    })(t0);
  }

  /* ---------------------------------------------------------
     Hero parallax: prints move by depth as the page scrolls
     --------------------------------------------------------- */
  function initParallax() {
    if (reduce) return;
    var items = document.querySelectorAll('[data-depth]');
    if (!items.length) return;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      // only meaningful near the top; clamp so it settles
      var p = Math.min(y, window.innerHeight);
      items.forEach(function (el) {
        var depth = parseFloat(el.getAttribute('data-depth')) || 0;
        el.style.setProperty('--py', (-p * depth) + 'px');
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------
     Smooth section jumps with the View Transitions API (fallback: normal)
     --------------------------------------------------------- */
  function initViewTransitions() {
    if (!document.startViewTransition || reduce) return;
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        document.startViewTransition(function () {
          target.scrollIntoView({ behavior: 'instant', block: 'start' });
        });
      });
    });
  }

  /* ---------------------------------------------------------
     Cross-page transition: clicking a member photo tags it with a
     shared view-transition-name, so it morphs into the profile page.
     --------------------------------------------------------- */
  function initPageMorph() {
    if (reduce) return;
    // with `@view-transition { navigation: auto }` the browser runs the
    // cross-document transition itself. We only tag the clicked photo so it
    // lines up with the portrait on the next page, then let the link go.
    document.addEventListener('click', function (e) {
      var link = e.target.closest('.member__link');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (link.host && link.host !== location.host) return;
      var photo = link.querySelector('.member__photo');
      if (!photo) return;
      // give the clicked photo the shared name for this snapshot
      photo.style.viewTransitionName = 'member-photo';
      // clear it again in case the navigation is cancelled (e.g. open in new tab)
      setTimeout(function () { photo.style.viewTransitionName = ''; }, 1500);
    });
  }

  /* ---------------------------------------------------------
     3D tilt: the big member prints lean toward the pointer
     --------------------------------------------------------- */
  function initTilt() {
    if (reduce || !finePointer) return;
    var MAX = 13; // degrees, a clear lean so every card reads as responsive

    // delegated, so member cards that main.js builds after boot still tilt
    var active = null;
    function resetCard(c) {
      c.classList.remove('is-tilting');
      c.style.setProperty('--rx', '0deg');
      c.style.setProperty('--ry', '0deg');
    }
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest ? e.target.closest('.member') : null;
      if (card !== active) {
        if (active) resetCard(active);
        active = card;
        if (active) active.classList.add('is-tilting');
      }
      if (!card) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((px - 0.5) * 2 * MAX).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((0.5 - py) * 2 * MAX).toFixed(2) + 'deg');
    }, { passive: true });
    // clear the lean when the pointer leaves the whole grid
    document.addEventListener('pointerleave', function () {
      if (active) { resetCard(active); active = null; }
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     Scroll progress bar + live section counter
     --------------------------------------------------------- */
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    var counter = document.getElementById('section-here');
    var sections = [].slice.call(document.querySelectorAll('[data-section]'));
    var ticking = false;

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      if (counter && sections.length) {
        var here = sections[0];
        var mid = window.scrollY + window.innerHeight * 0.35;
        for (var i = 0; i < sections.length; i++) {
          if (sections[i].offsetTop <= mid) here = sections[i];
        }
        var idx = sections.indexOf(here) + 1;
        var label = here.getAttribute('data-section') || '';
        if (counter.firstChild) {
          counter.firstChild.nodeValue = String(idx).padStart(2, '0') + ' / ' + String(sections.length).padStart(2, '0') + '  ' + label;
        }
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ---------------------------------------------------------
     Click ripple: a small bead splash on buttons and links
     --------------------------------------------------------- */
  function initRipple() {
    if (reduce) return;
    document.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      var host = e.target.closest('a, button, .shot__btn, .tape-btn, .member__link, .release__play');
      if (!host) return;
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      var r = host.getBoundingClientRect();
      var span = document.createElement('span');
      span.className = 'ripple';
      span.style.left = (e.clientX - r.left) + 'px';
      span.style.top = (e.clientY - r.top) + 'px';
      span.style.width = span.style.height = Math.max(r.width, r.height) * 1.6 + 'px';
      host.appendChild(span);
      setTimeout(function () { span.remove(); }, 600);
    });
  }

  /* ---------------------------------------------------------
     Bead burst: when a track starts, a few beads fly out of the
     play button (a small celebratory pop).
     --------------------------------------------------------- */
  function beadBurst(x, y) {
    if (reduce) return;
    var KINDS = ['blossom', 'bubbles', 'buttercup'];
    for (var i = 0; i < 10; i++) {
      var b = document.createElement('span');
      b.className = 'burst-bead burst-bead--' + KINDS[i % 3];
      b.style.left = x + 'px';
      b.style.top = y + 'px';
      var ang = (Math.PI * 2 * i) / 10 + Math.random() * 0.5;
      var dist = 40 + Math.random() * 70;
      b.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(0) + 'px');
      b.style.setProperty('--dy', (Math.sin(ang) * dist).toFixed(0) + 'px');
      var size = 8 + Math.random() * 12;
      b.style.width = b.style.height = size + 'px';
      document.body.appendChild(b);
      (function (node) { setTimeout(function () { node.remove(); }, 700); })(b);
    }
  }

  function initBurst() {
    if (reduce) return;
    document.addEventListener('nj:play', function (e) {
      var d = e.detail || {};
      if (typeof d.x === 'number' && typeof d.y === 'number') beadBurst(d.x, d.y);
    });
    // a member page opens with a burst in that member's colour
    var body = document.body;
    if (body.hasAttribute('data-member')) {
      var tone = getComputedStyle(document.documentElement).getPropertyValue('--tone').trim() || '#ff8fc4';
      setTimeout(function () {
        memberBurst(window.innerWidth / 2, window.innerHeight * 0.42, tone);
      }, 420);
    }
  }

  function memberBurst(x, y, colour) {
    if (reduce) return;
    var n = 26;
    for (var i = 0; i < n; i++) {
      var b = document.createElement('span');
      b.className = 'burst-bead';
      b.style.background = 'radial-gradient(circle at 35% 30%, #fff, ' + colour + ' 62%, rgba(0,0,0,0.25))';
      b.style.left = x + 'px';
      b.style.top = y + 'px';
      var ang = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      var dist = 90 + Math.random() * 160;
      b.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(0) + 'px');
      b.style.setProperty('--dy', (Math.sin(ang) * dist).toFixed(0) + 'px');
      var size = 8 + Math.random() * 16;
      b.style.width = b.style.height = size + 'px';
      document.body.appendChild(b);
      (function (node) { setTimeout(function () { node.remove(); }, 900); })(b);
    }
  }

  /* ---------------------------------------------------------
     Scroll distortion: big headings ripple into place as they enter
     --------------------------------------------------------- */
  function initWarpHeadings() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var heads = document.querySelectorAll('.hero__word, .section-num, .profile__name, .profile__signature');
    if (!heads.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          el.classList.add('warp-in');
          // clear the class after it plays so it can replay if scrolled back into view
          setTimeout(function () { el.classList.remove('warp-in'); }, 1100);
          io.unobserve(el);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    heads.forEach(function (h) { io.observe(h); });
  }

  /* ---------------------------------------------------------
     Drag-to-explore: the hero pinwall can be nudged like a real
     cork board. Pointer drag moves it; it eases to a clamp so it
     never flies off. Skipped on touch (native scroll wins) and reduced.
     --------------------------------------------------------- */
  function initDragBoard() {
    if (reduce || !finePointer) return;
    var board = document.querySelector('.hero__pinwall');
    if (!board) return;
    var DRAGX = 40, DRAGY = 26; // how far it may be nudged
    var x = 0, y = 0, tx = 0, ty = 0;
    var dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;

    board.classList.add('is-draggable');

    board.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY; ox = x; oy = y;
      board.classList.add('is-grabbing');
      board.setPointerCapture && board.setPointerCapture(e.pointerId);
    });
    board.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      tx = Math.max(-DRAGX, Math.min(DRAGX, ox + (e.clientX - sx)));
      ty = Math.max(-DRAGY, Math.min(DRAGY, oy + (e.clientY - sy)));
    });
    function end(e) {
      if (!dragging) return;
      dragging = false;
      board.classList.remove('is-grabbing');
      board.releasePointerCapture && e.pointerId != null && board.hasPointerCapture && board.hasPointerCapture(e.pointerId) && board.releasePointerCapture(e.pointerId);
    }
    board.addEventListener('pointerup', end);
    board.addEventListener('pointercancel', end);

    (function loop() {
      requestAnimationFrame(loop);
      // ease toward the target, and drift home when released
      var gx = dragging ? tx : 0;
      var gy = dragging ? ty : 0;
      x += (gx - x) * 0.1; y += (gy - y) * 0.1;
      if (Math.abs(x) < 0.05 && Math.abs(y) < 0.05 && !dragging) x = y = 0;
      board.style.setProperty('--dragx', x.toFixed(2) + 'px');
      board.style.setProperty('--dragy', y.toFixed(2) + 'px');
    })();
  }

  function boot() {
    initCursor();
    initBeads();
    initParallax();
    initViewTransitions();
    initPageMorph();
    initTilt();
    initScrollProgress();
    initRipple();
    initBurst();
    initWarpHeadings();
    initDragBoard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
