# NotesX

Static Astro site for reading subject notes in English and Bengali.

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

Use `language: bn` for the Bengali version.

## Add a PDF

Place lecture PDFs under `public/pdfs/[subject-slug]/`:

```text
public/pdfs/comp60272/03-topic.pdf
```

The filename must be `NN-slug.pdf`. To pair with markdown, the `NN-slug`
portion must exactly match the markdown filename before `.en.md` or `.bn.md`.
PDFs appear as a subject-page option, open in a new tab, and are not indexed by
search.

## Deploy

Deploy to Netlify or Cloudflare Pages from GitHub.

- Build command: `npm run build`
- Publish directory: `dist/`

Pagefind runs after Astro builds and writes search assets to `dist/pagefind/`.
