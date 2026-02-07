import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    required: true
  },

  difficulty: {
    type: String,
    enum: ['basic', 'intermediate', 'hard'],
    required: true
  },

  score: Number,
  total: Number,

  answers: [
    {
      question: String,
      selected: String,
      correct: String,
      isCorrect: Boolean
    }
  ],

  strictMode: { type: Boolean, default: true },
  timeTaken: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);
