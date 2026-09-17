import { ContentBlockWithDetails } from "../types";

export const TOPIC_06_ID = "e1000000-0000-0000-0000-000000000106";
export const TOPIC_07_ID = "e1000000-0000-0000-0000-000000000107";
export const TOPIC_08_ID = "e1000000-0000-0000-0000-000000000108";
export const TOPIC_09_ID = "e1000000-0000-0000-0000-000000000109";

// ============================================================================
// TOPIC 06: Raoult's Law
// ============================================================================
export const TOPIC_06_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000000601",
    topicId: TOPIC_06_ID,
    type: "THEORY",
    title: "Raoult's Law for Volatile Binary Liquid Mixtures",
    description: "Derive partial vapor pressures, total vapor pressure, and examine Raoult's law as a special case of Henry's law.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "Formulated by French chemist François-Marie Raoult in 1886, Raoult's Law provides the mathematical basis for understanding how vapor pressures of volatile components combine in a liquid solution.",
      sections: [
        {
          id: "sec-raoult-derivation",
          badge: "GOVERNING LAW",
          heading: "Mathematical Formulation & Dalton's Law",
          paragraphs: [
            "For a solution of volatile liquids, the partial vapor pressure of each component in the solution is directly proportional to its mole fraction present in solution.",
            "p_A = p_A° · x_A and p_B = p_B° · x_B, where p_A° and p_B° represent the vapor pressures of pure components A and B at that temperature.",
            "Applying Dalton's Law of Partial Pressures: P_total = p_A + p_B = p_A° · x_A + p_B° · x_B = p_A° + (p_B° - p_A°) · x_B.",
            "Raoult's Law as a Special Case of Henry's Law: For a volatile solute, p = K_H · x (Henry's law). If the proportionality constant K_H equals the pure liquid vapor pressure p°, Henry's law becomes identical to Raoult's law.",
          ],
          bulletPoints: [
            "Linear Vapor Pressure: The total vapor pressure varies linearly with the mole fraction of component B.",
            "Vapor Phase Composition: The mole fraction in vapor phase (y_A, y_B) differs from liquid phase: y_A = p_A / P_total, and y_B = p_B / P_total.",
            "The vapor phase is always richer in the more volatile component (the one with higher pure vapor pressure p°).",
          ],
          keyTerms: [
            {
              term: "Raoult's Law",
              definition: "At a given temperature, the partial vapor pressure of any volatile component is equal to the product of its vapor pressure in pure state and its mole fraction in solution.",
            },
            {
              term: "Dalton's Law of Partial Pressures",
              definition: "The total pressure in a gas mixture is the arithmetic sum of the partial pressures of individual non-reacting constituent gases.",
            },
          ],
          callout: {
            type: "ncert",
            title: "Board Examination Favorite",
            text: "Frequently asked: 'Under what condition does Henry's Law become Raoult's Law?' Answer: When the Henry's law proportionality constant K_H becomes equal to the vapor pressure of the pure component (p°), Henry's law becomes Raoult's law.",
          },
          interactiveWidget: "RAOULTS_LAW_GRAPH",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000000602",
    topicId: TOPIC_06_ID,
    type: "QUESTIONS",
    title: "Mastery Questions: Raoult's Law",
    description: "Numerical and conceptual problems on binary vapor pressure calculations.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000000621",
        questionText: "At 300 K, the vapor pressure of pure benzene is 0.850 bar. A non-volatile solute is added, and the vapor pressure of the solution becomes 0.845 bar. What is the mole fraction of the solute?",
        questionType: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        displayOrder: 1,
        hint: "Use (p° - p) / p° = x₂.",
        explanation: "(0.850 - 0.845) / 0.850 = 0.005 / 0.850 = 0.00588 ≈ 0.0059.",
        options: [
          { id: "e1000000-0000-0000-0000-000000000651", optionText: "0.0059", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000000652", optionText: "0.0125", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000000653", optionText: "0.845", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000000654", optionText: "0.050", isCorrect: false, displayOrder: 4 },
        ],
      },
    ],
  },
];

// ============================================================================
// TOPIC 07: Ideal and Non-Ideal Solutions
// ============================================================================
export const TOPIC_07_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000000701",
    topicId: TOPIC_07_ID,
    type: "THEORY",
    title: "Thermodynamic & Molecular Criteria for Ideal Solutions",
    description: "Learn enthalpy of mixing, volume of mixing, and intermolecular attraction criteria distinguishing ideal and non-ideal solutions.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "Liquid-liquid solutions are classified as either ideal or non-ideal depending on whether they obey Raoult's law over the entire range of concentrations and temperatures.",
      sections: [
        {
          id: "sec-ideal-criteria",
          badge: "THERMODYNAMIC CRITERIA",
          heading: "Criteria for an Ideal Solution",
          paragraphs: [
            "An ideal solution is one which obeys Raoult's law strictly over the entire range of concentration and temperature.",
            "For an ideal solution, the intermolecular attractive forces between solute-solvent (A-B) are virtually identical to those between solvent-solvent (A-A) and solute-solute (B-B) molecules.",
            "Consequently, no heat is absorbed or evolved during mixing: ΔH_mixing = 0. Furthermore, there is neither expansion nor contraction in volume: ΔV_mixing = 0.",
          ],
          bulletPoints: [
            "Raoult's Law Obedience: p_A = p_A° · x_A and p_B = p_B° · x_B at all concentrations.",
            "Enthalpy of Mixing: ΔH_mix = 0 (athermic process).",
            "Volume of Mixing: ΔV_mix = 0 (Total volume = V_A + V_B).",
            "NCERT Classic Examples: n-hexane + n-heptane, Benzene + Toluene, Bromoethane + Chloroethane, Chlorobenzene + Bromobenzene.",
          ],
          keyTerms: [
            {
              term: "Ideal Solution",
              definition: "A solution that obeys Raoult's law over the entire range of concentration with ΔH_mix = 0 and ΔV_mix = 0.",
            },
            {
              term: "Intermolecular Homogeneity",
              definition: "The condition where A-B molecular interactions are identical in magnitude and nature to A-A and B-B interactions.",
            },
          ],
          callout: {
            type: "ncert",
            title: "Board Exam Tip: Ideal Pairs",
            text: "Any pair of liquids that have almost identical molecular sizes, structures, and polarities (such as homologous pairs like n-hexane and n-heptane, or benzene and toluene) form nearly ideal solutions.",
          },
          interactiveWidget: "IDEAL_NON_IDEAL_COMPARATOR",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000000702",
    topicId: TOPIC_07_ID,
    type: "QUESTIONS",
    title: "Check Your Understanding: Ideal Solutions",
    description: "Identify ideal binary pairs and thermodynamic characteristics.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000000721",
        questionText: "Which of the following binary liquid mixtures behaves almost ideally?",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 1,
        hint: "Look for structurally similar homologous compounds.",
        explanation: "Benzene and toluene have almost identical molecular geometry, aromatic character, and London dispersion forces, making ΔH_mix ≈ 0 and ΔV_mix ≈ 0.",
        options: [
          { id: "e1000000-0000-0000-0000-000000000751", optionText: "Benzene + Toluene", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000000752", optionText: "Ethanol + Acetone", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000000753", optionText: "Chloroform + Acetone", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000000754", optionText: "Water + Nitric acid", isCorrect: false, displayOrder: 4 },
        ],
      },
    ],
  },
];

// ============================================================================
// TOPIC 08: Positive and Negative Deviation
// ============================================================================
export const TOPIC_08_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000000801",
    topicId: TOPIC_08_ID,
    type: "THEORY",
    title: "Non-Ideal Solutions: Positive and Negative Deviations from Raoult's Law",
    description: "Understand why molecular attractions cause positive or negative deviations, and master standard NCERT examples.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "When a solution does not obey Raoult's law over the entire range of concentrations, it is called a non-ideal solution. The vapor pressure is either higher or lower than predicted by Raoult's law.",
      sections: [
        {
          id: "sec-deviations-explained",
          badge: "DEVIATION MECHANISMS",
          heading: "Positive vs. Negative Deviations",
          paragraphs: [
            "Positive Deviation: Occurs when A-B intermolecular attractive forces are WEAKER than A-A and B-B forces. Molecules escape more readily into the vapor phase, so vapor pressure is HIGHER than predicted by Raoult's law. ΔH_mix > 0 (endothermic) and ΔV_mix > 0 (volume expansion).",
            "Example of Positive Deviation: Ethanol + Acetone. Pure ethanol has strong intermolecular hydrogen bonding. When acetone is added, acetone molecules get between ethanol molecules and disrupt hydrogen bonds, enabling easier evaporation.",
            "Negative Deviation: Occurs when A-B intermolecular attractive forces are STRONGER than A-A and B-B forces. Molecules are held more tightly, so vapor pressure is LOWER than predicted by Raoult's law. ΔH_mix < 0 (exothermic) and ΔV_mix < 0 (volume contraction).",
            "Example of Negative Deviation: Chloroform + Acetone. Chloroform (CHCl₃) forms a new, strong intermolecular hydrogen bond with the carbonyl oxygen of acetone: Cl₃C—H···O=C(CH₃)₂.",
          ],
          bulletPoints: [
            "Positive Deviation: P_total > p_A + p_B, ΔH_mix > 0, ΔV_mix > 0. Examples: Ethanol + Acetone, CS₂ + Acetone, Carbon tetrachloride + Toluene.",
            "Negative Deviation: P_total < p_A + p_B, ΔH_mix < 0, ΔV_mix < 0. Examples: Chloroform + Acetone, Phenol + Aniline, Water + Nitric Acid.",
          ],
          keyTerms: [
            {
              term: "Positive Deviation",
              definition: "Behavior where the observed vapor pressure is greater than predicted by Raoult's law due to weaker solute-solvent interactions.",
            },
            {
              term: "Negative Deviation",
              definition: "Behavior where the observed vapor pressure is less than predicted by Raoult's law due to stronger solute-solvent interactions (such as new H-bonds).",
            },
          ],
          callout: {
            type: "ncert",
            title: "Crucial NCERT Reason Question",
            text: "Explain why mixing chloroform and acetone results in a decrease in total volume and evolution of heat. Answer: Chloroform forms new hydrogen bonds with the carbonyl oxygen of acetone. Increased attractive forces pull molecules closer (ΔV < 0) and release energy (ΔH < 0), causing negative deviation.",
          },
          interactiveWidget: "DEVIATION_CURVES_GRAPH",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000000802",
    topicId: TOPIC_08_ID,
    type: "QUESTIONS",
    title: "Exam Questions: Positive & Negative Deviation",
    description: "Test your ability to predict sign of ΔH_mix, ΔV_mix, and deviation direction.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000000821",
        questionText: "On mixing 20 mL of acetone with 20 mL of chloroform, the total volume of the resulting solution will be:",
        questionType: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        displayOrder: 1,
        hint: "Recall whether this mixture shows positive or negative deviation.",
        explanation: "Acetone and chloroform form intermolecular hydrogen bonds, exhibiting negative deviation from Raoult's law where ΔV_mix < 0. Hence, total volume is less than 40 mL.",
        options: [
          { id: "e1000000-0000-0000-0000-000000000851", optionText: "Less than 40 mL", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000000852", optionText: "Equal to 40 mL", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000000853", optionText: "Greater than 40 mL", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000000854", optionText: "Cannot be predicted", isCorrect: false, displayOrder: 4 },
        ],
      },
    ],
  },
];

// ============================================================================
// TOPIC 09: Azeotropes
// ============================================================================
export const TOPIC_09_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000000901",
    topicId: TOPIC_09_ID,
    type: "THEORY",
    title: "Azeotropic Mixtures: Minimum & Maximum Boiling Azeotropes",
    description: "Understand constant boiling mixtures, phase equilibrium diagrams, and why azeotropes cannot be separated by fractional distillation.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "Azeotropes are binary mixtures having the same composition in liquid and vapor phases and boil at a constant temperature. Fractional distillation cannot separate their components beyond the azeotropic composition.",
      sections: [
        {
          id: "sec-azeotropes",
          badge: "CONSTANT BOILING MIXTURES",
          heading: "Types of Azeotropes & Distillation Limits",
          paragraphs: [
            "An azeotrope or constant-boiling mixture behaves like a pure liquid during distillation because vapor phase mole fractions (y_A, y_B) are exactly identical to liquid phase mole fractions (x_A, x_B).",
            "Minimum Boiling Azeotrope: Formed by non-ideal solutions showing LARGE POSITIVE DEVIATION. Since vapor pressure reaches a maximum, the boiling point reaches a minimum lower than either pure component.",
            "Example: 95.4% Ethanol + 4.6% Water by mass. Boils at 351.15 K (78.0 °C), lower than pure ethanol (351.5 K) and pure water (373.15 K). Ordinary fractional distillation of fermented mash yields at most 95.4% ethanol.",
            "Maximum Boiling Azeotrope: Formed by non-ideal solutions showing LARGE NEGATIVE DEVIATION. Vapor pressure reaches a minimum, so boiling point reaches a maximum higher than either pure component.",
            "Example: 68% Nitric Acid (HNO₃) + 32% Water by mass. Boils at 393.5 K (120.5 °C), higher than pure water (373.15 K) and pure HNO₃ (359 K).",
          ],
          bulletPoints: [
            "Minimum Boiling: Large Positive Deviation → Max Vapor Pressure → Min Boiling Point.",
            "Maximum Boiling: Large Negative Deviation → Min Vapor Pressure → Max Boiling Point.",
            "Fractional Distillation Limit: Once the azeotropic composition is reached, further fractional distillation cannot change the composition.",
          ],
          keyTerms: [
            {
              term: "Azeotrope",
              definition: "A binary mixture whose vapor phase has identical composition to its liquid phase, boiling at a constant temperature without change in composition.",
            },
            {
              term: "Minimum Boiling Azeotrope",
              definition: "An azeotropic mixture that boils at a temperature lower than either of the pure components, resulting from large positive deviation.",
            },
          ],
          callout: {
            type: "ncert",
            title: "Board Exam Question Alert",
            text: "Question: 'Why can 95.4% ethanol-water mixture not be concentrated further by fractional distillation?' Answer: It forms a minimum boiling azeotrope with identical liquid and vapor compositions, boiling constantly at 78 °C.",
          },
          interactiveWidget: "AZEOTROPE_PHASE_DIAGRAM",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000000902",
    topicId: TOPIC_09_ID,
    type: "QUESTIONS",
    title: "Check Your Understanding: Azeotropes",
    description: "Solve board questions on constant boiling mixtures.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000000921",
        questionText: "Which type of deviation leads to the formation of a maximum boiling azeotrope?",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 1,
        hint: "Higher boiling point means lower vapor pressure.",
        explanation: "A maximum boiling azeotrope corresponds to a minimum in the vapor pressure curve, which is caused by large negative deviation from Raoult's law.",
        options: [
          { id: "e1000000-0000-0000-0000-000000000951", optionText: "Large negative deviation", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000000952", optionText: "Large positive deviation", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000000953", optionText: "Zero deviation (ideal)", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000000954", optionText: "Henry's law obedience", isCorrect: false, displayOrder: 4 },
        ],
      },
    ],
  },
];
