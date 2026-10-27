import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ContentService } from "../../src/server/services/content-service.js";

describe("ContentService", () => {
  describe("Curriculum Metadata Resolution", () => {
    it("should resolve known default subjects", async () => {
      const chem = await ContentService.resolveSubject("chemistry");
      assert.ok(chem);
      assert.equal(chem.title, "Class 12 Chemistry");

      const physics = await ContentService.resolveSubject("physics");
      assert.ok(physics);
      assert.equal(physics.title, "Class 12 Physics");
    });

    it("should return null for unknown subjects", async () => {
      const unknown = await ContentService.resolveSubject("non-existent-subject");
      assert.equal(unknown, null);
    });

    it("should resolve known chapter by slugs", async () => {
      const chapter = await ContentService.resolveChapter("chemistry", "chapter-01");
      assert.ok(chapter);
      assert.equal(chapter.id, "chem-c01");
      assert.equal(chapter.title, "Solutions");
    });

    it("should return null for unknown chapters", async () => {
      const chapter = await ContentService.resolveChapter("chemistry", "chapter-99");
      assert.equal(chapter, null);
    });
  });

  describe("Topic and Content Block Resolution", () => {
    it("should return null for unauthored / unknown topic slugs", async () => {
      const topic = await ContentService.resolveTopic("chemistry", "chapter-01", "unknown-topic");
      assert.equal(topic, null);
    });

    it("should return empty array for unknown topic blocks", async () => {
      const blocks = await ContentService.resolveContentBlocks("unknown-topic-id");
      assert.deepEqual(blocks, []);
    });

    it("should report default chapters as unauthored (empty topicIds)", async () => {
      const isAuthored = await ContentService.isChapterAuthored("chem-c01");
      assert.equal(isAuthored, false);
    });
  });

  describe("Schema Validation Helper", () => {
    it("should reject invalid topic content payloads", () => {
      const result = ContentService.validateTopicContent({
        metadata: { id: "invalid" },
        blocks: "not an array",
      });
      assert.equal(result.success, false);
    });

    it("should accept valid empty topic content payloads", () => {
      const result = ContentService.validateTopicContent({
        metadata: {
          id: "chem-c01-t01",
          chapterId: "chem-c01",
          subjectId: "chemistry",
          slug: "intro-solutions",
          title: "Introduction",
          order: 1,
        },
        blocks: [],
      });
      assert.equal(result.success, true);
    });
  });
});
