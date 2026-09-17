import { ContentBlockWithDetails } from "../types";

export const TOPIC_02_ID = "e1000000-0000-0000-0000-000000000102";
export const TOPIC_03_ID = "e1000000-0000-0000-0000-000000000103";
export const TOPIC_04_ID = "e1000000-0000-0000-0000-000000000104";
export const TOPIC_05_ID = "e1000000-0000-0000-0000-000000000105";

// ============================================================================
// TOPIC 02: Types of Solutions
// ============================================================================
export const TOPIC_02_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000000201",
    topicId: TOPIC_02_ID,
    type: "THEORY",
    title: "Classification & Nine Binary Types of Solutions",
    description: "Explore the 9 combinations of binary solutions based on the physical state of solute and solvent.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "Solutions can exist in gaseous, liquid, or solid states. Depending on whether the solute and solvent are gas, liquid, or solid, exactly nine types of binary solutions are possible.",
      sections: [
        {
          id: "sec-nine-types",
          badge: "NCERT TAXONOMY",
          heading: "The Nine Types of Binary Solutions",
          paragraphs: [
            "The physical state of the solvent determines whether the resulting solution is a gaseous solution, liquid solution, or solid solution.",
            "In solid solutions, solute atoms or molecules either occupy interstitial spaces in the crystal lattice or substitute for solvent atoms in substitutional alloys.",
          ],
          bulletPoints: [
            "Gaseous Solutions: Gas in Gas (Air, O₂ + N₂), Liquid in Gas (Chloroform mixed with nitrogen gas), Solid in Gas (Camphor in nitrogen gas).",
            "Liquid Solutions: Gas in Liquid (CO₂ in soda, O₂ in water), Liquid in Liquid (Ethanol dissolved in water), Solid in Liquid (Glucose in water).",
            "Solid Solutions: Gas in Solid (H₂ absorbed in Palladium), Liquid in Solid (Amalgam of mercury with sodium), Solid in Solid (Copper dissolved in gold / Brass).",
          ],
          keyTerms: [
            {
              term: "Substitutional Solid Solution",
              definition: "A solid solution where solute atoms displace and occupy lattice sites of solvent atoms (e.g., brass Cu-Zn).",
            },
            {
              term: "Interstitial Solid Solution",
              definition: "A solid solution where small solute atoms fit into interstitial voids between larger solvent atoms (e.g., carbon in iron).",
            },
          ],
          callout: {
            type: "ncert",
            title: "NCERT Board Question Alert",
            text: "Frequently asked: Give one example of a solution of liquid in solid (Sodium amalgam) and gas in solid (Hydrogen adsorbed on palladium).",
          },
          interactiveWidget: "TYPES_OF_SOLUTIONS_MATRIX",
        },
        {
          id: "sec-3d-brass",
          badge: "3D SOLID SOLUTION",
          heading: "3D Substitutional Alloy Lattice (Brass)",
          paragraphs: [
            "In solid solutions, solute particles fit directly into the crystal structure of the solvent.",
            "Brass is a substitutional solid solution where Zinc atoms (solute) replace Copper atoms (solvent) at random positions in the Face-Centered Cubic (FCC) metallic lattice.",
          ],
          callout: {
            type: "info",
            title: "Atomic Packing Criterion",
            text: "Solute and solvent atoms must have similar atomic radii (within 15%, Hume-Rothery rule) to form a substitutional solid solution without distorting the crystal lattice.",
          },
          interactiveWidget: "BRASS_LATTICE_3D",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000000202",
    topicId: TOPIC_02_ID,
    type: "QUESTIONS",
    title: "Check Your Understanding: Types of Solutions",
    description: "Practice CBSE board-level questions on solution classification.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000000221",
        questionText: "Which of the following is an example of a 'Solid in Gas' solution?",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 1,
        hint: "Think of sublimable solids dispersing in atmospheric gases.",
        explanation: "Camphor vapors dispersed in nitrogen gas represent a solid solute uniformly distributed in a gaseous solvent.",
        options: [
          { id: "e1000000-0000-0000-0000-000000000251", optionText: "Camphor in nitrogen gas", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000000252", optionText: "Chloroform in nitrogen gas", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000000253", optionText: "Humidity in air", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000000254", optionText: "Dust storm in desert", isCorrect: false, displayOrder: 4 },
        ],
      },
      {
        id: "e1000000-0000-0000-0000-000000000222",
        questionText: "In dental amalgam, what are the physical states of the solute and the solvent?",
        questionType: "SHORT_ANSWER",
        difficulty: "MEDIUM",
        marks: 2,
        displayOrder: 2,
        hint: "Mercury is liquid at room temperature; silver/tin is solid.",
        expectedAnswer: "Solute: Liquid (Mercury, Hg); Solvent: Solid (Silver, Tin or Sodium).",
        explanation: "Dental amalgam is classified as a Liquid in Solid solution. The liquid mercury dissolves into the solid metal powder matrix.",
      },
    ],
  },
];

// ============================================================================
// TOPIC 03: Concentration of Solutions
// ============================================================================
export const TOPIC_03_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000000301",
    topicId: TOPIC_03_ID,
    type: "THEORY",
    title: "Expressing Concentration of Solutions",
    description: "Master mass percentage, volume percentage, ppm, mole fraction, molarity, and molality, and their temperature dependence.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "Concentration expresses the relative amount of solute present in a given quantity of solution or solvent. Choosing the correct unit is vital for quantitative stoichiometry.",
      sections: [
        {
          id: "sec-conc-units",
          badge: "QUANTITATIVE UNITS",
          heading: "Key Concentration Units & Temperature Dependence",
          paragraphs: [
            "Units based on mass (Mass %, ppm, Mole fraction, Molality) are completely independent of temperature because mass does not alter with temperature.",
            "Units involving solution volume (Molarity M, Volume %, Mass-by-Volume %) depend on temperature because liquids expand or contract upon heating or cooling.",
          ],
          bulletPoints: [
            "Molarity (M): Moles of solute per liter of solution (mol/L). Temperature DEPENDENT.",
            "Molality (m): Moles of solute per kilogram of solvent (mol/kg). Temperature INDEPENDENT.",
            "Mole Fraction (x): Ratio of moles of a component to the total moles in solution (dimensionless, Σx_i = 1).",
            "Parts Per Million (ppm): Solute mass per 10⁶ units of solution mass; used for trace pollutants.",
          ],
          keyTerms: [
            {
              term: "Molality (m)",
              definition: "The number of moles of solute dissolved in 1 kilogram (1000 g) of solvent. m = (w₂ / M₂) × (1000 / w₁ in g).",
            },
            {
              term: "Mole Fraction (x₂)",
              definition: "The fraction of total moles contributed by solute: x₂ = n₂ / (n₁ + n₂).",
            },
          ],
          callout: {
            type: "tip",
            title: "Standard CBSE Exam Question",
            text: "Question: 'Why is molality preferred over molarity in reporting concentration values?' Answer: Molality is temperature independent because mass does not change with temperature, whereas molarity changes due to thermal expansion of the solution volume.",
          },
          interactiveWidget: "CONCENTRATION_CALCULATOR",
        },
        {
          id: "sec-3d-volumetric",
          badge: "3D VOLUMETRIC FLASK",
          heading: "3D Volumetric Concentration & Particle Density",
          paragraphs: [
            "Molarity measures the number of moles of solute per liter of total solution. In laboratory practice, solutions of precise molarity are prepared in calibrated volumetric flasks.",
            "Adjust the slider in the 3D model below to observe how increasing molarity multiplies particle density inside the 1.000 L volume.",
          ],
          callout: {
            type: "tip",
            title: "Meniscus Reading",
            text: "For clear aqueous solutions, the volume is adjusted until the bottom of the curved liquid meniscus aligns precisely with the etched calibration mark on the flask neck.",
          },
          interactiveWidget: "VOLUMETRIC_SOLUTION_3D",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000000302",
    topicId: TOPIC_03_ID,
    type: "QUESTIONS",
    title: "Practice Exercises: Concentration Calculations",
    description: "Test your mastery on concentration unit conversions.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000000321",
        questionText: "Which concentration unit changes when the temperature of the solution changes?",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 1,
        hint: "Volume changes with temperature, while mass remains constant.",
        explanation: "Molarity involves volume of solution in the denominator. Since volume expands with temperature increase, molarity decreases as temperature rises.",
        options: [
          { id: "e1000000-0000-0000-0000-000000000351", optionText: "Molarity", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000000352", optionText: "Molality", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000000353", optionText: "Mole fraction", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000000354", optionText: "Mass percentage", isCorrect: false, displayOrder: 4 },
        ],
      },
      {
        id: "e1000000-0000-0000-0000-000000000322",
        questionText: "Calculate the molality of a 2.5 g of ethanoic acid (CH₃COOH) in 75 g of benzene. (Molar mass of CH₃COOH = 60 g/mol).",
        questionType: "SHORT_ANSWER",
        difficulty: "MEDIUM",
        marks: 2,
        displayOrder: 2,
        hint: "Moles = 2.5 / 60. Molality = moles / (75 / 1000).",
        expectedAnswer: "0.556 mol/kg (or 0.556 m)",
        explanation: "Moles of CH₃COOH = 2.5 / 60 = 0.0417 mol. Mass of benzene = 75 g = 0.075 kg. Molality m = 0.0417 / 0.075 = 0.556 mol kg⁻¹.",
      },
    ],
  },
];

// ============================================================================
// TOPIC 04: Solubility & Henry's Law
// ============================================================================
export const TOPIC_04_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000000401",
    topicId: TOPIC_04_ID,
    type: "THEORY",
    title: "Solubility of Solids & Gases in Liquids: Henry's Law",
    description: "Understand dissolution equilibrium, temperature effects, and Henry's law governing gas solubility.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "Solubility is the maximum amount of a substance that can dissolve in a specified amount of solvent at a given temperature. Dissolution of solids vs gases shows radically different temperature and pressure behaviors.",
      sections: [
        {
          id: "sec-henry",
          badge: "HENRY'S LAW",
          heading: "Factors Affecting Solubility & Henry's Law Equation",
          paragraphs: [
            "For solid in liquid, 'like dissolves like'. If dissolution is endothermic (ΔH_sol > 0), solubility increases with temperature (Le Chatelier's principle). If exothermic (ΔH_sol < 0), solubility decreases.",
            "For gas in liquid, dissolution is always exothermic (condensation-like process). Hence, gas solubility ALWAYS decreases with increasing temperature.",
            "Henry's Law states that at constant temperature, the solubility of a gas in a liquid is directly proportional to the partial pressure of the gas over the solution: p = K_H · x.",
          ],
          bulletPoints: [
            "Henry's Law Equation: p = K_H · x, where p is partial pressure, x is mole fraction of gas in solution, and K_H is Henry's law constant.",
            "Higher K_H implies lower solubility at the same pressure.",
            "K_H increases with temperature, which explains why gases are less soluble in warm water.",
            "Biological Application: Aquatic species are more comfortable in cold water because dissolved O₂ concentration is higher.",
            "Deep-sea Scuba Divers: Breathe air diluted with Helium (11.7% He, 56.2% N₂, 32.1% O₂) to avoid painful and lethal 'bends' upon rapid ascent.",
            "Anoxia at High Altitudes: Low atmospheric pressure leads to low dissolved O₂ in blood, causing fatigue and lack of mental clarity in climbers.",
          ],
          keyTerms: [
            {
              term: "Henry's Law Constant (K_H)",
              definition: "Proportionality constant in p = K_H · x. Depends on the nature of the gas and increases with temperature.",
            },
            {
              term: "The Bends (Decompression Sickness)",
              definition: "Formation of painful nitrogen gas bubbles in the blood vessels when a diver ascends rapidly to lower surface pressure.",
            },
          ],
          callout: {
            type: "ncert",
            title: "NCERT Board Conceptual Highlight",
            text: "Question: 'Why do soda bottles fizz violently when uncapped?' Answer: Bottles are sealed under high CO₂ pressure to increase solubility. When opened, pressure drops, CO₂ solubility plunges, and excess gas escapes vigorously.",
          },
          interactiveWidget: "HENRYS_LAW_GRAPH",
        },
        {
          id: "sec-3d-henry",
          badge: "3D PISTON CYLINDER",
          heading: "3D High-Pressure Gas Dissolution Cylinder",
          paragraphs: [
            "Henry's law dictates that the equilibrium solubility of a gas is directly proportional to its partial pressure above the liquid.",
            "In the 3D cylinder below, adjust the piston pressure. As the piston compresses the gas phase, collisions per second on the liquid surface rise, forcing more gas molecules into solution.",
          ],
          callout: {
            type: "ncert",
            title: "Dynamic Equilibrium",
            text: "At equilibrium, Rate of gas molecules entering solution = Rate of dissolved gas molecules escaping back into headspace.",
          },
          interactiveWidget: "HENRYS_LAW_CHAMBER_3D",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000000402",
    topicId: TOPIC_04_ID,
    type: "QUESTIONS",
    title: "Board Questions: Solubility & Henry's Law",
    description: "Solve conceptual and graphical questions on gas solubility.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000000421",
        questionText: "If the Henry's law constant (K_H) of gas A is 140 kbar and that of gas B is 35 kbar at the same temperature and pressure, which gas is more soluble?",
        questionType: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        displayOrder: 1,
        hint: "x = p / K_H. Inverse relationship between solubility and K_H.",
        explanation: "From p = K_H · x, the mole fraction x is inversely proportional to K_H. Gas B has a smaller K_H value, so it is 4 times more soluble than gas A at the same partial pressure.",
        options: [
          { id: "e1000000-0000-0000-0000-000000000451", optionText: "Gas B is more soluble", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000000452", optionText: "Gas A is more soluble", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000000453", optionText: "Both are equally soluble", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000000454", optionText: "Cannot be determined without temperature", isCorrect: false, displayOrder: 4 },
        ],
      },
      {
        id: "e1000000-0000-0000-0000-000000000422",
        questionText: "Why are aquatic species more comfortable in cold water than in warm water?",
        questionType: "SHORT_ANSWER",
        difficulty: "EASY",
        marks: 2,
        displayOrder: 2,
        hint: "Consider how gas solubility in liquids depends on temperature.",
        expectedAnswer: "Because the solubility of oxygen in water increases as temperature decreases (K_H decreases with temperature).",
        explanation: "Dissolution of gases in liquids is an exothermic process. According to Le Chatelier's principle and Henry's law, oxygen is significantly more soluble in cold water, providing higher dissolved oxygen for aquatic respiration.",
      },
    ],
  },
];

// ============================================================================
// TOPIC 05: Vapour Pressure
// ============================================================================
export const TOPIC_05_CONTENT_BLOCKS: ContentBlockWithDetails[] = [
  {
    id: "cb100000-0000-0000-0000-000000000501",
    topicId: TOPIC_05_ID,
    type: "THEORY",
    title: "Vapour Pressure of Liquid Solutions & Dynamic Equilibrium",
    description: "Understand the microscopic origin of vapor pressure, evaporation-condensation dynamic equilibrium, and the lowering caused by non-volatile solutes.",
    displayOrder: 1,
    isPublished: true,
    content: {
      introduction:
        "When a volatile liquid is placed in an enclosed vessel, molecules at the liquid surface with sufficient kinetic energy escape into the vapor phase. Concurrently, vapor molecules strike the liquid surface and condense.",
      sections: [
        {
          id: "sec-vp-equilibrium",
          badge: "DYNAMIC EQUILIBRIUM",
          heading: "Definition & Factors Influencing Vapour Pressure",
          paragraphs: [
            "Vapour pressure of a liquid is defined as the pressure exerted by the vapor in thermodynamic equilibrium with the liquid at a specified temperature.",
            "Dynamic equilibrium is reached when Rate of Evaporation = Rate of Condensation.",
            "When a non-volatile solute (e.g. glucose, urea, sucrose) is dissolved in a solvent, solute particles occupy a fraction of the surface area. Since solute particles cannot vaporize, the available surface area for solvent evaporation decreases, causing a reduction in vapor pressure.",
          ],
          bulletPoints: [
            "Nature of Liquid: Liquids with weaker intermolecular forces (e.g. ether, acetone) have higher vapor pressures and lower boiling points.",
            "Temperature: Vapor pressure increases exponentially with temperature as more molecules possess kinetic energy exceeding the intermolecular barrier.",
            "Surface Fraction Effect: Vapour pressure is a surface phenomenon. Dissolving a non-volatile solute reduces the surface fraction occupied by solvent molecules.",
          ],
          keyTerms: [
            {
              term: "Vapour Pressure",
              definition: "The equilibrium pressure exerted by gas molecules above the liquid surface in a closed container at constant temperature.",
            },
            {
              term: "Non-Volatile Solute",
              definition: "A solute that exerts zero or negligible vapor pressure at the operating temperature (e.g., solid salts, sugars).",
            },
          ],
          callout: {
            type: "info",
            title: "Crucial Principle for Colligative Properties",
            text: "All colligative properties (RLVP, boiling point elevation, freezing point depression, osmotic pressure) originate fundamentally from the lowering of solvent vapor pressure caused by adding a non-volatile solute.",
          },
          interactiveWidget: "VAPOUR_PRESSURE_SIM",
        },
        {
          id: "sec-3d-evaporation",
          badge: "3D EQUILIBRIUM CHAMBER",
          heading: "3D Closed Vessel: Surface Solute Blocking",
          paragraphs: [
            "In a closed container, liquid molecules evaporate into the headspace until dynamic equilibrium is reached.",
            "Switch between pure solvent and non-volatile solute solution in the 3D model below to see how solute particles physically occupy surface sites, reducing the escaping rate and lowering equilibrium vapor pressure.",
          ],
          callout: {
            type: "ncert",
            title: "Raoult's Law Foundation",
            text: "Because solute particles occupy a fraction of the liquid surface, fewer solvent molecules are exposed to the gas phase, directly resulting in lowering of vapor pressure (p₁ < p₁°).",
          },
          interactiveWidget: "EVAPORATION_EQUILIBRIUM_3D",
        },
      ],
    },
  },
  {
    id: "cb100000-0000-0000-0000-000000000502",
    topicId: TOPIC_05_ID,
    type: "QUESTIONS",
    title: "Practice Questions: Vapour Pressure",
    description: "Check your conceptual grasp of vapor pressure and surface evaporation.",
    displayOrder: 2,
    isPublished: true,
    content: {},
    questions: [
      {
        id: "e1000000-0000-0000-0000-000000000521",
        questionText: "What happens to the vapor pressure of water when 1 mole of glucose is added to 1 liter of pure water at 298 K?",
        questionType: "MCQ",
        difficulty: "EASY",
        marks: 1,
        displayOrder: 1,
        hint: "Glucose is a non-volatile solute.",
        explanation: "Glucose molecules occupy part of the liquid surface, decreasing the rate of evaporation of water. Hence the equilibrium vapor pressure decreases.",
        options: [
          { id: "e1000000-0000-0000-0000-000000000551", optionText: "It decreases", isCorrect: true, displayOrder: 1 },
          { id: "e1000000-0000-0000-0000-000000000552", optionText: "It increases", isCorrect: false, displayOrder: 2 },
          { id: "e1000000-0000-0000-0000-000000000553", optionText: "It remains identical", isCorrect: false, displayOrder: 3 },
          { id: "e1000000-0000-0000-0000-000000000554", optionText: "It doubles", isCorrect: false, displayOrder: 4 },
        ],
      },
    ],
  },
];
