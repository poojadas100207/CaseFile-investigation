# AI Mystery Room — The Tech Campus Heist 🔍💻


## 🌟 1. Project Overview & Flagship Scenario

**AI Mystery Room** is a full-stack, procedural cyber-detective puzzle game powered by **Google Gemini** generative AI and structured with **Node.js, Express, MongoDB, and React**.

### The Flagship Scenario: *The Tech Campus Heist*
> *"During the midnight annual tech symposium hackathon, a revolutionary quantum microchip prototype worth ₹50 Lakhs was stolen from the locked main server room. Only four people had swipe-card access during the lockdown window: the lead hardware architect who was deep in debugging, the rival team captain who lost the qualifiers, the late-night janitor with a history of debt, and the head of security whose logs show a mysterious manual override."*

Players act as the Lead Cyber Forensic Investigator. They must analyze server breach logs, interrogate suspect alibis, inspect physical and digital clues (+5 pts), decrypt tactical hints (-10 pts), and deliver a formal indictment to unmask the true culprit.

---

## 🚀 2. Key Features

- **Procedural & Curated Generation:** Seamlessly play *The Tech Campus Heist* or generate infinite unique scenarios across three difficulty levels using Gemini AI.
- **Strict Anti-Cheating & Solution Security:** The true culprit ID and forensic solution narrative are strictly omitted from all active investigation API responses. They are decrypted only after a formal accusation is registered.
- **Dynamic Evidence Board:** Clues start sealed/encrypted. Players examine evidence to reveal timestamps, CCTV logs, spectroscopy, and physical tool marks (+5 points each).
- **Tactical Hints Terminal:** Unlocks progressive investigative insights at the cost of score penalties (-10 points each).
- **Accusation Chamber & Post-Mortem Debrief:** Accusing the culprit renders an instant verdict. Solved cases feature confetti celebrations, score breakdown, the culprit’s true motive, and full narrative explanation.
- **Zero-Friction Local Database:** Features both MongoDB Atlas connection support and an automated in-memory MongoDB fallback, running immediately without requiring a local database installation.

---

## 🧩 3. Difficulty & Scoring Rules

| Difficulty | Suspects | Clues | Hints | Base Score |
| :--- | :---: | :---: | :---: | :---: |
| **Easy** | 3 | 5 | 2 | **100 PTS** |
| **Medium** | 4 | 7 | 3 | **150 PTS** |
| **Hard** | 5 | 9 | 3 | **200 PTS** |

### Score Calculation Formula
$$\text{Final Score} = \max(0, \text{Base Score} + (\text{Discovered Clues} \times 5) - (\text{Hints Used} \times 10))$$
- **Correct Accusation:** Awards full Base Score.
- **Incorrect Accusation:** Base Score = 0 (Total = only bonus points minus penalties, min 0).

---

## 🛠️ 4. Tech Stack

### Frontend (`/client`)
- **React 19 & Vite 6** (Fast, reactive single-page app)
- **Tailwind CSS v4** (Atmospheric Cyber/Noir styling)
- **Lucide React** (Modern iconography)
- **Axios** (REST API client)
- **Canvas-Confetti** (Victory celebration animations)

### Backend (`/server`)
- **Node.js & Express.js** (Modular REST API)
- **MongoDB & Mongoose** (Persistent case, clue, and score documents)
- **MongoDB Memory Server** (Seamless out-of-the-box local development fallback)
- **Google GenAI SDK (`@google/genai`)** (Structured Gemini API inference)
- **Zod** (Schema validation enforcing exact difficulty constraints)

---

## ⚡ 5. Quick Start (Run Locally)

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Step 1: Clone the Repository
```bash
git clone <repository_url>
cd "investigation Project"
```

### Step 2: Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
APP_TIMEZONE=Asia/Kolkata
```
*(Note: If `MONGODB_URI` is left blank, the server automatically starts an in-memory MongoDB instance. If `GEMINI_API_KEY` is not provided, the server uses the built-in procedural engine for "The Tech Campus Heist" and other scenarios!)*

### Step 3: Run the Application
In terminal 1 (Backend):
```bash
cd server
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`.*

In terminal 2 (Frontend):
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 📡 6. API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/cases` | Generates a new case with Gemini (sanitized response). |
| `GET` | `/api/cases` | Retrieves list of recent cases. |
| `GET` | `/api/cases/:id` | Retrieves active case state (culprit & solution omitted). |
| `POST` | `/api/cases/:id/clues/:clueId/discover` | Discovers a clue and adds +5 pts. |
| `POST` | `/api/cases/:id/hints` | Unlocks next hint and deducts 10 pts. |
| `POST` | `/api/cases/:id/accuse` | Submits accused suspect ID, computes verdict and reveals solution. |
| `GET` | `/api/cases/:id/result` | Retrieves full post-mortem debrief and score breakdown. |

---

## 🚀 7. Deployment Instructions

### Frontend (Vercel)
1. Push your repository to GitHub.
2. In Vercel, import the repo and set **Root Directory** to `client`.
3. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-domain.com/api` (see [`client/.env.example`](./client/.env.example))
4. Deploy!

### Backend (Render / Railway / Fly.io)
1. In Render, create a new **Web Service** pointing to the repository.
2. Set **Root Directory** to `server`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables:
   - `PORT` = `5000`
   - `MONGODB_URI` = `mongodb+srv://<user>:<password>@cluster.mongodb.net/ai_mystery_room`
   - `GEMINI_API_KEY` = `<your-gemini-key>`
   - `CLIENT_URL` = `https://your-frontend-domain.vercel.app`
