import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  subjectMetadataSchema,
  chapterMetadataSchema,
  topicMetadataSchema,
  contentBlockSchema,
  topicContentSchema,
} from "../../src/lib/validation/content-schema.js";

describe("Content Validation Schemas", () => {
  describe("Subject Metadata Validation", () => {
    it("should validate valid subject metadata", () => {
      const valid = {
        id: "physics",
        slug: "physics",
        title: "Class 12 Physics",
        description: "Core Physics Curriculum",
        grade: 12,
        chapterIds: ["phy-c01"],
      };
      const result = subjectMetadataSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("should reject subject metadata with empty id or slug", () => {
      const invalid = {
        id: "",
        slug: "",
        title: "Invalid Subject",
      };
      const result = subjectMetadataSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("Chapter Metadata Validation", () => {
    it("should validate valid chapter metadata", () => {
      const valid = {
        id: "chem-c01",
        subjectId: "chemistry",
        slug: "chapter-01",
        title: "Solutions",
        order: 1,
        topicIds: [],
      };
      const result = chapterMetadataSchema.safeParse(valid);
      assert.equal(result.success, true);
      assert.deepEqual(result.data.topicIds, []);
    });

    it("should reject negative chapter order", () => {
      const invalid = {
        id: "chem-c01",
        subjectId: "chemistry",
        slug: "chapter-01",
        title: "Solutions",
        order: -1,
      };
      const result = chapterMetadataSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("Topic Metadata Validation", () => {
    it("should validate valid topic metadata", () => {
      const valid = {
        id: "chem-c01-t01",
        chapterId: "chem-c01",
        subjectId: "chemistry",
        slug: "types-of-solutions",
        title: "Types of Solutions",
        order: 1,
        estimatedMinutes: 20,
      };
      const result = topicMetadataSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("should reject topic metadata missing mandatory relationships", () => {
      const invalid = {
        id: "t01",
        slug: "types-of-solutions",
        title: "Missing Chapter & Subject",
        order: 1,
      };
      const result = topicMetadataSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("Discriminated Union Content Blocks", () => {
    it("should validate THEORY block", () => {
      const theoryBlock = {
        id: "b-theory-1",
        type: "THEORY",
        displayOrder: 1,
        title: "Core Concepts",
        data: {
          introduction: "Introductory overview",
          sections: [
            {
              id: "sec-1",
              heading: "Classification",
              paragraphs: ["A solution is a homogeneous mixture of two or more substances."],
            },
          ],
        },
      };
      const result = contentBlockSchema.safeParse(theoryBlock);
      assert.equal(result.success, true);
      assert.equal(result.data.type, "THEORY");
    });

    it("should validate IMAGE block", () => {
      const imageBlock = {
        id: "b-img-1",
        type: "IMAGE",
        displayOrder: 2,
        title: "Vapour Pressure Diagram",
        data: {
          url: "https://example.com/assets/vapour-pressure.png",
          altText: "Graph of vapour pressure vs temperature",
          caption: "Figure 1.1: Equilibrium vapour pressure",
        },
      };
      const result = contentBlockSchema.safeParse(imageBlock);
      assert.equal(result.success, true);
      assert.equal(result.data.type, "IMAGE");
    });

    it("should validate FORMULA block", () => {
      const formulaBlock = {
        id: "b-formula-1",
        type: "FORMULA",
        displayOrder: 3,
        title: "Henry's Law Equation",
        data: {
          formulaName: "Henry's Law",
          formulaExpression: "p = K_H \\times x",
          resultUnit: "atm",
          variables: [
            {
              id: "v-kh",
              symbol: "K_H",
              label: "Henry's Law Constant",
              defaultValue: 1.67,
            },
            {
              id: "v-x",
              symbol: "x",
              label: "Mole fraction in solution",
              defaultValue: 0.05,
            },
          ],
        },
      };
      const result = contentBlockSchema.safeParse(formulaBlock);
      assert.equal(result.success, true);
      assert.equal(result.data.type, "FORMULA");
    });

    it("should validate GRAPH block", () => {
      const graphBlock = {
        id: "b-graph-1",
        type: "GRAPH",
        displayOrder: 4,
        title: "Raoult's Law Curve",
        data: {
          graphType: "2d",
          title: "Total Vapour Pressure vs Mole Fraction",
          xAxis: { label: "Mole Fraction x1", min: 0, max: 1 },
          yAxis: { label: "Vapour Pressure (mmHg)", min: 0, max: 200 },
        },
      };
      const result = contentBlockSchema.safeParse(graphBlock);
      assert.equal(result.success, true);
      assert.equal(result.data.type, "GRAPH");
    });

    it("should validate THREE_D block", () => {
      const threeDBlock = {
        id: "b-3d-1",
        type: "THREE_D",
        displayOrder: 5,
        title: "Lattice Structure 3D",
        data: {
          modelId: "brass-lattice",
          title: "Substitutional Solid Solution",
          cameraPosition: [0, 2, 5],
        },
      };
      const result = contentBlockSchema.safeParse(threeDBlock);
      assert.equal(result.success, true);
      assert.equal(result.data.type, "THREE_D");
    });

    it("should validate VIDEO block", () => {
      const videoBlock = {
        id: "b-video-1",
        type: "VIDEO",
        displayOrder: 6,
        title: "Colligative Properties Lecture",
        data: {
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          provider: "youtube",
          durationSeconds: 720,
        },
      };
      const result = contentBlockSchema.safeParse(videoBlock);
      assert.equal(result.success, true);
      assert.equal(result.data.type, "VIDEO");
    });

    it("should validate QUESTIONS block", () => {
      const questionsBlock = {
        id: "b-questions-1",
        type: "QUESTIONS",
        displayOrder: 7,
        title: "Conceptual Checks",
        data: {
          questions: [
            {
              id: "q-1",
              questionText: "What is an ideal solution?",
              questionType: "MCQ",
              difficulty: "EASY",
              marks: 1,
              explanation: "Obeys Raoult's law over the entire concentration range.",
              displayOrder: 1,
              options: [
                { id: "opt-1", optionText: "Obeys Raoult's law", isCorrect: true, displayOrder: 1 },
                { id: "opt-2", optionText: "Deviates strongly", isCorrect: false, displayOrder: 2 },
              ],
            },
          ],
        },
      };
      const result = contentBlockSchema.safeParse(questionsBlock);
      assert.equal(result.success, true);
      assert.equal(result.data.type, "QUESTIONS");
    });

    it("should reject an unknown content block type", () => {
      const invalidBlock = {
        id: "b-invalid-1",
        type: "UNSUPPORTED_TYPE",
        displayOrder: 1,
      };
      const result = contentBlockSchema.safeParse(invalidBlock);
      assert.equal(result.success, false);
    });
  });

  describe("Topic Content Document Validation", () => {
    it("should validate empty topic content with no blocks", () => {
      const emptyTopic = {
        metadata: {
          id: "chem-c01-t01",
          chapterId: "chem-c01",
          subjectId: "chemistry",
          slug: "types-of-solutions",
          title: "Types of Solutions",
          order: 1,
        },
        blocks: [],
      };
      const result = topicContentSchema.safeParse(emptyTopic);
      assert.equal(result.success, true);
      assert.equal(result.data.blocks.length, 0);
    });
  });
});
