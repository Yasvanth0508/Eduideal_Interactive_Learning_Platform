-- ====================================================================
-- EduAidel Database Migration: 0002_topic_01_content.sql
-- Topic 1: Introduction to Solutions — Content Blocks & Questions
-- ====================================================================

-- 1. Insert Content Blocks for Topic 1
INSERT INTO content_blocks (id, topic_id, type, title, description, content, display_order, is_published)
VALUES
(
  'cb100000-0000-0000-0000-000000000101',
  'e1000000-0000-0000-0000-000000000101',
  'THEORY',
  '1. What is a Solution? (Homogeneous Mixtures)',
  'Understand the foundational definition, homogeneous nature, and particle-level criteria of true solutions.',
  '{
    "introduction": "In everyday life, we rarely come across chemically pure substances. Most matter around us consists of mixtures — brass, saline water, aerated beverages, and even the air we breathe are all mixtures. Among these, solutions form the most fundamental class.",
    "sections": [
      {
        "id": "sec-def",
        "badge": "FUNDAMENTAL DEFINITION",
        "heading": "Definition of a Solution",
        "paragraphs": [
          "A solution is defined as a homogeneous mixture of two or more chemically non-reacting substances whose composition can be varied within certain limits.",
          "By homogeneous, we mean that its composition and chemical/physical properties are completely uniform throughout the entire bulk of the mixture. Whether you sample the mixture from the top, center, or bottom of the container, the constituent ratio remains identical."
        ],
        "bulletPoints": [
          "Molecular Dispersal: Solute particles dissolve and disperse at the molecular or ionic level.",
          "Particle Size: Solute particles have diameters smaller than 1 nanometer (1 nm = 10⁻⁹ m or 10 Å).",
          "Single Phase: A true solution exists as a single thermodynamic phase (it has no visible boundaries of separation)."
        ],
        "keyTerms": [
          {
            "term": "Homogeneous Mixture",
            "definition": "A mixture possessing uniform composition and properties throughout, with no observable phase boundaries."
          },
          {
            "term": "True Solution",
            "definition": "A solution where solute particles are dispersed at atomic or molecular dimensions (< 1 nm), preventing scattering of light."
          }
        ],
        "callout": {
          "type": "ncert",
          "title": "NCERT Curriculum Focus",
          "text": "Because particles in a true solution are smaller than 1 nm, they do not scatter visible light (no Tyndall effect), cannot be observed under an optical microscope, and do not settle down under gravity upon standing."
        },
        "interactiveWidget": "PARTICLE_SIMULATOR"
      }
    ]
  }'::jsonb,
  1,
  true
),
(
  'cb100000-0000-0000-0000-000000000102',
  'e1000000-0000-0000-0000-000000000101',
  'THEORY',
  '2. Components of a Solution: Solute vs. Solvent',
  'Learn the rules for distinguishing solute and solvent, and understand binary, ternary, and quaternary solutions.',
  '{
    "introduction": "Solutions are classified by the number of components they contain. In CBSE Class 12 Chemistry, we deal almost exclusively with binary solutions.",
    "sections": [
      {
        "id": "sec-components",
        "badge": "CLASSIFICATION BY COMPONENTS",
        "heading": "Binary, Ternary & Quaternary Solutions",
        "paragraphs": [
          "• Binary Solution: Composed of exactly two components (1 solute + 1 solvent). Example: Salt in water.",
          "• Ternary Solution: Composed of three components. Example: Salt + Sugar in water.",
          "• Quaternary Solution: Composed of four components. Example: Salt + Sugar + Lemon juice in water."
        ]
      },
      {
        "id": "sec-rules",
        "badge": "SOLUTE VS. SOLVENT RULES",
        "heading": "How to Identify Solute and Solvent",
        "paragraphs": [
          "In a binary solution, the two components are designated as the solvent and the solute according to two scientific principles:"
        ],
        "bulletPoints": [
          "Rule 1 (Physical State Rule): The component that has the same physical state as the resulting solution is the solvent. For example, when solid sugar dissolves in liquid water, the resulting syrup is liquid; therefore, water is the solvent.",
          "Rule 2 (Relative Amount Rule): If both components share the same physical state (e.g. liquid + liquid), the component present in the largest quantity (by moles or mass) is designated as the solvent. The other component is the solute."
        ],
        "keyTerms": [
          {
            "term": "Solvent",
            "definition": "The component of the solution that is present in the largest quantity and determines the physical state in which the solution exists."
          },
          {
            "term": "Solute",
            "definition": "One or more components present in the solution in lesser quantities than the solvent."
          }
        ],
        "callout": {
          "type": "warning",
          "title": "Classic CBSE Exam Trick",
          "text": "In a 20% ethanol solution in water, Ethanol is the Solute (20 mL) and Water is the Solvent (80 mL). However, in an 80% ethanol solution, Ethanol is the Solvent (80 mL) and Water is the Solute (20 mL)!"
        },
        "interactiveWidget": "SOLUTE_SOLVENT_EXPLORER"
      }
    ]
  }'::jsonb,
  2,
  true
),
(
  'cb100000-0000-0000-0000-000000000103',
  'e1000000-0000-0000-0000-000000000101',
  'THEORY',
  '3. Comparison: True Solution vs. Colloid vs. Suspension',
  'Clarify the fundamental physical distinctions in particle size, stability, filtration, and optical behavior.',
  '{
    "introduction": "Dispersed systems in chemistry are categorized based on the diameter of the dispersed particles into true solutions, colloidal solutions, and coarse suspensions.",
    "sections": [
      {
        "id": "sec-dispersion",
        "badge": "COMPARATIVE ANALYSIS",
        "heading": "Particle Dimensions and Physical Behavior",
        "paragraphs": [
          "The physical behavior of a mixture depends critically on particle size. While true solutions are molecularly dispersed, colloids and suspensions contain aggregates of thousands of atoms or molecules."
        ],
        "interactiveWidget": "SOLUTION_COLLOID_SUSPENSION_COMPARISON",
        "callout": {
          "type": "tip",
          "title": "Key Board Takeaway",
          "text": "Only true solutions are thermodynamically stable single-phase systems where particles never settle under gravity and cannot be separated even by fine ultra-filtration membranes."
        }
      }
    ]
  }'::jsonb,
  3,
  true
),
(
  'cb100000-0000-0000-0000-000000000104',
  'e1000000-0000-0000-0000-000000000101',
  'THEORY',
  '4. The 9 Types of Binary Solutions',
  'Explore the 9 possible combinations of solute and solvent across Solid, Liquid, and Gaseous states.',
  '{
    "introduction": "Depending upon whether the solvent is a gas, a liquid, or a solid, binary solutions are categorized into three broad classes: Gaseous solutions, Liquid solutions, and Solid solutions. Since the solute can also be in any of the 3 states of matter, there are 9 distinct types.",
    "sections": [
      {
        "id": "sec-types-matrix",
        "badge": "NCERT TABLE 1.1",
        "heading": "Binary Solution Classification Matrix",
        "paragraphs": [
          "Review each type below. Notice that the physical state of the solvent dictates the overarching classification of the solution."
        ],
        "interactiveWidget": "TYPES_OF_SOLUTIONS_MATRIX",
        "callout": {
          "type": "ncert",
          "title": "Frequently Tested NCERT Examples",
          "text": "CBSE board papers regularly ask for specific examples: (1) Gas in Solid: Solution of Hydrogen in Palladium, (2) Liquid in Solid: Amalgam of Mercury with Sodium, (3) Solid in Gas: Camphor in Nitrogen gas."
        }
      }
    ]
  }'::jsonb,
  4,
  true
),
(
  'cb100000-0000-0000-0000-000000000105',
  'e1000000-0000-0000-0000-000000000101',
  'QUESTIONS',
  '5. Quick Practice & Self-Assessment',
  'Test your understanding with CBSE-aligned multiple choice, component identification, and conceptual questions.',
  NULL,
  5,
  true
)
ON CONFLICT (id) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  display_order = EXCLUDED.display_order,
  is_published = EXCLUDED.is_published;

-- 2. Insert Practice Questions for Block 5
INSERT INTO questions (id, content_block_id, question_text, question_type, difficulty, marks, explanation, display_order)
VALUES
(
  'e1000000-0000-0000-0000-000000000201',
  'cb100000-0000-0000-0000-000000000105',
  'Which of the following is an example of a solid solution in which the solute is a gas?',
  'MCQ',
  'EASY',
  1,
  'In a solution of hydrogen in palladium, hydrogen gas (H₂) is adsorbed/occluded inside the crystal lattice of solid palladium (Pd). Here, the solute is a gas and the solvent is a solid.',
  1
),
(
  'e1000000-0000-0000-0000-000000000202',
  'cb100000-0000-0000-0000-000000000105',
  'If a mixture is prepared by mixing 75 mL of pure ethanol with 25 mL of pure water, which component acts as the solvent?',
  'MCQ',
  'MEDIUM',
  1,
  'When both components share the same physical state (both are liquids), the component present in the largest quantity acts as the solvent. Here, ethanol constitutes 75% of the mixture, so ethanol is the solvent and water is the solute.',
  2
),
(
  'e1000000-0000-0000-0000-000000000203',
  'cb100000-0000-0000-0000-000000000105',
  'What is the maximum particle diameter for a dispersed substance to be classified as a true solution?',
  'MCQ',
  'EASY',
  1,
  'In a true solution, solute particles are dispersed at atomic or molecular levels with diameters less than 1 nm (10⁻⁹ m or 10 Å). Particles between 1 nm and 1000 nm form colloids, and particles > 1000 nm form suspensions.',
  3
),
(
  'e1000000-0000-0000-0000-000000000204',
  'cb100000-0000-0000-0000-000000000105',
  'Component Identification: In Tincture of Iodine (used as a common antiseptic), identify the solute and the solvent.',
  'SHORT_ANSWER',
  'MEDIUM',
  2,
  'Tincture of iodine contains 2–3% elemental iodine (I₂) dissolved in an alcohol-water mixture. Since iodine is dissolved in a much larger volume of alcohol, Iodine is the solid Solute and Ethyl Alcohol is the liquid Solvent.',
  4
),
(
  'e1000000-0000-0000-0000-000000000205',
  'cb100000-0000-0000-0000-000000000105',
  'Type & Phase Identification: Identify the physical state of the solute and the solvent in Dental Amalgam (or Sodium Amalgam).',
  'SHORT_ANSWER',
  'MEDIUM',
  2,
  'An amalgam is formed by dissolving liquid mercury (Hg) into a solid metal matrix such as sodium (Na) or silver (Ag). Because the solid metal is present in larger amount and determines the solid state of the amalgam, Mercury is the liquid Solute and Sodium/Silver is the solid Solvent.',
  5
),
(
  'e1000000-0000-0000-0000-000000000206',
  'cb100000-0000-0000-0000-000000000105',
  'Conceptual Reasoning: Why is an alloy such as Brass (approx. 30% Zn in 70% Cu) classified as a solution, even though both components are solid and cannot be separated by physical filtration?',
  'SHORT_ANSWER',
  'HARD',
  3,
  'Brass qualifies as a true solid solution because: 1. Atomic Homogeneity: Zinc atoms substitute uniformly for copper atoms in the crystal lattice. 2. Retained Identity: Constituent elements retain their characteristic properties. 3. Variable Composition: The ratio of Zn in Cu can be continuously varied within limits (20% to 40%).',
  6
)
ON CONFLICT (id) DO UPDATE
SET
  question_text = EXCLUDED.question_text,
  question_type = EXCLUDED.question_type,
  difficulty = EXCLUDED.difficulty,
  marks = EXCLUDED.marks,
  explanation = EXCLUDED.explanation,
  display_order = EXCLUDED.display_order;

-- 3. Insert Question Options for MCQs
INSERT INTO question_options (id, question_id, option_text, is_correct, display_order)
VALUES
-- Options for Q1
('e1000000-0000-0000-0000-000000000301', 'e1000000-0000-0000-0000-000000000201', 'Camphor in nitrogen gas', false, 1),
('e1000000-0000-0000-0000-000000000302', 'e1000000-0000-0000-0000-000000000201', 'Solution of hydrogen in palladium', true, 2),
('e1000000-0000-0000-0000-000000000303', 'e1000000-0000-0000-0000-000000000201', 'Chloroform mixed with nitrogen gas', false, 3),
('e1000000-0000-0000-0000-000000000304', 'e1000000-0000-0000-0000-000000000201', 'Amalgam of mercury with sodium', false, 4),

-- Options for Q2
('e1000000-0000-0000-0000-000000000305', 'e1000000-0000-0000-0000-000000000202', 'Water, because water is always the universal solvent', false, 1),
('e1000000-0000-0000-0000-000000000306', 'e1000000-0000-0000-0000-000000000202', 'Ethanol, because it is present in the larger volume', true, 2),
('e1000000-0000-0000-0000-000000000307', 'e1000000-0000-0000-0000-000000000202', 'Both act as solvents simultaneously', false, 3),
('e1000000-0000-0000-0000-000000000308', 'e1000000-0000-0000-0000-000000000202', 'Neither, because they form an azeotrope', false, 4),

-- Options for Q3
('e1000000-0000-0000-0000-000000000309', 'e1000000-0000-0000-0000-000000000203', 'Less than 1 nm (10⁻⁹ m)', true, 1),
('e1000000-0000-0000-0000-000000000310', 'e1000000-0000-0000-0000-000000000203', 'Between 1 nm and 1000 nm', false, 2),
('e1000000-0000-0000-0000-000000000311', 'e1000000-0000-0000-0000-000000000203', 'Greater than 1000 nm', false, 3),
('e1000000-0000-0000-0000-000000000312', 'e1000000-0000-0000-0000-000000000203', 'Greater than 1 μm', false, 4)
ON CONFLICT (id) DO UPDATE
SET
  option_text = EXCLUDED.option_text,
  is_correct = EXCLUDED.is_correct,
  display_order = EXCLUDED.display_order;
