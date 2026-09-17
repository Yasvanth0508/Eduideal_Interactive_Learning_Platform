import { ContentBlockWithDetails } from "../types";

export const TOPIC_14_ID = "e1000000-0000-0000-0000-000000000114";
export const TOPIC_15_ID = "e1000000-0000-0000-0000-000000000115";
export const TOPIC_16_ID = "e1000000-0000-0000-0000-000000000116";

// ============================================================================
// TOPIC 14: Osmosis
// ============================================================================
export const TOPIC_14_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000001401",
    topicId: TOPIC_14_ID,
    type: "THEORY",
    title: "Osmosis & Semi-Permeable Membranes (SPM)",
    description: "Understand the spontaneous movement of solvent molecules, semi-permeable membranes, and biological significance.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "If a raw mango is placed in concentrated brine, it shrivels into a pickle. Wilted flowers revive when placed in fresh water. These common natural phenomena are driven by osmosis.",
      sections: [
        {
          id: "sec-osmosis-concept",
          badge: "MEMBRANE TRANSPORT",
          heading: "Mechanism of Osmosis & Nature of SPM",
          paragraphs: [
            "A semi-permeable membrane (SPM) contains a network of sub-microscopic pores that permit small solvent molecules (like H₂O) to pass through, while blocking larger solute molecules or hydrated ions.",
            "Osmosis is the spontaneous net flow of solvent molecules from pure solvent (or a dilute solution) into a concentrated solution across a semi-permeable membrane.",
            "SPMs can be natural (animal bladders, parchment paper, cell membranes) or synthetic (cellophane, porous copper ferrocyanide Cu₂[Fe(CN)₆], cellulose acetate).",
          ],
          bulletPoints: [
            "Direction of Flow: From lower solute concentration (high solvent chemical potential) to higher solute concentration (lower solvent chemical potential).",
            "Driving Force: Equalization of chemical potentials across the membrane.",
          ],
          keyTerms: [
            {
              term: "Semi-Permeable Membrane (SPM)",
              definition: "A membrane that selectively allows solvent molecules to pass through while impeding the passage of solute particles.",
            },
            {
              term: "Osmosis",
              definition: "The spontaneous net passage of solvent molecules from a region of lower solute concentration to higher solute concentration through an SPM.",
            },
          ],
          callout: {
            type: "ncert",
            title: "Board Conceptual Check",
            text: "Question: 'Does solvent move in only one direction during osmosis?' Answer: No, solvent molecules move in both directions, but the net rate of flow is from pure solvent into the solution.",
          },
          interactiveWidget: "OSMOSIS_SIMULATION",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000001402",
    topicId: TOPIC_14_ID,
    type: "QUESTIONS",
    title: "Check Your Understanding: Osmosis",
    description: "Test your understanding of osmosis and semi-permeable membranes.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000001421",
        questionText: "During osmosis, solvent molecules flow through the semi-permeable membrane:",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 1,
        hint: "From higher solvent concentration to lower solvent concentration.",
        explanation: "Net solvent flow occurs from the dilute solution (or pure solvent) having high solvent chemical potential to the concentrated solution.",
        options: [
          { id: "e1000000-0000-0000-0000-000000001451", optionText: "From dilute solution to concentrated solution", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000001452", optionText: "From concentrated solution to dilute solution", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000001453", optionText: "In both directions at equal rates always", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000001454", optionText: "Only if external pressure is applied", isCorrect: false, displayOrder: 4 },
        ],
      },
    ],
  },
];

// ============================================================================
// TOPIC 15: Osmotic Pressure
// ============================================================================
export const TOPIC_15_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000001501",
    topicId: TOPIC_15_ID,
    type: "THEORY",
    title: "Osmotic Pressure & Solution Tonicity",
    description: "Derive van 't Hoff's osmotic equation (Π = CRT), explore isotonic/hypotonic/hypertonic solutions and macromolecule molar mass determination.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "Osmotic pressure is the excess hydrostatic pressure that must be applied to the solution to prevent the inward osmosis of pure solvent through a semi-permeable membrane.",
      sections: [
        {
          id: "sec-osmotic-pressure",
          badge: "QUANTITATIVE OSMOMETRY",
          heading: "Formula (Π = CRT) & Solution Tonicity",
          paragraphs: [
            "For dilute solutions, osmotic pressure (Π) is directly proportional to the molarity (C) of the solution at a given absolute temperature (T): Π = C · R · T.",
            "Since C = n₂ / V = (w₂ / M₂) / V, the equation becomes: Π = (w₂ · R · T) / (M₂ · V).",
            "Rearranging for molar mass: M₂ = (w₂ · R · T) / (Π · V).",
            "Isotonic Solutions: Two solutions having equal osmotic pressure at the same temperature. No net osmosis occurs between them.",
            "0.9% (m/v) aqueous NaCl (Normal Saline) is isotonic with human blood cells. In < 0.9% NaCl (hypotonic), RBCs swell and burst (hemolysis). In > 0.9% NaCl (hypertonic), RBCs lose water and shrink (crenation).",
          ],
          bulletPoints: [
            "Why Osmotic Pressure is Preferred for Macromolecules: 1) Measured at room temperature (proteins don't denature); 2) Uses molarity instead of molality; 3) Even very dilute macromolecule solutions (small molality) generate a large, accurately readable osmotic pressure (several mm or cm of liquid column).",
            "Edema: People taking excess salt in food retain water in tissue cells and intercellular spaces due to osmosis, causing puffiness called edema.",
          ],
          keyTerms: [
            {
              term: "Osmotic Pressure (Π)",
              definition: "The excess hydrostatic pressure applied to a solution to halt the inward flow of solvent across a semi-permeable membrane.",
            },
            {
              term: "Isotonic Solutions",
              definition: "Solutions having identical osmotic pressures at a given temperature, across which no net osmosis occurs.",
            },
          ],
          callout: {
            type: "ncert",
            title: "Board Favorite: Molar Mass of Proteins",
            text: "Question: 'Why is osmotic pressure measurement preferred over boiling point elevation for finding the molar mass of biomolecules?' Answer: Biomolecules are thermally unstable at high temperatures and have low solubility; osmotic pressure provides large, easily measurable values at room temperature.",
          },
          interactiveWidget: "OSMOTIC_PRESSURE_CALCULATOR",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000001502",
    topicId: TOPIC_15_ID,
    type: "QUESTIONS",
    title: "Problems: Osmotic Pressure",
    description: "Numerical and physiological problems on osmotic pressure.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000001521",
        questionText: "What will happen to red blood cells (RBCs) when placed in a 0.5% (m/v) NaCl solution?",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 1,
        hint: "Blood is isotonic with 0.9% NaCl.",
        explanation: "0.5% NaCl is hypotonic relative to blood cells. Water enters the cells by endoosmosis, causing them to swell and burst (hemolysis).",
        options: [
          { id: "e1000000-0000-0000-0000-000000001551", optionText: "They swell and may burst (hemolysis)", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000001552", optionText: "They shrink (crenation)", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000001553", optionText: "No change in size", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000001554", optionText: "They dissolve completely", isCorrect: false, displayOrder: 4 },
        ],
      },
    ],
  },
];

// ============================================================================
// TOPIC 16: Reverse Osmosis
// ============================================================================
export const TOPIC_16_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000001601",
    topicId: TOPIC_16_ID,
    type: "THEORY",
    title: "Reverse Osmosis (RO) & Water Desalination",
    description: "Understand the thermodynamic reversal of osmosis under high external pressure and its industrial application in seawater desalination.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "The direction of osmosis can be reversed if a hydrostatic pressure larger than the osmotic pressure is applied to the concentrated solution.",
      sections: [
        {
          id: "sec-reverse-osmosis",
          badge: "DESALINATION TECHNOLOGY",
          heading: "Condition for Reverse Osmosis (P > Π)",
          paragraphs: [
            "When the pressure applied to the solution side is greater than its osmotic pressure (P > Π), solvent molecules are forced to migrate from the solution through the SPM into the pure solvent compartment.",
            "This phenomenon is called Reverse Osmosis (RO).",
            "Membrane Material: Modern industrial desalination uses a thin film of cellulose acetate supported over a porous polymer substrate. Cellulose acetate is permeable to water molecules while rejecting ions and contaminants.",
          ],
          bulletPoints: [
            "Condition: External Applied Pressure P > Π.",
            "Direction of Water: From Saline / Salt solution to Fresh water.",
            "Key Applications: Desalination of seawater, domestic drinking water RO systems.",
          ],
          keyTerms: [
            {
              term: "Reverse Osmosis",
              definition: "The process in which solvent flows from the solution into the pure solvent when an external pressure exceeding osmotic pressure is applied to the solution.",
            },
            {
              term: "Cellulose Acetate Membrane",
              definition: "A semi-permeable polymer membrane selectively permeable to water and impermeable to dissolved ionic salts.",
            },
          ],
          callout: {
            type: "ncert",
            title: "CBSE Exam Highlight",
            text: "State the condition for reverse osmosis to occur and name the polymer membrane commonly used. Answer: P > Π; Cellulose acetate supported on a porous sheet.",
          },
          interactiveWidget: "REVERSE_OSMOSIS_SIMULATOR",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000001602",
    topicId: TOPIC_16_ID,
    type: "QUESTIONS",
    title: "Practice: Reverse Osmosis",
    description: "Conceptual questions on reverse osmosis desalination.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000001621",
        questionText: "Reverse osmosis occurs when the pressure applied on the solution is:",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 1,
        hint: "To force water backwards against the natural gradient.",
        explanation: "When applied pressure exceeds the osmotic pressure (P > Π), solvent molecules are forced from the concentrated solution into pure water.",
        options: [
          { id: "e1000000-0000-0000-0000-000000001651", optionText: "Greater than osmotic pressure (P > Π)", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000001652", optionText: "Less than osmotic pressure (P < Π)", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000001653", optionText: "Equal to osmotic pressure (P = Π)", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000001654", optionText: "Zero", isCorrect: false, displayOrder: 4 },
        ],
      },
    ],
  },
];
