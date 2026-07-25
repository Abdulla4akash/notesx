# NotesX

**Live site: <https://akash-notex.netlify.app/>**

A static [Astro](https://astro.build/) site for reading MSc study notes in English and Bengali. No backend, no authentication, no database — notes are authored as markdown files, organised by subject and chapter, and built into a static site.

## Contents

| Subject | Code | Files |
|---|---|---|
| Advanced Topics in Knowledge Representation and Reasoning | COMP64602 | 58 |
| Secure Computer Architecture and Systems | COMP60261 | 27 |
| Security and Privacy in Artificial Intelligence | COMP60272 | 21 |
| Logics for Knowledge Representation and Reasoning | COMP64401 | 20 |
| Topics in Machine Learning | COMP64501 | 20 |
| Transforming Text Into Meaning | COMP64702 | 20 |
| Advanced Topics in Machine Learning | COMP64802 | 20 |
| Cognitive Robotics and Computer Vision | COMP64301 | 7 |
| Masters Project | COMP66060 | — |
| Reinforcement Learning | *self-learning* | 7 |

## Features

- **Bilingual** — each chapter can have an English (`.en.md`) and a Bengali (`.bn.md`) version
- **Maths** — LaTeX via `remark-math` + `rehype-katex`, written as `$inline$` and `$$display$$`
- **Full-text search** — [Pagefind](https://pagefind.app/) indexes the site at build time
- **PDF attachments** — lecture slides pair automatically with chapters
- **Anki decks** — downloadable `.apkg` files linked from flashcard chapters

## Run locally

```sh
npm install
npm run dev
```

Build and preview:

```sh
npm run build
npm run preview
```

`npm run build` runs Astro and then Pagefind, which writes search assets to `dist/pagefind/`.

## Add a subject

1. Add a subject entry to `src/config/subjects.ts`.
2. Create a matching directory under `src/content/notes/`.

Example:

```ts
{ slug: "comp61011", code: "COMP61011", name: "Machine Learning" }
```

## Add a chapter

Create markdown files in the subject directory:

```text
src/content/notes/comp60272/03-topic.en.md
src/content/notes/comp60272/03-topic.bn.md
```

Each file needs frontmatter:

```yaml
---
subject: COMP60272
chapter: 3
title: Topic Title
language: en
---
```

Use `language: bn` for the Bengali version. The schema lives in
`src/content.config.ts` — `chapter` must be a positive integer and `language`
must be `en` or `bn`. A build failure here usually means frontmatter that does
not match the schema.

### Chapter numbering convention

`chapter` controls ordering on the subject page, so related material is grouped
by numeric offset rather than interleaved with the notes:

| Range | Purpose |
|---|---|
| `1`–`19` | Lecture / week notes |
| `+10` offset | Flashcards for the corresponding note |
| `+20` offset | Question banks |
| `+70` offset | Extra exercise sets |
| `98`–`99` | Mock exams and worked solutions |

For example in COMP60261, week 3 notes are chapter `3`, its flashcards are `13`,
and its question bank is `23`. Subjects with more chapters use wider bands —
COMP64401 uses `31`–`34` for flashcards and `51`–`54` for question banks.

## Add a PDF

Place lecture PDFs under `public/pdfs/[subject-slug]/`:

```text
public/pdfs/comp60272/03-topic.pdf
```

The filename must be `NN-slug.pdf`. To pair with markdown, the `NN-slug`
portion must exactly match the markdown filename before `.en.md` or `.bn.md`.
PDFs are discovered automatically by `getPdfEntriesForSubject` in
`src/lib/notes.ts`, appear as a subject-page option, open in a new tab, and are
not indexed by search.

## Add an Anki deck

Place `.apkg` files under `public/anki/[subject-slug]/`:

```text
public/anki/comp60261/13-week-3-flashcards.apkg
```

Unlike PDFs these are **not** auto-discovered — link to one from the top of the
matching flashcard chapter:

```markdown
**Anki:** [Download this deck as `.apkg`](/anki/comp60261/13-week-3-flashcards.apkg)
— import into Anki via *File → Import*.
```

Keep deck and model IDs stable when regenerating a deck, so that re-importing
updates existing cards instead of duplicating them.

## Writing notes

- **Keep display maths on one line.** Multi-line `\begin{aligned}` blocks with
  `\\` row separators do not survive the markdown pipeline — the environment is
  stripped and KaTeX fails. Use single-line `$$…$$`, or a bulleted list of
  inline `$…$` expressions.
- **Collapsible answers** use raw HTML, which markdown passes through:

  ```html
  <details>
  <summary><strong>Q1.</strong> Question here</summary>

  Answer here.

  </details>
  ```

- After building, check for silent maths failures — the build succeeds even when
  an expression fails to render:

  ```sh
  grep -ro 'katex-error' dist/ | wc -l   # should be 0
  ```

## Deploy

Deployed to Netlify from GitHub — pushes to `main` trigger a build.

- Build command: `npm run build`
- Publish directory: `dist/`

Both are already set in `netlify.toml`, so importing the repo needs no extra
configuration.
