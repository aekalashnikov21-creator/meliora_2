import type { ReactNode } from "react";
import { useInView } from "../lib/hooks";
import type { StepItem } from "../lib/data";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`rv ${on ? "on" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function MaskLines({
  lines,
  className = "",
  lineClassName = "",
  delayStep = 110,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delayStep?: number;
}) {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`rv-mask ${on ? "on" : ""} ${className}`}>
      {lines.map((l, i) => (
        <span
          key={i}
          className={`rv-line ${lineClassName}`}
          style={{ transitionDelay: `${i * delayStep}ms` }}
        >
          {l}
        </span>
      ))}
    </div>
  );
}

export function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" className={className} aria-hidden="true">
      <rect
        x="2.4"
        y="2.4"
        width="5.2"
        height="5.2"
        transform="rotate(45 5 5)"
        fill="currentColor"
      />
    </svg>
  );
}

export function OrnamentRule({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        className={`h-px flex-1 ${dark ? "bg-hairline-dark" : "bg-hairline"}`}
      />
      <Diamond className="h-2 w-2 text-gold" />
      <span
        className={`h-px flex-1 ${dark ? "bg-hairline-dark" : "bg-hairline"}`}
      />
    </div>
  );
}

export function Callout({
  tag,
  text,
  tone,
}: {
  tag: string;
  text: string;
  tone: "gold" | "ink";
}) {
  const isInk = tone === "ink";
  return (
    <Reveal className="my-8">
      <figure
        className={`relative overflow-hidden border-l-[3px] border-gold px-6 py-5 sm:px-8 sm:py-6 ${
          isInk ? "bg-ink text-paper" : "bg-cream"
        }`}
      >
        <Diamond
          className={`pointer-events-none absolute -right-4 -top-4 h-20 w-20 ${
            isInk ? "text-gold/15" : "text-gold/12"
          }`}
        />
        <figcaption
          className={`mb-1.5 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] ${
            isInk ? "text-gold-bright" : "text-gold"
          }`}
        >
          <Diamond className="h-1.5 w-1.5" />
          {tag}
        </figcaption>
        <p
          className={`max-w-2xl text-[15px] leading-relaxed sm:text-base ${
            isInk ? "text-paper/90" : "text-ink/85"
          }`}
        >
          {text}
        </p>
      </figure>
    </Reveal>
  );
}

export function Steps({
  items,
  start = 1,
  tone = "paper",
}: {
  items: StepItem[];
  start?: number;
  tone?: "paper" | "ink";
}) {
  const ink = tone === "ink";
  return (
    <ol className={`my-6 border-t ${ink ? "border-hairline-dark" : "border-hairline"}`}>
      {items.map((s, i) => (
        <Reveal key={i} delay={i * 60}>
          <li
            className={`group grid grid-cols-[44px_1fr] gap-3 border-b py-4 pl-1 pr-2 transition-colors duration-300 sm:grid-cols-[60px_1fr] sm:gap-5 sm:py-5 ${
              ink
                ? "border-hairline-dark hover:bg-ink-soft/60"
                : "border-hairline hover:bg-paper-bright"
            }`}
          >
            <span
              className={`pt-0.5 font-mono text-sm font-semibold transition-colors duration-300 sm:text-base ${
                ink
                  ? "text-gold-bright/70 group-hover:text-gold-bright"
                  : "text-gold/75 group-hover:text-gold"
              }`}
            >
              {String(start + i).padStart(2, "0")}
              <span className="ml-0.5 align-top text-[9px]">◆</span>
            </span>
            <p
              className={`text-[15px] leading-relaxed sm:text-base ${
                ink ? "text-paper/70" : "text-ink/75"
              }`}
            >
              <span
                className={`font-bold ${ink ? "text-paper" : "text-ink"}`}
              >
                {s.lead}
              </span>
              {s.body ? ` ${s.body}` : ""}
            </p>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

export function DataTable({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: string[][];
  caption?: string;
}) {
  return (
    <Reveal className="my-8">
      {caption ? (
        <p className="mb-3 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
          <Diamond className="h-1.5 w-1.5" />
          {caption}
        </p>
      ) : null}
      <div className="touch-scroll overflow-x-auto border border-hairline bg-paper-bright shadow-[0_18px_40px_-28px_rgba(31,27,22,0.45)]">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="bg-gold">
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-paper-bright sm:px-5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className={`transition-colors duration-200 hover:bg-gold/10 ${
                  ri % 2 === 1 ? "bg-paper-dim/55" : "bg-paper-bright"
                }`}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`border-t border-hairline px-4 py-3 align-top text-sm leading-relaxed sm:px-5 ${
                      ci === 0
                        ? "font-semibold text-ink"
                        : "text-ink/78"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}

export function SubHeading({ text }: { text: string }) {
  return (
    <Reveal className="mb-1 mt-10">
      <h3 className="flex items-baseline gap-3">
        <span className="font-display text-2xl font-semibold italic text-ink sm:text-[1.7rem]">
          {text}
        </span>
        <span className="rule-draw h-px flex-1 bg-gold/50" />
      </h3>
    </Reveal>
  );
}

export function Paragraph({ text }: { text: string }) {
  return (
    <Reveal>
      <p className="max-w-2xl text-[15px] leading-relaxed text-ink/78 sm:text-base">
        {text}
      </p>
    </Reveal>
  );
}
