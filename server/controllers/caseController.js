import { Case } from '../models/Case.js';
import { generateMysteryCase, DIFFICULTY_CONFIG } from '../services/geminiService.js';

export const createCase = async (req, res) => {
  try {
    const { premise, difficulty = 'medium' } = req.body;
    const validDifficulty = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';

    const caseData = await generateMysteryCase(premise, validDifficulty);

    const newCase = new Case({
      title: caseData.title,
      premise: premise || 'The Tech Campus Heist',
      story: caseData.story,
      difficulty: validDifficulty,
      suspects: caseData.suspects,
      clues: caseData.clues.map((c) => ({
        ...c,
        discovered: false,
      })),
      hints: caseData.hints.map((h) => ({
        ...h,
        unlocked: false,
      })),
      culpritId: caseData.culpritId,
      solutionExplanation: caseData.solutionExplanation,
      status: 'investigating',
      score: 0,
      scoreBreakdown: {
        baseScore: 0,
        cluesBonus: 0,
        hintsPenalty: 0,
        finalScore: 0,
      },
    });

    await newCase.save();
    return res.status(201).json(newCase.toClientJSON());
  } catch (error) {
    console.error('Error creating case:', error);
    return res.status(500).json({ error: 'Failed to generate mystery case.' });
  }
};

export const getCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .select('title difficulty status score createdAt completedAt premise')
      .sort({ createdAt: -1 })
      .limit(20);
    return res.json(cases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    return res.status(500).json({ error: 'Failed to retrieve cases.' });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({ error: 'Case not found.' });
    }
    return res.json(caseDoc.toClientJSON());
  } catch (error) {
    console.error('Error fetching case:', error);
    return res.status(500).json({ error: 'Failed to retrieve case.' });
  }
};

export const discoverClue = async (req, res) => {
  try {
    const { id, clueId } = req.params;
    const caseDoc = await Case.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    if (caseDoc.status !== 'investigating') {
      return res.status(400).json({ error: 'Case is already closed.' });
    }

    const clue = caseDoc.clues.find((c) => c.id === clueId);
    if (!clue) {
      return res.status(404).json({ error: 'Clue not found.' });
    }

    if (!clue.discovered) {
      clue.discovered = true;
      clue.discoveredAt = new Date();
      caseDoc.scoreBreakdown.cluesBonus += 5;
      caseDoc.score = Math.max(
        0,
        caseDoc.scoreBreakdown.baseScore +
          caseDoc.scoreBreakdown.cluesBonus -
          caseDoc.scoreBreakdown.hintsPenalty
      );
      await caseDoc.save();
    }

    return res.json({
      clue,
      score: caseDoc.score,
      scoreBreakdown: caseDoc.scoreBreakdown,
      discoveredCount: caseDoc.clues.filter((c) => c.discovered).length,
      totalClues: caseDoc.clues.length,
    });
  } catch (error) {
    console.error('Error discovering clue:', error);
    return res.status(500).json({ error: 'Failed to discover clue.' });
  }
};

export const requestHint = async (req, res) => {
  try {
    const { id } = req.params;
    const caseDoc = await Case.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    if (caseDoc.status !== 'investigating') {
      return res.status(400).json({ error: 'Case is already closed.' });
    }

    const nextHint = caseDoc.hints.find((h) => !h.unlocked);
    if (!nextHint) {
      return res.status(400).json({ error: 'All available hints have already been unlocked.' });
    }

    nextHint.unlocked = true;
    nextHint.unlockedAt = new Date();
    caseDoc.scoreBreakdown.hintsPenalty += 10;
    caseDoc.score = Math.max(
      0,
      caseDoc.scoreBreakdown.baseScore +
        caseDoc.scoreBreakdown.cluesBonus -
        caseDoc.scoreBreakdown.hintsPenalty
    );

    await caseDoc.save();

    const remainingHints = caseDoc.hints.filter((h) => !h.unlocked).length;

    return res.json({
      hint: nextHint,
      hintsRemaining: remainingHints,
      score: caseDoc.score,
      scoreBreakdown: caseDoc.scoreBreakdown,
      allHints: caseDoc.hints,
    });
  } catch (error) {
    console.error('Error requesting hint:', error);
    return res.status(500).json({ error: 'Failed to request hint.' });
  }
};

export const submitAccusation = async (req, res) => {
  try {
    const { id } = req.params;
    const { suspectId, rationale } = req.body;

    if (!suspectId) {
      return res.status(400).json({ error: 'Please select a suspect to accuse.' });
    }

    const caseDoc = await Case.findById(id);
    if (!caseDoc) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    if (caseDoc.status !== 'investigating') {
      return res.json({
        message: 'This case has already been resolved.',
        case: caseDoc.toObject(),
        isCorrect: caseDoc.status === 'solved',
      });
    }

    const isCorrect = suspectId === caseDoc.culpritId;
    const difficultyConf = DIFFICULTY_CONFIG[caseDoc.difficulty] || DIFFICULTY_CONFIG.medium;

    if (isCorrect) {
      caseDoc.status = 'solved';
      caseDoc.scoreBreakdown.baseScore = difficultyConf.baseScore;
    } else {
      caseDoc.status = 'failed';
      caseDoc.scoreBreakdown.baseScore = 0;
    }

    caseDoc.accusedSuspectId = suspectId;
    caseDoc.accusationRationale = rationale || '';
    caseDoc.scoreBreakdown.finalScore = Math.max(
      0,
      caseDoc.scoreBreakdown.baseScore +
        caseDoc.scoreBreakdown.cluesBonus -
        caseDoc.scoreBreakdown.hintsPenalty
    );
    caseDoc.score = caseDoc.scoreBreakdown.finalScore;
    caseDoc.completedAt = new Date();

    await caseDoc.save();

    const culprit = caseDoc.suspects.find((s) => s.id === caseDoc.culpritId);
    const accused = caseDoc.suspects.find((s) => s.id === suspectId);

    return res.json({
      verdict: isCorrect ? 'SOLVED' : 'FAILED',
      isCorrect,
      case: caseDoc.toObject(),
      culprit,
      accused,
      solutionExplanation: caseDoc.solutionExplanation,
      scoreBreakdown: caseDoc.scoreBreakdown,
      finalScore: caseDoc.score,
    });
  } catch (error) {
    console.error('Error submitting accusation:', error);
    return res.status(500).json({ error: 'Failed to process accusation.' });
  }
};

export const getCaseResult = async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    if (caseDoc.status === 'investigating') {
      return res.status(400).json({
        error: 'Case is still under active investigation. Accuse a suspect to unlock the full debrief.',
      });
    }

    const culprit = caseDoc.suspects.find((s) => s.id === caseDoc.culpritId);
    const accused = caseDoc.suspects.find((s) => s.id === caseDoc.accusedSuspectId);

    return res.json({
      verdict: caseDoc.status === 'solved' ? 'SOLVED' : 'FAILED',
      isCorrect: caseDoc.status === 'solved',
      case: caseDoc.toObject(),
      culprit,
      accused,
      solutionExplanation: caseDoc.solutionExplanation,
      scoreBreakdown: caseDoc.scoreBreakdown,
      finalScore: caseDoc.score,
    });
  } catch (error) {
    console.error('Error retrieving case result:', error);
    return res.status(500).json({ error: 'Failed to retrieve case result.' });
  }
};
