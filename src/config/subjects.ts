export const subjects = [
  { slug: "comp60261", code: "COMP60261", name: "Secure Computer Architecture and Systems" },
  { slug: "comp64301", code: "COMP64301", name: "Cognitive Robotics and Computer Vision" },
  { slug: "comp64401", code: "COMP64401", name: "Logics for Knowledge Representation and Reasoning" },
  { slug: "comp64501", code: "COMP64501", name: "Topics in Machine Learning" },
  { slug: "comp60272", code: "COMP60272", name: "Security and Privacy in Artificial Intelligence" },
  { slug: "comp64602", code: "COMP64602", name: "Advanced Topics in Knowledge Representation and Reasoning" },
  { slug: "comp64702", code: "COMP64702", name: "Transforming Text Into Meaning" },
  { slug: "comp64802", code: "COMP64802", name: "Advanced Topics in Machine Learning" },
  { slug: "comp66060", code: "COMP66060", name: "Masters Project" },
] as const;

export type Subject = (typeof subjects)[number];

export const selfLearning = [
  { slug: "reinforcement-learning", code: "Self Learning", name: "Reinforcement Learning" },
] as const;

export type SelfLearning = (typeof selfLearning)[number];

export const allSubjects = [...subjects, ...selfLearning] as const;
