---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief — NewJeans fan page

Scope: the whole one-page fan site (`index.html` + `css/` + `js/`). Mode:
**Experience** — the visitor is inside the group's visual world; the photography
leads from the first viewport and the interface recedes.

Audience & job: a fan scrolling on a phone, and the person building the page to
practise frontend. Job: look at who NewJeans are, the five members, their releases,
and the concept photos. Success: the page feels calm, clean and Y2K-minimal like
the group, and the photos do the talking.

Chosen direction: **Airport fashion street-snap wall** — the fan-culture pinboard
where fans keep the members' airport and street looks: photos pinned over an
off-white board with film-frame edges, a small mono caption strip under each
(shooting-date / location / member), printed "STREET SNAP" tape labels, taped
corners and paper textures. The visitor moves board-to-board rather than through
a corporate page.

Memorable moment: the **gallery is a pinboard** — photos sit slightly askew with
paper edges and pin shadows; hovering straightens a print and lifts a caption.

Unresolved: whether the member section is a row of cards or an editorial spread;
resolved as a horizontal scroll of pinned member prints.

## Direction contract

**THESIS** — One idea: this fan page is a fan's street-snap pinboard, the place
the fandom actually keeps the members' looks. It refuses the category default of
the official-corporate K-pop landing page (full-bleed hero + gradient + card grid).

**OWN-WORLD** — Off-white board paper (`#f4f0e8`), warm ink black (`#1b1a17`),
one Y2K accent **bubblegum blue** (`#7fb2e3`) with a secondary **acid lime**
(`#c6d94a`) used as tape/highlight only; every photo is a print with a thin white
border, a slight rotation and a soft pin shadow; mono captions in a printed tape
strip. No gradients as decoration, no glass, no rounded cards.

**STORY** — The fan understands instantly: this is a fan's board of the group's
looks; scroll the board, read the members pinned up, see the releases, wander the
gallery.

**FIRST VIEWPORT** — A full-height board: group prints pinned across it at gentle
angles, a large wordmark set in the board's own taped-label type, and a mono strip
across the bottom (DEBUT 2022 · 5 MEMBERS · ADOR). Primary action: a taped
"BUKA GALERI" tab that scrolls to the board.

**FORM** — Grounded direction **#4 of 7** (airport street-snap wall), ordered by
resonance after the Y2K CD jewel case, the photocard binder, and the comeback
teaser board. Seed key **c694f7c0** (assigned index 4).

**FINISH** — unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Motion thesis

Refinement within the established pinboard world — motion carries the Y2K / NewJeans
energy the still page was missing. NewJeans' own visual era (and its official
Powerpuff Girls tie-in) earns three Powerpuff beads: pink, blue, lime.

- **Focal moment:** the **hero bead field** — three glowing Powerpuff beads
  (pink / blue / lime) drift across the board and lean away from the pointer. This
  is the authored sequence the surface has earned; it is specific to this world.
- **Continuity:** section jumps use the View Transitions API so the wordmark and
  board feel like one surface, with a plain instant fallback.
- **Feedback:** the custom Y2K cursor (a bead that swells on hover) acknowledges the
  pointer; the marquee ticker keeps the fandom's motion alive between sections.
- **Depth & material:** the hero adopts a **scroll parallax** — pinwall layers move
  at different rates — plus a faint pixel grain and one thin scanline sweep.
- **Budget:** beads and cursor are GPU transforms on a small fixed count (bounded);
  grain is a static CSS layer (no per-frame cost); scanline is one nonessential loop
  that pauses offscreen. All of it is removed or stilled under `prefers-reduced-motion`.

## Raises from declined challengers (kept disciplines)

- From the **luxury fashion flagship** challenger (declined as a carrier — it would
  make a fan page read like a brand): keep its *editorial negative space* — generous
  bone-white margin around full-bleed looks, few words set large.
- From the **labanotation** challenger (declined): keep its *measured symmetry
  discipline* — a centre rule and paired columns for the member profiles.
