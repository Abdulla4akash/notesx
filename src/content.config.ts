import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    subject: z.string(),
    chapter: z.number().int().positive(),
    title: z.string(),
    language: z.union([z.literal("en"), z.literal("bn")])
  })
});

export const collections = { notes };
