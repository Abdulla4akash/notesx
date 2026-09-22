/**
 * Presentation helpers: a colour identity per subject, and a type badge per
 * chapter. Both are derived, so adding a subject or chapter needs no extra
 * configuration.
 */

/** Hue (0-360) per subject slug. Distinct and evenly spread so subjects are
 *  distinguishable at a glance on the index pages. */
const SUBJECT_HUES: Record<string, number> = {
  comp60261: 205, // Secure Computer Architecture - blue
  comp60272: 275, // Security and Privacy in AI - violet
  comp64301: 25, // Cognitive Robotics and Vision - orange
  comp64401: 150, // Logics for KR&R - green
  comp64501: 340, // Topics in ML - pink
  comp64602: 175, // Advanced KR&R - teal
  comp64702: 45, // Transforming Text Into Meaning - amber
  comp64802: 300, // Advanced Topics in ML - magenta
  comp66060: 220, // Masters Project - indigo
  "reinforcement-learning": 95 // Self-learning - lime
};

/** Deterministic fallback so an unregistered subject still gets a stable hue. */
function hashHue(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 360;
  }
  return hash;
}

export function subjectHue(slug: string): number {
  return SUBJECT_HUES[slug] ?? hashHue(slug);
}

export type ChapterKind = "notes" | "flashcards" | "questions" | "exercises" | "exam" | "plan";

const KIND_LABELS: Record<ChapterKind, string> = {
  notes: "Notes",
  flashcards: "Flashcards",
  questions: "Question bank",
  exercises: "Exercises",
  exam: "Exam",
  plan: "Study plan"
};

/**
 * Classify a chapter by its title, falling back to the numeric bands described
 * in the README. Title first, because it is explicit and subject-independent -
 * the numeric offsets differ between subjects.
 */
export function chapterKind(title: string, chapter: number): ChapterKind {
  const t = title.toLowerCase();

  if (/flash\s*card/.test(t)) return "flashcards";
  if (/question\s*bank/.test(t)) return "questions";
  if (/exercise/.test(t)) return "exercises";
  if (/mock exam|exam practice|past paper/.test(t)) return "exam";
  if (/study plan/.test(t)) return "plan";

  if (chapter >= 98) return "exam";
  if (chapter >= 70) return "exercises";
  if (chapter >= 50) return "questions";
  if (chapter >= 30) return "flashcards";

  return "notes";
}

export function chapterKindLabel(kind: ChapterKind): string {
  return KIND_LABELS[kind];
}
