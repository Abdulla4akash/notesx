# COMP60261 Slide Deck to NotesX Note Prompt

Use this prompt with Codex or another coding agent when you want to turn one
downloaded COMP60261 slide deck into a detailed NotesX markdown note and publish
it to GitHub.

```text
You are working in the user's Windows workspace.

Goal:
Turn one specific downloaded COMP60261 slide deck into a detailed English
NotesX note, matching the existing NotesX structure, validate the site, then
commit and push the change to the user's GitHub repository.

Inputs:
- NOTESX_REPO: C:\Users\abdul\notesx
- DOWNLOADED_SLIDES_ROOT: C:\Users\abdul\Downloads\COMP60261-slides
- SLIDE_DECK_PATH: <absolute path to one deck's index.html, for example
  C:\Users\abdul\Downloads\COMP60261-slides\slides\20-trusted-execution-environments\index.html>
- TARGET_NOTE_PATH: <repo-relative markdown path to create or update, for example
  src\content\notes\comp60261\04-week-4.en.md>
- TARGET_CHAPTER_NUMBER: <positive integer used in frontmatter>
- TARGET_TITLE: <frontmatter title, for example "Week 4">
- PUBLISH_MODE: <"direct-main" only if explicitly requested by the user;
  otherwise use "branch-pr">

Repository structure to follow:
- The repo is C:\Users\abdul\notesx.
- COMP60261 notes live in src\content\notes\comp60261.
- Markdown files use this frontmatter exactly:
  ---
  subject: COMP60261
  chapter: <TARGET_CHAPTER_NUMBER>
  title: "<TARGET_TITLE>"
  language: en
  ---
- Existing lecture notes use chapters 1-9.
- Flashcards use a +10 offset.
- Question banks use a +20 offset.
- Do not create flashcards, question banks, PDFs, or Bengali notes unless the
  user explicitly asks.

Before editing:
1. Run git status --short --branch in NOTESX_REPO.
2. Read README.md, src\content.config.ts, and at least two existing COMP60261
   notes near the target chapter.
3. If TARGET_NOTE_PATH already exists, preserve its frontmatter and local style.
   Update the relevant lecture section instead of replacing unrelated material.
4. If there are unrelated local changes, do not stage or overwrite them.

How to read the slide deck:
1. Open SLIDE_DECK_PATH.
2. The COMP60261 downloaded decks are Remark.js HTML decks. Extract the lecture
   markdown from the textarea block in index.html, then split slides on slide
   separators such as "---".
3. Follow local relative references from the deck folder:
   - include/*.svg, include/*.png, include/*.jpg, etc.
   - src/* code snippets
4. For SVGs, read the SVG text/labels when useful. For raster images, inspect
   them visually if image-view tooling is available. If an image is important
   but cannot be interpreted, write [UNCLEAR: image detail] rather than guessing.
5. Use only the downloaded slide deck and its local assets as the source unless
   the user explicitly authorizes web research.

Writing requirements:
- Produce detailed study notes, not a terse slide summary.
- Explain every substantive slide idea in prose.
- Add definitions, intuition, examples, security significance, and exam-facing
  interpretation where supported by the slides.
- Use sections that mirror the lecture's conceptual flow.
- Prefer this structure:
  # COMP60261 - <lecture or week title>

  **Source used:** downloaded slide deck, `<SLIDE_DECK_PATH>`.

  **Transcript status:** no lecture transcript was provided. These notes are
  grounded in the slides only. Mark transcript-dependent gaps as **[UNCLEAR]**.

  **Topic and scope:** ...

  ---

  ## 1. ...
  ### 1.1 ...
- Use tables when they make comparisons easier.
- Use fenced code blocks for code examples and explain what the code shows.
- Keep display maths on one line because the NotesX markdown pipeline can break
  multi-line KaTeX environments.
- Avoid dumping full slide text verbatim. Paraphrase and transform it into notes.
  Short exact phrases are acceptable only when a definition needs precision.
- Do not hallucinate missing details. Mark unsupported claims as [UNCLEAR] or
  omit them.
- Keep punctuation ASCII unless the existing target file already uses another
  style and consistency requires it.

Editing:
1. Write the markdown to TARGET_NOTE_PATH.
2. If updating an existing week file, insert or expand only the section
   corresponding to SLIDE_DECK_PATH. Do not destroy other lectures in the week.
3. Ensure the file remains valid Astro content markdown with valid frontmatter.

Validation:
1. Run npm run build from NOTESX_REPO.
2. After a successful build, check for KaTeX render errors:
   PowerShell:
   Get-ChildItem -Path dist -Recurse -File | Select-String -Pattern 'katex-error'
   This should return no matches.
3. If validation fails, fix the markdown and rerun once. Do not push a broken
   build unless the user explicitly tells you to.

Git publishing:
1. Run git diff -- TARGET_NOTE_PATH and inspect the actual note change.
2. Run git status --short.
3. Stage only the intended note file:
   git add -- TARGET_NOTE_PATH
4. Commit with a concise message, for example:
   git commit -m "Expand COMP60261 trusted execution notes"
5. If PUBLISH_MODE is "direct-main" and the user explicitly requested pushing
   main, run:
   git pull --rebase origin main
   git push origin main
6. Otherwise, use a branch and draft PR:
   git switch -c agent/comp60261-<short-topic>-notes
   git push -u origin HEAD
   gh pr create --draft --fill

Final response:
- State the slide deck used.
- State the note file created or updated.
- State the validation result.
- State the commit hash and GitHub branch/PR or direct push target.
```

