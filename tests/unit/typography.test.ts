import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  typographyTokens,
  getTypographyCssVariables,
  generateTypographyCssText,
} from "../../src/styles/typography";
import katex from "katex";

describe("Typography Design System Tokens", () => {
  describe("Font Families & Weights", () => {
    it("should configure Inter as the primary UI font", () => {
      assert.ok(typographyTokens.fonts.ui.includes("var(--font-inter)"));
    });

    it("should configure JetBrains Mono as the code font", () => {
      assert.ok(typographyTokens.fonts.code.includes("var(--font-jetbrains-mono)"));
    });

    it("should configure KaTeX math fonts", () => {
      assert.ok(typographyTokens.fonts.math.includes("KaTeX"));
    });

    it("should define standard weights (400, 500, 600, 700)", () => {
      assert.equal(typographyTokens.weights.regular, 400);
      assert.equal(typographyTokens.weights.medium, 500);
      assert.equal(typographyTokens.weights.semibold, 600);
      assert.equal(typographyTokens.weights.bold, 700);
    });
  });

  describe("Type Scale (Desktop & Mobile)", () => {
    it("should match Lesson Title: 38px desktop / 30px mobile, weight 700", () => {
      const { lessonTitle } = typographyTokens.scale;
      assert.equal(lessonTitle.desktop.px, 38);
      assert.equal(lessonTitle.mobile.px, 30);
      assert.equal(lessonTitle.weight, 700);
      assert.equal(lessonTitle.lineHeight, 1.25);
    });

    it("should match Page Title / H1: 32px desktop / 28px mobile, weight 700", () => {
      const { pageTitleH1 } = typographyTokens.scale;
      assert.equal(pageTitleH1.desktop.px, 32);
      assert.equal(pageTitleH1.mobile.px, 28);
      assert.equal(pageTitleH1.weight, 700);
      assert.equal(pageTitleH1.lineHeight, 1.25);
    });

    it("should match Section / H2: 26px desktop / 23px mobile, weight 600", () => {
      const { sectionH2 } = typographyTokens.scale;
      assert.equal(sectionH2.desktop.px, 26);
      assert.equal(sectionH2.mobile.px, 23);
      assert.equal(sectionH2.weight, 600);
      assert.equal(sectionH2.lineHeight, 1.25);
    });

    it("should match Subsection / H3: 21px desktop / 20px mobile, weight 600", () => {
      const { subsectionH3 } = typographyTokens.scale;
      assert.equal(subsectionH3.desktop.px, 21);
      assert.equal(subsectionH3.mobile.px, 20);
      assert.equal(subsectionH3.weight, 600);
      assert.equal(subsectionH3.lineHeight, 1.25);
    });

    it("should match H4: 18px desktop / 17px mobile, weight 600", () => {
      const { h4 } = typographyTokens.scale;
      assert.equal(h4.desktop.px, 18);
      assert.equal(h4.mobile.px, 17);
      assert.equal(h4.weight, 600);
    });

    it("should match Body paragraphs: 17px desktop / 16px mobile, 1.7 line height", () => {
      const { body } = typographyTokens.scale;
      assert.equal(body.desktop.px, 17);
      assert.equal(body.desktop.rem, "1.0625rem");
      assert.equal(body.mobile.px, 16);
      assert.equal(body.mobile.rem, "1rem");
      assert.equal(body.lineHeight, 1.7);
    });

    it("should match Key takeaway: 18px desktop / 17px mobile, weight 600", () => {
      const { keyTakeaway } = typographyTokens.scale;
      assert.equal(keyTakeaway.desktop.px, 18);
      assert.equal(keyTakeaway.mobile.px, 17);
      assert.equal(keyTakeaway.weight, 600);
    });

    it("should match Captions and labels: 14px (0.875rem)", () => {
      const { captionsLabels } = typographyTokens.scale;
      assert.equal(captionsLabels.desktop.px, 14);
      assert.equal(captionsLabels.desktop.rem, "0.875rem");
      assert.equal(captionsLabels.mobile.px, 14);
    });

    it("should match Metadata: 13px (0.8125rem)", () => {
      const { metadata } = typographyTokens.scale;
      assert.equal(metadata.desktop.px, 13);
      assert.equal(metadata.desktop.rem, "0.8125rem");
    });
  });

  describe("Reading Layout & Line Length Standards", () => {
    it("should set body line height to 1.7 and heading line height to 1.25", () => {
      assert.equal(typographyTokens.lineHeights.body, 1.7);
      assert.equal(typographyTokens.lineHeights.heading, 1.25);
    });

    it("should set reading width within 680-760px standard", () => {
      const { minWidthPx, maxWidthPx, widthRem } = typographyTokens.reading;
      assert.equal(minWidthPx, 680);
      assert.equal(maxWidthPx, 760);
      assert.equal(widthRem, "46rem"); // 46rem * 16px = 736px (within 680-760px)
    });

    it("should enforce left alignment for paragraphs", () => {
      assert.equal(typographyTokens.reading.alignment, "left");
    });
  });

  describe("CSS Variables Generation", () => {
    it("should generate all CSS custom properties for :root", () => {
      const vars = getTypographyCssVariables();
      assert.ok(vars["--font-ui"]);
      assert.ok(vars["--font-code"]);
      assert.equal(vars["--text-base"], "1.0625rem");
      assert.equal(vars["--text-lesson"], "2.375rem");
      assert.equal(vars["--leading-body"], "1.7");
      assert.equal(vars["--leading-heading"], "1.25");
      assert.equal(vars["--reading-width"], "46rem");
    });

    it("should generate valid CSS rule text", () => {
      const cssText = generateTypographyCssText();
      assert.ok(cssText.startsWith(":root {"));
      assert.ok(cssText.includes("--reading-width: 46rem;"));
      assert.ok(cssText.includes("--leading-body: 1.7;"));
      assert.ok(cssText.endsWith("}"));
    });
  });

  describe("KaTeX Mathematical Formula Rendering", () => {
    it("should render inline formulas without throwing", () => {
      const output = katex.renderToString("F = ma", { displayMode: false });
      assert.ok(output.includes("katex"));
      assert.ok(output.includes("F"));
      assert.ok(output.includes("m"));
    });

    it("should render display formulas with katex-display", () => {
      const output = katex.renderToString("\\Delta T_b = i \\times K_b \\times m", {
        displayMode: true,
      });
      assert.ok(output.includes("katex-display"));
      assert.ok(output.includes("Δ"));
    });
  });
});
