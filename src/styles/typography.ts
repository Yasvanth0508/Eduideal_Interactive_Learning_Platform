/**
 * EduAidel Centralized Typography System
 * Source of Truth: Docs/EduAidel_Typography_README.md
 *
 * Changing any token in this file updates application typography consistently:
 * Typography Tokens -> CSS Custom Properties -> Utility & Component Classes -> Application Pages.
 */

export interface ResponsiveScale {
  desktop: {
    rem: string;
    px: number;
  };
  mobile: {
    rem: string;
    px: number;
  };
  weight: number | string;
  lineHeight: number | string;
}

export const typographyTokens = {
  // Font Families
  fonts: {
    ui: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    code: 'var(--font-jetbrains-mono), monospace',
    math: '"KaTeX_Main", "KaTeX_Math", "Times New Roman", serif',
  },

  // Font Weights
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Type Scale (Desktop & Mobile with rem + px)
  scale: {
    lessonTitle: {
      desktop: { rem: "2.375rem", px: 38 },
      mobile: { rem: "1.875rem", px: 30 },
      weight: 700,
      lineHeight: 1.25,
    },
    pageTitleH1: {
      desktop: { rem: "2rem", px: 32 },
      mobile: { rem: "1.75rem", px: 28 },
      weight: 700,
      lineHeight: 1.25,
    },
    sectionH2: {
      desktop: { rem: "1.625rem", px: 26 },
      mobile: { rem: "1.4375rem", px: 23 },
      weight: 600,
      lineHeight: 1.25,
    },
    subsectionH3: {
      desktop: { rem: "1.3125rem", px: 21 },
      mobile: { rem: "1.25rem", px: 20 },
      weight: 600,
      lineHeight: 1.25,
    },
    h4: {
      desktop: { rem: "1.125rem", px: 18 },
      mobile: { rem: "1.0625rem", px: 17 },
      weight: 600,
      lineHeight: 1.3,
    },
    body: {
      desktop: { rem: "1.0625rem", px: 17 },
      mobile: { rem: "1rem", px: 16 },
      weight: 400,
      lineHeight: 1.7,
    },
    keyTakeaway: {
      desktop: { rem: "1.125rem", px: 18 },
      mobile: { rem: "1.0625rem", px: 17 },
      weight: 600,
      lineHeight: 1.6,
    },
    buttonsNav: {
      desktop: { rem: "0.9375rem", px: 15 }, // 14-16px range
      mobile: { rem: "0.875rem", px: 14 },
      weight: 600,
      lineHeight: 1.4,
    },
    captionsLabels: {
      desktop: { rem: "0.875rem", px: 14 },
      mobile: { rem: "0.875rem", px: 14 },
      weight: 400,
      lineHeight: 1.5,
    },
    metadata: {
      desktop: { rem: "0.8125rem", px: 13 },
      mobile: { rem: "0.8125rem", px: 13 },
      weight: 400,
      lineHeight: 1.4,
    },
    code: {
      desktop: { rem: "0.9375rem", px: 15 },
      mobile: { rem: "0.875rem", px: 14 },
      weight: 500,
      lineHeight: 1.6,
    },
  },

  // Line Heights
  lineHeights: {
    body: 1.7,
    heading: 1.25,
    tight: 1.15,
    relaxed: 1.6,
  },

  // Spacing (Paragraph & Heading relationships)
  spacing: {
    paragraphMarginBottom: "1.25rem", // 20px (range 20-24px)
    headingToParagraph: "0.75rem",    // 12px (range 10-14px)
    headingMarginTop: "2rem",         // 32px
    subheadingMarginTop: "1.5rem",    // 24px
  },

  // Reading Column and Experience Standards
  reading: {
    widthRem: "46rem",                // 736px (range 680-760px / 42.5-47.5rem)
    minWidthPx: 680,
    maxWidthPx: 760,
    targetLineLengthChars: "60-80",
    targetWordsPerLine: "10-15",
    alignment: "left" as const,
  },
} as const;

/**
 * Maps typography tokens to CSS custom properties.
 */
export function getTypographyCssVariables(): Record<string, string> {
  const { fonts, scale, lineHeights, spacing, reading } = typographyTokens;

  return {
    "--font-ui": fonts.ui,
    "--font-code": fonts.code,
    "--font-math": fonts.math,

    // Base type scale tokens
    "--text-xs": scale.metadata.desktop.rem,
    "--text-sm": scale.captionsLabels.desktop.rem,
    "--text-nav": scale.buttonsNav.desktop.rem,
    "--text-base": scale.body.desktop.rem,
    "--text-base-mobile": scale.body.mobile.rem,
    "--text-lg": scale.h4.desktop.rem,
    "--text-xl": scale.subsectionH3.desktop.rem,
    "--text-2xl": scale.sectionH2.desktop.rem,
    "--text-3xl": scale.pageTitleH1.desktop.rem,
    "--text-lesson": scale.lessonTitle.desktop.rem,
    "--text-lesson-mobile": scale.lessonTitle.mobile.rem,

    // Line heights
    "--leading-body": String(lineHeights.body),
    "--leading-heading": String(lineHeights.heading),
    "--leading-tight": String(lineHeights.tight),

    // Spacing
    "--spacing-paragraph": spacing.paragraphMarginBottom,
    "--spacing-heading-to-p": spacing.headingToParagraph,
    "--spacing-heading-top": spacing.headingMarginTop,

    // Reading column
    "--reading-width": reading.widthRem,
  };
}

/**
 * Generates the CSS rule string for `:root` based on the centralized tokens.
 */
export function generateTypographyCssText(): string {
  const vars = getTypographyCssVariables();
  const declarations = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  return `:root {\n${declarations}\n}`;
}

export const typographyCssVariablesText: string = generateTypographyCssText();
