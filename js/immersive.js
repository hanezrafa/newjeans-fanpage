/* =========================================================
   NewJeans fan page - immersive layer (Y2K / Powerpuff)
   A custom bead cursor, a drifting field of pink / blue / lime
   beads that lean away from the pointer, hero parallax, and a
   smooth section-jump via the View Transitions API.

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
    var COUNT = finePointer ? 12 : 8;
    var beads = [];
    var mx = -9999, my = -9999;

    for (var i = 0; i < COUNT; i++) {
      var b = document.createElement('span');
      var kind = KINDS[i % 3];
      b.className = 'bead bead--' + kind;
      var size = 10 + Math.random() * 22;
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      field.appendChild(b);
      var hx = Math.random() * window.innerWidth;
      var hy = Math.random() * window.innerHeight;
      beads.push({
        el: b,
        homeX: hx, homeY: hy,   // the spot the bead returns to
        x: hx, y: hy,           // current (pushed) spot
        r: size / 2
      });
    }

    if (finePointer) {
      document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    }

    var paused = false;
    document.addEventListener('visibilitychange', function () {
      paused = document.hidden;
    });

    (function loop() {
      requestAnimationFrame(loop);
      if (paused) return;
      for (var i = 0; i < beads.length; i++) {
        var o = beads[i];
        // push away from the pointer, then spring back to the home spot
        var ddx = o.x - mx, ddy = o.y - my;
        var d2 = ddx * ddx + ddy * ddy;
        if (d2 < 16000 && d2 > 0.01) {
          var d = Math.sqrt(d2);
          var force = (1 - d / 126) * 1.4;
          o.x += (ddx / d) * force;
          o.y += (ddy / d) * force;
        }
        // settle back home, so with no pointer nearby the beads are still
        o.x += (o.homeX - o.x) * 0.045;
        o.y += (o.homeY - o.y) * 0.045;
        o.el.style.transform = 'translate(' + o.x.toFixed(1) + 'px,' + o.y.toFixed(1) + 'px)';
      }
    })();
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

  function boot() {
    initCursor();
    initBeads();
    initParallax();
    initViewTransitions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
