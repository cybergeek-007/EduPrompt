import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  subtopicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subtopic', required: true },
  text: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Content', contentSchema);
