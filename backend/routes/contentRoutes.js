import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import Topic from "../models/Topic.js";
import Subtopic from "../models/Subtopic.js";
import Content from "../models/Content.js";
import { generateText } from "../utils/groq.js";

const router = express.Router();

/* ------------------------------------------------------------------
 🟢 1. GENERATE STUDY PLAN (DYNAMIC + CLEAN)
-------------------------------------------------------------------*/
router.post("/generate/plan", requireAuth, async (req, res) => {
  try {
    const { topicName } = req.body;
    if (!topicName) return res.status(400).json({ error: "topicName required" });

    console.log("🟢 Generating study plan for:", topicName);

    /* --------------------- SUBTOPIC GENERATION PROMPT --------------------- */
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

    const listText = await generateText(listPrompt);
    let lines = [];

    if (listText) {
      lines = listText
        .split(/\r?\n/)
        .map((l) => l.replace(/^\d+\.\s*/, "").trim())
        .filter(
          (l) =>
            l &&
            !l.startsWith("⚠️") &&
            !l.match(/^prompt:/i) &&
            !l.toLowerCase().includes("here are")
        );
    }

    // Strong fallback if Gemini fails
    if (lines.length < 5) {
      console.warn("⚠️ Gemini failed → using fallback subtopics");
      lines = [
        "Introduction",
        "Fundamental Concepts",
        "Core Components",
        "Advanced Usage",
        "Best Practices",
        "Performance Optimization",
        "Real-world Examples",
      ];
    }

    /* -------------------------- SAVE TOPIC -------------------------- */
    const topic = await Topic.create({
      name: topicName,
      userId: req.user._id,
    });

    const subtopicIds = [];

    /* ---------------------- GENERATE CONTENT FOR EACH SUBTOPIC ---------------------- */
    for (const name of lines) {
      const clean = name.trim();

      const explanationPrompt = `
Write a clean, highly readable explanation for the subtopic "${clean}" within the topic "${topicName}".

STRICT Formatting Rules:
- DO NOT use markdown headings (#, ##, ###).
- Start with: **${clean}**
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

      const explanation =
        (await generateText(explanationPrompt)) ||
        `**${clean}**\n\nContent unavailable.`;

      const sub = await Subtopic.create({
        name: clean,
        topicId: topic._id,
      });

      const cont = await Content.create({
        subtopicId: sub._id,
        text: explanation,
      });

      sub.contentId = cont._id;
      await sub.save();
      subtopicIds.push(sub._id);
    }

    return res.status(201).json({
      message: "Plan generated successfully",
      topicId: topic._id,
      subtopicCount: subtopicIds.length,
    });
  } catch (err) {
    console.error("❌ /generate/plan error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------------------------------------------
 🟢 2. GET ALL TOPICS (WITH SUBTOPICS)
-------------------------------------------------------------------*/
/* ------------------------------------------------------------------
 🟢 2. GET ALL TOPICS (FAST + DASHBOARD SAFE)
-------------------------------------------------------------------*/
router.get("/topics", requireAuth, async (req, res) => {
  try {
    const topics = await Topic.aggregate([
      { $match: { userId: req.user._id } },

      // Fetch all subtopics for each topic
      {
        $lookup: {
          from: "subtopics",
          localField: "_id",
          foreignField: "topicId",
          as: "subtopics",
        },
      },

      // Compute totalDays & completedDays
      {
        $addFields: {
          totalDays: { $size: "$subtopics" },
          completedDays: {
            $size: {
              $filter: {
                input: "$subtopics",
                as: "s",
                cond: { $eq: ["$$s.completed", true] },
              },
            },
          },
        },
      },

      // Compute % progress
      {
        $addFields: {
          progress: {
            $cond: [
              { $eq: ["$totalDays", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$completedDays", "$totalDays"] },
                      100,
                    ],
                  },
                  0,
                ],
              },
            ],
          },
        },
      },

      // Keep dashboard-needed fields ONLY
      {
        $project: {
          name: 1,
          subtopics: 1,
          totalDays: 1,
          completedDays: 1,
          progress: 1,
        },
      },
    ]);

    res.json(topics);
  } catch (err) {
    console.error("❌ /topics error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ------------------------------------------------------------------
 🟢 3. GET SUBTOPICS FOR SINGLE TOPIC
-------------------------------------------------------------------*/
router.get("/topics/:id/subtopics", requireAuth, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).lean();
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    const subs = await Subtopic.find({ topicId: topic._id }).lean();

    for (let s of subs) {
      const cont = await Content.findOne({ subtopicId: s._id }).lean();
      s.content = cont?.text || "";
    }

    res.json({ subtopics: subs });
  } catch (err) {
    console.error("❌ /topics/:id/subtopics error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------------------------------------------
 🟢 4. TOGGLE COMPLETE
-------------------------------------------------------------------*/
router.post("/subtopics/:id/toggle", requireAuth, async (req, res) => {
  try {
    const sub = await Subtopic.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: "Subtopic not found" });

    sub.completed = !sub.completed;
    await sub.save();

    res.json({ success: true, completed: sub.completed });
  } catch (err) {
    console.error("❌ /toggle error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------------------------------------------
 🟢 5. GET SINGLE SUBTOPIC CONTENT
-------------------------------------------------------------------*/
router.get("/subtopics/:id", requireAuth, async (req, res) => {
  try {
    const sub = await Subtopic.findById(req.params.id).lean();
    if (!sub) return res.status(404).json({ error: "Subtopic not found" });

    const cont = await Content.findOne({ subtopicId: sub._id }).lean();

    res.json({
      ...sub,
      text: cont?.text || "",
    });
  } catch (err) {
    console.error("❌ /subtopics/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
