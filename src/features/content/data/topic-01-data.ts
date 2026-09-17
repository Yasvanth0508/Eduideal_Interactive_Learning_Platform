import { ContentBlockWithDetails } from "../types";

export const TOPIC_01_ID = "e1000000-0000-0000-0000-000000000101";

export const TOPIC_01_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  // ----------------------------------------------------
  // BLOCK 1: What is a Solution & Particle Homogeneity
  // ----------------------------------------------------
  {
    id: "cb100000-0000-0000-0000-000000000101",
    topicId: TOPIC_01_ID,
    type: "THEORY",
    title: "1. What is a Solution? (Homogeneous Mixtures)",
    description:
      "Understand the foundational definition, homogeneous nature, and particle-level criteria of true solutions.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "In everyday life, we rarely come across chemically pure substances. Most matter around us consists of mixtures — brass, saline water, aerated beverages, and even the air we breathe are all mixtures. Among these, solutions form the most fundamental class.",
      sections: [
        {
          id: "sec-def",
          badge: "FUNDAMENTAL DEFINITION",
          heading: "Definition of a Solution",
          paragraphs: [
            "A solution is defined as a homogeneous mixture of two or more chemically non-reacting substances whose composition can be varied within certain limits.",
            "By homogeneous, we mean that its composition and chemical/physical properties are completely uniform throughout the entire bulk of the mixture. Whether you sample the mixture from the top, center, or bottom of the container, the constituent ratio remains identical.",
          ],
          bulletPoints: [
            "Molecular Dispersal: Solute particles dissolve and disperse at the molecular or ionic level.",
            "Particle Size: Solute particles have diameters smaller than 1 nanometer (1 nm = 10⁻⁹ m or 10 Å).",
            "Single Phase: A true solution exists as a single thermodynamic phase (it has no visible boundaries of separation).",
          ],
          keyTerms: [
            {
              term: "Homogeneous Mixture",
              definition:
                "A mixture possessing uniform composition and properties throughout, with no observable phase boundaries.",
            },
            {
              term: "True Solution",
              definition:
                "A solution where solute particles are dispersed at atomic or molecular dimensions (< 1 nm), preventing scattering of light.",
            },
          ],
          callout: {
            type: "ncert",
            title: "NCERT Curriculum Focus",
            text: "Because particles in a true solution are smaller than 1 nm, they do not scatter visible light (no Tyndall effect), cannot be observed under an optical microscope, and do not settle down under gravity upon standing.",
          },
          interactiveWidget: "PARTICLE_SIMULATOR",
        },
      ],
    },
  },

  // ----------------------------------------------------
  // BLOCK 2: Components of a Solution (Solute vs Solvent)
  // ----------------------------------------------------
  {
    id: "cb100000-0000-0000-0000-000000000102",
    topicId: TOPIC_01_ID,
    type: "THEORY",
    title: "2. Components of a Solution: Solute vs. Solvent",
    description:
      "Learn the rules for distinguishing solute and solvent, and understand binary, ternary, and quaternary solutions.",
    displayOrder: 2,
    isPublished: true,
    content: {
      introduction:
        "Solutions are classified by the number of components they contain. In CBSE Class 12 Chemistry, we deal almost exclusively with binary solutions.",
      sections: [
        {
          id: "sec-components",
          badge: "CLASSIFICATION BY COMPONENTS",
          heading: "Binary, Ternary & Quaternary Solutions",
          paragraphs: [
            "• Binary Solution: Composed of exactly two components (1 solute + 1 solvent). Example: Salt in water.",
            "• Ternary Solution: Composed of three components. Example: Salt + Sugar in water.",
            "• Quaternary Solution: Composed of four components. Example: Salt + Sugar + Lemon juice in water.",
          ],
        },
        {
          id: "sec-rules",
          badge: "SOLUTE VS. SOLVENT RULES",
          heading: "How to Identify Solute and Solvent",
          paragraphs: [
            "In a binary solution, the two components are designated as the solvent and the solute according to two scientific principles:",
          ],
          bulletPoints: [
            "Rule 1 (Physical State Rule): The component that has the same physical state as the resulting solution is the solvent. For example, when solid sugar dissolves in liquid water, the resulting syrup is liquid; therefore, water is the solvent.",
            "Rule 2 (Relative Amount Rule): If both components share the same physical state (e.g. liquid + liquid), the component present in the largest quantity (by moles or mass) is designated as the solvent. The other component is the solute.",
          ],
          keyTerms: [
            {
              term: "Solvent",
              definition:
                "The component of the solution that is present in the largest quantity and determines the physical state in which the solution exists.",
            },
            {
              term: "Solute",
              definition:
                "One or more components present in the solution in lesser quantities than the solvent.",
            },
          ],
          callout: {
            type: "warning",
            title: "Classic CBSE Exam Trick",
            text: "In a 20% ethanol solution in water, Ethanol is the Solute (20 mL) and Water is the Solvent (80 mL). However, in an 80% ethanol solution, Ethanol is the Solvent (80 mL) and Water is the Solute (20 mL)!",
          },
          interactiveWidget: "SOLUTE_SOLVENT_EXPLORER",
        },
      ],
    },
  },

  // ----------------------------------------------------
  // BLOCK 3: True Solution vs Colloid vs Suspension
  // ----------------------------------------------------
  {
    id: "cb100000-0000-0000-0000-000000000103",
    topicId: TOPIC_01_ID,
    type: "THEORY",
    title: "3. Comparison: True Solution vs. Colloid vs. Suspension",
    description:
      "Clarify the fundamental physical distinctions in particle size, stability, filtration, and optical behavior.",
    displayOrder: 3,
    isPublished: true,
    content: {
      introduction:
        "Dispersed systems in chemistry are categorized based on the diameter of the dispersed particles into true solutions, colloidal solutions, and coarse suspensions.",
      sections: [
        {
          id: "sec-dispersion",
          badge: "COMPARATIVE ANALYSIS",
          heading: "Particle Dimensions and Physical Behavior",
          paragraphs: [
            "The physical behavior of a mixture depends critically on particle size. While true solutions are molecularly dispersed, colloids and suspensions contain aggregates of thousands of atoms or molecules.",
          ],
          interactiveWidget: "SOLUTION_COLLOID_SUSPENSION_COMPARISON",
          callout: {
            type: "tip",
            title: "Key Board Takeaway",
            text: "Only true solutions are thermodynamically stable single-phase systems where particles never settle under gravity and cannot be separated even by fine ultra-filtration membranes.",
          },
        },
      ],
    },
  },

  // ----------------------------------------------------
  // BLOCK 4: The 9 Types of Binary Solutions (NCERT 1.1)
  // ----------------------------------------------------
  {
    id: "cb100000-0000-0000-0000-000000000104",
    topicId: TOPIC_01_ID,
    type: "THEORY",
    title: "4. The 9 Types of Binary Solutions",
    description:
      "Explore the 9 possible combinations of solute and solvent across Solid, Liquid, and Gaseous states.",
    displayOrder: 4,
    isPublished: true,
    content: {
      introduction:
        "Depending upon whether the solvent is a gas, a liquid, or a solid, binary solutions are categorized into three broad classes: Gaseous solutions, Liquid solutions, and Solid solutions. Since the solute can also be in any of the 3 states of matter, there are 9 distinct types.",
      sections: [
        {
          id: "sec-types-matrix",
          badge: "NCERT TABLE 1.1",
          heading: "Binary Solution Classification Matrix",
          paragraphs: [
            "Review each type below. Notice that the physical state of the solvent dictates the overarching classification of the solution.",
          ],
          interactiveWidget: "TYPES_OF_SOLUTIONS_MATRIX",
          callout: {
            type: "ncert",
            title: "Frequently Tested NCERT Examples",
            text: "CBSE board papers regularly ask for specific examples: (1) Gas in Solid: Solution of Hydrogen in Palladium, (2) Liquid in Solid: Amalgam of Mercury with Sodium, (3) Solid in Gas: Camphor in Nitrogen gas.",
          },
        },
      ],
    },
  },

  // ----------------------------------------------------
  // BLOCK 5: Quick Practice (Questions)
  // ----------------------------------------------------
  {
    id: "cb100000-0000-0000-0000-000000000105",
    topicId: TOPIC_01_ID,
    type: "QUESTIONS",
    title: "5. Quick Practice & Self-Assessment",
    description:
      "Test your understanding with CBSE-aligned multiple choice, component identification, and conceptual questions.",
    displayOrder: 5,
    isPublished: true,
    content: null,
    questions: [
      // 3 MCQs
      {
        id: "e1000000-0000-0000-0000-000000000201",
        questionText:
          "Which of the following is an example of a solid solution in which the solute is a gas?",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 1,
        explanation:
          "In a solution of hydrogen in palladium, hydrogen gas (H₂) is adsorbed/occluded inside the crystal lattice of solid palladium (Pd). Here, the solute is a gas and the solvent is a solid.",
        options: [
          {
            id: "e1000000-0000-0000-0000-000000000301",
            optionText: "Camphor in nitrogen gas",
            isCorrect: false,
            displayOrder: 1,
          },
          {
            id: "e1000000-0000-0000-0000-000000000302",
            optionText: "Solution of hydrogen in palladium",
            isCorrect: true,
            displayOrder: 2,
          },
          {
            id: "e1000000-0000-0000-0000-000000000303",
            optionText: "Chloroform mixed with nitrogen gas",
            isCorrect: false,
            displayOrder: 3,
          },
          {
            id: "e1000000-0000-0000-0000-000000000304",
            optionText: "Amalgam of mercury with sodium",
            isCorrect: false,
            displayOrder: 4,
          },
        ],
      },
      {
        id: "e1000000-0000-0000-0000-000000000202",
        questionText:
          "If a mixture is prepared by mixing 75 mL of pure ethanol with 25 mL of pure water, which component acts as the solvent?",
        questionType: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        displayOrder: 2,
        explanation:
          "When both components share the same physical state (both are liquids), the component present in the largest quantity acts as the solvent. Here, ethanol constitutes 75% of the mixture, so ethanol is the solvent and water is the solute.",
        options: [
          {
            id: "e1000000-0000-0000-0000-000000000305",
            optionText: "Water, because water is always the universal solvent",
            isCorrect: false,
            displayOrder: 1,
          },
          {
            id: "e1000000-0000-0000-0000-000000000306",
            optionText: "Ethanol, because it is present in the larger volume",
            isCorrect: true,
            displayOrder: 2,
          },
          {
            id: "e1000000-0000-0000-0000-000000000307",
            optionText: "Both act as solvents simultaneously",
            isCorrect: false,
            displayOrder: 3,
          },
          {
            id: "e1000000-0000-0000-0000-000000000308",
            optionText: "Neither, because they form an azeotrope",
            isCorrect: false,
            displayOrder: 4,
          },
        ],
      },
      {
        id: "e1000000-0000-0000-0000-000000000203",
        questionText:
          "What is the maximum particle diameter for a dispersed substance to be classified as a true solution?",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 3,
        explanation:
          "In a true solution, solute particles are dispersed at atomic or molecular levels with diameters less than 1 nm (10⁻⁹ m or 10 Å). Particles between 1 nm and 1000 nm form colloids, and particles > 1000 nm form suspensions.",
        options: [
          {
            id: "e1000000-0000-0000-0000-000000000309",
            optionText: "Less than 1 nm (10⁻⁹ m)",
            isCorrect: true,
            displayOrder: 1,
          },
          {
            id: "e1000000-0000-0000-0000-000000000310",
            optionText: "Between 1 nm and 1000 nm",
            isCorrect: false,
            displayOrder: 2,
          },
          {
            id: "e1000000-0000-0000-0000-000000000311",
            optionText: "Greater than 1000 nm",
            isCorrect: false,
            displayOrder: 3,
          },
          {
            id: "e1000000-0000-0000-0000-000000000312",
            optionText: "Greater than 1 μm",
            isCorrect: false,
            displayOrder: 4,
          },
        ],
      },
      // 2 Identification Questions
      {
        id: "e1000000-0000-0000-0000-000000000204",
        questionText:
          "Component Identification: In Tincture of Iodine (used as a common antiseptic), identify the solute and the solvent.",
        questionType: "SHORT_ANSWER",
        difficulty: "MEDIUM",
        marks: 2,
        displayOrder: 4,
        hint: "Tincture of iodine is a 2–3% solution.",
        expectedAnswer: "Solute: Iodine (I₂, solid); Solvent: Alcohol / Ethanol (liquid).",
        explanation:
          "Tincture of iodine contains 2–3% elemental iodine (I₂) dissolved in an alcohol-water mixture. Since iodine is dissolved in a much larger volume of alcohol, Iodine is the solid Solute and Ethyl Alcohol is the liquid Solvent.",
      },
      {
        id: "e1000000-0000-0000-0000-000000000205",
        questionText:
          "Type & Phase Identification: Identify the physical state of the solute and the solvent in Dental Amalgam (or Sodium Amalgam).",
        questionType: "SHORT_ANSWER",
        difficulty: "MEDIUM",
        marks: 2,
        displayOrder: 5,
        hint: "Mercury is liquid at room temperature while sodium/silver is solid.",
        expectedAnswer: "Solute: Mercury (Liquid); Solvent: Sodium or Silver (Solid). Type: Liquid in Solid solution.",
        explanation:
          "An amalgam is formed by dissolving liquid mercury (Hg) into a solid metal matrix such as sodium (Na) or silver (Ag). Because the solid metal is present in larger amount and determines the solid state of the amalgam, Mercury is the liquid Solute and Sodium/Silver is the solid Solvent.",
      },
      // 1 Conceptual Question
      {
        id: "e1000000-0000-0000-0000-000000000206",
        questionText:
          "Conceptual Reasoning: Why is an alloy such as Brass (approx. 30% Zn in 70% Cu) classified as a solution, even though both components are solid and cannot be separated by physical filtration?",
        questionType: "SHORT_ANSWER",
        difficulty: "HARD",
        marks: 3,
        displayOrder: 6,
        hint: "Recall the two conditions in the definition of a solution: homogeneity and variable composition.",
        expectedAnswer:
          "Brass is homogeneous at the atomic level, retains the chemical properties of Cu and Zn, and its composition can be varied continuously within limits.",
        explanation:
          "Brass qualifies as a true solid solution because:\n1. Atomic Homogeneity: Zinc atoms substitute uniformly for copper atoms in the face-centered cubic crystal lattice, resulting in uniform properties throughout.\n2. Retained Identity: Zinc and copper do not form a fixed stoichiometric chemical compound; each constituent retains its individual properties.\n3. Variable Composition: The ratio of zinc in copper can be adjusted within limits (e.g. 20% to 40% Zn) to produce different grades of brass, fulfilling the precise definition of a solution.",
      },
    ],
  },
];
