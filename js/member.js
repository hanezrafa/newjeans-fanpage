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

  /* ---------- portrait ---------- */
  var portrait = document.getElementById('pf-portrait');
  if (portrait) {
    portrait.src = PHOTO_BASE + member.photo;
    portrait.alt = member.name + ' of NewJeans';
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

  /* ---------- the member's photo board ---------- */
  var grid = document.getElementById('pf-grid');
  var note = document.getElementById('pf-count');

  fetch('js/photos.json')
    .then(function (r) { return r.json(); })
    .then(function (list) {
      var mine = list.filter(function (p) { return p.cat === member.id.toUpperCase(); });
      if (note) note.textContent = mine.length + ' photos of ' + member.name;
      if (!grid) return;
      var frag = document.createDocumentFragment();
      mine.forEach(function (p, i) {
        var li = el('li', 'shot');
        li.style.setProperty('--tilt', tilt(i) + 'deg');
        var btn = el('button', 'shot__btn');
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Enlarge photo of ' + member.name);
        btn.innerHTML =
          '<img class="shot__img" src="' + PHOTO_BASE + esc(p.file) + '" alt="' + esc(member.name) + ' — photo ' + (i + 1) + '" loading="lazy" decoding="async">' +
          '<span class="shot__cap">' + esc(member.name) + ' · ' + String(i + 1).padStart(3, '0') + '</span>';
        li.appendChild(btn);
        frag.appendChild(li);
      });
      grid.appendChild(frag);
    })
    .catch(function () {
      if (note) note.textContent = 'Photos could not be loaded.';
    });
})();
