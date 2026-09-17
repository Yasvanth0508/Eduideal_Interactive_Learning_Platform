import { ContentBlockWithDetails } from "../types";

export const TOPIC_10_ID = "e1000000-0000-0000-0000-000000000110";
export const TOPIC_11_ID = "e1000000-0000-0000-0000-000000000111";
export const TOPIC_12_ID = "e1000000-0000-0000-0000-000000000112";
export const TOPIC_13_ID = "e1000000-0000-0000-0000-000000000113";

// ============================================================================
// TOPIC 10: Colligative Properties
// ============================================================================
export const TOPIC_10_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000001001",
    topicId: TOPIC_10_ID,
    type: "THEORY",
    title: "Introduction to Colligative Properties",
    description: "Definition, particle-count dependence, and comparative overview of the 4 fundamental colligative properties.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "The word 'colligative' is derived from the Latin 'colligatus', meaning 'bound together' or 'collected'. These properties depend strictly on the collection (number) of solute particles rather than their chemical identity or structural nature.",
      sections: [
        {
          id: "sec-colligative-def",
          badge: "UNIFYING PRINCIPLE",
          heading: "What are Colligative Properties?",
          paragraphs: [
            "Colligative properties are those properties of dilute solutions containing non-volatile solutes that depend only on the total number of solute particles relative to the total number of molecules present in solution, and NOT on the chemical nature or size of the solute.",
            "Whether 1 mole of glucose, 1 mole of sucrose, or 1 mole of urea is dissolved in 1 kg of water, the magnitude of the boiling point elevation or freezing point depression is identical because each non-electrolyte provides 6.022 × 10²³ particles.",
            "The 4 fundamental colligative properties recognized by CBSE Class 12 are:",
          ],
          bulletPoints: [
            "1. Relative Lowering of Vapour Pressure: (p₁° - p₁) / p₁° = x₂",
            "2. Elevation of Boiling Point: ΔT_b = K_b · m",
            "3. Depression of Freezing Point: ΔT_f = K_f · m",
            "4. Osmotic Pressure: Π = C · R · T",
          ],
          keyTerms: [
            {
              term: "Colligative Property",
              definition: "A property of a solution that depends solely upon the ratio of the number of solute particles to solvent particles, and not on the chemical identity of the solute.",
            },
          ],
          callout: {
            type: "ncert",
            title: "NCERT Board Question Alert",
            text: "Question: 'Why do 0.1 M glucose and 0.1 M urea have the same freezing point depression?' Answer: Both are non-electrolytes that do not dissociate or associate in water, yielding the same number of solute particles per unit volume.",
          },
          interactiveWidget: "COLLIGATIVE_PROPERTIES_HUB",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000001002",
    topicId: TOPIC_10_ID,
    type: "QUESTIONS",
    title: "Check Your Understanding: Colligative Concepts",
    description: "Concept checks on colligative property definitions.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000001021",
        questionText: "Which of the following is NOT a colligative property?",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 1,
        hint: "Colligative properties depend on particle concentration, not intrinsic liquid surface tension.",
        explanation: "Surface tension is an intensive property characteristic of the liquid's intermolecular forces, not a colligative property.",
        options: [
          { id: "e1000000-0000-0000-0000-000000001051", optionText: "Surface tension", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000001052", optionText: "Osmotic pressure", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000001053", optionText: "Elevation of boiling point", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000001054", optionText: "Depression of freezing point", isCorrect: false, displayOrder: 4 },
        ],
      },
    ],
  },
];

// ============================================================================
// TOPIC 11: Relative Lowering of Vapour Pressure
// ============================================================================
export const TOPIC_11_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000001101",
    topicId: TOPIC_11_ID,
    type: "THEORY",
    title: "Relative Lowering of Vapour Pressure (RLVP)",
    description: "Derive Raoult's expression for non-volatile solutes and calculate unknown molar mass (M₂).",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "When a non-volatile solute is dissolved in a solvent, the vapor pressure of the solution (p₁) is lower than that of pure solvent (p₁°). The ratio of this lowering (p₁° - p₁) to the pure vapor pressure (p₁°) is known as the relative lowering of vapor pressure.",
      sections: [
        {
          id: "sec-rlvp-derivation",
          badge: "NCERT DERIVATION",
          heading: "Derivation & Molar Mass Formula",
          paragraphs: [
            "According to Raoult's law for non-volatile solute: p₁ = p₁° · x₁ = p₁° · (1 - x₂), which rearranges to: p₁° - p₁ = p₁° · x₂.",
            "Dividing by p₁°: (p₁° - p₁) / p₁° = x₂. The relative lowering depends only on the mole fraction of the solute, proving it is a colligative property.",
            "For dilute solutions, n₂ ≪ n₁, so x₂ = n₂ / (n₁ + n₂) ≈ n₂ / n₁.",
            "Substituting n₂ = w₂ / M₂ and n₁ = w₁ / M₁: (p₁° - p₁) / p₁° = (w₂ · M₁) / (M₂ · w₁).",
            "Hence, the molar mass of solute is: M₂ = (w₂ · M₁ · p₁°) / [w₁ · (p₁° - p₁)].",
          ],
          bulletPoints: [
            "p₁°: Vapor pressure of pure solvent.",
            "p₁: Vapor pressure of solution with non-volatile solute.",
            "w₂, M₂: Mass and molar mass of solute.",
            "w₁, M₁: Mass and molar mass of solvent.",
          ],
          keyTerms: [
            {
              term: "Relative Lowering of Vapour Pressure (RLVP)",
              definition: "The ratio of vapor pressure decrease (p₁° - p₁) caused by non-volatile solute to the vapor pressure of the pure solvent (p₁°).",
            },
          ],
          callout: {
            type: "tip",
            title: "Dilute Solution Approximation",
            text: "In NCERT board numericals, if the solution is very dilute (< 5%), (n₁ + n₂) is safely approximated as n₁. For more concentrated solutions, use the exact formula: (p₁° - p₁) / p₁ = n₂ / n₁.",
          },
          interactiveWidget: "RLVP_CALCULATOR",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000001102",
    topicId: TOPIC_11_ID,
    type: "QUESTIONS",
    title: "Numerical Problems: RLVP",
    description: "Calculate solute molar masses using relative vapor pressure lowering.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000001121",
        questionText: "The vapor pressure of pure water at 298 K is 23.8 mm Hg. 50 g of urea (NH₂CONH₂, M₂ = 60) is dissolved in 850 g of water. Calculate the relative lowering of vapor pressure.",
        questionType: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        displayOrder: 1,
        hint: "Find x₂ = n₂ / (n₁ + n₂). Moles of urea = 50/60 = 0.833 mol. Moles of water = 850/18 = 47.22 mol.",
        explanation: "n₂ = 0.833, n₁ = 47.22. Total moles = 48.053. x₂ = 0.833 / 48.053 = 0.0173. RLVP = x₂ = 0.0173.",
        options: [
          { id: "e1000000-0000-0000-0000-000000001151", optionText: "0.0173", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000001152", optionText: "0.0588", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000001153", optionText: "0.412", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000001154", optionText: "0.0012", isCorrect: false, displayOrder: 4 },
        ],
      },
    ],
  },
];

// ============================================================================
// TOPIC 12: Elevation of Boiling Point
// ============================================================================
export const TOPIC_12_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000001201",
    topicId: TOPIC_12_ID,
    type: "THEORY",
    title: "Elevation of Boiling Point (Ebullioscopy)",
    description: "Explore boiling point thermodynamics, the ebullioscopic constant (K_b), and determination of solute molar mass.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "The boiling point of a liquid is the temperature at which its equilibrium vapor pressure equals the external atmospheric pressure (1.013 bar). Since a non-volatile solute lowers vapor pressure, the solution must be heated to a higher temperature to reach 1 atm.",
      sections: [
        {
          id: "sec-boiling-elevation",
          badge: "EBULLIOSCOPY",
          heading: "Formula & Molal Elevation Constant (K_b)",
          paragraphs: [
            "Let T_b° be the boiling point of pure solvent and T_b be the boiling point of the solution. The elevation of boiling point is ΔT_b = T_b - T_b°.",
            "Experiments establish that for dilute solutions, the elevation of boiling point is directly proportional to the molal concentration (molality m) of the solute: ΔT_b = K_b · m.",
            "Here, K_b is called the Molal Boiling Point Elevation Constant or Ebullioscopic Constant. The unit of K_b is K kg mol⁻¹.",
            "Since molality m = (w₂ / M₂) × (1000 / w₁ in g), we have: ΔT_b = (1000 · K_b · w₂) / (M₂ · w₁).",
            "Thermodynamic formula for K_b: K_b = (R · M₁ · T_b°²) / (1000 · Δ_vap H), where R is gas constant and Δ_vap H is enthalpy of vaporization.",
          ],
          bulletPoints: [
            "K_b for Water: 0.52 K kg mol⁻¹.",
            "K_b depends solely on the nature of the solvent, never on the solute.",
            "Molar mass of solute: M₂ = (1000 · K_b · w₂) / (ΔT_b · w₁).",
          ],
          keyTerms: [
            {
              term: "Ebullioscopic Constant (K_b)",
              definition: "The elevation in boiling point produced when 1 mole of a non-volatile solute is dissolved in 1 kilogram of solvent. Unit: K kg mol⁻¹.",
            },
          ],
          callout: {
            type: "ncert",
            title: "Board Definition Alert",
            text: "Define molal elevation constant. Answer: K_b is defined as the boiling point elevation produced when 1 mole of non-volatile solute is dissolved in 1 kg of solvent (i.e., m = 1 mol/kg).",
          },
          interactiveWidget: "BOILING_ELEVATION_CALCULATOR",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000001202",
    topicId: TOPIC_12_ID,
    type: "QUESTIONS",
    title: "Problems: Elevation of Boiling Point",
    description: "Solve board numericals on boiling elevation and K_b calculations.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000001221",
        questionText: "What is the SI unit of molal elevation constant (K_b)?",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 1,
        hint: "K_b = ΔT_b / m. Temperature is in Kelvin, molality is in mol/kg.",
        explanation: "K_b has dimensions of Temperature / Molality = K / (mol/kg) = K kg mol⁻¹.",
        options: [
          { id: "e1000000-0000-0000-0000-000000001251", optionText: "K kg mol⁻¹", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000001252", optionText: "K mol kg⁻¹", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000001253", optionText: "kg mol K⁻¹", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000001254", optionText: "mol kg⁻¹ K⁻¹", isCorrect: false, displayOrder: 4 },
        ],
      },
    ],
  },
];

// ============================================================================
// TOPIC 13: Depression of Freezing Point
// ============================================================================
export const TOPIC_13_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000001301",
    topicId: TOPIC_13_ID,
    type: "THEORY",
    title: "Depression of Freezing Point (Cryoscopy)",
    description: "Thermodynamic basis of freezing depression, cryoscopic constant (K_f), and applications in car radiators and de-icing.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "The freezing point of a substance is the temperature at which its liquid and solid states possess the same vapor pressure. Dissolving a non-volatile solute lowers the vapor pressure of the liquid phase, intercepting the solid curve at a lower temperature.",
      sections: [
        {
          id: "sec-freezing-depression",
          badge: "CRYOSCOPY",
          heading: "Formula & Molal Depression Constant (K_f)",
          paragraphs: [
            "Let T_f° be the freezing point of pure solvent and T_f be the freezing point of the solution. The depression of freezing point is ΔT_f = T_f° - T_f.",
            "For dilute solutions, the freezing point depression is directly proportional to molality: ΔT_f = K_f · m.",
            "K_f is known as the Molal Depression Constant or Cryoscopic Constant (unit: K kg mol⁻¹). For water, K_f = 1.86 K kg mol⁻¹.",
            "Molar mass of solute: M₂ = (1000 · K_f · w₂) / (ΔT_f · w₁).",
            "Thermodynamic formula for K_f: K_f = (R · M₁ · T_f°²) / (1000 · Δ_fus H), where Δ_fus H is the enthalpy of fusion of the solvent.",
          ],
          bulletPoints: [
            "Antifreeze Solution: Ethylene glycol mixed in water lowers freezing point to prevent engine coolant freezing in winter.",
            "Salting Roads: Spreading NaCl or CaCl₂ on snow lowers the freezing point of water below ambient temperature, causing ice to melt.",
          ],
          keyTerms: [
            {
              term: "Cryoscopic Constant (K_f)",
              definition: "The depression in freezing point produced when 1 mole of non-volatile solute is dissolved in 1 kilogram of solvent.",
            },
          ],
          callout: {
            type: "ncert",
            title: "Board Favorite Question",
            text: "Explain why common salt (NaCl) or calcium chloride (CaCl₂) is spread on icy roads in cold countries. Answer: It depresses the freezing point of water well below 0 °C, melting the ice and clearing roads.",
          },
          interactiveWidget: "FREEZING_DEPRESSION_CALCULATOR",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000001302",
    topicId: TOPIC_13_ID,
    type: "QUESTIONS",
    title: "Problems: Depression of Freezing Point",
    description: "Numerical exercises on freezing point depression and K_f.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000001321",
        questionText: "45 g of ethylene glycol (C₂H₆O₂, M₂ = 62 g/mol) is mixed with 600 g of water. Calculate the freezing point of the solution. (K_f for water = 1.86 K kg mol⁻¹).",
        questionType: "SHORT_ANSWER",
        difficulty: "MEDIUM",
        marks: 2,
        displayOrder: 1,
        hint: "m = (45 / 62) / 0.600 kg. ΔT_f = 1.86 × m. T_f = 273.15 - ΔT_f.",
        expectedAnswer: "270.9 K (or -2.25 °C)",
        explanation: "Moles of glycol = 45 / 62 = 0.726 mol. Molality m = 0.726 / 0.600 = 1.21 mol/kg. ΔT_f = 1.86 × 1.21 = 2.25 K. Freezing point = 273.15 K - 2.25 K = 270.9 K (-2.25 °C).",
      },
    ],
  },
];
