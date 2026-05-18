# Notes Webapp — Build Specification

## Overview

A static, read-only web app for browsing personal study notes. Notes are authored as markdown files, organised by subject and chapter, with English and Bengali versions of each chapter. Deployed as a static site (Netlify or Cloudflare Pages). No backend, no authentication, no database.

The user opens the site, picks a subject, picks a chapter, and reads it in their preferred language. That is the entire user journey.

## Stack

- **Framework:** Astro (latest stable). Chosen for minimal client-side JS, native markdown support via Content Collections, and fast static builds.
- **Markdown rendering:** Astro's built-in markdown pipeline with `remark-math` and `rehype-katex` for LaTeX equations.
- **Syntax highlighting:** Shiki (built into Astro) with a single theme — `github-dark` or `min-light`, pick one and keep it consistent.
- **Search:** Pagefind, integrated post-build (see Search section below).
- **Styling:** Plain CSS in a single global stylesheet. No Tailwind, no CSS-in-JS, no UI libraries. The aesthetic is minimalist; the CSS should reflect that.
- **Hosting:** Netlify or Cloudflare Pages, deployed from a GitHub repo. Build command `npm run build`, publish directory `dist/`.
- **Node version:** 20 LTS or newer.

## Content Structure

All notes live under `src/content/notes/`, organised by subject directory. Each chapter has exactly two markdown files — one English, one Bengali — distinguished by a language suffix in the filename.

```
src/content/notes/
  comp60272/
    01-llm-pretraining.en.md
    01-llm-pretraining.bn.md
    02-smpc.en.md
    02-smpc.bn.md
  comp61011/  (placeholder — user will populate)
  comp34812/  (placeholder — user will populate)
```

The numeric prefix on filenames determines chapter ordering on the subject page. Two-digit zero-padded (`01`, `02`, … `99`).

## Frontmatter Schema

Every markdown file must have this frontmatter. Validated via Astro Content Collections with a Zod schema.

```yaml
---
subject: COMP60272            # subject code, matches directory key
chapter: 2                    # integer, matches filename prefix
title: Secure Multi-Party Computation
language: en                  # "en" or "bn"
---
```

The Zod schema should enforce `language` as the literal union `"en" | "bn"` and `chapter` as a positive integer.

## Subjects Registry

Subjects are defined in a single config file — `src/config/subjects.ts` — as an exported array. This is the source of truth for what appears on the home page and the display name shown for each subject. The directory name under `src/content/notes/` must match the `slug` field.

```ts
export const subjects = [
  { slug: "comp60272", code: "COMP60272", name: "Security and Privacy of AI" },
  { slug: "comp61011", code: "COMP61011", name: "Machine Learning" },
  // user adds more
] as const;
```

The home page should render every subject in this array, even if its directory has no notes yet. Empty subjects show "No chapters yet" on the subject page rather than 404ing.

## Routes

Three route templates, all static.

### `/` — Home

Lists every subject from the registry. Each subject is a tappable card showing:
- Subject code (e.g. `COMP60272`)
- Subject name (e.g. `Security and Privacy of AI`)

Card links to `/[subject-slug]/`.

Layout: vertical stack on mobile, grid (2 or 3 columns) on wider viewports. No images, no icons.

### `/[subject]/` — Subject page

Dynamic route. `[subject]` matches a `slug` from the registry.

Header: subject code and name.

Body: list of chapters. A "chapter" is defined as the unique set of `(subject, chapter)` pairs across all notes in that subject. For each chapter, show:
- Chapter number and title (taken from whichever language version exists; prefer English if both exist)
- Two buttons side by side: `EN` and `BN`

If only one language exists for a chapter, the missing-language button is disabled (greyed out, not clickable). Do not hide it — the asymmetry should be visible so the user knows what's missing.

Buttons link to `/[subject]/[chapter-slug]/[language]/`.

Sorted by chapter number ascending.

### `/[subject]/[chapter]/[lang]/` — Note page

Dynamic route. Renders the markdown body of the corresponding `.en.md` or `.bn.md` file.

`[chapter]` is the slug derived from the filename without the language suffix — i.e. `01-llm-pretraining.en.md` produces chapter slug `01-llm-pretraining`.

Header on this page:
- Breadcrumb: `Home / COMP60272 / Chapter 2`
- Chapter title (H1)
- Language toggle: two pills, `EN` and `BN`. Current language is highlighted. Clicking the other one navigates to the same chapter in that language. If the other language doesn't exist, the pill is disabled.

Body: rendered markdown. KaTeX-rendered equations. Code blocks with Shiki highlighting. Tables, lists, blockquotes — all standard markdown elements should render cleanly.

Footer on this page: prev / next chapter links within the same subject and language. If no prev or next exists, omit that link rather than disabling it.

## Search

Full-text search across all notes using Pagefind. Pagefind runs after Astro's build, scans the generated HTML in `dist/`, and produces a static search index plus a search UI bundle, also placed in `dist/`. No server, no API key, no runtime cost.

**Build integration:**

- Add `pagefind` as a dev dependency.
- Modify the `build` script in `package.json` to run Pagefind after Astro: `astro build && pagefind --site dist`.
- Pagefind output lives at `dist/pagefind/` and is served as static assets.

**Indexing scope:**

Pagefind indexes any element with `data-pagefind-body` on the page. The note page template should set this attribute on the main content wrapper so chapter body text is indexed but the breadcrumb, language toggle, and prev/next footer are not.

Per-page metadata for result display, set via `data-pagefind-meta`:

- `subject` — the subject code (e.g. `COMP60272`)
- `chapter` — the chapter number and title (e.g. `Chapter 2: SMPC`)
- `language` — `en` or `bn`

Filter attributes via `data-pagefind-filter`:

- `subject` — allows filtering results by subject
- `language` — allows filtering results by language

**Search UI:**

A search box on the home page only — not in a global header. Uses Pagefind's default UI component (`<link rel="stylesheet" href="/pagefind/pagefind-ui.css">` and `<script src="/pagefind/pagefind-ui.js">`) initialised in a single `<script>` block. Configure it with:

- Placeholder text: "Search notes"
- Filters enabled for `subject` and `language`
- Results show subject, chapter, and a snippet

Style the search UI to match the site's typography and palette — Pagefind's defaults are overridable via CSS variables on the `.pagefind-ui` selector. Keep it minimalist; no icon, no fancy framing.

**Note pages do not contain a search box.** When reading, the user is not searching. A search button in the breadcrumb is acceptable if it just links to `/#search` and scrolls/focuses the home page search box.

## Print Stylesheet

Chapters should print cleanly for offline study and exam revision. Add a `@media print` block to `global.css` that:

- Hides the breadcrumb, language toggle, prev/next footer, and any search-related elements.
- Resets background to white and text to black regardless of dark/light mode.
- Removes max-width constraints — let content fill the printable area.
- Ensures code blocks wrap rather than overflow; long lines should break.
- Forces KaTeX equations to render with sufficient size (KaTeX uses SVG/HTML, so check it survives print at readable size).
- Adds the chapter title and subject as a print header via `@page` rules if practical, otherwise leaves the in-page H1 as the visible title.
- Page-break-inside avoid on tables, figures, and code blocks where possible.

The user should be able to hit `Cmd/Ctrl+P` on any note page and get a clean PDF.

## Static Path Generation

Use Astro's `getStaticPaths` to generate every valid `(subject, chapter, lang)` combination at build time. Pages that don't exist (missing language for a chapter) should not be generated — clicking a disabled button is impossible, so no 404s in normal use.

## Styling

A single `src/styles/global.css` file. No component-scoped styles unless absolutely necessary.

Design principles (binding, not suggestions):

- **Typography first.** The site is for reading. Pick one serif for body (e.g. `Charter`, `Iowan Old Style`, system serif fallback) or one humanist sans (e.g. `Inter`, system-ui). Not both. Body text 17–18px on desktop, 16px on mobile. Line height 1.6. Max content width 68ch on note pages.
- **Two colours plus neutrals.** A background, a foreground, one accent for links and active states. Pick from a muted palette — no saturated blues or reds. Greyscale plus one warm or cool accent.
- **Dark mode via `prefers-color-scheme`.** Both modes must be designed, not just inverted.
- **No animations.** Hover state on links is colour change only. No transitions, no fades, no shadows that move.
- **No icons, no emoji, no decorative elements.** Text and layout do all the work.
- **Bengali script support.** Bengali notes must render in a font that supports the script properly. Use `Noto Sans Bengali` or `Hind Siliguri` via Google Fonts, scoped to elements with `lang="bn"`. Set `lang="bn"` on the `<html>` or `<body>` of Bengali note pages (and `lang="en"` for English) so the right font is applied automatically.

## Example Markdown File

Codex should generate one complete example chapter as a reference, in both languages, so the user can see the pattern. Use a short SMPC excerpt — three or four paragraphs, one display equation, one inline equation, one code block, one table. The content itself doesn't matter for the build; it's there to verify rendering.

## Build & Deploy

- `package.json` scripts: `dev`, `build`, `preview`.
- `.gitignore` for `node_modules`, `dist`, `.astro`.
- `netlify.toml` with build command and publish directory configured. Include this even if the user ends up deploying to Cloudflare Pages — it's a one-file marker and harmless.
- `README.md` with: how to add a new subject, how to add a new chapter, how to run locally, how to deploy. Keep it under 60 lines.

## Out of Scope for v1

Explicitly not building:

- Tags or filtering beyond Pagefind's built-in subject/language filters
- Authentication or private notes
- Comments or annotations
- PDF rendering (notes are markdown only; the original PDFs live elsewhere)
- Editing in-browser
- A sidebar or persistent navigation beyond the breadcrumb
- Reading progress, bookmarks, or any client-side state
- RSS or sitemap (can add later)

If Codex generates any of these, it has overbuilt the spec.

## Acceptance Checklist

Codex's output should pass all of these:

1. `npm install && npm run dev` starts the dev server with no errors.
2. Home page lists all subjects from the registry and shows a working search box.
3. Subject page lists chapters sorted by number, with EN/BN buttons, disabled where a language is missing.
4. Note page renders markdown, KaTeX equations, code blocks, and tables correctly.
5. Language toggle on the note page switches between EN and BN versions of the same chapter.
6. Prev/next links work within a subject and language.
7. Bengali pages render in a Bengali-capable font.
8. Dark mode works via system preference.
9. `npm run build` completes without errors, runs Pagefind, and produces a `dist/` directory containing `pagefind/` assets.
10. Searching from the home page returns results across all subjects and languages, with working subject/language filters.
11. Printing a note page (Cmd/Ctrl+P) produces a clean output with no navigation chrome, white background, and readable equations.
12. Adding a new `03-foo.en.md` and `03-foo.bn.md` file requires zero code changes — the new chapter appears automatically and is searchable after rebuild.