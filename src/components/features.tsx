import { useState } from "react";
import {
  CAMPAIGNS,
  CHECKLIST_ITEMS,
  KPI_ROWS,
  LEVELS,
  TOTAL_BUDGET,
} from "../lib/data";
import { useLocalStorageState } from "../lib/hooks";
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

/* ---------- 08 · интерактивный чек-лист ---------- */
const CHECK_KEY = "meliora-checklist-v1";

export function Checklist() {
  const [checked, setChecked] = useLocalStorageState<boolean[]>(
    CHECK_KEY,
    CHECKLIST_ITEMS.map(() => false)
  );
  const done = CHECKLIST_ITEMS.map((_, i) => !!checked[i]);
  const count = done.filter(Boolean).length;
  const allDone = count === CHECKLIST_ITEMS.length;

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = CHECKLIST_ITEMS.map((_, j) => !!prev[j]);
      next[i] = !next[i];
      return next;
    });

  return (
    <Reveal className="my-8">
      <div className="border border-hairline bg-paper-bright shadow-[0_24px_60px_-40px_rgba(31,27,22,0.5)]">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-hairline px-5 py-4 sm:px-7">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
              Отмечайте по мере выполнения
            </p>
            <p className="mt-1 font-display text-xl font-semibold text-ink">
              Выполнено {count} из {CHECKLIST_ITEMS.length}
            </p>
          </div>
          {count > 0 ? (
            <button
              type="button"
              onClick={() => setChecked(CHECKLIST_ITEMS.map(() => false))}
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold"
            >
              Сбросить
            </button>
          ) : null}
        </div>

        <div className="h-[3px] bg-hairline/60">
          <div
            className="h-full bg-gold transition-all duration-500 ease-out"
            style={{ width: `${(count / CHECKLIST_ITEMS.length) * 100}%` }}
          />
        </div>

        <ul className="px-2 sm:px-4">
          {CHECKLIST_ITEMS.map((item, i) => (
            <li key={i} className={i > 0 ? "border-t border-hairline" : ""}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={done[i]}
                className="group flex w-full items-start gap-4 px-3 py-4 text-left transition-colors duration-200 hover:bg-cream/70 sm:gap-5 sm:px-4"
              >
                <span className="pt-1 font-mono text-[11px] font-semibold text-gold/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`${done[i] ? "checked" : ""} mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center border transition-colors duration-300 ${
                    done[i]
                      ? "border-gold bg-gold"
                      : "border-gold/45 group-hover:border-gold"
                  }`}
                >
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
                    <path
                      className="check-path"
                      d="M4 10.5 L8.2 14.5 L16 6"
                      fill="none"
                      stroke="#faf6ec"
                      strokeWidth="2.4"
                      strokeLinecap="square"
                    />
                  </svg>
                </span>
                <span
                  className={`text-[15px] leading-relaxed transition-colors duration-300 ${
                    done[i]
                      ? "text-muted line-through decoration-gold/50"
                      : "text-ink/85"
                  }`}
                >
                  {item}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex min-h-[4.5rem] items-center justify-end border-t border-hairline px-6 py-4">
          {allDone ? (
            <p className="stamp-in inline-block border-[3px] border-gold px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.28em] text-gold">
              Готово к запуску ◆ 8 / 8
            </p>
          ) : (
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">
              прогресс сохраняется в браузере
            </p>
          )}
        </div>
      </div>
    </Reveal>
  );
}
