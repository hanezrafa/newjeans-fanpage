# Design

<!-- impeccable:design-schema 1 -->

## World

**Airport street-snap pinboard.** The page is a fan's pinboard: photos of the
members pinned over a cool near-white board, prints with thin white borders and
soft pin shadows, each frame set at a gentle hand-pinned angle, printed tape
labels and mono captions. The visitor scrolls the board rather than a corporate
landing page. This is the fandom's own artifact, not the label's.

Direction **#4 of 7** by resonance (after the Y2K CD jewel case, the photocard
binder, and the comeback teaser board). Seed key **c694f7c0**.

## Palette

Restrained: cool near-white board, ink black, one Y2K accent and one highlight.

| Role | Token | Value |
|------|-------|-------|
| Board | `--board` | `#f2f3f6` |
| Board recessed | `--board-2` / `-3` | `#e9ebf0` / `#dbdee6` |
| Ink | `--ink` | `#14161c` |
| Ink secondary | `--ink-soft` | `#3c4048` |
| Ink faint | `--ink-faint` | `#5f6470` |
| **Accent (bubblegum)** | `--bubble` / `--bubble-dk` | `#7fb2e3` / `#2f6dab` |
| Highlight (tape) | `--acid` | `#d7e05a` |
| Print edge | `--print-edge` | `#ffffff` |

The ground is **cool** white (`#f2f3f6`), deliberately not the warm cream/beige the
category defaults to. NewJeans reads as clean white and bubblegum pastel. Bubblegum
blue is the single accent; acid lime is highlight and tape only.

## Typography

- **Anton** - the hero wordmark and secondary display. The hero word is a **Y2K
  magazine clipping**: "NEW" over "JEANS" in two overlapping rows, each letter
  tilted and nudged by its own small rotation and lift, and three letters carry the
  Powerpuff trio (pink J, blue A, lime S).
- **Archivo** - body and UI (a grotesque with character; not the overused Inter).
- **Space Mono** - captions, tape labels, meta rows, numerals.

The scale is fluid for display (`clamp`) and fixed for UI. Functional text never
falls below 11px; body measure stays within 62ch.

## Material and components

- **Print** - every photo is a print: a white border, a pin dot at top centre and a
  soft offset shadow, set at a stable per-index rotation so the board looks
  hand-pinned, straightening on hover.
- **Tape button** - filters are paper tape: mono caps, slight rotation, acid when active.
- **Release row** - a tracklist with a play control: year, type, title and note as
  hairline-ruled rows.
- **CD read-out** - the playable discography shows a spinning disc, the track and
  album, and a small equaliser while a preview plays. Play controls are square metal
  caps with a `clip-path` triangle that becomes a pause bar while playing.
- **Era timeline** - a vertical spine carrying the group's eras as a colour spectrum
  (blue to purple to pink to lime to amber); each card wears its era's colour as a
  small square chip, never a side border.
- **Member print** - a pinned portrait print in a horizontal snap-scroll row.
- **Lightbox** - the print enlarged on ink, captioned with member and index / 276.

## Motion

**Y2K / Powerpuff immersive layer.** NewJeans' own visual era, and its official
Powerpuff Girls tie-in, earn three bead colours: pink (Blossom), blue (Bubbles),
lime (Buttercup).

- **Focal moment:** a fixed field of 8 to 12 glowing beads drifts across the board
  and pushes away from the pointer. It is the authored sequence the surface earned
  and it is specific to this world.
- **Custom cursor:** a bead dot plus a trailing ring (the Y2K lag); on links the dot
  swells and the ring turns pink. Pointer devices only.
- **Depth:** the hero pinwall parallaxes by layer as the page scrolls; a mono ticker
  runs between the hero and the board; stickers spin on one slow axis.
- **Screen texture:** a faint pixel grain and one thin scanline sweep.
- **Continuity:** section jumps use the View Transitions API, with an instant
  fallback where it is unsupported.
- **Budget and control:** beads are a bounded count on GPU transforms; grain is a
  static layer; the scanline loop stops when the tab is hidden. Under
  `prefers-reduced-motion` the beads, cursor, scanline, stickers and ticker are
  removed and content stays visible.

## Browser surfaces

Themed from the palette: acid `::selection`, a 3px bubblegum `:focus-visible` ring,
and mono numerals in captions.

## Layout

Standard Experience topology: a sticky taped-label top bar; a full-height hero board
with a scattered pinwall and a centred wordmark; then About, a horizontal member row,
a discography tracklist and a paginated gallery grid. Responsive is structural: the
pinwall sheds its inner prints under 720px, the release row reflows to a stacked
grid, and the gallery grid tightens its columns. No horizontal overflow at 390 / 768 / 1440.

## Verification

- Mechanical detector (impeccable, 61 rules): **0 findings**.
- Horizontal overflow: none at 390 / 768 / 1440.
- Contrast: all text passes WCAG AA (ink-faint raised to `#5f6470` to clear 4.5:1).
- No console or network errors; `favicon.png` present.
