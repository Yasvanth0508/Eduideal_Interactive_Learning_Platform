# EduAidel Typography Guidelines

## 1. Font families

  -----------------------------------------------------------------------
  Purpose                 Font                    Weights
  ----------------------- ----------------------- -----------------------
  UI, headings,           **Inter**               400, 500, 600, 700
  paragraphs, buttons,                            
  navigation                                      

  Code and technical      **JetBrains Mono**      400, 500
  identifiers                                     

  Mathematical notation   **KaTeX renderer** with Renderer default
                          bundled math fonts      
  -----------------------------------------------------------------------

Use Inter as the default font. Add JetBrains Mono only for code. Avoid
decorative fonts in lesson content.

## 2. Type scale

  Element                      Desktop      Mobile     Weight
  ------------------------ ----------- ----------- ----------
  Lesson title                   38 px       30 px        700
  Page title / H1                32 px       28 px        700
  Section / H2                   26 px       23 px        600
  Subsection / H3                21 px       20 px        600
  H4                             18 px       17 px        600
  Body paragraphs                17 px   16--17 px        400
  Key takeaway               17--18 px   16--17 px   500--600
  Buttons and navigation     14--16 px   14--16 px   500--600
  Captions and labels            14 px       14 px        400
  Metadata                   13--14 px   13--14 px        400
  Code                       14--15 px   13--14 px   400--500

Avoid text below 13 px for meaningful information.

## 3. Reading layout and spacing

-   **Body line height:** `1.7`.
-   **Heading line height:** `1.2–1.3`.
-   **Paragraph spacing:** `20–24 px`.
-   **Heading-to-paragraph spacing:** `10–14 px`.
-   **Reading column width:** `680–760 px` (approximately
    `42–47.5 rem`).
-   **Target line length:** approximately `60–80 characters`, usually
    around `10–15 words` depending on word length and font size.
-   **Text alignment:** left aligned; do not justify paragraphs.
-   **Paragraphs:** keep each paragraph focused on one idea, usually
    2--5 sentences.
-   **Lists:** use for steps, properties, comparisons, and key points.
-   **Emphasis:** bold key terms sparingly; avoid bolding entire
    paragraphs.

Keep the reading column narrower than the full page. On mobile, use the
available width with comfortable side padding.

## 4. Content-specific rules

-   **Theory:** Inter, 17 px desktop / 16--17 px mobile, line height
    `1.7`.
-   **Examples and explanations:** same body style; separate examples
    with spacing or a subtle container.
-   **Questions and options:** 16--17 px; leave clear vertical space
    between answer options.
-   **Image captions and chart labels:** at least 14 px where practical.
-   **Code:** JetBrains Mono, 14--15 px desktop; allow horizontal
    scrolling for long lines.
-   **Navigation and controls:** Inter, 14--16 px; use weight 500 or
    600.
-   **Key takeaways:** use a short heading and concise text; do not rely
    on color alone to communicate importance.

## 5. Formula rendering

Use **KaTeX** for mathematical notation. Do not render complex formulas
as plain text, screenshots, or manually spaced Unicode characters.

-   Inline formulas: place within a sentence, e.g. `$F = ma$`.

-   Display formulas: place important equations on their own centered
    line:

    ``` math
    F_{\text{net}} = ma
    ```

-   Use proper subscripts, superscripts, fractions, roots, Greek
    letters, vectors, and units.

-   Define variables immediately below or beside the equation.

-   Keep equations responsive; allow horizontal scrolling only for
    unusually wide expressions.

-   Use consistent notation throughout a lesson.

-   Keep explanatory text in Inter; let KaTeX render formulas with its
    math fonts.

For Next.js, use a React-compatible KaTeX integration or render with
KaTeX directly. Include KaTeX CSS and verify both inline and display
math. If the project already has a math-rendering library, inspect it
before adding another dependency.

## 6. Accessibility and implementation

-   Maintain strong text/background contrast (WCAG AA target: 4.5:1 for
    normal text).
-   Support browser zoom and responsive font sizes.
-   Do not communicate meaning through color alone.
-   Load only the required font weights.
-   Prefer `next/font` or self-hosted fonts to reduce layout shifts and
    external requests.
-   Keep typography tokens centralized; avoid one-off sizes.

## 7. CSS tokens

``` css
:root {
  --font-ui: "Inter", sans-serif;
  --font-code: "JetBrains Mono", monospace;

  --text-xs: 0.8125rem;    /* 13px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1.0625rem;  /* 17px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.3125rem;    /* 21px */
  --text-2xl: 1.625rem;    /* 26px */
  --text-3xl: 2rem;        /* 32px */
  --text-lesson: 2.375rem; /* 38px */

  --leading-body: 1.7;
  --leading-heading: 1.25;
  --reading-width: 46rem;
}

.lesson-content {
  max-width: var(--reading-width);
  font-family: var(--font-ui);
  font-size: var(--text-base);
  line-height: var(--leading-body);
}

.lesson-content p {
  margin-block: 0 1.25rem;
}

.lesson-content h2,
.lesson-content h3 {
  line-height: var(--leading-heading);
  font-weight: 600;
  margin-block: 2rem 0.75rem;
}

.lesson-content pre,
.lesson-content code {
  font-family: var(--font-code);
}
```

## Final standard

**Inter for UI and reading, JetBrains Mono for code, KaTeX for formulas,
17 px body text, 1.7 body line height, and a 680--760 px reading
column.**
