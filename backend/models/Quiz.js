import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  topicId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Topic', 
    required: true 
  },

  difficulty: {
    type: String,
    enum: ['basic', 'intermediate', 'hard'],
    default: 'basic'
  },

  strictMode: {
    type: Boolean,
    default: true
  },

  quiz: [
    {
      question: String,
      options: [String],
      answer: String
    }
  ],

  topicName: { type: String, required: true },

  createdAt: { type: Date, default: Date.now }
});

// allow ONE quiz per topic per difficulty
quizSchema.index({ topicId: 1, difficulty: 1 }, { unique: true });

export default mongoose.model('Quiz', quizSchema);
