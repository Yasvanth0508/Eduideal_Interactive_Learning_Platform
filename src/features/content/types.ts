export type ContentBlockType =
  | "THEORY"
  | "IMAGE"
  | "FORMULA"
  | "GRAPH"
  | "THREE_D"
  | "VIDEO"
  | "QUESTIONS";

export type InteractiveWidgetType =
  | "PARTICLE_SIMULATOR"
  | "SOLUTE_SOLVENT_EXPLORER"
  | "TYPES_OF_SOLUTIONS_MATRIX"
  | "SOLUTION_COLLOID_SUSPENSION_COMPARISON"
  | "CONCENTRATION_CALCULATOR"
  | "HENRYS_LAW_GRAPH"
  | "VAPOUR_PRESSURE_SIM"
  | "RAOULTS_LAW_GRAPH"
  | "IDEAL_NON_IDEAL_COMPARATOR"
  | "DEVIATION_CURVES_GRAPH"
  | "AZEOTROPE_PHASE_DIAGRAM"
  | "COLLIGATIVE_PROPERTIES_HUB"
  | "RLVP_CALCULATOR"
  | "BOILING_ELEVATION_CALCULATOR"
  | "FREEZING_DEPRESSION_CALCULATOR"
  | "OSMOSIS_SIMULATION"
  | "OSMOTIC_PRESSURE_CALCULATOR"
  | "REVERSE_OSMOSIS_SIMULATOR"
  | "ASSOCIATION_DISSOCIATION_VISUALIZER"
  | "VANT_HOFF_CALCULATOR"
  | "COLLIGATIVE_APPLICATIONS_SHOWCASE"
  | "NUMERICAL_PRACTICE_WORKBENCH";

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface CalloutBox {
  type: "tip" | "info" | "warning" | "ncert";
  title: string;
  text: string;
}

export interface TheorySection {
  id: string;
  badge?: string;
  heading?: string;
  subheading?: string;
  paragraphs: string[];
  bulletPoints?: string[];
  keyTerms?: KeyTerm[];
  callout?: CalloutBox;
  interactiveWidget?: InteractiveWidgetType;
}

export interface TheoryBlockContent {
  introduction?: string;
  sections: TheorySection[];
}

export interface QuestionOptionItem {
  id: string;
  optionText: string;
  isCorrect: boolean;
  displayOrder: number;
}

export interface QuestionItem {
  id: string;
  questionText: string;
  questionType: "MCQ" | "TRUE_FALSE" | "NUMERICAL" | "SHORT_ANSWER";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  marks: number;
  explanation: string;
  displayOrder: number;
  options?: QuestionOptionItem[];
  expectedAnswer?: string;
  hint?: string;
}

export interface FormulaVariableItem {
  id: string;
  symbol: string;
  label: string;
  unit: string | null;
  dataType: string;
  defaultValue: number;
  minValue?: number | null;
  maxValue?: number | null;
  displayOrder: number;
}

export interface FormulaConfigItem {
  id: string;
  name: string;
  formulaExpression: string;
  resultUnit: string | null;
  description: string | null;
  variables: FormulaVariableItem[];
}

export interface ContentBlockWithDetails {
  id: string;
  topicId: string;
  type: ContentBlockType;
  title: string | null;
  description: string | null;
  content: TheoryBlockContent | Record<string, unknown> | null;
  displayOrder: number;
  isPublished: boolean;
  questions?: QuestionItem[];
  formulaConfig?: FormulaConfigItem;
}
