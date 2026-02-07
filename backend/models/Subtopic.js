import mongoose from 'mongoose';

const subtopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  completed: { type: Boolean, default: false }, // ✅ new field
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Subtopic', subtopicSchema);
