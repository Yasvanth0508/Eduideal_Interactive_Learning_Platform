import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { ContentRegistry } from "../../src/content/registry.js";
import { TopicContent } from "../../src/types/content.js";

describe("ContentRegistry", () => {
  let registry: ContentRegistry;

  beforeEach(() => {
    registry = new ContentRegistry();
    // Register test subjects and chapters with empty topics
    registry.registerSubject({
      id: "chemistry",
      slug: "chemistry",
      title: "Class 12 Chemistry",
      grade: 12,
      chapterIds: ["chem-c01"],
    });

    registry.registerChapter({
      id: "chem-c01",
      subjectId: "chemistry",
      slug: "chapter-01",
      title: "Solutions",
      order: 1,
      topicIds: [], // Empty: unauthored
    });
  });

  describe("Curriculum Lookups", () => {
    it("should resolve known subject by ID or slug", () => {
      const byId = registry.getSubject("chemistry");
      assert.ok(byId);
      assert.equal(byId.id, "chemistry");

      const bySlug = registry.getSubject("CHEMISTRY");
      assert.ok(bySlug);
      assert.equal(bySlug.slug, "chemistry");
    });

    it("should return null for unknown subject ID or slug", () => {
      const result = registry.getSubject("unknown-subject");
      assert.equal(result, null);
    });

    it("should resolve chapter by subject and chapter slug", () => {
      const chapter = registry.getChapter("chemistry", "chapter-01");
      assert.ok(chapter);
      assert.equal(chapter.id, "chem-c01");
      assert.deepEqual(chapter.topicIds, []);
    });

    it("should return null for unknown chapter slug or unknown chapter ID", () => {
      const bySlug = registry.getChapter("chemistry", "non-existent-chapter");
      assert.equal(bySlug, null);

      const byId = registry.getChapterById("non-existent-id");
      assert.equal(byId, null);
    });

    it("should return null for unknown topic metadata and slug", () => {
      const meta = registry.getTopicMetadata("chem-c01-t99");
      assert.equal(meta, null);

      const bySlug = registry.getTopicMetadataBySlug("chemistry", "chapter-01", "non-existent-topic");
      assert.equal(bySlug, null);
    });
  });

  describe("Empty Content & Unauthored Verification", () => {
    it("should report unauthored chapter as false when topicIds is empty", async () => {
      const isAuthored = await registry.isChapterAuthored("chem-c01");
      assert.equal(isAuthored, false);
    });

    it("should return empty content document if topic has metadata but no loader", async () => {
      registry.registerTopic({
        id: "chem-c01-t01",
        chapterId: "chem-c01",
        subjectId: "chemistry",
        slug: "intro-solutions",
        title: "Introduction to Solutions",
        order: 1,
      });

      const content = await registry.getTopicContent("chem-c01-t01");
      assert.ok(content);
      assert.equal(content.metadata.id, "chem-c01-t01");
      assert.deepEqual(content.blocks, []);

      const isTopicAuthored = await registry.isTopicAuthored("chem-c01-t01");
      assert.equal(isTopicAuthored, false);
    });

    it("should return null for completely unregistered topic ID", async () => {
      const content = await registry.getTopicContent("completely-unknown-topic");
      assert.equal(content, null);
    });
  });

  describe("Topic Module Registration & Resolution", () => {
    it("should register and resolve a validated topic module", async () => {
      const topicDoc: TopicContent = {
        metadata: {
          id: "chem-c01-t02",
          chapterId: "chem-c01",
          subjectId: "chemistry",
          slug: "henrys-law",
          title: "Henry's Law",
          order: 2,
        },
        blocks: [
          {
            id: "b1",
            type: "THEORY",
            displayOrder: 1,
            title: "Solubility of Gases",
            data: {
              introduction: "Henry's law quantifies gas solubility.",
              sections: [],
            },
          },
        ],
      };

      registry.registerTopic(topicDoc.metadata, () => topicDoc);

      const resolved = await registry.getTopicContent("chem-c01-t02");
      assert.ok(resolved);
      assert.equal(resolved.metadata.title, "Henry's Law");
      assert.equal(resolved.blocks.length, 1);
      assert.equal(resolved.blocks[0].type, "THEORY");

      const isAuthored = await registry.isTopicAuthored("chem-c01-t02");
      assert.equal(isAuthored, true);
    });

    it("should never silently fall back to mock or fixture data for unknown inputs", async () => {
      const result = await registry.getTopicContentBySlug("chemistry", "chapter-01", "arbitrary-unknown");
      assert.equal(result, null);
    });
  });
});
