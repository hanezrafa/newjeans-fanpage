# NewJeans · Fan Board

An **unofficial** fan page for the girl group NewJeans, built as a frontend
practice project. It is **plain HTML + CSS + JavaScript** (no framework, no build step).

## Page contents

| Section | Contents |
|---------|----------|
| Hero | A board of pinned photos + large wordmark + fact strip |
| About | Group intro |
| Members | 5 members (horizontal scroll) — each links to a full profile page |
| Discography | 10 releases, with a playable 30-second preview per track |
| Eras | A colour timeline of the group's eras, 2022 to 2024 |
| Gallery | 276 concept photos, filterable by member, with a lightbox |

### Member profile pages

Each member has their own page, reachable by clicking their photo in the Members
section: `minji.html`, `hanni.html`, `danielle.html`, `haerin.html`, `hyein.html`.
A profile carries a tall portrait, a short bio, a facts card (position, birthday,
height, MBTI, colour), prev/next member links, and that member's own photo board.

> Danielle is marked as a **former member**: ADOR announced the end of her contract
> on 29 December 2025.

> Music previews use the **official 30-second previews** from the Apple iTunes Search
> API (free and legal). They need an internet connection; without one the discography
> still works as a plain list.

## Structure

```
├─ index.html           # home
├─ minji.html · hanni.html · danielle.html · haerin.html · hyein.html  # member profiles
├─ css/
│  ├─ style.css         # the pinboard world (shared)
│  └─ member.css        # member profile layout
├─ js/
│  ├─ data.js           # group, member and discography facts (window.NJ)
│  ├─ previews.js       # 30-second song previews (iTunes)
│  ├─ main.js           # home render + gallery filter + lightbox
│  ├─ audio.js          # playable discography
│  ├─ member.js         # builds a member profile from <body data-member>
│  └─ immersive.js      # cursor, beads, parallax, view transitions
└─ assets/photos/       # 276 NewJeans concept photos
```

## Notes

- Every fact is public and verifiable; no news, rumours, or legal-dispute content.
- No backend, no accounts, no tracking. Fully static.
