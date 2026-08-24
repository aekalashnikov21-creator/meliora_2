import { useState } from "react";
import { useInView, useScramble } from "../lib/hooks";
import { TICKER_ITEMS, TOTAL_BUDGET } from "../lib/data";
import { Diamond, OrnamentRule } from "./ui";

const WORDMARK = "MELIORA";

const PASSPORT = [
  { label: "Аккаунты", value: "2 Instagram" },
  { label: "Кампании", value: "4 цели" },
  { label: "Бюджет / день", value: `${TOTAL_BUDGET.toLocaleString("ru-RU")} ₸` },
  { label: "Фаза обучения", value: "72 часа" },
];

export function Cover() {
  const [ref, on] = useInView<HTMLDivElement>(0.1);
  const meta = useScramble("АВГУСТ 2026 · АЛМАТЫ · GMT+5 · KZT");

  return (
    <section
      id="cover"
      style={{ minHeight: "100svh" }}
      className="glow-gold grid-dark relative flex min-h-screen flex-col justify-between overflow-hidden bg-ink-deep px-5 pb-6 pt-[5.75rem] text-paper sm:min-h-[100svh] sm:px-10 lg:px-14 lg:pt-7"
    >
      {/* верхняя служебная строка */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline-dark/80 pb-5">
        <p className="flex items-center gap-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-muted-dark sm:text-[11px]">
          <Diamond className="h-1.5 w-1.5 text-gold-bright" />
          Внутренний регламент · рекламный кабинет
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-bright/90 sm:text-[11px]">
          {meta}
        </p>
      </header>

      {/* центральная композиция */}
      <div ref={ref} className="py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1
              aria-label={WORDMARK}
              className="font-display text-[clamp(3.2rem,11.5vw,8.5rem)] font-semibold leading-[0.95] tracking-[0.24em] text-paper-bright"
            >
              {WORDMARK.split("").map((ch, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`rv inline-block ${on ? "on" : ""}`}
                  style={{ transitionDelay: `${180 + i * 75}ms` }}
                >
                  {ch}
                </span>
              ))}
            </h1>
            <OrnamentRule dark className="mt-6 max-w-[26rem]" />
            <p
              className={`rv mt-5 font-mono text-[11px] font-medium uppercase tracking-[0.34em] text-gold-bright sm:text-xs ${on ? "on" : ""}`}
              style={{ transitionDelay: "760ms" }}
            >
              Beauty &amp; Spa&nbsp;&nbsp;·&nbsp;&nbsp;Medical
            </p>
          </div>

          <p
            className={`rv hidden max-w-[15rem] border-l border-hairline-dark pl-4 text-right font-mono text-[10px] leading-loose uppercase tracking-[0.18em] text-muted-dark sm:block sm:text-[11px] ${on ? "on" : ""}`}
            style={{ transitionDelay: "820ms" }}
          >
            Лист ожидания
            <br />
            открыт — первые
            <br />
            <span className="text-gold-bright">100 гостей</span>
          </p>
        </div>

        <div className="mt-10 max-w-3xl sm:mt-14">
          <h2 className="font-display text-[clamp(2rem,5.4vw,3.9rem)] font-medium leading-[1.06] text-paper-bright">
            <span className="rv-mask block">
              <span
                className={`rv-line ${on ? "on" : ""}`}
                style={{ transitionDelay: "300ms" }}
              >
                Технический запуск
              </span>
            </span>
            <span className="rv-mask block">
              <span
                className={`rv-line ${on ? "on" : ""}`}
                style={{ transitionDelay: "430ms" }}
              >
                рекламы:{" "}
                <em className="italic text-gold-bright">Instagram + ГЕО</em>
              </span>
            </span>
          </h2>
          <p
            className={`rv mt-6 max-w-xl text-[15px] leading-relaxed text-muted-dark sm:text-base ${on ? "on" : ""}`}
            style={{ transitionDelay: "560ms" }}
          >
            Пошаговая настройка кабинета, кампаний, групп и объявлений —
            простыми словами, для всей команды. Два трека: Instagram и
            геосервисы — Яндекс Карты, Google Maps, 2ГИС.
          </p>
        </div>
      </div>

      {/* паспорт запуска + аккаунты */}
      <div>
        <div
          className={`rv grid grid-cols-2 border border-hairline-dark/90 lg:grid-cols-4 ${on ? "on" : ""}`}
          style={{ transitionDelay: "640ms" }}
        >
          {PASSPORT.map((p, i) => (
            <div
              key={p.label}
              className={`group px-5 py-4 transition-colors duration-300 hover:bg-ink-soft/70 sm:px-6 sm:py-5 ${
                i % 2 === 1 ? "border-l border-hairline-dark/90" : ""
              } ${i > 1 ? "border-t border-hairline-dark/90 lg:border-t-0" : ""} ${
                i === 2 ? "lg:border-l" : ""
              } ${i === 3 ? "lg:border-l" : ""}`}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-dark sm:text-[10px]">
                {p.label}
              </p>
              <p className="mt-1.5 font-display text-xl font-semibold text-paper-bright transition-colors duration-300 group-hover:text-gold-bright sm:text-2xl">
                {p.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p
            className={`rv flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.14em] text-gold-bright sm:text-xs ${on ? "on" : ""}`}
            style={{ transitionDelay: "720ms" }}
          >
            <span>@meliora_almaty</span>
            <Diamond className="h-1.5 w-1.5 text-gold" />
            <span>@meliora_medical_almaty</span>
          </p>

          <DownloadButton on={on} />

          <p
            className={`rv flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-dark ${on ? "on" : ""}`}
            style={{ transitionDelay: "800ms" }}
          >
            листайте — регламент ниже
            <span className="scroll-hint block h-8 w-px bg-gold-bright" />
          </p>
        </div>
      </div>
    </section>
  );
}

type DlState = "idle" | "busy" | "done";

function DownloadButton({ on }: { on: boolean }) {
  const [state, setState] = useState<DlState>("idle");

  const run = async () => {
    if (state === "busy") return;
    setState("busy");
    try {
      const { downloadGuideDocx } = await import("../lib/docx");
      await downloadGuideDocx();
      setState("done");
      window.setTimeout(() => setState("idle"), 2600);
    } catch (e) {
      console.error("Не удалось собрать .docx", e);
      setState("idle");
    }
  };

  return (
    <button
      type="button"
      onClick={run}
      disabled={state === "busy"}
      className={`rv group inline-flex cursor-pointer items-center gap-3 border px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] transition-all duration-300 active:translate-y-px disabled:cursor-wait sm:text-[11px] ${
        on ? "on" : ""
      } ${
        state === "done"
          ? "border-gold-bright/80 bg-gold-bright/10 text-gold-bright"
          : "border-gold-bright/70 bg-gold text-ink-deep hover:bg-gold-bright"
      }`}
      style={{ transitionDelay: "760ms" }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {state === "done" ? (
          <path d="M2 7.5 5.5 11 12 3.5" stroke="currentColor" strokeWidth="1.8" />
        ) : (
          <path
            d="M7 1v8m0 0L3.5 5.5M7 9l3.5-3.5M1.5 12.5h11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        )}
      </svg>
      {state === "busy"
        ? "Готовим файл…"
        : state === "done"
          ? "Скачано ✓"
          : "Скачать регламент · .docx"}
    </button>
  );
}

export function Ticker() {
  const row = (hidden: boolean) => (
    <div
      aria-hidden={hidden}
      className="flex shrink-0 items-center"
    >
      {TICKER_ITEMS.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.18em]">
            {t}
          </span>
          <Diamond className="h-1.5 w-1.5 shrink-0 text-ink-deep/70" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-gold/50 bg-gold py-2.5 text-paper-bright">
      <div className="marquee-track flex w-max" style={{ "--speed": "36s" } as React.CSSProperties}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
