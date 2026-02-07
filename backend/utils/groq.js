// backend/utils/groq.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

/* ------------------------------------------------------------
   CLEAN, SAFE, PROMPT-STABLE GROQ GENERATOR
------------------------------------------------------------- */
export async function generateText(prompt) {
    if (!process.env.GROQ_API_KEY) {
        console.error("❌ Missing GROQ_API_KEY");
        return null;
    }

    console.log("👉 Sending prompt to Groq (via OpenAI SDK)...");

    try {
        const completion = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant that outputs straight text without any markdown code blocks, HTML tags, or conversational fillers. Follow formatting rules strictly.",
                },
                {
                    role: "user",
                    content: String(prompt),
                },
            ],
            model: "gemma2-9b-it",
            temperature: 0.3,
            max_tokens: 2048,
        });

        console.log("✅ Groq Response received");
        // console.log("Raw Response:", JSON.stringify(completion, null, 2));

        let text = completion.choices[0]?.message?.content?.trim() || null;

        if (!text) {
            console.error("❌ Groq returned empty text");
            return null;
        }

        // CLEAN OUTPUT (Similar to Gemini cleaning)
        text = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .replace(/^Prompt:.*/gim, "")
            .trim();

        return text;
    } catch (err) {
        console.error("⚠️ Groq Error:", err);
        if (err.response) {
            console.error("Response data:", err.response.data);
        }
        return null;
    }
}

/* ------------------------------------------------------------
   NEW DIFFICULTY QUIZ PROMPTS (Reused from Gemini)
------------------------------------------------------------- */
export const quizPrompts = {
    basic: (topicName, subs) => `
Generate 5 very easy MCQ questions for beginners learning "${topicName}".
Context:
${subs.join("\n")}

STRICT JSON ONLY:
[
 { "question": "...", "options": ["A","B","C","D"], "answer":"A" }
]`,

    intermediate: (topicName, subs) => `
Generate 8 medium difficulty MCQ questions for "${topicName}".
Context:
${subs.join("\n")}

STRICT JSON ONLY.`,

    hard: (topicName, subs) => `
Generate 10 hard MCQs requiring deep understanding of "${topicName}".
Context:
${subs.join("\n")}

STRICT JSON ONLY.
`,
};
