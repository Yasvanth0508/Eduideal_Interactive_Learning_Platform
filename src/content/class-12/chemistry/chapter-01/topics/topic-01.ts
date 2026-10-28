import { TopicContent } from "@/types/content";

export const topic01Content: TopicContent = {
  metadata: {
    id: "chem-c01-t01",
    chapterId: "chem-c01",
    subjectId: "chemistry",
    slug: "colligative-properties",
    title: "Colligative Properties & Elevation of Boiling Point",
    order: 1,
    description:
      "Explore binary solutions, solvent-solute interactions, 3D molecular solvation, and boiling point elevation with interactive calculators.",
    estimatedMinutes: 20,
  },
  blocks: [
    // 1. Summary / Theory Block
    {
      id: "chem-c01-t01-b01",
      type: "THEORY",
      displayOrder: 1,
      title: "Introduction to Solutions & Colligative Phenomena",
      description:
        "Fundamental principles of binary solutions, concentration measures, and solvent-solute dynamics.",
      data: {
        introduction:
          "A solution is a homogeneous mixture of two or more chemically non-reacting substances whose composition can vary within certain limits. In a binary solution, the component present in larger quantity is the solvent, while the component present in smaller quantity is the solute.",
        sections: [
          {
            id: "sec-overview",
            badge: "FUNDAMENTALS",
            heading: "1. Types of Binary Solutions and Concentration Terms",
            paragraphs: [
              "Binary solutions are categorized by the physical states of solute and solvent. Liquid solutions (solid in liquid, gas in liquid, and liquid in liquid) form the basis of CBSE Class 12 physical chemistry.",
              "Concentration expressions quantify solute-to-solvent proportions: Molarity (M, moles per liter of solution) is temperature-dependent due to volumetric expansion, whereas Molality (m, moles per kilogram of solvent) is strictly independent of temperature.",
            ],
            bulletPoints: [
              "Molarity (M): moles of solute / volume of solution in liters (temperature-dependent)",
              "Molality (m): moles of solute / mass of solvent in kilograms (temperature-independent)",
              "Mole Fraction (χ): ratio of moles of a component to total moles in solution",
            ],
            keyTerms: [
              {
                term: "Solvent",
                definition:
                  "The component of a solution determining its physical state and present in the greatest quantity.",
              },
              {
                term: "Solute",
                definition:
                  "The dissolved substance present in lesser quantity in the solvent.",
              },
              {
                term: "Colligative Property",
                definition:
                  "A physical property that depends solely on the number of solute particles present, not their chemical nature.",
              },
            ],
            callout: {
              type: "ncert",
              title: "NCERT Key Concept: Why Molality is Preferred Over Molarity",
              text: "Molality is independent of temperature because it is based on masses of components rather than volumes. Since mass is unaffected by thermal expansion, temperature variations do not alter the molality of a solution.",
            },
          },
        ],
      },
    },

    // 2. 3D Model Block
    {
      id: "chem-c01-t01-b02",
      type: "THREE_D",
      displayOrder: 2,
      title: "3D Interactive Solvation Shell & Molecular Hydration",
      description:
        "Explore how polar solvent molecules orient their dipoles around solute ions in an aqueous solution.",
      data: {
        modelId: "solution-molecules",
        title: "Molecular Solute-Solvent Interaction",
        subtitle:
          "Cation (purple) & Anion (green) stabilized by polar solvent water dipoles (red oxygen + white hydrogens)",
        badge: "3D MOLECULAR SIMULATION",
        cameraPosition: [0, 2, 6],
        config: {
          moleculeType: "NaCl_in_H2O",
          soluteParticles: 2,
          solventMolecules: 8,
        },
      },
    },

    // 3. One Image from Web Block
    {
      id: "chem-c01-t01-b03",
      type: "IMAGE",
      displayOrder: 3,
      title: "Experimental Determination of Solution Concentrations",
      description:
        "Laboratory apparatus and volumetric measurement of homogeneous chemical solutions.",
      data: {
        url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
        altText:
          "Laboratory glassware and beaker showing precise chemical solution measurement and thermal analysis.",
        caption:
          "Figure 1.1: Precise measurement of solute concentrations and colligative thermal shifts in the chemistry laboratory.",
        aspectRatio: "16/9",
      },
    },

    // 4. Formula Calculator Block
    {
      id: "chem-c01-t01-b04",
      type: "FORMULA",
      displayOrder: 4,
      title: "Boiling Point Elevation (ΔTb) Interactive Calculator",
      description:
        "Calculate the increase in boiling point ΔTb = i × Kb × m for dilute solutions with non-volatile solutes.",
      data: {
        id: "calc-boiling-point",
        formulaName: "Boiling Point Elevation (Ebullioscopy)",
        formulaExpression: "ΔTb = i × Kb × m",
        resultUnit: "K",
        description:
          "Elevation in boiling point is directly proportional to the molality (m) of the solute particles in the solvent.",
        variables: [
          {
            id: "var-i",
            symbol: "i",
            label: "Van 't Hoff Factor (i)",
            unit: "",
            defaultValue: 1.0,
            minValue: 1.0,
            maxValue: 4.0,
            step: 0.1,
            description:
              "Number of particles into which solute dissociates (1 for glucose/urea, 2 for NaCl).",
          },
          {
            id: "var-kb",
            symbol: "Kb",
            label: "Ebullioscopic Constant (Kb)",
            unit: "K·kg/mol",
            defaultValue: 0.512,
            minValue: 0.1,
            maxValue: 5.0,
            step: 0.001,
            description:
              "Molal boiling point elevation constant of the solvent (0.512 for water, 2.53 for benzene).",
          },
          {
            id: "var-m",
            symbol: "m",
            label: "Molality (m)",
            unit: "mol/kg",
            defaultValue: 1.5,
            minValue: 0.1,
            maxValue: 10.0,
            step: 0.1,
            description: "Moles of solute dissolved per 1 kg of pure solvent.",
          },
        ],
      },
    },

    // 5. Summary Review Block
    {
      id: "chem-c01-t01-b05",
      type: "THEORY",
      displayOrder: 5,
      title: "Summary & Key Exam Formulas",
      description:
        "Essential formulas, common calculation pitfalls, and quick reference for board examinations.",
      data: {
        introduction:
          "Here is a concise summary of the colligative property formulas and conceptual rules required for CBSE Class 12 Chemistry examination mastery.",
        sections: [
          {
            id: "sec-formula-summary",
            badge: "EXAM REVISION",
            heading: "2. Master Formula Reference Table",
            paragraphs: [
              "When a non-volatile solute is dissolved in a solvent, the vapor pressure of the solution decreases, causing the boiling point to rise and the freezing point to fall.",
              "All four colligative properties are interlinked by the number of moles of solute particles present in the solution.",
            ],
            bulletPoints: [
              "Relative Lowering of Vapor Pressure: (P°₁ - P₁) / P°₁ = x₂ = n₂ / (n₁ + n₂)",
              "Boiling Point Elevation: ΔTb = i × Kb × m  where Tb = T°b + ΔTb",
              "Freezing Point Depression: ΔTf = i × Kf × m  where Tf = T°f - ΔTf",
              "Osmotic Pressure: Π = i × C × R × T = i × (n₂ / V) × R × T",
            ],
            callout: {
              type: "tip",
              title: "Exam Tip: Association vs Dissociation",
              text: "Always check if the solute dissociates or associates! For electrolytes like NaCl (i = 2) or BaCl₂ (i = 3), failure to include the Van 't Hoff factor (i) will result in incorrect numerical solutions.",
            },
          },
        ],
      },
    },

    // 6. Questions Block
    {
      id: "chem-c01-t01-b06",
      type: "QUESTIONS",
      displayOrder: 6,
      title: "Concept Check & Practice Questions",
      description:
        "Test your understanding of solutions, Raoult's law, and boiling point elevation with instant feedback.",
      data: {
        questions: [
          {
            id: "q01",
            questionText:
              "Which of the following properties is NOT a colligative property of a solution?",
            questionType: "MCQ",
            difficulty: "EASY",
            marks: 1,
            displayOrder: 1,
            explanation:
              "Colligative properties depend strictly on the ratio of the number of solute particles to the number of solvent molecules in a solution, not on the identity of the solute. Relative lowering of vapor pressure, boiling point elevation, freezing point depression, and osmotic pressure are the four colligative properties. Optical activity depends on the molecular symmetry and identity of the substance, making it a constitutive property.",
            options: [
              {
                id: "q01-opt-a",
                optionText: "Relative lowering of vapor pressure",
                isCorrect: false,
                displayOrder: 1,
              },
              {
                id: "q01-opt-b",
                optionText: "Elevation in boiling point",
                isCorrect: false,
                displayOrder: 2,
              },
              {
                id: "q01-opt-c",
                optionText: "Optical activity of the solution",
                isCorrect: true,
                displayOrder: 3,
              },
              {
                id: "q01-opt-d",
                optionText: "Osmotic pressure",
                isCorrect: false,
                displayOrder: 4,
              },
            ],
          },
          {
            id: "q02",
            questionText:
              "A 1.0 mol/kg aqueous solution of glucose (non-electrolyte, i = 1) is prepared. If Kb for water is 0.512 K·kg/mol and the normal boiling point of water is 373.15 K, what is the boiling point of this solution?",
            questionType: "MCQ",
            difficulty: "MEDIUM",
            marks: 2,
            displayOrder: 2,
            explanation:
              "Using ΔTb = i × Kb × m: with i = 1 (glucose does not dissociate), Kb = 0.512 K·kg/mol, and m = 1.0 mol/kg, we find ΔTb = 1 × 0.512 × 1.0 = 0.512 K. The boiling point of the solution is Tb = T°b + ΔTb = 373.15 K + 0.512 K = 373.662 K ≈ 373.66 K.",
            options: [
              {
                id: "q02-opt-a",
                optionText: "372.64 K",
                isCorrect: false,
                displayOrder: 1,
              },
              {
                id: "q02-opt-b",
                optionText: "373.15 K",
                isCorrect: false,
                displayOrder: 2,
              },
              {
                id: "q02-opt-c",
                optionText: "373.66 K",
                isCorrect: true,
                displayOrder: 3,
              },
              {
                id: "q02-opt-d",
                optionText: "374.17 K",
                isCorrect: false,
                displayOrder: 4,
              },
            ],
          },
        ],
      },
    },
  ],
};
