-- =======================================================
-- Migration: 0001_solutions_topics.sql
-- Purpose: Enable RLS & Seed CBSE Class 12 Solutions Topics
-- =======================================================

-- 1. Enable Row Level Security (RLS)
ALTER TABLE "subjects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chapters" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "topics" ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any
DROP POLICY IF EXISTS "Public subjects read" ON "subjects";
DROP POLICY IF EXISTS "Public chapters read" ON "chapters";
DROP POLICY IF EXISTS "Public topics read" ON "topics";

-- 3. Row Level Security Policies
-- Allow public access to published subjects
CREATE POLICY "Public subjects read" ON "subjects"
  FOR SELECT USING (is_published = true);

-- Allow public access to published chapters belonging to published subjects
CREATE POLICY "Public chapters read" ON "chapters"
  FOR SELECT USING (
    is_published = true AND EXISTS (
      SELECT 1 FROM "subjects" s
      WHERE s.id = chapters.subject_id AND s.is_published = true
    )
  );

-- Allow public access to published topics belonging to published chapters & subjects
CREATE POLICY "Public topics read" ON "topics"
  FOR SELECT USING (
    is_published = true AND EXISTS (
      SELECT 1 FROM "chapters" c
      JOIN "subjects" s ON s.id = c.subject_id
      WHERE c.id = topics.chapter_id AND c.is_published = true AND s.is_published = true
    )
  );

-- 4. Seed Subject: Chemistry
INSERT INTO "subjects" (
  id,
  name,
  slug,
  description,
  thumbnail_url,
  display_order,
  is_published,
  created_at,
  updated_at
) VALUES (
  'e1000000-0000-0000-0000-000000000001',
  'Chemistry',
  'chemistry',
  'Interactive chemistry concepts, formulas, visual simulations, graphs, and topic-wise practice.',
  '/assets/eduideal-logo-BUtjWTvV.png',
  1,
  true,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- 5. Seed Chapter: Solutions
INSERT INTO "chapters" (
  id,
  subject_id,
  name,
  slug,
  description,
  display_order,
  is_published,
  created_at,
  updated_at
) VALUES (
  'e1000000-0000-0000-0000-000000000010',
  'e1000000-0000-0000-0000-000000000001',
  'Solutions',
  'solutions',
  'Master binary liquid solutions, concentration units, solubility, Henry''s law, Raoult''s law, ideal vs non-ideal solutions, azeotropes, the four colligative properties, abnormal molar masses, and the van''t Hoff factor.',
  1,
  true,
  NOW(),
  NOW()
) ON CONFLICT (subject_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- 6. Seed 20 Topics for Solutions Chapter
INSERT INTO "topics" (
  id,
  chapter_id,
  name,
  slug,
  description,
  display_order,
  is_published,
  created_at,
  updated_at
) VALUES
  (
    'e1000000-0000-0000-0000-000000000101',
    'e1000000-0000-0000-0000-000000000010',
    'Introduction to Solutions',
    'introduction-to-solutions',
    'Understand solute, solvent and solutions',
    1,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000102',
    'e1000000-0000-0000-0000-000000000010',
    'Types of Solutions',
    'types-of-solutions',
    'Classify solutions based on physical state',
    2,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000103',
    'e1000000-0000-0000-0000-000000000010',
    'Concentration of Solutions',
    'concentration-of-solutions',
    'Learn different concentration units',
    3,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000104',
    'e1000000-0000-0000-0000-000000000010',
    'Solubility',
    'solubility',
    'Understand factors affecting solubility',
    4,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000105',
    'e1000000-0000-0000-0000-000000000010',
    'Vapour Pressure',
    'vapour-pressure',
    'Explore vapour pressure of liquid solutions',
    5,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000106',
    'e1000000-0000-0000-0000-000000000010',
    'Raoult''s Law',
    'raoults-law',
    'Master Raoult''s law for volatile and non-volatile solutes',
    6,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000107',
    'e1000000-0000-0000-0000-000000000010',
    'Ideal and Non-Ideal Solutions',
    'ideal-and-non-ideal-solutions',
    'Understand thermodynamic criteria and intermolecular interactions',
    7,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000108',
    'e1000000-0000-0000-0000-000000000010',
    'Positive and Negative Deviation',
    'positive-and-negative-deviation',
    'Explore positive and negative deviations from Raoult''s law',
    8,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000109',
    'e1000000-0000-0000-0000-000000000010',
    'Azeotropes',
    'azeotropes',
    'Learn about minimum and maximum boiling azeotropes',
    9,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000110',
    'e1000000-0000-0000-0000-000000000010',
    'Colligative Properties',
    'colligative-properties',
    'Introduction to colligative properties',
    10,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000111',
    'e1000000-0000-0000-0000-000000000010',
    'Relative Lowering of Vapour Pressure',
    'relative-lowering-of-vapour-pressure',
    'Molecular mass determination using RLVP',
    11,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000112',
    'e1000000-0000-0000-0000-000000000010',
    'Elevation of Boiling Point',
    'elevation-of-boiling-point',
    'Ebullioscopic constant and boiling point elevation',
    12,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000113',
    'e1000000-0000-0000-0000-000000000010',
    'Depression of Freezing Point',
    'depression-of-freezing-point',
    'Cryoscopic constant and freezing point depression',
    13,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000114',
    'e1000000-0000-0000-0000-000000000010',
    'Osmosis',
    'osmosis',
    'Understand semipermeable membranes and solvent flow',
    14,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000115',
    'e1000000-0000-0000-0000-000000000010',
    'Osmotic Pressure',
    'osmotic-pressure',
    'Study van''t Hoff equation for osmotic pressure',
    15,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000116',
    'e1000000-0000-0000-0000-000000000010',
    'Reverse Osmosis',
    'reverse-osmosis',
    'Water purification and applications of reverse osmosis',
    16,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000117',
    'e1000000-0000-0000-0000-000000000010',
    'Abnormal Molar Mass',
    'abnormal-molar-mass',
    'Discrepancies caused by association and dissociation',
    17,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000118',
    'e1000000-0000-0000-0000-000000000010',
    'Van''t Hoff Factor',
    'vant-hoff-factor',
    'Calculate i factor and degree of dissociation or association',
    18,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000119',
    'e1000000-0000-0000-0000-000000000010',
    'Applications of Colligative Properties',
    'applications-of-colligative-properties',
    'Real-world engineering and medical applications',
    19,
    true,
    NOW(),
    NOW()
  ),
  (
    'e1000000-0000-0000-0000-000000000120',
    'e1000000-0000-0000-0000-000000000010',
    'Numerical Practice',
    'numerical-practice',
    'Master NCERT and CBSE board numerical problem solving',
    20,
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (chapter_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();
