import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../../src/lib/db";
import {
  subjects,
  chapters,
  topics,
  contentBlocks,
  questions,
  questionOptions,
} from "../../src/lib/db/schema";
import {
  CHEMISTRY_SUBJECT,
  SOLUTIONS_CHAPTER,
  SOLUTIONS_TOPICS,
} from "../../src/features/subjects/data";
import { TOPIC_01_CONTENT_BLOCKS } from "../../src/features/content/data/topic-01-data";

async function runSeed() {
  console.log("Seeding Chemistry subject...");
  await db
    .insert(subjects)
    .values({
      id: CHEMISTRY_SUBJECT.id,
      name: CHEMISTRY_SUBJECT.name,
      slug: CHEMISTRY_SUBJECT.slug,
      description: CHEMISTRY_SUBJECT.description,
      thumbnailUrl: CHEMISTRY_SUBJECT.thumbnailUrl,
      displayOrder: CHEMISTRY_SUBJECT.displayOrder,
      isPublished: CHEMISTRY_SUBJECT.isPublished,
    })
    .onConflictDoUpdate({
      target: subjects.slug,
      set: {
        name: CHEMISTRY_SUBJECT.name,
        description: CHEMISTRY_SUBJECT.description,
        isPublished: CHEMISTRY_SUBJECT.isPublished,
      },
    });

  console.log("Seeding Solutions chapter...");
  await db
    .insert(chapters)
    .values({
      id: SOLUTIONS_CHAPTER.id,
      subjectId: SOLUTIONS_CHAPTER.subjectId,
      name: SOLUTIONS_CHAPTER.name,
      slug: SOLUTIONS_CHAPTER.slug,
      description: SOLUTIONS_CHAPTER.description,
      displayOrder: SOLUTIONS_CHAPTER.displayOrder,
      isPublished: SOLUTIONS_CHAPTER.isPublished,
    })
    .onConflictDoUpdate({
      target: [chapters.subjectId, chapters.slug],
      set: {
        name: SOLUTIONS_CHAPTER.name,
        description: SOLUTIONS_CHAPTER.description,
        isPublished: SOLUTIONS_CHAPTER.isPublished,
      },
    });

  console.log("Seeding 20 Solutions topics...");
  for (const topic of SOLUTIONS_TOPICS) {
    await db
      .insert(topics)
      .values({
        id: topic.id,
        chapterId: topic.chapterId,
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        displayOrder: topic.displayOrder,
        isPublished: topic.isPublished,
      })
      .onConflictDoUpdate({
        target: [topics.chapterId, topics.slug],
        set: {
          name: topic.name,
          description: topic.description,
          displayOrder: topic.displayOrder,
          isPublished: topic.isPublished,
        },
      });
  }

  console.log("Seeding Topic 1 content blocks and questions...");
  for (const block of TOPIC_01_CONTENT_BLOCKS) {
    await db
      .insert(contentBlocks)
      .values({
        id: block.id,
        topicId: block.topicId,
        type: block.type,
        title: block.title,
        description: block.description,
        content: block.content,
        displayOrder: block.displayOrder,
        isPublished: block.isPublished,
      })
      .onConflictDoUpdate({
        target: contentBlocks.id,
        set: {
          title: block.title,
          description: block.description,
          content: block.content,
          displayOrder: block.displayOrder,
          isPublished: block.isPublished,
        },
      });

    if (block.questions && block.questions.length > 0) {
      for (const q of block.questions) {
        await db
          .insert(questions)
          .values({
            id: q.id,
            contentBlockId: block.id,
            questionText: q.questionText,
            questionType: q.questionType,
            difficulty: q.difficulty,
            marks: q.marks,
            explanation: q.explanation,
            displayOrder: q.displayOrder,
          })
          .onConflictDoUpdate({
            target: questions.id,
            set: {
              questionText: q.questionText,
              questionType: q.questionType,
              difficulty: q.difficulty,
              marks: q.marks,
              explanation: q.explanation,
              displayOrder: q.displayOrder,
            },
          });

        if (q.options && q.options.length > 0) {
          for (const opt of q.options) {
            await db
              .insert(questionOptions)
              .values({
                id: opt.id,
                questionId: q.id,
                optionText: opt.optionText,
                isCorrect: opt.isCorrect,
                displayOrder: opt.displayOrder,
              })
              .onConflictDoUpdate({
                target: questionOptions.id,
                set: {
                  optionText: opt.optionText,
                  isCorrect: opt.isCorrect,
                  displayOrder: opt.displayOrder,
                },
              });
          }
        }
      }
    }
  }

  console.log("Successfully seeded Solutions chapter, 20 topics, and Topic 1 content.");
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
