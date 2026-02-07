// -------------------------------------------------------------
//  QUIZ ROUTES (STRICT MODE + DIFFICULTY LEVEL SUPPORT)
// -------------------------------------------------------------

import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";

import Topic from "../models/Topic.js";
import Subtopic from "../models/Subtopic.js";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";

import { generateText, quizPrompts } from "../utils/groq.js";

const router = express.Router();

/* -------------------------------------------------------------
   UTIL FUNCTION: Generate Quiz Based on Difficulty
--------------------------------------------------------------*/
async function generateDifficultyQuiz(topicId, topicName, difficulty) {
  const subtopics = await Subtopic.find({ topicId }).lean();
  const subs = subtopics.map((s) => s.name);

  // Generate quiz using difficulty prompt
  let raw = await generateText(quizPrompts[difficulty](topicName, subs));

  if (!raw) raw = "[]";

  const clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  let parsed = [];

  try {
    parsed = JSON.parse(clean);
  } catch (err) {
    console.error("⚠️ Quiz JSON Parse Error, using fallback");

    parsed = [
      {
        question: `What is ${topicName}?`,
        options: ["A", "B", "C", "D"],
        answer: "A",
      },
    ];
  }

  const saved = await Quiz.findOneAndUpdate(
    { topicId, difficulty },
    {
      quiz: parsed,
      topicName,
      difficulty,
      strictMode: true,
    },
    { new: true, upsert: true }
  ).lean();

  return saved;
}

/* -------------------------------------------------------------
   1️⃣ GET QUIZ BY DIFFICULTY
--------------------------------------------------------------*/
router.get("/:topicId/difficulty/:difficulty", requireAuth, async (req, res) => {
  try {
    const { topicId, difficulty } = req.params;

    const topic = await Topic.findById(topicId).lean();
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    let quizDoc = await Quiz.findOne({ topicId, difficulty }).lean();

    if (!quizDoc) {
      console.log(`⚠️ No quiz found → Generating new ${difficulty} quiz`);
      quizDoc = await generateDifficultyQuiz(topicId, topic.name, difficulty);
    }

    return res.json({
      quiz: quizDoc.quiz,
      topicName: quizDoc.topicName,
      difficulty,
      strictMode: true,
    });
  } catch (err) {
    console.error("❌ Quiz fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------------------------------------------
   2️⃣ SUBMIT QUIZ ATTEMPT
--------------------------------------------------------------*/
router.post("/submit", requireAuth, async (req, res) => {
  try {
    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      topicId: req.body.topicId,
      difficulty: req.body.difficulty,
      score: req.body.score,
      total: req.body.total,
      answers: req.body.answers, // list of user answers
      timeTaken: req.body.timeTaken,
      strictMode: true,
    });

    return res.json({ success: true, attempt });
  } catch (err) {
    console.error("❌ Quiz attempt save error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------------------------------------------
   3️⃣ GET ALL ATTEMPTS FOR PROGRESS PAGE
--------------------------------------------------------------*/
router.get("/attempts/:topicId", requireAuth, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      userId: req.user._id,
      topicId: req.params.topicId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(attempts);
  } catch (err) {
    console.error("❌ Fetch attempts error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------------------------------------------
   EXPORT ROUTER
--------------------------------------------------------------*/
export default router;
