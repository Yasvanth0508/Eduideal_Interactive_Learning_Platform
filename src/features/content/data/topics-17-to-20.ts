import { ContentBlockWithDetails } from "../types";

export const TOPIC_17_ID = "e1000000-0000-0000-0000-000000000117";
export const TOPIC_18_ID = "e1000000-0000-0000-0000-000000000118";
export const TOPIC_19_ID = "e1000000-0000-0000-0000-000000000119";
export const TOPIC_20_ID = "e1000000-0000-0000-0000-000000000120";

// ============================================================================
// TOPIC 17: Abnormal Molar Mass
// ============================================================================
export const TOPIC_17_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000001701",
    topicId: TOPIC_17_ID,
    type: "THEORY",
    title: "Abnormal Molar Masses: Association and Dissociation",
    description: "Understand why experimentally determined molar masses diverge from expected values due to association or dissociation.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "Molar masses calculated from colligative properties assume that the solute behaves as a non-electrolyte and neither associates nor dissociates in solution. When this assumption is violated, the calculated molar mass is found to be either higher or lower than the expected value.",
      sections: [
        {
          id: "sec-abnormal-mass",
          badge: "DEVIATION FROM THEORETICAL MASS",
          heading: "Dissociation vs. Association Effects",
          paragraphs: [
            "Colligative properties are inversely proportional to the molar mass of the solute (Colligative Property ∝ 1 / M₂).",
            "Dissociation of Solute: When an electrolyte (like KCl, NaCl, CaCl₂) dissolves in water, it dissociates into two or more ions. The number of solute particles increases. Consequently, the observed colligative property is greater than expected, and the calculated molar mass is lower than the actual molecular weight (M_obs < M_normal).",
            "Association of Solute: When molecules associate (e.g. ethanoic acid or benzoic acid dimerizes in non-polar solvents like benzene), two or more molecules combine into a single giant particle. The number of solute particles decreases. Consequently, the observed colligative property is smaller, and the calculated molar mass is higher than normal (M_obs > M_normal).",
          ],
          bulletPoints: [
            "Dissociation: Particles increase → Colligative property increases → Observed Molar Mass decreases.",
            "Association: Particles decrease → Colligative property decreases → Observed Molar Mass increases.",
          ],
          keyTerms: [
            {
              term: "Abnormal Molar Mass",
              definition: "A molar mass value determined from colligative properties that deviates from the theoretical formula mass due to association or dissociation in solution.",
            },
          ],
          callout: {
            type: "ncert",
            title: "Board Question Alert",
            text: "Question: 'Why is the experimental molar mass of ethanoic acid in benzene found to be around 120 g/mol instead of 60 g/mol?' Answer: Ethanoic acid undergoes dimerization in benzene via two intermolecular hydrogen bonds, halving the particle count and doubling the calculated molar mass.",
          },
          interactiveWidget: "ASSOCIATION_DISSOCIATION_VISUALIZER",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000001702",
    topicId: TOPIC_17_ID,
    type: "QUESTIONS",
    title: "Check Your Understanding: Abnormal Molar Mass",
    description: "Reasoning questions on abnormal molar masses.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000001721",
        questionText: "When KCl is dissolved in water, the experimental molar mass obtained from freezing point depression is approximately:",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 1,
        hint: "KCl dissociates into K+ and Cl- ions.",
        explanation: "Since KCl dissociates into two ions (K⁺ and Cl⁻), the number of particles is doubled. Since molar mass is inversely proportional to freezing depression, the experimental molar mass is approximately half of normal (74.5 / 2 ≈ 37.25 g/mol).",
        options: [
          { id: "e1000000-0000-0000-0000-000000001751", optionText: "Half of its normal molar mass", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000001752", optionText: "Double its normal molar mass", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000001753", optionText: "Equal to its normal molar mass", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000001754", optionText: "Zero", isCorrect: false, displayOrder: 4 },
        ],
      },
    ],
  },
];

// ============================================================================
// TOPIC 18: Van 't Hoff Factor
// ============================================================================
export const TOPIC_18_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000001801",
    topicId: TOPIC_18_ID,
    type: "THEORY",
    title: "Van 't Hoff Factor (i) & Modified Colligative Equations",
    description: "Master the definition of i, degree of dissociation (α), degree of association, and modified colligative formulas.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "In 1880, J.H. van 't Hoff introduced the factor 'i' to quantify the extent of association or dissociation of a solute in solution.",
      sections: [
        {
          id: "sec-vant-hoff-factor",
          badge: "VAN 'T HOFF FACTOR (i)",
          heading: "Definitions & Quantitative Relations",
          paragraphs: [
            "The van 't Hoff factor (i) is defined as: i = (Normal molar mass) / (Abnormal molar mass) = (Observed colligative property) / (Calculated colligative property) = (Total moles of particles after association/dissociation) / (Total moles of particles before).",
            "For non-electrolytes (glucose, sucrose, urea): i = 1.",
            "For electrolytes undergoing dissociation: i > 1. Relation with degree of dissociation (α): i = 1 + (n - 1)α, where n is the number of ions formed per molecule. Thus: α = (i - 1) / (n - 1).",
            "For solutes undergoing association (dimerization, trimerization): i < 1. Relation with degree of association (α): i = 1 + (1/n - 1)α. For dimerization (n = 2): α = 2(1 - i).",
            "Modified Colligative Equations incorporating i:",
          ],
          bulletPoints: [
            "Relative Lowering of Vapour Pressure: (p₁° - p₁) / p₁° = i · x₂",
            "Elevation of Boiling Point: ΔT_b = i · K_b · m",
            "Depression of Freezing Point: ΔT_f = i · K_f · m",
            "Osmotic Pressure: Π = i · C · R · T",
          ],
          keyTerms: [
            {
              term: "Van 't Hoff Factor (i)",
              definition: "The ratio of the experimentally observed colligative value to the theoretical colligative value assuming no association/dissociation.",
            },
            {
              term: "Degree of Dissociation (α)",
              definition: "The fraction of total substance that undergoes dissociation into ions in solution: α = (i - 1) / (n - 1).",
            },
          ],
          callout: {
            type: "tip",
            title: "Board Exam Tip: Value of i",
            text: "For strong electrolytes at infinite dilution: NaCl (n=2, i=2), CaCl₂ (n=3, i=3), K₄[Fe(CN)₆] (n=5, i=5). For dimerization of acetic acid in benzene, i ≈ 0.5.",
          },
          interactiveWidget: "VANT_HOFF_CALCULATOR",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000001802",
    topicId: TOPIC_18_ID,
    type: "QUESTIONS",
    title: "Problems: Van 't Hoff Factor",
    description: "Calculate i, α, and colligative properties for electrolytic solutions.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000001821",
        questionText: "What is the expected value of the van 't Hoff factor (i) for complete dissociation of K₄[Fe(CN)₆]?",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 1,
        hint: "Count total ions: 4 K+ and 1 complex ion [Fe(CN)6]4-.",
        explanation: "K₄[Fe(CN)₆] dissociates into 4 K⁺ ions and 1 [Fe(CN)₆]⁴⁻ ion, totaling 5 ions per formula unit. For complete dissociation, i = 5.",
        options: [
          { id: "e1000000-0000-0000-0000-000000001851", optionText: "5", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000001852", optionText: "4", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000001853", optionText: "1", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000001854", optionText: "6", isCorrect: false, displayOrder: 4 },
        ],
      },
    ],
  },
];

// ============================================================================
// TOPIC 19: Applications of Colligative Properties
// ============================================================================
export const TOPIC_19_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000001901",
    topicId: TOPIC_19_ID,
    type: "THEORY",
    title: "Practical & Industrial Applications of Colligative Properties",
    description: "Antifreeze solutions, de-icing of roadways, intravenous fluids, and food preservation.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "Colligative properties play profound roles across engineering, medicine, and food technology. From preventing car radiators from freezing in winter to maintaining cellular integrity during medical infusions, understanding colligative phenomena is vital.",
      sections: [
        {
          id: "sec-applications",
          badge: "REAL-WORLD CHEMISTRY",
          heading: "Core Industrial & Medical Applications",
          paragraphs: [
            "1. Radiator Antifreeze: Adding 35% (v/v) ethylene glycol to car cooling systems lowers the freezing point of water to 255.4 K (-17.6 °C), protecting car engines in sub-zero winter temperatures, while simultaneously elevating the boiling point to 106 °C for summer protection.",
            "2. De-icing Highways: Sprinkling salts (NaCl or CaCl₂) on frozen roads depresses the freezing point of ice below ambient temperature, causing it to melt. CaCl₂ is more potent because it produces 3 ions (i ≈ 3) and dissolves exothermically.",
            "3. Food Preservation: Salting meats and pickles, or adding high sugar concentrations to jams and jellies, exerts strong osmotic pressure. Microbial cells lose water via exoosmosis, undergo plasmolysis, and are neutralized without synthetic preservatives.",
            "4. Intravenous Injections: Intravenous fluids must be isotonic with blood plasma (0.9% m/v NaCl). Hypotonic solutions cause hemolysis (bursting of RBCs), while hypertonic solutions cause crenation (shrinking of RBCs).",
          ],
          bulletPoints: [
            "Ethylene glycol: Dual antifreeze / antiboil additive.",
            "CaCl₂ vs NaCl: Higher 'i' and exothermic ΔH make CaCl₂ superior for severe freezes.",
            "Normal saline: 0.9% (m/v) NaCl keeps RBC membrane intact.",
          ],
          keyTerms: [
            {
              term: "Antifreeze",
              definition: "A substance (such as ethylene glycol) added to water to lower its freezing point and prevent solidification in cold engines.",
            },
            {
              term: "Plasmolysis",
              definition: "The shrinkage of cellular protoplasm away from the cell wall due to exoosmosis when placed in a hypertonic environment.",
            },
          ],
          callout: {
            type: "ncert",
            title: "Board Favorite Question",
            text: "Explain why salt is applied to raw mangoes while preparing pickles. Answer: The hypertonic salt environment causes exoosmosis of water from mango cells and kills bacteria by plasmolysis, preserving the pickle.",
          },
          interactiveWidget: "COLLIGATIVE_APPLICATIONS_SHOWCASE",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000001902",
    topicId: TOPIC_19_ID,
    type: "QUESTIONS",
    title: "Board Application Questions",
    description: "Reasoning and conceptual questions on practical colligative phenomena.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000001921",
        questionText: "Why is calcium chloride (CaCl₂) more effective than sodium chloride (NaCl) in clearing snow from roads at sub-zero temperatures?",
        questionType: "SHORT_ANSWER",
        difficulty: "MEDIUM",
        marks: 2,
        displayOrder: 1,
        hint: "Consider the van 't Hoff factor and the enthalpy of dissolution.",
        expectedAnswer: "CaCl₂ produces 3 ions (i ≈ 3) compared to 2 ions for NaCl, producing greater freezing point depression; its dissolution is also exothermic.",
        explanation: "1 mole of CaCl₂ furnishes 3 moles of ions (i ≈ 3), producing a 1.5× greater depression in freezing point than NaCl (i ≈ 2). Additionally, dissolution of CaCl₂ is exothermic, supplying heat to accelerate ice melting down to -29 °C.",
      },
    ],
  },
];

// ============================================================================
// TOPIC 20: Numerical Practice
// ============================================================================
export const TOPIC_20_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000002001",
    topicId: TOPIC_20_ID,
    type: "THEORY",
    title: "Comprehensive NCERT Board Numerical Workbench",
    description: "Step-by-step problem-solving strategy for all formulas in CBSE Class 12 Solutions.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "Numericals constitute roughly 40-50% of the weightage from the Solutions chapter in the CBSE Board examination. Mastering the systematic sequence — identifying given quantities, selecting the governing formula, verifying units, and applying van 't Hoff corrections — guarantees full marks.",
      sections: [
        {
          id: "sec-master-strategy",
          badge: "BOARD PROBLEM-SOLVING PROTOCOL",
          heading: "Step-by-Step Strategy & Formula Quick-Sheet",
          paragraphs: [
            "Follow this 4-step framework for every numerical:",
            "1. List all given values with SI/metric units (convert volumes to liters, temperatures to Kelvin, masses to kilograms where required).",
            "2. Check electrolyte status: If the solute is an electrolyte (NaCl, CaCl₂, etc.), ALWAYS incorporate the van 't Hoff factor 'i'.",
            "3. Rearrange the formula algebraically for the unknown variable before plugging in numbers.",
            "4. Calculate carefully, retain correct significant figures, and append the appropriate physical unit.",
          ],
          bulletPoints: [
            "Molality: m = (w₂ / M₂) × (1000 / w₁)",
            "Henry's Law: p = K_H · x",
            "Raoult's Law: P_total = p_A° + (p_B° - p_A°) · x_B",
            "RLVP: (p₁° - p₁) / p₁° = i · (w₂ · M₁) / (M₂ · w₁)",
            "Boiling Elevation: ΔT_b = i · K_b · m",
            "Freezing Depression: ΔT_f = i · K_f · m",
            "Osmotic Pressure: Π = i · (w₂ · R · T) / (M₂ · V)",
            "Degree of Dissociation: α = (i - 1) / (n - 1)",
          ],
          keyTerms: [
            {
              term: "Unit Homogeneity",
              definition: "Ensuring all terms in an equation share consistent unit dimensions (e.g. pressure in bar when R = 0.083 L bar K⁻¹ mol⁻¹).",
            },
          ],
          callout: {
            type: "tip",
            title: "Crucial Gas Constant Units (R)",
            text: "When calculating osmotic pressure (Π): If Π is in atm, use R = 0.0821 L atm K⁻¹ mol⁻¹. If Π is in bar, use R = 0.083 L bar K⁻¹ mol⁻¹. If using SI units (Pa, m³), use R = 8.314 J K⁻¹ mol⁻¹.",
          },
          interactiveWidget: "NUMERICAL_PRACTICE_WORKBENCH",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000002002",
    topicId: TOPIC_20_ID,
    type: "QUESTIONS",
    title: "Mastery Numerical Test: Full Chapter Solutions",
    description: "Complete NCERT board-style numerical evaluation.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000002021",
        questionText: "Calculate the mass of ascorbic acid (Vitamin C, C₆H₈O₆, Molar mass = 176 g/mol) to be dissolved in 75 g of acetic acid to lower its melting point by 1.5 K. (K_f for acetic acid = 3.9 K kg mol⁻¹).",
        questionType: "SHORT_ANSWER",
        difficulty: "HARD",
        marks: 3,
        displayOrder: 1,
        hint: "Use ΔT_f = (1000 × K_f × w₂) / (M₂ × w₁). Rearrange for w₂.",
        expectedAnswer: "5.08 g",
        explanation: "w₂ = (ΔT_f × M₂ × w₁) / (1000 × K_f) = (1.5 × 176 × 75) / (1000 × 3.9) = 19800 / 3900 = 5.077 g ≈ 5.08 g.",
      },
    ],
  },
];
