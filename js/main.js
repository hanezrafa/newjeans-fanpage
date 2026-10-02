/* =========================================================
   NewJeans fan page - interaction
   Renders members, discography and the photo board; wires the
   gallery filter, the lightbox and scroll reveal. Plain JS.
   ========================================================= */

(function () {
  'use strict';

  var PHOTO_BASE = 'assets/photos/';
  var PAGE_SIZE = 24;

  /* ---------- tiny helpers ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  // stable pseudo-random tilt per index, so the board looks hand-pinned
  function tilt(i) {
    var t = ((i * 37) % 7) - 3; // -3..3
    return t === 0 ? 1 : t;
  }
  // resolve a path against the document, so a URL used from CSS resolves
  // relative to the page (not relative to the stylesheet)
  function absUrl(p) {
    return new URL(p, document.baseURI).href;
  }

  /* ---------- render: intro text ---------- */
  var introText = document.getElementById('intro-text');
  if (introText) introText.textContent = NJ.group.intro;

  /* ---------- render: members (each links to its profile page) ---------- */
  var membersRow = document.getElementById('members-row');
  if (membersRow && NJ.members) {
    NJ.members.forEach(function (m) {
      var li = el('li', 'member');
      li.style.setProperty('--tilt', tilt(m.name.length) + 'deg');
      if (m.tone) li.style.setProperty('--tone', m.tone);
      li.innerHTML =
        '<a class="member__link" href="' + esc(m.id) + '.html" aria-label="Open ' + esc(m.name) + '\u2019s profile">' +
          '<img class="member__photo" src="' + PHOTO_BASE + esc(m.photo) + '" alt="' + esc(m.name) + ' of NewJeans" loading="lazy" width="600" height="800">' +
          '<div class="member__meta">' +
            '<h3 class="member__name">' + esc(m.name) + '</h3>' +
            '<p class="member__full">' + esc(m.full) + ' · ' + esc(m.hangul) + '</p>' +
            '<div class="member__row"><span>' + esc(m.from) + '</span><span>b. ' + esc(m.born) + '</span></div>' +
            '<span class="member__cta">View profile →</span>' +
          '</div>' +
        '</a>';
      membersRow.appendChild(li);
    });
  }

  /* ---------- render: releases (with play when a preview matches) ---------- */
  var relList = document.getElementById('releases-list');
  function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g, ''); }
  if (relList && NJ.releases) {
    NJ.releases.forEach(function (r) {
      var li = el('li', 'release reveal');
      // does a preview exist whose title starts with this release title?
      var pv = (window.NJ_PREVIEWS || []).find(function (p) {
        return norm(p.track) === norm(r.title) || norm(p.track).indexOf(norm(r.title)) === 0;
      });
      var playBtn = pv
        ? '<button class="release__play" type="button" data-track="' + esc(pv.track) +
          '" aria-label="Play a preview of ' + esc(r.title) + '">' +
          '<span class="release__play-tri" aria-hidden="true"></span></button>'
        : '<span class="release__play release__play--off" aria-hidden="true"></span>';
      li.innerHTML =
        playBtn +
        '<span class="release__year">' + esc(r.year) + '</span>' +
        '<span class="release__type">' + esc(r.type) + '</span>' +
        '<span class="release__title">' + esc(r.title) + '</span>' +
        '<span class="release__note">' + esc(r.note || r.month) + '</span>';
      relList.appendChild(li);
    });
  }

  /* ---------- render: eras timeline ---------- */
  var erasLine = document.getElementById('eras-line');
  if (erasLine && NJ.eras) {
    NJ.eras.forEach(function (e, i) {
      var li = el('li', 'era reveal');
      li.style.setProperty('--tone', e.tone);
      li.style.setProperty('--i', i);
      if (e.bg) li.style.setProperty('--bg', 'url("' + absUrl(e.bg) + '")');
      li.innerHTML =
        '<span class="era__dot" aria-hidden="true"></span>' +
        '<div class="era__card">' +
          '<span class="era__year">' + esc(e.year) + '</span>' +
          '<h3 class="era__title">' + esc(e.title) + '</h3>' +
          '<p class="era__blurb">' + esc(e.blurb) + '</p>' +
        '</div>';
      erasLine.appendChild(li);
    });
  }

  /* ---------- gallery ---------- */
  var grid = document.getElementById('gallery-grid');
  var note = document.getElementById('gallery-note');
  var loadMoreBtn = document.getElementById('load-more');
  var filters = document.getElementById('gallery-filters');

  // Build the gallery dataset from photos.json, meta-naming each frame.
  var ALL = [];
  var activeList = [];   // the currently filtered list (what the grid and lightbox both read)
  var shown = 0;
  var activeFilter = 'all';

  function memberLabel(cat) {
    if (cat === 'group') return 'NewJeans';
    return cat.charAt(0) + cat.slice(1).toLowerCase();
  }

  function fill(list, n) {
    var frag = document.createDocumentFragment();
    for (var i = shown; i < Math.min(list.length, shown + n); i++) {
      var p = list[i];
      var li = el('li', 'shot');
      li.style.setProperty('--tilt', tilt(i) + 'deg');
      var label = memberLabel(p.cat) + ' · ' + String(i + 1).padStart(3, '0');
      var btn = el('button', 'shot__btn');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Enlarge photo: ' + label);
      btn.dataset.index = i;
      btn.innerHTML =
        '<img class="shot__img" src="' + PHOTO_BASE + esc(p.file) + '" alt="Photo ' + esc(label) + '" loading="lazy" decoding="async">' +
        '<span class="shot__cap">' + esc(label) + '</span>';
      li.appendChild(btn);
      frag.appendChild(li);
    }
    grid.appendChild(frag);
    shown += n;
  }

  function currentList() {
    if (activeFilter === 'all') return ALL;
    return ALL.filter(function (p) { return p.cat === activeFilter; });
  }

  function render(reset) {
    if (reset) { grid.innerHTML = ''; shown = 0; }
    activeList = currentList();
    fill(activeList, PAGE_SIZE);
    var remaining = activeList.length - shown;
    if (note) note.textContent = activeList.length + ' photos · showing ' + Math.min(shown, activeList.length);
    if (loadMoreBtn) {
      if (remaining > 0) {
        loadMoreBtn.hidden = false;
        loadMoreBtn.textContent = 'Load more (' + remaining + ')';
      } else {
        loadMoreBtn.hidden = true;
      }
    }
  }

  function bindGallery() {
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.shot__btn');
      if (btn) openLightbox(Number(btn.dataset.index));
    });
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () { render(false); });
    }
    if (filters) {
      filters.addEventListener('click', function (e) {
        var b = e.target.closest('.tape-btn');
        if (!b) return;
        activeFilter = b.dataset.filter;
        Array.prototype.forEach.call(filters.querySelectorAll('.tape-btn'), function (x) {
          var on = x === b;
          x.classList.toggle('is-active', on);
          x.setAttribute('aria-selected', String(on));
        });
        render(true);
      });
    }
  }

  /* ---------- lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbIndex = 0;

  function openLightbox(index) {
    lbIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('lb-close').focus();
  }
  function updateLightbox() {
    var p = activeList[lbIndex];
    if (!p) return;
    lbImg.src = PHOTO_BASE + p.file;
    lbImg.alt = 'Photo of ' + memberLabel(p.cat);
    lbCap.textContent = memberLabel(p.cat) + ' · ' + String(lbIndex + 1).padStart(3, '0') + ' / ' + activeList.length;
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }
  function step(delta) {
    if (!activeList.length) return;
    lbIndex = (lbIndex + delta + activeList.length) % activeList.length;
    updateLightbox();
  }

  function bindLightbox() {
    document.getElementById('lb-close').addEventListener('click', closeLightbox);
    document.getElementById('lb-prev').addEventListener('click', function () { step(-1); });
    document.getElementById('lb-next').addEventListener('click', function () { step(1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ---------- scroll reveal ---------- */
  function bindReveal() {
    var items = document.querySelectorAll('.reveal, .intro, .members, .gallery');
    if (!('IntersectionObserver' in window) || !items.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (it) { io.observe(it); });
  }

  /* ---------- boot ---------- */
  document.getElementById('foot-year').textContent = new Date().getFullYear();

  fetch('js/photos.json')
    .then(function (r) { return r.json(); })
    .then(function (list) {
      ALL = list;
      bindGallery();
      bindLightbox();
      render(true);
    })
    .catch(function () {
      if (note) note.textContent = 'Gallery failed to load.';
    });

  bindReveal();
})();
