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
  | "SOLUTION_COLLOID_SUSPENSION_COMPARISON";

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
}
