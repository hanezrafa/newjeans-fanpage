# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: plain static HTML + CSS + JavaScript, no framework and no build step.
Chosen because the brief is a frontend practice build where the point is to write
the markup, styles and interaction directly.

## Users

Fans of the K-pop girl group NewJeans, and the person building this site to practise
frontend craft. A visitor arrives from a search, a link or curiosity about the group;
they want to look at the members, see the discography and browse concept photos. They
are typically on a phone, scrolling casually, in a bright environment (daylight, a lit
room), not in a dark studio.

## Product Purpose

A one-page fan site for NewJeans: who they are, the five members, their releases and
a photo gallery. It exists to gather the group's public facts and its concept
photography into one clean, aesthetic, easy-to-browse page. Success means a fan
scrolls it and feels the group's calm, Y2K-minimalist mood, and the builder learns
real responsive layout, grid and interaction.

## Positioning

A fan-made visual archive, not the group's official site. Its character comes from
the group's own aesthetic (clean, minimal, 2000s-nostalgic, "girl next door") and
from a gallery of concept photos rather than news or commerce.

## Operating Context

- Browsed on a phone first, then desktop; opened from a link; no login, no app.
- Fully static: no backend, no build, no accounts, no tracking.
- Served locally for the build; images live in `assets/photos/`.

## Capabilities and Constraints

- Static single page: hero, intro, member profiles, discography, photo gallery.
- Photos are real NewJeans concept photos downloaded from a public archive
  (`kprofiles.com`), used with the builder's stated permission from ADOR.
- All facts about the group (names, label, debut, releases) must be true and sourced;
  nothing invented. No news, no rumours, no legal-dispute content.
- No fabricated prices, products, tickets or streaming claims.

## Brand Commitments

The subject is **NewJeans** (Minji, Hanni, Danielle, Haerin, Hyein), a South Korean
girl group under ADOR; debut single "Attention", July 22, 2022. The site borrows the
group's widely-known visual mood (calm, clean, minimalist, Y2K-nostalgic) but is an
unofficial fan page and must read as such, not as the official site.

## Evidence on Hand

- 276 real concept photos in `assets/photos/` (group plus per member: MINJI, HANNI,
  DANIELLE, HAERIN, HYEIN). No official logo, wordmark or press kit is held.
- Public, verifiable facts from Wikipedia (group, members, label, releases).
- Absent (must not be invented): official brand assets, press quotes, sales figures
  presented as our own, tour dates, prices.

## Product Principles

- The photos carry the page; layout and chrome stay out of their way.
- Calm and minimal, never loud; the page should feel like the group sounds.
- Everything on the page is true and traceable; a fan page owes its visitors honesty.
- Real, responsive craft over decoration: it is also a frontend exercise.

## Accessibility and Inclusion

Readable in daylight: strong contrast on a light ground, large legible type, alt text
on every photo naming the member, keyboard-reachable gallery and controls, and
`prefers-reduced-motion` respected.
