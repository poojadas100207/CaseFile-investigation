import mongoose from 'mongoose';

const SuspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  alibi: { type: String, required: true },
  motive: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
});

const ClueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  discovered: { type: Boolean, default: false },
  discoveredAt: { type: Date },
});

const HintSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  unlocked: { type: Boolean, default: false },
  unlockedAt: { type: Date },
});

const ScoreBreakdownSchema = new mongoose.Schema({
  baseScore: { type: Number, default: 0 },
  cluesBonus: { type: Number, default: 0 },
  hintsPenalty: { type: Number, default: 0 },
  finalScore: { type: Number, default: 0 },
}, { _id: false });

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  premise: { type: String, required: true },
  story: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
    required: true,
  },
  suspects: [SuspectSchema],
  clues: [ClueSchema],
  hints: [HintSchema],

  // Security sensitive - kept strictly private until accusation
  culpritId: { type: String, required: true },
  solutionExplanation: { type: String, required: true },

  // Player progress & evaluation
  status: {
    type: String,
    enum: ['investigating', 'solved', 'failed'],
    default: 'investigating',
  },
  accusedSuspectId: { type: String, default: null },
  accusationRationale: { type: String, default: '' },
  score: { type: Number, default: 0 },
  scoreBreakdown: {
    type: ScoreBreakdownSchema,
    default: () => ({ baseScore: 0, cluesBonus: 0, hintsPenalty: 0, finalScore: 0 }),
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

// Method to return safe JSON to the client (strips culprit and solution during investigation)
CaseSchema.methods.toClientJSON = function () {
  const doc = this.toObject();
  
  if (doc.status === 'investigating') {
    delete doc.culpritId;
    delete doc.solutionExplanation;
  }
  
  return doc;
};

export const Case = mongoose.model('Case', CaseSchema);
