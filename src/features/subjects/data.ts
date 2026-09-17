import { ChapterWithTopics, TopicDetail } from "./types";

export const CHEMISTRY_SUBJECT = {
  id: "e1000000-0000-0000-0000-000000000001",
  name: "Chemistry",
  slug: "chemistry",
  description:
    "Interactive chemistry concepts, formulas, visual simulations, graphs, and topic-wise practice.",
  thumbnailUrl: "/assets/eduideal-logo-BUtjWTvV.png",
  displayOrder: 1,
  isPublished: true,
};

export const SOLUTIONS_CHAPTER = {
  id: "e1000000-0000-0000-0000-000000000010",
  subjectId: "e1000000-0000-0000-0000-000000000001",
  name: "Solutions",
  slug: "solutions",
  description:
    "Learn the concepts of solutions step by step. Master concentration units, Raoult's law, colligative properties, and abnormal molar masses.",
  displayOrder: 1,
  isPublished: true,
};

export const SOLUTIONS_TOPICS: Array<{
  id: string;
  chapterId: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isPublished: boolean;
}> = [
  {
    id: "e1000000-0000-0000-0000-000000000101",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Introduction to Solutions",
    slug: "introduction-to-solutions",
    description: "Understand solute, solvent and solutions",
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000102",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Types of Solutions",
    slug: "types-of-solutions",
    description: "Classify solutions based on physical state",
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000103",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Concentration of Solutions",
    slug: "concentration-of-solutions",
    description: "Learn different concentration units",
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000104",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Solubility",
    slug: "solubility",
    description: "Understand factors affecting solubility",
    displayOrder: 4,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000105",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Vapour Pressure",
    slug: "vapour-pressure",
    description: "Explore vapour pressure of liquid solutions",
    displayOrder: 5,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000106",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Raoult's Law",
    slug: "raoults-law",
    description: "Master Raoult's law for volatile and non-volatile solutes",
    displayOrder: 6,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000107",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Ideal and Non-Ideal Solutions",
    slug: "ideal-and-non-ideal-solutions",
    description: "Understand thermodynamic criteria and intermolecular interactions",
    displayOrder: 7,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000108",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Positive and Negative Deviation",
    slug: "positive-and-negative-deviation",
    description: "Explore positive and negative deviations from Raoult's law",
    displayOrder: 8,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000109",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Azeotropes",
    slug: "azeotropes",
    description: "Learn about minimum and maximum boiling azeotropes",
    displayOrder: 9,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000110",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Colligative Properties",
    slug: "colligative-properties",
    description: "Introduction to colligative properties",
    displayOrder: 10,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000111",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Relative Lowering of Vapour Pressure",
    slug: "relative-lowering-of-vapour-pressure",
    description: "Molecular mass determination using RLVP",
    displayOrder: 11,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000112",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Elevation of Boiling Point",
    slug: "elevation-of-boiling-point",
    description: "Ebullioscopic constant and boiling point elevation",
    displayOrder: 12,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000113",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Depression of Freezing Point",
    slug: "depression-of-freezing-point",
    description: "Cryoscopic constant and freezing point depression",
    displayOrder: 13,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000114",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Osmosis",
    slug: "osmosis",
    description: "Understand semipermeable membranes and solvent flow",
    displayOrder: 14,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000115",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Osmotic Pressure",
    slug: "osmotic-pressure",
    description: "Study van't Hoff equation for osmotic pressure",
    displayOrder: 15,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000116",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Reverse Osmosis",
    slug: "reverse-osmosis",
    description: "Water purification and applications of reverse osmosis",
    displayOrder: 16,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000117",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Abnormal Molar Mass",
    slug: "abnormal-molar-mass",
    description: "Discrepancies caused by association and dissociation",
    displayOrder: 17,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000118",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Van't Hoff Factor",
    slug: "vant-hoff-factor",
    description: "Calculate i factor and degree of dissociation or association",
    displayOrder: 18,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000119",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Applications of Colligative Properties",
    slug: "applications-of-colligative-properties",
    description: "Real-world engineering and medical applications",
    displayOrder: 19,
    isPublished: true,
  },
  {
    id: "e1000000-0000-0000-0000-000000000120",
    chapterId: SOLUTIONS_CHAPTER.id,
    name: "Numerical Practice",
    slug: "numerical-practice",
    description: "Master NCERT and CBSE board numerical problem solving",
    displayOrder: 20,
    isPublished: true,
  },
];

export function getFallbackChapterWithTopics(
  subjectSlug: string,
  chapterSlug: string
): ChapterWithTopics | null {
  if (subjectSlug === "chemistry" && chapterSlug === "solutions") {
    return {
      id: SOLUTIONS_CHAPTER.id,
      subjectId: SOLUTIONS_CHAPTER.subjectId,
      name: SOLUTIONS_CHAPTER.name,
      slug: SOLUTIONS_CHAPTER.slug,
      description: SOLUTIONS_CHAPTER.description,
      displayOrder: SOLUTIONS_CHAPTER.displayOrder,
      isPublished: SOLUTIONS_CHAPTER.isPublished,
      subjectName: CHEMISTRY_SUBJECT.name,
      subjectSlug: CHEMISTRY_SUBJECT.slug,
      topics: SOLUTIONS_TOPICS.map((t) => ({
        ...t,
        createdAt: null,
        updatedAt: null,
      })),
    };
  }
  return null;
}

export function getFallbackTopic(
  subjectSlug: string,
  chapterSlug: string,
  topicSlug: string
): TopicDetail | null {
  if (subjectSlug === "chemistry" && chapterSlug === "solutions") {
    const topic = SOLUTIONS_TOPICS.find((t) => t.slug === topicSlug);
    if (!topic) return null;
    return {
      ...topic,
      createdAt: null,
      updatedAt: null,
      chapterName: SOLUTIONS_CHAPTER.name,
      chapterSlug: SOLUTIONS_CHAPTER.slug,
      subjectName: CHEMISTRY_SUBJECT.name,
      subjectSlug: CHEMISTRY_SUBJECT.slug,
    };
  }
  return null;
}
