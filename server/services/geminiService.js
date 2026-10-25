import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const GeneratedCaseSchema = z.object({
  title: z.string().min(3),
  story: z.string().min(30),
  suspects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      role: z.string(),
      bio: z.string(),
      alibi: z.string(),
      motive: z.string(),
    })
  ),
  clues: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
  hints: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
  culpritId: z.string(),
  solutionExplanation: z.string().min(20),
});

export const DIFFICULTY_CONFIG = {
  easy: {
    suspectCount: 3,
    clueCount: 5,
    hintCount: 2,
    baseScore: 100,
  },
  medium: {
    suspectCount: 4,
    clueCount: 7,
    hintCount: 3,
    baseScore: 150,
  },
  hard: {
    suspectCount: 5,
    clueCount: 9,
    hintCount: 3,
    baseScore: 200,
  },
};

export const DEFAULT_TECH_CAMPUS_PREMISE =
  'During the midnight annual tech symposium hackathon, a revolutionary quantum microchip prototype worth ₹50 Lakhs was stolen from the locked main server room. Only four people had swipe-card access during the lockdown window: the lead hardware architect who was deep in debugging, the rival team captain who lost the qualifiers, the late-night janitor with a history of debt, and the head of security whose logs show a mysterious manual override.';

/**
 * Procedural fallback for "The Tech Campus Heist" and offline resilience
 */
const getFallbackCase = (premise, difficulty = 'medium') => {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const isTechHeist =
    !premise ||
    premise.toLowerCase().includes('quantum') ||
    premise.toLowerCase().includes('heist') ||
    premise.toLowerCase().includes('campus');

  if (isTechHeist) {
    const allSuspects = [
      {
        id: 'suspect_1',
        name: 'Dr. Aarav Mehta',
        role: 'Lead Hardware Architect',
        bio: 'Chief engineer behind the Q-Core-9 prototype. Stressed, perfectionist, obsessed with computational benchmarks.',
        alibi: 'Claims he was in Lab 4B from 11:30 PM to 1:15 AM running cryogenic thermal simulations.',
        motive: 'Recently discovered a fatal architectural flaw that would ruin his patent rights if published before revisions.',
      },
      {
        id: 'suspect_2',
        name: 'Rohan Deshmukh',
        role: 'Rival Team Captain (Apex Hackers)',
        bio: 'Senior CS student whose flagship neural net submission was disqualified at 10 PM over API plagiarism accusations.',
        alibi: 'Claims he was brooding at the outdoor cafeteria benches smoking and drinking cold brew with teammates.',
        motive: 'Bitter grievance and rumors of a ₹30 Lakh counter-bounty on the black-hat marketplace for quantum schematics.',
      },
      {
        id: 'suspect_3',
        name: 'Ramesh Patel',
        role: 'Late-Night Facility Custodian',
        bio: 'Senior facility cleaner with campus badge clearance for maintenance closets and sub-floor ventilation shafts.',
        alibi: 'Claims he was cleaning the 3rd-floor bio-lab spills and took a break in the basement locker room.',
        motive: 'Heavy informal loan shark debts coming due next Monday, often overheard asking about high-value e-waste.',
      },
      {
        id: 'suspect_4',
        name: 'Vikram Singhania',
        role: 'Head of Campus Security',
        bio: 'Former cyber intelligence officer managing access-control biometrics, surveillance loops, and server room keys.',
        alibi: 'Claims he was doing his routine security patrol across the North quadrangle during the critical 12:45 AM window.',
        motive: 'A hidden shell company registered in his spouse’s name recently received mysterious offshore wire inquiries.',
      },
      {
        id: 'suspect_5',
        name: 'Ananya Sen',
        role: 'Venture Capital Liaison & Judge',
        bio: 'Early-stage angel investor judging the hardware track, evaluating commercial monetization of the quantum chip.',
        alibi: 'Claims she was inside the VIP hospitality lounge on a Zoom pitch call with Singapore investors until 1:00 AM.',
        motive: 'Her venture fund is bleeding capital; acquiring the IP exclusively would bail out her flagship portfolio.',
      },
    ];

    const allClues = [
      {
        id: 'clue_1',
        title: 'Server Room Swipe Log Timestamp',
        description:
          'Audit trail reveals badge #0412 unlocked the magnetic lock at 00:44:12 AM, exactly 3 minutes before the facility CCTV feed experienced an unexpected 90-second static freeze.',
      },
      {
        id: 'clue_2',
        title: 'Thermal Imaging Thermal Anomaly',
        description:
          'Cryo-chamber diagnostics indicate the server room sub-floor HVAC vent was opened from inside the maintenance duct between 00:41 AM and 00:52 AM, dropping room pressure.',
      },
      {
        id: 'clue_3',
        title: 'Security Console Manual Override Log',
        description:
          'Terminal logs at the North Guard post show administrator command: `sudo sysctl --disable cctv-sector-7 --auth-token MASTER_OVERRIDE` executed at 00:43:50 AM.',
      },
      {
        id: 'clue_4',
        title: 'Discarded Electrostatic Smock in Duct',
        description:
          'A size XL anti-static cleanroom gown smelling faintly of synthetic floor-buffing wax and machine oil was snagged on a screw inside air duct shaft #3.',
      },
      {
        id: 'clue_5',
        title: 'Burnt Micro-Soldering Iron & USB Sniffer',
        description:
          'Recovered behind Server Rack 12: a hot portable battery-operated iron used to melt the glass cryo-seal, alongside an encrypted Raspberry Pi Zero clone.',
      },
      {
        id: 'clue_6',
        title: 'Corrupted Cafeteria CCTV Timestamp',
        description:
          'Outdoor cafeteria camera confirms Rohan Deshmukh was visibly present at the picnic tables, arguing loudly on phone speaker between 00:35 AM and 01:05 AM.',
      },
      {
        id: 'clue_7',
        title: 'Custodial Locker #14 Search Report',
        description:
          'In Ramesh Patel’s locker: an envelope with ₹2,00,000 cash advance and a folded schematic map of the ceiling ventilation ducts with server rack #12 circled in blue sharpie.',
      },
      {
        id: 'clue_8',
        title: 'Encrypted Telegram Chat on Lab Terminal',
        description:
          'An open session on an auxiliary terminal showed user "Phantom_Proxy" chatting with "Apex_Rohan", but Rohan’s message read: "I won’t steal physical silicon, that’s insane. I only wanted the benchmark logs!"',
      },
      {
        id: 'clue_9',
        title: 'Forensic Fiber Analysis on Broken Seal',
        description:
          'Microscopic fibers on the severed security ribbon match heavy industrial denim uniform fabric issued exclusively to the campus facilities maintenance department.',
      },
    ];

    const allHints = [
      {
        id: 'hint_1',
        text: 'Pay close attention to physical access methods versus digital access. The magnetic door swipe may have been an intentional decoy to trigger an alarm while the real physical entry occurred through a service passage.',
      },
      {
        id: 'hint_2',
        text: 'Cross-reference the security console override with the custodian’s movements and the specific physical evidence found inside the ventilation shaft.',
      },
      {
        id: 'hint_3',
        text: 'The custodian was bribed to be the inside physical operative: his uniform fibers and locker blueprints match the physical entry point directly into the sub-floor cryo-casing.',
      },
    ];

    const suspects = allSuspects.slice(0, config.suspectCount);
    const clues = allClues.slice(0, config.clueCount);
    const hints = allHints.slice(0, config.hintCount);

    return {
      title: 'The Tech Campus Heist: The Midnight Quantum Breach',
      story:
        'At 00:45 AM during the annual midnight hackathon at the prestigious Indian Institute of Cyber Technology, the emergency alarm shrieked. The ultra-secure Server Room 01—housing the revolutionary ₹50 Lakh Q-Core-9 quantum microchip—had been breached. The prototype’s vacuum cryo-casing was cracked open and the silicon core was vanished. During the campus-wide symposium lockdown, badge swipes, ventilation shafts, and manual console overrides point to an inside job executed under cover of the hackathon chaos.',
      suspects,
      clues,
      hints,
      culpritId: 'suspect_3', // Ramesh Patel (The Custodian)
      solutionExplanation:
        'Ramesh Patel, the late-night custodian, was the culprit behind the physical theft. Facing crippling debts, Ramesh conspired with an external buyer. While Head of Security Vikram Singhania initiated a console override thinking he was isolating a false alarm, Ramesh utilized his custodial access and knowledge of the building infrastructure. Wearing an electrostatic smock, he navigated through the sub-floor HVAC duct into Server Room 01, bypassed the motion beams from beneath the floorboards, used a portable battery-soldering tool to melt the acrylic cryo-seal, and extracted the Q-Core-9 prototype. His industrial denim uniform fibers, the discarded smock bearing floor-wax residue, and the ₹2,00,000 cash advance found in his locker provide irrefutable physical and forensic proof.',
    };
  }

  // Generic fallback for custom premise
  return {
    title: 'The Mystery of the Vanished Asset',
    story: `An unexpected investigation has commenced regarding: "${premise}". Crucial forensic traces were recorded at the crime scene. Several suspects had exclusive access during the event window.`,
    suspects: [
      {
        id: 'suspect_1',
        name: 'Alex Vance',
        role: 'Chief Technology Director',
        bio: 'Had full clearance and administrative oversight of the premises.',
        alibi: 'Claims to have been in an executive strategy review.',
        motive: 'Financial irregularities under recent internal audit.',
      },
      {
        id: 'suspect_2',
        name: 'Jordan Lee',
        role: 'Lead Systems Operator',
        bio: 'Maintains server telemetry and credentials.',
        alibi: 'Claims to have been patching remote load balancers.',
        motive: 'Passed over for promotion three times this year.',
      },
      {
        id: 'suspect_3',
        name: 'Samira Khan',
        role: 'On-site Specialist',
        bio: 'Has physical keys to the secure compartments.',
        alibi: 'Claims to have taken an unauthorized break off-camera.',
        motive: 'Sudden high cash transactions in recent personal records.',
      },
      {
        id: 'suspect_4',
        name: 'Morgan Blake',
        role: 'External Auditor',
        bio: 'Contracted to evaluate security vulnerabilities.',
        alibi: 'Claims to have been reviewing paper manifests in the lobby.',
        motive: 'Recruited by an aggressive competitor firm.',
      },
      {
        id: 'suspect_5',
        name: 'Casey Rivera',
        role: 'Night Shift Coordinator',
        bio: 'Supervises floor access and visitor registration logs.',
        alibi: 'Claims to have been checking perimeter fire exits.',
        motive: 'Struggling with clandestine gaming debts.',
      },
    ].slice(0, config.suspectCount),
    clues: [
      {
        id: 'clue_1',
        title: 'Security Access Log Anomaly',
        description: 'Electronic reader logged an unauthorized keycard pass during the critical window.',
      },
      {
        id: 'clue_2',
        title: 'Physical Trace Evidence',
        description: 'Traces of specialized chemical residue found directly on the safe handle.',
      },
      {
        id: 'clue_3',
        title: 'Encrypted Message Log',
        description: 'A burner phone recovered near the fire exit showing incoming encrypted coordinates.',
      },
      {
        id: 'clue_4',
        title: 'Tampered Surveillance Feed',
        description: 'Camera 4 was looped with a 15-minute static freeze interval.',
      },
      {
        id: 'clue_5',
        title: 'Financial Transaction Note',
        description: 'Bank slip indicating an urgent deposit deadline matching one suspect’s financial distress.',
      },
      {
        id: 'clue_6',
        title: 'Tool Marks on Vault Latch',
        description: 'Tool scratches match precision instruments found in the on-site specialist kit.',
      },
      {
        id: 'clue_7',
        title: 'Witness Statement Fragment',
        description: 'A witness saw a shadowy figure wearing a specialist jumpsuit entering the back corridor.',
      },
    ].slice(0, config.clueCount),
    hints: [
      {
        id: 'hint_1',
        text: 'Compare the physical tool marks against each suspect’s specialized equipment.',
      },
      {
        id: 'hint_2',
        text: 'The suspect with direct physical tools and financial distress is the primary actor.',
      },
      {
        id: 'hint_3',
        text: 'Samira Khan had both the physical clearance and the urgent motive to execute the heist.',
      },
    ].slice(0, config.hintCount),
    culpritId: 'suspect_3',
    solutionExplanation:
      'Samira Khan executed the theft by exploiting her specialized tools and direct access. Desperate for funds to settle debt obligations, she tampered with the perimeter lock and removed the asset through the service corridor.',
  };
};

/**
 * Generates a mystery case using Gemini API or fallback
 */
export const generateMysteryCase = async (premise, difficulty = 'medium') => {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const targetPremise = premise?.trim() || DEFAULT_TECH_CAMPUS_PREMISE;

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If no API key is provided, use high-fidelity procedural fallback
  if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey === 'your_gemini_api_key_here') {
    console.log('[GeminiService] No GEMINI_API_KEY configured. Utilizing procedural case engine.');
    return getFallbackCase(targetPremise, difficulty);
  }

  const prompt = `
You are the master game designer and mystery writer for "AI Mystery Room", an interactive detective game.
Generate a cohesive, logically sound, and thrilling mystery case based on the following input:

PREMISE: "${targetPremise}"
DIFFICULTY: "${difficulty.toUpperCase()}"

STRICT REQUIREMENTS FOR THIS DIFFICULTY LEVEL:
- Suspects count: EXACTLY ${config.suspectCount} suspects. Each MUST have a unique id ("suspect_1", "suspect_2", ...).
- Clues count: EXACTLY ${config.clueCount} clues. Each MUST have a unique id ("clue_1", "clue_2", ...).
- Hints count: EXACTLY ${config.hintCount} hints. Each MUST have a unique id ("hint_1", "hint_2", ...).
- Culprit: Exactly ONE suspect MUST be the true culprit. Specify culpritId as the matching suspect id (e.g., "suspect_3").
- Clues must be consistent and point decisively to the culprit through forensic deduction, while providing realistic red herrings for other suspects.
- Hints must gradually lead the player towards identifying the culprit.
- Solution explanation must be thorough (at least 3-4 sentences), explaining HOW the crime was committed, WHY other suspects are innocent, and WHICH clues seal the conviction.

Return ONLY a valid JSON object with this exact structure:
{
  "title": "A captivating, atmospheric title",
  "story": "A rich 2-3 paragraph background story setting up the incident, the lockdown, the scene of the crime, and what is at stake.",
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Full Name",
      "role": "Title / Role",
      "bio": "Background details and personality",
      "alibi": "What they claimed they were doing during the crime window",
      "motive": "Potential reason or leverage they could have had"
    }
  ],
  "clues": [
    {
      "id": "clue_1",
      "title": "Short descriptive clue name",
      "description": "Specific forensic evidence, timestamp log, witness detail, physical item, or digital trace."
    }
  ],
  "hints": [
    {
      "id": "hint_1",
      "text": "Guidance helping the detective connect the clues"
    }
  ],
  "culpritId": "suspect_X",
  "solutionExplanation": "Comprehensive breakdown of how the crime occurred, how the clues corroborate the culprit, and why other suspects are cleared."
}
`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Attempt generation with gemini-2.5-flash or gemini-1.5-flash
    let rawText = '';
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`[GeminiService] Requesting generation from model: ${modelName}...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });
        rawText = response.text;
        if (rawText) break;
      } catch (err) {
        console.warn(`[GeminiService] Model ${modelName} failed:`, err.message);
      }
    }

    if (!rawText) {
      throw new Error('All Gemini model attempts returned empty response');
    }

    // Strip markdown code fences if present
    const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedText);

    // Validate with Zod
    const validatedData = GeneratedCaseSchema.parse(parsedData);

    // Ensure culpritId exists among suspects
    const validCulprit = validatedData.suspects.some((s) => s.id === validatedData.culpritId);
    if (!validCulprit && validatedData.suspects.length > 0) {
      validatedData.culpritId = validatedData.suspects[0].id;
    }

    return validatedData;
  } catch (error) {
    console.error('[GeminiService] Generation failed or validation error:', error.message);
    console.log('[GeminiService] Falling back to procedural high-quality case engine.');
    return getFallbackCase(targetPremise, difficulty);
  }
};
