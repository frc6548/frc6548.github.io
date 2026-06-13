# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## Project overview

This is the static website for **Perry RAMBOTS**, FIRST Robotics Competition
Team 6548 (phsrambots.org). It is plain HTML/CSS/JS with no build step,
framework, or package manager - every file is served as-is.

## Deployment

- Hosted on **GitHub Pages**.
- `.github/workflows/static.yml` deploys the entire repo on every push to
  `main` (or manual dispatch) via `actions/upload-pages-artifact` +
  `actions/deploy-pages`.
- There is no build/compile step - whatever is committed to `main` is what
  ships. Test changes by opening the HTML files directly or via a local
  static server before pushing.

## Structure

- `index.html`, `gallery/`, `donate/`, `links/`, `team/`, `calendar/`,
  `robots/2025-guppy/`, `opt-out/` - top-level pages (each its own
  `index.html`).
- `css/style.css` - single global stylesheet for the whole site.
- `js/` - plain scripts, one per concern (`header.js`, `slideshow.js`,
  `calendar.js`, `livestream.js`, `sponsors.js`, `stats.js`). No modules/bundler;
  each is loaded with a plain `<script src="...">` tag.
- `data/` - JSON content files, images, icons, and the Afacad font. Pages
  fetch JSON from here at runtime to populate content (see "Content driven by
  JSON" below).
- `scripts/*.py` - one-off maintenance scripts (not run automatically):
  - `convert_to_webp.py` / `clear_webps.py` - convert images to WebP and
    remove the originals.
  - `optimize.py` - resize sponsor logos in `data/sponsors` to a max width.
  - `webp-no-scan-html.py` - convert images to WebP without rewriting any
    HTML/CSS/JS references.
- `index.md`, `llm.md`, `llm.txt`, `llms.md`, `llms.txt` - duplicate LLM
  descriptor files describing the site for AI crawlers. **Keep these five
  files byte-identical** - if you edit one, copy the result to the other four.

## Shared header/footer pattern

There is no templating system. Every page includes `js/header.js`, which on
`DOMContentLoaded`:

- Injects JSON-LD structured data (`Organization`, `WebSite`,
  `LocalBusiness` schemas) into `<head>`.
- Builds the `.hd-container` header (logo, site title, hamburger nav) and
  appends it as the first child of `<body>`.
- Builds the `<footer>` (contact info, socials, privacy policy modal,
  501(c)(3) disclaimer) and appends it to `<body>`.
- Fetches `data/links.json` to populate the menu, email/phone/address
  (base64-encoded - decoded with `atob()`), and social links, overriding the
  hardcoded defaults.
- Loads Google Analytics (gtag) unless the `OptOutTrack=1` cookie is set
  (see `opt-out/index.html`).

When adding a new page, copy the `<head>` boilerplate (font/style links,
meta tags, JSON-LD `ld-org` block) from an existing page like `index.html`
and include `js/header.js` - do not hand-write the header/footer markup.

## Content driven by JSON

Several pages fetch JSON at runtime instead of hardcoding content:

- `data/links.json` - menu items, contact info (base64), socials. Used by
  `js/header.js`.
- `data/stats.json` - homepage "by the numbers" stats. Used by `js/stats.js`,
  which animates each `.stat-number` counting up from 0. Values may be a
  plain number or a number with a suffix (e.g. `"4x"`, `"50+"`); the suffix
  is preserved and only the numeric prefix is animated.
- `data/slideshow/info.json` - homepage image carousel slides. Used by
  `js/slideshow.js`.
- `data/livestream.json` - current/upcoming livestream info. Used by
  `js/livestream.js`.
- `data/calendar/<year>/<month>/events.json` - calendar events, one file per
  month. Used by `calendar/index.html` + `js/calendar.js`.

## Fonts

The site uses **Afacad** everywhere via `@font-face` in `css/style.css`,
loaded from `/data/afacad.ttf`. Do not swap this for a system font or a
different web font.

## Icons and arrows: no special unicode

Do not use unicode arrows, emoji, em/en dashes, or curly quotes anywhere in
HTML, JS, CSS, or markdown content - use plain ASCII (hyphens, straight
quotes) and CSS-drawn icons instead. Two existing patterns to reuse:

- **Hamburger menu icon** (`.hamburger` / `.hamburger-bar` in
  `css/style.css`): three CSS `div`s sized via `--bar-width`,
  `--bar-height`, and `--bar-gap` custom properties, overridden per
  breakpoint in the responsive media queries. Do not go back to a
  font-glyph hamburger character.
- **Chevron arrows** (`.chevron`, `.chevron-left`, `.chevron-right` in
  `css/style.css`): a border-trick triangle (`border-width: 0 3px 3px 0`
  rotated 45deg) using `currentColor`, so it inherits whatever color the
  surrounding button uses. Used by the slideshow prev/next buttons and the
  calendar nav buttons.

## Slideshow (`js/slideshow.js`)

The homepage image carousel is clone-based: `showSlide()` builds a temporary
`.slide-staging` container with clones of the previous/current/next slide,
animates them via CSS `transform: translateX(...)` transitions, then
`finalizePendingTransition()` removes the staging area and applies the
`active` class to the real target slide. `pendingTransition` is always shaped
as `{ stage, activeIndex, idx }`. Rapid clicks are coalesced into
`queuedMoves` and processed once the current transition finishes.

## General conventions

- No build tooling - keep CSS/JS plain and dependency-free.
- Avoid duplicate CSS rules; the stylesheet has previously accumulated
  redundant/duplicate selectors (e.g. multiple `.imageslideshow` or
  `.site-nav` blocks) - check for an existing rule before adding a new one.
- Only add comments where the *why* isn't obvious from the code itself.
- Animations: entrance animations (`fadeInUp`, `slideInLeft`,
  `slideInRight`, `countUp`) are applied directly to section/element
  selectors (e.g. `.stats-section`, `.stat-item`, `.ftc-section`,
  `.legacy-container h1`, `.p-anim`), often with staggered
  `animation-delay` on `:nth-child()` items. The marquee sponsor scroller
  uses the `scroll` keyframe.
