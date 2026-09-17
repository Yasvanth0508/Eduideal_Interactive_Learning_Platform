import { getChapterWithTopics, getTopicBySlug } from "../../src/features/subjects/queries";
import { getTopicContentBlocks } from "../../src/features/content/queries";

async function verify() {
  console.log("--- Testing getChapterWithTopics('chemistry', 'solutions') ---");
  const chapter = await getChapterWithTopics("chemistry", "solutions");
  console.log("Found Chapter:", chapter?.name, "with", chapter?.topics.length, "topics");

  console.log("--- Testing getTopicBySlug ---");
  const topic = await getTopicBySlug("chemistry", "solutions", "introduction-to-solutions");
  console.log("Found Topic:", topic?.name, "ID:", topic?.id);

  if (topic) {
    console.log("--- Testing getTopicContentBlocks(topic.id) ---");
    const blocks = await getTopicContentBlocks(topic.id);
    console.log("Found Content Blocks:", blocks.length);
    blocks.forEach(b => {
      console.log(` - Block ${b.displayOrder} (${b.type}): ${b.title}, questions: ${b.questions?.length || 0}`);
    });
  }

  process.exit(0);
}

verify().catch(e => {
  console.error(e);
  process.exit(1);
});
