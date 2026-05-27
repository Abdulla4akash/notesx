# NotesX — Spec Patch: Split PDF Export by Language + Fix Bengali Rendering

Modify the existing `scripts/export-pdfs.mjs` PDF export. Two changes: (1) produce one PDF per subject PER LANGUAGE instead of one combined bilingual PDF, and (2) fix Bengali glyphs rendering as null/broken characters in the PDF output. Do not change the website or anything outside the export script and its dependencies.

## Change 1 — Split by language

Currently the script produces one PDF per subject containing all chapters in both languages (English pages then Bengali pages). Change this so each subject produces up to TWO PDFs:

```
pdf-export/
  comp60272-en.pdf    # all English chapters for the subject, in chapter order
  comp60272-bn.pdf    # all Bengali chapters for the subject, in chapter order
  comp64401-en.pdf
  comp64401-bn.pdf
  ...
```

- `<slug>-en.pdf` contains only the English (`/en/`) pages for that subject, all chapters in ascending chapter-number order.
- `<slug>-bn.pdf` contains only the Bengali (`/bn/`) pages for that subject, all chapters in ascending order.
- If a subject has no English chapters, skip its `-en.pdf` (and likewise for `-bn.pdf`). Don't emit empty PDFs.
- Page breaks between chapters as before.
- Keep the chapter title + language label headings already implemented.

## Change 2 — Fix Bengali rendering (broken/null glyphs)

The current Bengali PDF pages contain corrupted glyphs (null characters `\u0000`, dropped conjuncts). Root cause is almost certainly that Puppeteer prints the page before the Bengali web font has fully loaded and rendered, and/or the font isn't embedding in the PDF. Fix by ensuring fonts are fully ready before printing each page:

- Before calling `page.pdf(...)`, wait for the page to be fully loaded AND fonts ready:
  - Navigate with `waitUntil: 'networkidle0'`.
  - Then `await page.evaluateHandle('document.fonts.ready')` (or `await page.evaluate(() => document.fonts.ready)`) so all `@font-face` fonts — including the Bengali font (Noto Sans Bengali / Hind Siliguri) — are loaded before printing.
  - If a brief explicit settle helps, add a short `await new Promise(r => setTimeout(r, 300))` after fonts.ready, but prefer the fonts.ready signal over arbitrary sleeps.
- Ensure the Bengali font is actually available to the print context:
  - If the pages load via a local static server (http://localhost:PORT), the `@font-face` web fonts should load normally — verify the font files are served and reachable.
  - If pages load via `file://`, web font URLs and relative paths often fail, which would cause exactly this glyph corruption. If `file://` is in use, switch to serving `dist/` over a local static server and load `http://localhost:PORT/...` so CSS and fonts resolve correctly.
- Use `printBackground: true` is not required, but DO ensure `page.pdf` is allowed to embed fonts (Chrome embeds fonts in print-to-PDF by default; the issue is loading, not embedding).
- After the fix, the Bengali PDF text must contain real Bengali characters (Unicode range U+0980–U+09FF) with no `\u0000` / replacement characters, and conjuncts must render correctly.

## Margins (optional, for tablet annotation)

If not already set, use generous margins (around 20–25mm) since these PDFs are annotated by hand on a tablet, leaving room to write. Keep it readable, not cramped.

## Acceptance checklist

1. `npm run export-pdfs` completes with no errors.
2. `pdf-export/` contains separate `<slug>-en.pdf` and `<slug>-bn.pdf` files per subject (only for languages that exist).
3. The English PDFs contain only English chapters; the Bengali PDFs contain only Bengali chapters; both in chapter order.
4. Extracting text from a Bengali PDF yields valid Bengali Unicode characters with NO null characters (`\u0000`) or replacement glyphs, and conjunct characters render correctly.
5. KaTeX equations and code blocks still render correctly in both the EN and BN PDFs.
6. Each individual PDF is a sensible size (much smaller than the previous ~1,160-page combined file).
7. Re-running overwrites cleanly; `pdf-export/` stays gitignored.
8. The website is unchanged.

## Verification hint for the implementer

After generating, programmatically check a Bengali PDF for null characters to confirm the fix, e.g. read the PDF text and assert it contains characters in U+0980–U+09FF and does not contain `\u0000`. Report the result.