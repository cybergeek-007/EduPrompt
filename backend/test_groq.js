
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

async function test() {
    try {
        console.log("Testing Groq API...");
        const completion = await client.chat.completions.create({
            messages: [{ role: "user", content: "Say hello" }],
            model: "llama-3.1-8b-instant",
        });
        console.log("Success:", completion.choices[0].message.content);
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
