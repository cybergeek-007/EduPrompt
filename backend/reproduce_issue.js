
import { generateText } from "./utils/groq.js";
import dotenv from "dotenv";

dotenv.config();

async function reproduce() {
    console.log("Starting reproduction...");

    const topicName = "React Hooks";

    // 1. Test List Generation
    const listPrompt = `
Generate a clean, structured learning plan for "${topicName}". 
Rules:
- Generate between 2 and 5 subtopics depending on topic complexity.
- Subtopics must be technical, progressive, and specific.
- DO NOT include any intro phrases like "Here are", "Below are", "Sure", "Let’s".
- Do NOT explain the list.
- ONLY return a numbered list in this exact format:

1. Subtopic Name
2. Subtopic Name
3. Subtopic Name
...
`;

    console.log("Testing List Generation...");
    const listText = await generateText(listPrompt);
    console.log("---------------------------------------------------");
    console.log("List Text Result (RAW):", JSON.stringify(listText));
    console.log("---------------------------------------------------");

    if (!listText) {
        console.error("❌ List generation failed");
        return;
    }

    // 2. Test Content Generation for one subtopic
    const subtopic = "useState Hook";
    const explanationPrompt = `
Write a clean, highly readable explanation for the subtopic "${subtopic}" within the topic "${topicName}".

STRICT Formatting Rules:
- DO NOT use markdown headings (#, ##, ###).
- Start with: **${subtopic}**
- Use bold formatting for key terms.
- Use bullet points for lists.
- Add a short code example (if applicable).
- Add a **Practical Use-Case** section.
- No storytelling, no analogies, no fluff.
- Keep it around 150–200 words.
- The output format must be EXACTLY:

**Subtopic Title**

Short explanation paragraph.

**Key Concepts:**
- point 1
- point 2

**Example:**
\`\`\`code or SQL etc\`\`\`

**Practical Use-Case:**
One real-world scenario.
`;

    console.log("Testing Explanation Generation...");
    const explanation = await generateText(explanationPrompt);
    console.log("Explanation Result:", explanation);
}

reproduce();
