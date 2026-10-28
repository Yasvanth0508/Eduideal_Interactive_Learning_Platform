import React from "react";

export interface TypographyComponentProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Lesson Title: 38px desktop / 30px mobile, weight 700, line height 1.25
 */
export function LessonTitle({
  children,
  className = "",
  as: Component = "h1",
  ...props
}: TypographyComponentProps) {
  return (
    <Component className={`type-lesson-title text-neutral-900 ${className}`} {...props}>
      {children}
    </Component>
  );
}

/**
 * Page Title / H1: 32px desktop / 28px mobile, weight 700, line height 1.25
 */
export function PageTitle({
  children,
  className = "",
  as: Component = "h1",
  ...props
}: TypographyComponentProps) {
  return (
    <Component className={`type-h1 text-neutral-900 ${className}`} {...props}>
      {children}
    </Component>
  );
}

/**
 * Section Title / H2: 26px desktop / 23px mobile, weight 600, line height 1.25
 */
export function SectionTitle({
  children,
  className = "",
  as: Component = "h2",
  ...props
}: TypographyComponentProps) {
  return (
    <Component className={`type-h2 text-neutral-900 ${className}`} {...props}>
      {children}
    </Component>
  );
}

/**
 * Subsection Title / H3: 21px desktop / 20px mobile, weight 600, line height 1.25
 */
export function SubsectionTitle({
  children,
  className = "",
  as: Component = "h3",
  ...props
}: TypographyComponentProps) {
  return (
    <Component className={`type-h3 text-neutral-900 ${className}`} {...props}>
      {children}
    </Component>
  );
}

/**
 * H4: 18px desktop / 17px mobile, weight 600, line height 1.25
 */
export function Heading4({
  children,
  className = "",
  as: Component = "h4",
  ...props
}: TypographyComponentProps) {
  return (
    <Component className={`type-h4 text-neutral-900 ${className}`} {...props}>
      {children}
    </Component>
  );
}

/**
 * Body Paragraph: 17px desktop / 16px mobile, weight 400, line height 1.7, left aligned
 */
export function BodyParagraph({
  children,
  className = "",
  as: Component = "p",
  ...props
}: TypographyComponentProps) {
  return (
    <Component className={`type-body text-neutral-700 ${className}`} {...props}>
      {children}
    </Component>
  );
}

/**
 * Key Takeaway: 17-18px desktop / 16-17px mobile, weight 500-600
 */
export function KeyTakeaway({
  children,
  className = "",
  as: Component = "div",
  ...props
}: TypographyComponentProps) {
  return (
    <Component className={`type-takeaway ${className}`} {...props}>
      {children}
    </Component>
  );
}

/**
 * Reading Column Container: Constrains long-form lesson content to 680-760px (46rem)
 */
export function ReadingColumn({
  children,
  className = "",
  as: Component = "div",
  ...props
}: TypographyComponentProps) {
  return (
    <Component className={`reading-column ${className}`} {...props}>
      {children}
    </Component>
  );
}

/**
 * Captions & Labels: 14px, weight 400
 */
export function CaptionText({
  children,
  className = "",
  as: Component = "p",
  ...props
}: TypographyComponentProps) {
  return (
    <Component className={`type-caption text-neutral-500 ${className}`} {...props}>
      {children}
    </Component>
  );
}

/**
 * Metadata & Badges: 13-14px, weight 400
 */
export function MetadataText({
  children,
  className = "",
  as: Component = "span",
  ...props
}: TypographyComponentProps) {
  return (
    <Component className={`type-metadata text-neutral-500 ${className}`} {...props}>
      {children}
    </Component>
  );
}

/**
 * Code Snippets: JetBrains Mono, 14-15px desktop / 13-14px mobile, weight 400-500
 */
export function CodeSnippet({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code className={`type-code font-mono ${className}`} {...props}>
      {children}
    </code>
  );
}
