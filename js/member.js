/* =========================================================
   NewJeans fan page - member profile page
   One script drives all five member pages. The page declares
   which member it is with <body data-member="minji">. Photos
   come from photos.json (the same board as the home gallery).
   ========================================================= */

(function () {
  'use strict';

  var id = document.body.getAttribute('data-member');
  if (!id || !window.NJ) return;

  var member = NJ.members.find(function (m) { return m.id === id; });
  if (!member) return;

  var PHOTO_BASE = 'assets/photos/';

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
  function tilt(i) { var t = ((i * 37) % 7) - 3; return t === 0 ? 1 : t; }

  /* ---------- document title + page vars ---------- */
  document.title = member.name + ' · NewJeans Fan Board';
  document.documentElement.style.setProperty('--tone', member.tone);
  // a readable twin of the tone for small text (darken light pastels)
  var DARK = { '#8cc6ff': '#2f6dab', '#b7e46a': '#5c8414', '#ff8fc4': '#c23b7c', '#b7a6ff': '#6a4fd0', '#ffc978': '#a86a12' };
  document.documentElement.style.setProperty('--tone-ink', DARK[member.tone] || member.tone);

  /* ---------- build the name letter by letter (clipped letters) ---------- */
  var nameEl = document.getElementById('pf-name');
  if (nameEl) {
    nameEl.innerHTML = '';
    nameEl.setAttribute('aria-label', member.name);
    var word = el('span');
    word.setAttribute('aria-hidden', 'true');
    word.style.display = 'contents';
    member.name.split('').forEach(function (ch) {
      var s = el('span', 'lt');
      s.textContent = ch;
      word.appendChild(s);
    });
    nameEl.appendChild(word);
  }

  /* ---------- eyebrow: the member's status ---------- */
  var eyebrow = document.getElementById('pf-eyebrow');
  if (eyebrow) eyebrow.textContent = (member.status || 'Member') + ' · NewJeans';

  var hangul = document.getElementById('pf-hangul');
  if (hangul) hangul.textContent = member.hangul + ' · ' + member.full;

  var blurb = document.getElementById('pf-blurb');
  if (blurb) blurb.textContent = member.blurb;

  var bio = document.getElementById('pf-bio');
  if (bio) bio.textContent = member.bio;

  /* ---------- emoji sticker badge on the portrait ---------- */
  var badge = document.getElementById('pf-badge');
  if (badge) {
    badge.textContent = member.emoji || '★';
    badge.setAttribute('aria-hidden', 'true');
  }

  /* ---------- signature line (hand-signed feel) ---------- */
  var sig = document.getElementById('pf-signature');
  if (sig) {
    sig.textContent = member.name;
    sig.setAttribute('aria-hidden', 'true');
  }

  /* ---------- Y2K ID card: role, born, from + a barcode from the name ---------- */
  var idCard = document.getElementById('pf-idcard');
  if (idCard) {
    var rows = [
      ['Role', member.role || member.status || 'Member'],
      ['Born', member.born || ''],
      ['From', member.from || '']
    ].filter(function (r) { return r[1]; });
    var cells = rows.map(function (r) {
      return '<div class="idcard__row"><span class="k">' + esc(r[0]) + '</span><span class="v">' + esc(r[1]) + '</span></div>';
    }).join('');
    // a decorative barcode drawn from the member id, so it differs per member
    var bars = '';
    var seed = member.id + member.name;
    for (var bi = 0; bi < seed.length; bi++) {
      var w = (seed.charCodeAt(bi) % 3) + 1;
      bars += '<i style="width:' + w + 'px"></i>';
    }
    idCard.innerHTML =
      '<div class="idcard__head"><span class="idcard__brand">' + esc(member.name).toUpperCase() + '</span>' +
      '<span class="idcard__emoji" aria-hidden="true">' + (member.emoji || '★') + '</span></div>' +
      '<div class="idcard__body">' + cells + '</div>' +
      '<div class="idcard__foot"><span class="idcard__bars" aria-hidden="true">' + bars + '</span>' +
      '<span class="idcard__id">NJ-' + esc(member.id).toUpperCase() + '</span></div>';
  }

  /* ---------- portrait ---------- */
  var portrait = document.getElementById('pf-portrait');
  if (portrait) {
    portrait.src = PHOTO_BASE + member.photo;
    portrait.alt = member.name + ' of NewJeans';
  }

  /* ---------- oversized faded silhouette behind the page ---------- */
  var sil = document.getElementById('silhouette');
  if (sil) {
    var silPhoto = member.silhouette || member.photo;
    sil.style.backgroundImage = 'url("' + PHOTO_BASE + silPhoto + '")';
    sil.style.setProperty('--tone', member.tone);
  }

  /* ---------- the silhouette drifts slowly and breathes, eased in JS ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (sil && !reduce) {
    var sy = 0;       // current drift
    var syTarget = 0; // drift from the scroll position
    var start = performance.now();
    var running = true;

    var onScroll = function () {
      // up to ~80px of upward drift over the first ~1800px of scroll
      syTarget = Math.min(window.scrollY, 1800) * -0.045;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    document.addEventListener('visibilitychange', function () { running = !document.hidden; });

    (function loop(now) {
      requestAnimationFrame(loop);
      if (!running) return;
      // ease toward the scroll target so the motion never snaps
      sy += (syTarget - sy) * 0.06;
      var t = (now - start) / 1000;
      var breathe = 1 + Math.sin(t * 0.5) * 0.018; // subtle, ~11s cycle
      sil.style.transform =
        'translate(-50%, calc(-54% + ' + sy.toFixed(2) + 'px)) scale(' + breathe.toFixed(4) + ')';
    })(start);
  }

  /* ---------- 3D tilt on the portrait, like the home member cards ---------- */
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (portrait && finePointer && !reduce) {
    var pcard = portrait.parentElement; // the .profile__portrait figure
    var MAX = 9;
    pcard.addEventListener('pointerenter', function () { pcard.classList.add('is-tilting'); });
    pcard.addEventListener('pointermove', function (e) {
      var r = pcard.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      pcard.style.setProperty('--pry', ((px - 0.5) * 2 * MAX).toFixed(2) + 'deg');
      pcard.style.setProperty('--prx', ((0.5 - py) * 2 * MAX).toFixed(2) + 'deg');
    });
    pcard.addEventListener('pointerleave', function () {
      pcard.classList.remove('is-tilting');
      pcard.style.setProperty('--prx', '0deg');
      pcard.style.setProperty('--pry', '0deg');
    });
  }

  /* ---------- facts ---------- */
  var facts = document.getElementById('pf-facts');
  if (facts && member.facts) {
    member.facts.forEach(function (row) {
      var li = el('li');
      li.innerHTML = '<span class="k">' + esc(row[0]) + '</span><span class="v">' + esc(row[1]) + '</span>';
      facts.appendChild(li);
    });
  }

  /* ---------- prev / next member links ---------- */
  var idx = NJ.members.indexOf(member);
  var prev = NJ.members[(idx - 1 + NJ.members.length) % NJ.members.length];
  var next = NJ.members[(idx + 1) % NJ.members.length];
  var nav = document.getElementById('pf-nav');
  if (nav) {
    nav.innerHTML =
      '<a href="' + prev.id + '.html">← ' + esc(prev.name) + '</a>' +
      '<a href="index.html#members">All members</a>' +
      '<a href="' + next.id + '.html">' + esc(next.name) + ' →</a>';
  }

  /* ---------- the member's photo board (with lightbox) ---------- */
  var grid = document.getElementById('pf-grid');
  var note = document.getElementById('pf-count');

  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var mine = [];
  var lbIndex = 0;

  function openLightbox(index) {
    if (!lightbox) return;
    lbIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('lb-close').focus();
  }
  function updateLightbox() {
    var p = mine[lbIndex];
    if (!p) return;
    lbImg.src = PHOTO_BASE + p.file;
    lbImg.alt = 'Photo of ' + member.name;
    lbCap.textContent = member.name + ' · ' + String(lbIndex + 1).padStart(3, '0') + ' / ' + mine.length;
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }
  function step(delta) {
    if (!mine.length) return;
    lbIndex = (lbIndex + delta + mine.length) % mine.length;
    updateLightbox();
  }

  function bindLightbox() {
    if (!lightbox) return;
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.shot__btn');
      if (btn) openLightbox(Number(btn.dataset.index));
    });
    document.getElementById('lb-close').addEventListener('click', closeLightbox);
    document.getElementById('lb-prev').addEventListener('click', function () { step(-1); });
    document.getElementById('lb-next').addEventListener('click', function () { step(1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
  }

  fetch('js/photos.json')
    .then(function (r) { return r.json(); })
    .then(function (list) {
      var featured = (NJ.featured || []);
      mine = list.filter(function (p) {
        return p.cat === member.id.toUpperCase() && featured.indexOf(p.file) === -1;
      });
      if (note) note.textContent = mine.length + ' photos of ' + member.name;
      if (!grid) return;
      var frag = document.createDocumentFragment();
      mine.forEach(function (p, i) {
        var li = el('li', 'shot');
        li.style.setProperty('--tilt', tilt(i) + 'deg');
        var btn = el('button', 'shot__btn');
        btn.type = 'button';
        btn.dataset.index = i;
        btn.setAttribute('aria-label', 'Enlarge photo ' + (i + 1) + ' of ' + member.name);
        btn.innerHTML =
          '<img class="shot__img" src="' + PHOTO_BASE + esc(p.file) + '" alt="' + esc(member.name) + ', photo ' + (i + 1) + '" loading="lazy" decoding="async">' +
          '<span class="shot__cap">' + esc(member.name) + ' · ' + String(i + 1).padStart(3, '0') + '</span>';
        li.appendChild(btn);
        frag.appendChild(li);
      });
      grid.appendChild(frag);
      bindLightbox();
    })
    .catch(function () {
      if (note) note.textContent = 'Photos could not be loaded.';
    });
})();
