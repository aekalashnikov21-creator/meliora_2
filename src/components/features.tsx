import { useState } from "react";
import {
  CAMPAIGNS,
  KPI_ROWS,
  LEVELS,
  TOTAL_BUDGET,
  TRACKS,
} from "../lib/data";
import { Diamond, Reveal } from "./ui";

/* ---------- 01 · матрешка из трех уровней ---------- */
export function LevelsMatryoshka() {
  const [sel, setSel] = useState(1);
  const insets = ["inset-0", "inset-[13%]", "inset-[26%]"];

  return (
    <Reveal className="my-10">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-14">
        <div className="relative mx-auto aspect-square w-full max-w-[24rem] select-none">
          {LEVELS.map((l, i) => {
            const active = sel === i;
            return (
              <button
                key={l.level}
                type="button"
                aria-pressed={active}
                onClick={() => setSel(i)}
                className={`absolute ${insets[i]} border text-left transition-all duration-500 ${
                  active
                    ? "border-gold bg-cream shadow-[0_16px_44px_-24px_rgba(139,111,71,0.55)]"
                    : "border-hairline bg-paper-bright/60 hover:border-gold-soft hover:bg-cream/70"
                }`}
              >
                <span
                  className={`absolute left-2.5 top-2 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 sm:left-3 sm:text-[10px] ${
                    active ? "text-gold" : "text-muted/70"
                  }`}
                >
                  0{i + 1} · {l.level}
                </span>
              </button>
            );
          })}
        </div>

        <div>
          <div key={sel} className="anim-fade-swap">
            <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              <Diamond className="h-1.5 w-1.5" />
              Уровень {sel + 1} / 3
            </p>
            <h3 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
              {LEVELS[sel].level}
            </h3>
            <dl className="mt-6 space-y-5">
              <div className="border-l-2 border-gold pl-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  Что это
                </dt>
                <dd className="mt-1 max-w-md text-[15px] font-medium leading-relaxed text-ink sm:text-base">
                  {LEVELS[sel].what}
                </dd>
              </div>
              <div className="border-l-2 border-hairline pl-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  Простая аналогия
                </dt>
                <dd className="mt-1 max-w-md font-display text-xl italic leading-snug text-ink/85 sm:text-2xl">
                  {LEVELS[sel].analogy}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex items-center gap-2">
            {LEVELS.map((l, i) => (
              <button
                key={l.level}
                type="button"
                onClick={() => setSel(i)}
                className={`border px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.12em] transition-all duration-300 ${
                  sel === i
                    ? "border-gold bg-gold text-paper-bright"
                    : "border-hairline text-muted hover:border-gold hover:text-gold"
                }`}
              >
                0{i + 1}
              </button>
            ))}
            <span className="ml-3 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70 sm:block">
              нажмите на уровень
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- 02 · бюджетный реестр кампаний ---------- */
export function CampaignLedger() {
  const max = Math.max(...CAMPAIGNS.map((c) => c.budget));
  return (
    <div className="my-8">
      <ul className="border-t border-hairline">
        {CAMPAIGNS.map((c, i) => (
          <Reveal key={c.name} delay={i * 90}>
            <li className="group border-b border-hairline py-5 transition-colors duration-300 hover:bg-paper-bright">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-xs font-semibold text-gold/70 transition-colors group-hover:text-gold">
                    0{i + 1}
                  </span>
                  <h4 className="font-display text-2xl font-semibold text-ink sm:text-[1.65rem]">
                    {c.name}
                  </h4>
                  <span className="border border-gold/45 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-gold">
                    {c.goal}
                  </span>
                </div>
                <p className="font-mono text-lg font-semibold text-ink">
                  {c.budget.toLocaleString("ru-RU")}
                  <span className="ml-1 text-xs font-medium text-muted">
                    ₸ / день
                  </span>
                </p>
              </div>
              <p className="mt-1.5 max-w-xl pl-8 text-sm leading-relaxed text-muted">
                {c.why}
              </p>
              <div className="ml-8 mt-3.5 h-[3px] max-w-md bg-hairline/70">
                <div
                  className="bar-fill h-full bg-gold"
                  style={{ "--w": `${(c.budget / max) * 100}%` } as React.CSSProperties}
                />
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
      <Reveal delay={380}>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 pt-5">
          <p className="flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
            <Diamond className="h-1.5 w-1.5 text-gold" />
            Итого · в день
          </p>
          <p className="font-display text-4xl font-semibold text-ink">
            {TOTAL_BUDGET.toLocaleString("ru-RU")}{" "}
            <span className="text-2xl text-gold">₸</span>
          </p>
        </div>
      </Reveal>
    </div>
  );
}

/* ---------- 07 · нормативы метрик ---------- */
export function KpiBoard() {
  const rules = [
    { text: "72 часа — не трогаем обучение", live: true },
    { text: "CPL выше 8 000 тг → отключить", live: false },
    { text: "Частота выше 4 → новый креатив", live: false },
  ];
  return (
    <Reveal className="mt-10">
      <div className="border border-hairline-dark bg-ink-deep/60 px-6 py-6 sm:px-8 sm:py-8">
        <p className="flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-bright">
          <Diamond className="h-1.5 w-1.5" />
          Нормативы метрик · Ads Manager
        </p>
        <div className="mt-4">
          {KPI_ROWS.map((k, i) => (
            <div
              key={k.metric}
              className={`grid grid-cols-[120px_1fr] items-baseline gap-x-5 gap-y-1 py-4 transition-colors duration-300 hover:bg-ink-soft/60 sm:grid-cols-[190px_1fr_auto] sm:px-2 ${
                i > 0 ? "border-t border-hairline-dark" : ""
              }`}
            >
              <p className="font-mono text-sm font-semibold tracking-[0.08em] text-gold-bright">
                {k.metric}
              </p>
              <p className="text-sm leading-relaxed text-muted-dark">
                {k.desc}
              </p>
              <p className="col-start-1 font-display text-xl font-semibold text-paper-bright sm:col-start-auto sm:text-2xl">
                {k.norm}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2.5 border-t border-hairline-dark pt-5">
          {rules.map((r) => (
            <span
              key={r.text}
              className="flex items-center gap-2.5 border border-hairline-dark bg-ink px-3.5 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-paper/80 sm:text-[11px]"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  r.live ? "pulse-dot bg-gold-bright" : "bg-gold/60"
                }`}
              />
              {r.text}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- 00 · план действий: два трека ---------- */
export function LaunchPlan() {
  return (
    <Reveal className="my-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        {TRACKS.map((track, ti) => (
          <div
            key={track.name}
            className="group/track relative border border-hairline bg-paper-bright p-6 transition-all duration-500 hover:border-gold/60 hover:shadow-[0_28px_70px_-44px_rgba(139,111,71,0.65)] sm:p-8"
            style={{ transitionDelay: `${ti * 90}ms` }}
          >
            <span className="absolute right-5 top-5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/50 transition-colors duration-300 group-hover/track:text-gold">
              {String(ti + 1).padStart(2, "0")} / 02
            </span>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-gold">
              {track.name}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">
              {track.sub}
            </p>

            <ol className="relative mt-8 space-y-7 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-hairline">
              {track.phases.map((p) => (
                <li key={p.badge} className="relative pl-9">
                  <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rotate-45 border-[1.5px] border-gold bg-paper transition-all duration-300 group-hover/track:bg-gold/25" />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="border border-gold/40 bg-cream px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-gold">
                      {p.badge}
                    </span>
                    <span className="text-[15px] font-extrabold text-ink">
                      {p.title}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    {p.text}
                  </p>
                  {p.ref ? (
                    <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted/80">
                      → {p.ref}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/* ---------- маркерный список (оптимизация ГЕО) ---------- */
export function MarkedList({ items }: { items: string[] }) {
  return (
    <Reveal className="my-8">
      <ul className="border border-hairline bg-paper-bright">
        {items.map((item, i) => (
          <li
            key={i}
            className={`group/item flex items-start gap-4 px-5 py-4 transition-colors duration-300 hover:bg-cream/80 sm:px-6 ${
              i > 0 ? "border-t border-hairline" : ""
            }`}
          >
            <Diamond className="mt-[7px] h-2 w-2 shrink-0 text-gold/60 transition-colors duration-300 group-hover/item:text-gold" />
            <p className="text-[14.5px] leading-relaxed text-ink/85">{item}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}


