import type { CollectionEntry } from "astro:content";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { subjects } from "../config/subjects";

export type NoteEntry = CollectionEntry<"notes">;
export type Language = "en" | "bn";

export interface PdfEntry {
  subjectSlug: string;
  chapter: number;
  slug: string;
  title: string;
  url: string;
}

export function getSubjectBySlug(slug: string) {
  return subjects.find((subject) => subject.slug === slug);
}

export function getSubjectSlug(note: NoteEntry) {
  return note.id.split("/")[0];
}

export function getChapterSlug(note: NoteEntry) {
  const filename = note.id.split("/").at(-1) ?? note.id;
  return filename
    .replace(new RegExp(`\\.?${note.data.language}(\\.md)?$`), "")
    .replace(/\.(en|bn)(\.md)?$/, "");
}

export function getChapterPrefix(note: NoteEntry) {
  return getChapterSlug(note).split("-")[0] ?? String(note.data.chapter).padStart(2, "0");
}

export function getChapterTitle(notes: NoteEntry[]) {
  return notes.find((note) => note.data.language === "en")?.data.title ?? notes[0]?.data.title ?? "";
}

export function notesForSubject(notes: NoteEntry[], subjectSlug: string) {
  return notes.filter((note) => getSubjectSlug(note) === subjectSlug);
}

function titleFromSlug(slug: string) {
  const words = slug.replace(/^\d{2}-/, "").split("-");
  const acronyms = new Set(["ai", "api", "bn", "en", "kr", "llm", "nlp", "pdf", "smpc"]);

  return words
    .map((word) => {
      if (acronyms.has(word.toLowerCase())) {
        return word.toUpperCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function getPdfEntriesForSubject(subjectSlug: string): PdfEntry[] {
  const pdfDirectory = join(process.cwd(), "public", "pdfs", subjectSlug);

  if (!existsSync(pdfDirectory)) {
    return [];
  }

  return readdirSync(pdfDirectory)
    .filter((filename) => /^\d{2}-.+\.pdf$/.test(filename))
    .map((filename) => {
      const slug = filename.replace(/\.pdf$/, "");
      const chapter = Number(slug.split("-")[0]);

      return {
        subjectSlug,
        chapter,
        slug,
        title: titleFromSlug(slug),
        url: `/pdfs/${subjectSlug}/${filename}`
      };
    });
}

export function groupChapters(notes: NoteEntry[], pdfs: PdfEntry[] = []) {
  const chapters = new Map<string, { chapter: number; slug: string; entries: NoteEntry[]; pdf?: PdfEntry }>();

  for (const note of notes) {
    const slug = getChapterSlug(note);
    const key = `${note.data.chapter}:${slug}`;
    const current = chapters.get(key) ?? { chapter: note.data.chapter, slug, entries: [] };
    current.entries.push(note);
    chapters.set(key, current);
  }

  for (const pdf of pdfs) {
    const key = `${pdf.chapter}:${pdf.slug}`;
    const current = chapters.get(key) ?? { chapter: pdf.chapter, slug: pdf.slug, entries: [] };
    current.pdf = pdf;
    chapters.set(key, current);
  }

  return [...chapters.values()]
    .map(({ chapter, slug, entries, pdf }) => ({
      chapter,
      entries,
      slug,
      title: getChapterTitle(entries) || pdf?.title || "",
      en: entries.find((entry) => entry.data.language === "en"),
      bn: entries.find((entry) => entry.data.language === "bn"),
      pdf
    }))
    .sort((a, b) => a.chapter - b.chapter || a.slug.localeCompare(b.slug));
}
