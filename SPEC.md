# SPEC.md — AI Mystery Room: The Tech Campus Heist

## 1. Project Overview & Problem Statement
**AI Mystery Room** is an interactive, full-stack investigative puzzle game powered by Google Gemini generative AI. Players step into the shoes of a lead cyber-detective tasked with solving complex, procedurally generated or curated corporate and campus crimes.

The flagship scenario is **"The Tech Campus Heist"**:
> *"During the midnight annual tech symposium hackathon, a revolutionary quantum microchip prototype worth ₹50 Lakhs was stolen from the locked main server room. Only four people had swipe-card access during the lockdown window: the lead hardware architect who was deep in debugging, the rival team captain who lost the qualifiers, the late-night janitor with a history of debt, and the head of security whose logs show a mysterious manual override."*

### Problem Statement
Traditional mystery games rely on static, pre-scripted branching storylines with high authoring overhead and zero replayability. Static puzzles cannot adapt dynamically to different difficulty tiers or player premises.
**AI Mystery Room** solves this by leveraging LLM structured output generation (via Gemini API) combined with rigorous backend schema validation, sanitization, and deterministic scoring to provide an infinitely replayable, immersive detective experience where evidence, motives, alibis, and forensic clues logically align.

---

## 2. Target Users & Expected User Experience
### Target Audience
* Tech enthusiasts, students, and hackathon participants.
* Mystery and puzzle solvers who enjoy escape rooms, murder-mystery deduction, and forensic logic.
* Developers and AI practitioners exploring multimodal and structured agentic web applications.

### Expected User Experience (UX)
* **Atmospheric Detective UI:** Sleek, high-contrast dark-mode cyber aesthetic with terminal styling, glowing accents, audio-visual feedback, and card-based evidence dossiers.
* **Tension & Deduction:** Players uncover clues one by one, consult suspect dossiers, and decide when to spend hints (at the cost of deduction points).
* **High Replayability:** Instant one-click launch of the featured *Tech Campus Heist* case, or creation of custom mystery premises across 3 difficulty levels (*Easy*, *Medium*, *Hard*).
* **Zero Spoilers / Cheating Immunity:** Backend strictly conceals the identity of the culprit and the explanation until the player formally registers an accusation.

---

## 3. Technology Stack
* **Frontend:**
  * React 18+ (SPA with functional components and hooks)
  * Vite (Rapid build tool and HMR dev server)
  * Tailwind CSS (Cyberpunk/Noir detective styling, responsive layout)
  * Lucide React (Crisp iconography for dossiers, keys, hints, timers, and forensic evidence)
  * Axios (HTTP client with error handling)
  * Canvas-Confetti (Celebratory visual feedback upon successful deduction)
* **Backend:**
  * Node.js & Express.js (REST API architecture)
  * Mongoose & MongoDB (Document persistence for cases, clues, hints, and game state)
  * MongoDB Memory Server / Atlas Support (Self-contained development fallback when local mongod is absent)
  * `@google/genai` / Google Gemini API (Structured JSON generation of mystery cases)
  * Zod (Runtime validation of AI responses)
  * Dotenv & Cors (Configuration and Cross-Origin Resource Sharing)

---

## 4. Complete User Flow
```
[1. Home Page]
       │
       ▼
[2. Create Mystery / Select Difficulty]
  - Featured Case: "The Tech Campus Heist"
  - Custom Premise Option
  - Select Difficulty: Easy (3 suspects, 5 clues, 2 hints)
                      Medium (4 suspects, 7 clues, 3 hints)
                      Hard (5 suspects, 9 clues, 3 hints)
       │
       ▼
[3. Generating Case...] ───► Gemini API + Zod Validation ───► Stored in MongoDB (Solution hidden)
       │
       ▼
[4. Investigation Room]
  - Read Case Background & Incident Logs
  - Inspect Suspect Dossiers (Roles, Alibis, Motives)
  - Discover Hidden Clues (+5 pts each)
  - Unlock Critical Hints (-10 pts each)
  - Real-time Score & Progress Tracker
       │
       ▼
[5. Accusation Chamber]
  - Select Suspect from Lineup
  - Enter Detective's Rationale & Motive Breakdown
  - Final Confirmation Modal
       │
       ▼
[6. Results & Debrief]
  - Verdict: CASE SOLVED (Victory) vs. WRONGFUL ACCUSATION (Defeat)
  - True Culprit Identity & Full Forensic Narrative
  - Detailed Score Breakdown (Base + Clues Bonus - Hints Penalty)
  - Action to Start a New Case or Share Debrief
```

---

## 5. UI and Page Specifications

### A. Home (`/`)
* **Hero Banner:** "AI Mystery Room — Cyber Forensic Bureau".
* **Mission Briefing:** Overview of the platform and detective duties.
* **Quick Launch:** One-click instant button to launch the featured scenario: **"The Tech Campus Heist"**.
* **Navigation:** "Start New Investigation" button directing to `/create`.

### B. Create Mystery (`/create`)
* **Premise Selector:**
  * *Preset 1:* The Tech Campus Heist (₹50L Quantum Microchip stolen from server room).
  * *Preset 2:* The AI Model Leak (Stolen weights at a top AI research lab).
  * *Preset 3:* Crypto Vault Sabotage (Smart contract exploit at a Web3 fintech).
  * *Custom Premise:* Multi-line textarea for user's own storyline.
* **Difficulty Selector (Tabs/Cards):**
  * **Easy:** 3 Suspects, 5 Clues, 2 Hints (Base: 100 pts).
  * **Medium:** 4 Suspects, 7 Clues, 3 Hints (Base: 150 pts).
  * **Hard:** 5 Suspects, 9 Clues, 3 Hints (Base: 200 pts).
* **Generation State:** Cyber radar / forensic decryption progress bar with engaging status messages.

### C. Investigation Room (`/case/:id`)
* **Header Bar:** Case Title, Case ID, Difficulty Badge, Live Score, Discovered Clues count, Hints Remaining count.
* **Story Tab / Briefing:** Complete narrative detailing the lockdown window, scene of crime, and missing prototype.
* **Suspects Grid:** Interactive cards showing suspect Avatar/Icon, Name, Role, Bio, Claimed Alibi, and Known Motive.
* **Evidence Board (Clues):**
  * Undiscovered clues shown as encrypted/locked evidence cards.
  * Clicking "Examine Evidence" discovers the clue, triggers audio/visual reveal, updates score (+5 pts), and reveals the clue description.
* **Hints Terminal:**
  * Displays available hints.
  * Clicking "Request Hint" confirms penalty (-10 pts) and reveals forensic insight.
* **Action Bar:** Persistent "Proceed to Accusation" button.

### D. Accusation Modal / Screen (`/case/:id/accuse`)
* Lineup of all suspects with their mugshots and roles.
* Selection of the primary culprit.
* Optional rationale text input ("Why do you accuse this person?").
* Warning prompt: *"Submitting an accusation will permanently close the investigation and seal the case."*

### E. Results & Debrief (`/case/:id/result`)
* **Verdict Banner:**
  * High-energy Gold/Green for `CASE SOLVED` (triggers confetti).
  * Crimson alert for `WRONGFUL ACCUSATION`.
* **Culprit Dossier:** Name, Role, Image, and True Motive.
* **Master Solution Narrative:** Step-by-step breakdown of how the crime was executed and how clues connect.
* **Score Breakdown Card:**
  * Difficulty Base: `+100 / +150 / +200`
  * Clues Discovered Bonus: `X * 5 pts`
  * Hints Used Penalty: `Y * -10 pts`
  * **Final Score** (Minimum: 0)
* **Replay Action:** "Investigate Another Case" button.

---

## 6. Backend & Database Design

### Security Mandate
The backend MUST NOT return `culpritId` or `solutionExplanation` in `GET /api/cases/:id` or any active investigation endpoint. The secret fields remain encapsulated in MongoDB until `POST /api/cases/:id/accuse` or `GET /api/cases/:id/result` (only accessible when case status is `solved` or `failed`).

### API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/cases` | Generates a new case using Gemini, saves to DB, returns sanitized case. |
| `GET` | `/api/cases` | Retrieves recent public cases (title, difficulty, status, createdAt). |
| `GET` | `/api/cases/:id` | Retrieves active case state (sanitized: NO culprit/solution). |
| `POST` | `/api/cases/:id/clues/:clueId/discover` | Marks a clue as discovered and updates score (+5 pts). |
| `POST` | `/api/cases/:id/hints` | Unlocks the next hint and applies penalty (-10 pts). |
| `POST` | `/api/cases/:id/accuse` | Submits accused suspect ID, evaluates verdict, computes final score, reveals solution. |
| `GET` | `/api/cases/:id/result` | Retrieves full debrief including culprit and solution if case is completed. |

### Database Schema (Mongoose)
```typescript
interface ICase {
  title: string;
  premise: string;
  story: string;
  difficulty: 'easy' | 'medium' | 'hard';
  suspects: Array<{
    id: string;
    name: string;
    role: string;
    bio: string;
    alibi: string;
    motive: string;
    avatarUrl?: string;
  }>;
  clues: Array<{
    id: string;
    title: string;
    description: string;
    discovered: boolean;
    discoveredAt?: Date;
  }>;
  hints: Array<{
    id: string;
    text: string;
    unlocked: boolean;
    unlockedAt?: Date;
  }>;
  // Encrypted / Private until accusation
  culpritId: string;
  solutionExplanation: string;

  // Game state
  status: 'investigating' | 'solved' | 'failed';
  accusedSuspectId?: string;
  score: number;
  scoreBreakdown: {
    baseScore: number;
    cluesBonus: number;
    hintsPenalty: number;
    finalScore: number;
  };
  createdAt: Date;
  completedAt?: Date;
}
```

---

## 7. AI Prompt Engineering & Zod Schema

Gemini prompt specifies exact JSON constraints matching the difficulty configuration:
* **Easy:** 3 suspects, 5 clues, 2 hints. Base score: 100.
* **Medium:** 4 suspects, 7 clues, 3 hints. Base score: 150.
* **Hard:** 5 suspects, 9 clues, 3 hints. Base score: 200.

### Zod Validation Schema
```typescript
const CaseGenerationSchema = z.object({
  title: z.string().min(5),
  story: z.string().min(50),
  suspects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    alibi: z.string(),
    motive: z.string(),
  })),
  clues: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
  })),
  hints: z.array(z.object({
    id: z.string(),
    text: z.string(),
  })),
  culpritId: z.string(),
  solutionExplanation: z.string().min(30),
});
```

### Deterministic Fallback System
If Gemini API is unconfigured, rate-limited, or fails validation, the server automatically provides curated, high-integrity cases (starting with the full *Tech Campus Heist* blueprint) ensuring 100% test reliability and instant offline playability.

---

## 8. Scoring System Rules
1. **Accusation Verdict:**
   * Correct Accusation: Award Base Score (`Easy: 100`, `Medium: 150`, `Hard: 200`).
   * Incorrect Accusation: Base Score = 0.
2. **Clue Discovery Bonus:**
   * `+5 points` for every discovered clue.
3. **Hint Penalty:**
   * `-10 points` for each hint unlocked.
4. **Final Score Calculation:**
   $$\text{Final Score} = \max(0, \text{Base Score} + \text{Clues Bonus} - \text{Hints Penalty})$$
5. All calculations are executed strictly on the server to prevent client-side manipulation.

---

## 9. Acceptance Criteria
* [x] **SPEC.md Completed:** Detailed blueprint covering requirements, flows, schemas, and scoring.
* [ ] **Multi-Tier Difficulty:** Supports Easy, Medium, and Hard cases with exact suspect/clue/hint counts.
* [ ] **Showcase Case:** Seamless instant playability for "The Tech Campus Heist" and custom premise support.
* [ ] **Cheating Prevention:** Culprit ID and solution explanation omitted from client payloads until case resolution.
* [ ] **Interactive Investigation:** Interactive clue discovery (+5 pts) and hint unlocks (-10 pts).
* [ ] **Accusation & Verdict:** Accurate evaluation of user accusation with full forensic post-mortem explanation.
* [ ] **Responsive & Atmospheric UI:** High aesthetic standard with dark cyber/noir theme, badges, and clean navigation.
* [ ] **Deployment Readiness:** Scripts, environment variables, CORS, and build configurations optimized for Vercel (client) and Render/Fly.io/Atlas (server).
