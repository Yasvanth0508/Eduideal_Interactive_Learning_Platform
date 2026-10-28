import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { contentRegistry } from "../../src/content/registry.js";
import { saveTopicNote } from "../../src/features/notes/queries.js";
import { toggleTopicBookmark } from "../../src/features/bookmarks/queries.js";

describe("Topic Notes & Bookmarks Validation", () => {
  it("should reject saving note for unknown topic ID not in ContentRegistry", async () => {
    await assert.rejects(
      async () => {
        await saveTopicNote(
          "00000000-0000-0000-0000-000000000001",
          "unknown-topic-id-999",
          "Test note content"
        );
      },
      {
        message: 'Topic "unknown-topic-id-999" does not exist in ContentRegistry.',
      }
    );
  });

  it("should reject bookmarking unknown topic ID not in ContentRegistry", async () => {
    await assert.rejects(
      async () => {
        await toggleTopicBookmark(
          "00000000-0000-0000-0000-000000000001",
          "non-existent-topic"
        );
      },
      {
        message: 'Topic "non-existent-topic" does not exist in ContentRegistry.',
      }
    );
  });

  it("should verify registered topic IDs exist in ContentRegistry", () => {
    // Register a valid mock topic in registry
    contentRegistry.registerSubject({
      id: "test-subject",
      slug: "test-subject",
      title: "Test Subject",
      grade: 12,
      chapterIds: ["test-ch-01"],
    });

    contentRegistry.registerChapter({
      id: "test-ch-01",
      subjectId: "test-subject",
      slug: "test-ch-01",
      title: "Test Chapter 01",
      order: 1,
      topicIds: ["test-top-01"],
    });

    contentRegistry.registerTopic({
      id: "test-top-01",
      chapterId: "test-ch-01",
      subjectId: "test-subject",
      slug: "test-top-01",
      title: "Test Topic 01",
      order: 1,
    });

    assert.equal(contentRegistry.hasTopic("test-top-01"), true);
    assert.equal(contentRegistry.hasTopic("non-existent-id"), false);
  });
});
