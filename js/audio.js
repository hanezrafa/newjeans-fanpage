/* =========================================================
   NewJeans fan page - playable discography
   A single <audio> element plays the official 30-second iTunes
   previews of the group's tracks. The CD-player read-out shows
   what is playing. Everything degrades to a plain list when the
   previews are unavailable (offline, or a blocked network).
   ========================================================= */

(function () {
  'use strict';

  var list = document.getElementById('releases-list');
  var box = document.getElementById('nowplaying');
  var artEl = document.getElementById('np-art');
  var trackEl = document.getElementById('np-track');
  var albumEl = document.getElementById('np-album');
  var stopBtn = document.getElementById('np-stop');
  if (!list || !box) return;

  var previews = window.NJ_PREVIEWS || [];
  var audio = new Audio();
  audio.preload = 'none';

  function find(track) {
    return previews.find(function (p) { return p.track === track; });
  }

  function setPlayingButton(trackName) {
    list.querySelectorAll('.release__play').forEach(function (b) {
      var on = b.dataset.track === trackName;
      b.classList.toggle('is-playing', on);
      if (b.dataset.track) {
        b.setAttribute('aria-pressed', String(on));
      }
    });
  }

  function show(pv) {
    box.hidden = false;
    artEl.src = pv.art;
    artEl.alt = 'Cover of ' + pv.album;
    trackEl.textContent = pv.track;
    albumEl.textContent = pv.album;
  }

  function stopAll() {
    audio.pause();
    audio.currentTime = 0;
    box.hidden = true;
    setPlayingButton(null);
  }

  function play(trackName, originEl) {
    var pv = find(trackName);
    if (!pv) return;
    if (audio.src === pv.preview && !audio.paused) { stopAll(); return; }
    audio.src = pv.preview;
    audio.play().then(function () {
      show(pv);
      setPlayingButton(trackName);
      // let the immersive layer pop a few beads out of the play control
      if (originEl) {
        var r = originEl.getBoundingClientRect();
        document.dispatchEvent(new CustomEvent('nj:play', {
          detail: { x: r.left + r.width / 2, y: r.top + r.height / 2, track: trackName }
        }));
      }
    }).catch(function () {
      // offline or autoplay blocked - tell the user, keep the list usable
      trackEl.textContent = 'Preview unavailable';
      albumEl.textContent = 'Check your internet connection';
      box.hidden = false;
      setPlayingButton(null);
    });
  }

  list.addEventListener('click', function (e) {
    var btn = e.target.closest('.release__play');
    if (btn && btn.dataset.track) { play(btn.dataset.track, btn); return; }
    // the whole row is a play target too, so the control is impossible to miss
    var row = e.target.closest('.release');
    if (row) {
      var p = row.querySelector('.release__play[data-track]');
      if (p) play(p.dataset.track, p);
    }
  });

  // keyboard: the play buttons are real buttons, so Enter/Space work already;
  // Escape stops playback.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !box.hidden) stopAll();
  });

  audio.addEventListener('ended', stopAll);
  if (stopBtn) stopBtn.addEventListener('click', stopAll);

  // If there are no previews at all, hide the hint line.
  if (!previews.length) {
    var hint = document.getElementById('releases-hint');
    if (hint) hint.textContent = 'Discography: the group’s releases, in order.';
  }
})();
