# AGENTS.md

Notes for AI coding agents working in this project.

## Borrowing a vision model

**The local agent model cannot see images.** This project is full of photography,
so any task that depends on *what a picture looks like* must not be guessed.
Instead, borrow a **vision-capable model from the local 9router gateway** with the
bundled helper.

### When to use it

Use `tools/vision.js` whenever a task needs eyes, for example:

- picking the best photo (close-up, group shot, mood) from several candidates
- checking whether a background image matches its era/event label
- describing or comparing images you cannot render yourself
- reading text or details out of a screenshot or a rendered page
- verifying that a design element looks the way it is supposed to

If you find yourself thinking "I cannot see this image, so I'll assume…", stop and
run the helper instead. State clearly in your reply that the visual judgement came
from the borrowed model, not from you.

### How to use it

```bash
# one image, one question (prints the answer to stdout)
node tools/vision.js <image-path> "<question>"
```

- `<image-path>` — a PNG / JPG / WEBP / GIF on disk. For a multi-image question,
  first build a labelled **contact sheet** with System.Drawing, then ask about the
  sheet by number (this is how photo picks are done).
- Ask for a short, structured answer (a sentence, a number, or JSON) so the result
  is easy to use. Example:
  `node tools/vision.js sheet.png "Contact sheet of 37 photos numbered 1-37. Which 5 are the tightest close-ups of the face? Reply as a JSON array of numbers."`
- Exit code `0` = answer on stdout, `2` = every model failed (fall back to asking
  the user, never invent).

### Requirements

- The **9router gateway must be running** on `127.0.0.1:20128` (it may need the
  desktop shortcut / `9router` command to be started first). If the helper exits
  `2`, check the gateway and retry.
- Default model order (fast to strong): `gemini/gemini-3.5-flash-lite`,
  `gemini-3-flash-preview`, `gemini-3.7-flash`, `gemini-3.8-flash`.
  Override with `--model <id>`. The model ids live under the `9router` provider.
- Key and URL can be overridden with `NINE_ROUTER_KEY` / `NINE_ROUTER_URL`.

## Project shape

- Plain static HTML / CSS / JS, no framework, no build step.
- `index.html` — home. `minji.html … hyein.html` — member profiles.
- `css/` — `tokens.css`, `style.css` (shared world), `member.css`.
- `js/` — `data.js` (facts, `window.NJ`), `main.js`, `audio.js`, `member.js`,
  `immersive.js`, `previews.js`, `photos.json`.
- `assets/photos/` — concept photos. `assets/eras/` — web-sized era backgrounds.
  `assets/wallpapers/` — 4K originals, **not committed** (see `.gitignore`).
- `tools/vision.js` — borrow a vision model (see above).

## Conventions

- Facts must stay true and sourced; never invent quotes, dates, or claims.
- Keep the pinboard world: square corners, print borders, the accent palette.
- Run the Impeccable detector before shipping UI:
  `~/.agents/skills/impeccable/scripts/impeccable.cmd detect --json .`
- The only accepted detector finding is `marquee` (the ticker is intentional).
