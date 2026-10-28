"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathFormulaProps {
  expression: string;
  display?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Normalizes plain unicode symbols into KaTeX-compatible LaTeX expressions
 * if the expression is not already standard LaTeX.
 */
function normalizeToLatex(expr: string): string {
  if (!expr) return "";
  let s = expr.trim();

  // If already standard LaTeX containing backslashes, return as is
  if (s.includes("\\")) {
    return s;
  }

  // Common replacements for plain mathematical expressions
  s = s
    .replace(/Δ/g, "\\Delta ")
    .replace(/×/g, "\\times ")
    .replace(/·/g, "\\cdot ")
    .replace(/°/g, "^\\circ ")
    .replace(/±/g, "\\pm ")
    .replace(/π/g, "\\pi ")
    .replace(/θ/g, "\\theta ")
    .replace(/λ/g, "\\lambda ")
    .replace(/Tb/g, "T_b")
    .replace(/Tf/g, "T_f")
    .replace(/Kb/g, "K_b")
    .replace(/Kf/g, "K_f");

  return s;
}

/**
 * Renders mathematical equations using KaTeX according to EduAidel Typography Standards.
 * Display equations appear centered on their own line with horizontal scrolling for mobile.
 */
export function MathFormula({
  expression,
  display = true,
  className = "",
  ariaLabel,
}: MathFormulaProps) {
  const html = useMemo(() => {
    const latex = normalizeToLatex(expression);
    try {
      return katex.renderToString(latex, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return `<span class="katex-error">${expression}</span>`;
    }
  }, [expression, display]);

  if (display) {
    return (
      <div
        className={`w-full overflow-x-auto py-2 text-center text-neutral-900 select-all my-3 ${className}`}
        aria-label={ariaLabel || expression}
      >
        <div
          className="inline-block min-w-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }

  return (
    <span
      className={`inline-block align-middle select-all ${className}`}
      aria-label={ariaLabel || expression}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Parses mixed text containing `$inline-math$` delimiters and renders
 * inline KaTeX math formulas alongside standard Inter body typography.
 */
export function MathText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const parts = useMemo(() => {
    if (!text || !text.includes("$")) {
      return [{ type: "text" as const, content: text }];
    }

    const segments: Array<{ type: "text" | "math"; content: string }> = [];
    const regex = /\$([^$]+)\$/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          type: "text",
          content: text.slice(lastIndex, match.index),
        });
      }
      segments.push({
        type: "math",
        content: match[1],
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex),
      });
    }

    return segments;
  }, [text]);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.type === "math" ? (
          <MathFormula
            key={index}
            expression={part.content}
            display={false}
          />
        ) : (
          <React.Fragment key={index}>{part.content}</React.Fragment>
        )
      )}
    </span>
  );
}
