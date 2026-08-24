import { useMemo, useState } from "react";
import { CHAPTERS, TOTAL_BUDGET } from "./lib/data";
import type { Chapter } from "./lib/data";
import {
  useInView,
  useReadingProgress,
  useScrollSpy,
} from "./lib/hooks";
import { Cover, Ticker } from "./components/cover";
import {
  Callout,
  DataTable,
  Diamond,
  MaskLines,
  OrnamentRule,
  Paragraph,
  Steps,
  SubHeading,
} from "./components/ui";
import {
  CampaignLedger,
  KpiBoard,
  LaunchPlan,
  LevelsMatryoshka,
  MarkedList,
} from "./components/features";

/* ---------- оглавление: левый корешок (desktop) ---------- */
function Spine({ active }: { active: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-hairline-dark bg-ink-deep lg:flex">
      <a href="#cover" className="block border-b border-hairline-dark px-7 py-6">
        <p className="flex items-center gap-2.5">
          <Diamond className="h-2 w-2 text-gold-bright" />
          <span className="font-display text-xl font-semibold tracking-[0.3em] text-paper-bright">
            MELIORA
          </span>
        </p>
        <p className="mt-2.5 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-dark">
          Техзапуск рекламы · Instagram + ГЕО
        </p>
      </a>

      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <p className="px-3 pb-3 font-mono text-[9px] uppercase tracking-[0.26em] text-muted-dark/80">
          Содержание
        </p>
        <ul>
          {CHAPTERS.map((c) => {
            const isActive = active === c.id;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className={`group flex items-baseline gap-3 border-l-2 px-3 py-2.5 transition-all duration-300 ${
                    isActive
                      ? "border-gold bg-ink-soft/70"
                      : "border-transparent hover:border-gold/40 hover:bg-ink-soft/40"
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] font-semibold transition-colors ${
                      isActive
                        ? "text-gold-bright"
                        : "text-gold/55 group-hover:text-gold"
                    }`}
                  >
                    {c.num}
                  </span>
                  <span
                    className={`text-[13px] leading-snug transition-colors ${
                      isActive
                        ? "font-semibold text-paper-bright"
                        : "text-muted-dark group-hover:text-paper/85"
                    }`}
                  >
                    {c.title}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-hairline-dark px-7 py-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-muted-dark">
          Бюджет · день
        </p>
        <p className="mt-1 font-display text-3xl font-semibold text-gold-bright">
          {TOTAL_BUDGET.toLocaleString("ru-RU")} ₸
        </p>
        <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-dark/80">
          4 кампании · 2 аккаунта · KZT
        </p>
      </div>
    </aside>
  );
}

/* ---------- мобильная шапка с чипами разделов ---------- */
function MobileNav({ active }: { active: string }) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-hairline-dark bg-ink-deep lg:hidden">
      <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
        <a href="#cover" className="flex items-center gap-2">
          <Diamond className="h-1.5 w-1.5 text-gold-bright" />
          <span className="font-display text-sm font-semibold tracking-[0.26em] text-paper-bright">
            MELIORA
          </span>
        </a>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-dark">
          {TOTAL_BUDGET.toLocaleString("ru-RU")} ₸ / день
        </span>
      </div>
      <nav className="overflow-x-auto px-4 pb-2.5 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-1.5">
          {CHAPTERS.map((c) => {
            const isActive = active === c.id;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                className={`whitespace-nowrap border px-3 py-1.5 font-mono text-[10px] font-semibold tracking-[0.1em] transition-colors duration-300 ${
                  isActive
                    ? "border-gold bg-gold text-paper-bright"
                    : "border-hairline-dark text-muted-dark hover:border-gold/60 hover:text-gold-bright"
                }`}
              >
                {c.num} · {c.part}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

/* ---------- шапка раздела ---------- */
function ChapterHeader({ ch }: { ch: Chapter }) {
  const [ref, on] = useInView<HTMLDivElement>(0.2);
  const dark = !!ch.dark;
  return (
    <div ref={ref} className={`relative ${on ? "on" : ""}`}>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-8 right-0 select-none font-display text-[7.5rem] font-semibold leading-none sm:-top-12 sm:text-[11rem] lg:-top-16 lg:text-[13rem] ${
          dark ? "text-gold-bright/10" : "text-gold/10"
        }`}
      >
        {ch.num}
      </span>

      <p
        className={`rv flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.26em] ${
          dark ? "text-gold-bright" : "text-gold"
        } ${on ? "on" : ""}`}
      >
        <Diamond className="h-1.5 w-1.5" />
        Раздел {ch.num} · {ch.part}
      </p>

      <MaskLines
        className={`mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.06] sm:text-5xl lg:text-[3.3rem] ${
          dark ? "text-paper-bright" : "text-ink"
        }`}
        lines={[
          <>
            {ch.title}
            {ch.titleNote ? (
              <span
                className={`ml-3 align-middle font-display text-lg font-medium italic sm:text-xl ${
                  dark ? "text-muted-dark" : "text-muted"
                }`}
              >
                — {ch.titleNote}
              </span>
            ) : null}
          </>,
        ]}
      />

      <div className="mt-8 flex items-center gap-3">
        <span className="rule-draw h-px w-28 bg-gold" />
        <span
          className={`h-px flex-1 ${dark ? "bg-hairline-dark" : "bg-hairline"}`}
        />
      </div>
    </div>
  );
}

/* ---------- блоки раздела ---------- */
function Blocks({ ch }: { ch: Chapter }) {
  const tone = ch.dark ? "ink" : "paper";
  let counter = 0;
  return (
    <>
      {ch.blocks.map((b, i) => {
        switch (b.kind) {
          case "para":
            return <Paragraph key={i} text={b.text} />;
          case "sub":
            return <SubHeading key={i} text={b.text} />;
          case "steps": {
            const start = counter + 1;
            counter += b.items.length;
            return <Steps key={i} items={b.items} start={start} tone={tone} />;
          }
          case "table":
            return (
              <DataTable
                key={i}
                headers={b.headers}
                rows={b.rows}
                caption={b.caption}
              />
            );
          case "callout":
            return <Callout key={i} tag={b.tag} text={b.text} tone={b.tone} />;
          case "levels":
            return <LevelsMatryoshka key={i} />;
          case "campaigns":
            return <CampaignLedger key={i} />;
          case "kpi":
            return <KpiBoard key={i} />;
          case "list":
            return <MarkedList key={i} items={b.items} />;
          case "tracks":
            return <LaunchPlan key={i} />;
          default:
            return null;
        }
      })}
    </>
  );
}

function ChapterSection({ ch }: { ch: Chapter }) {
  return (
    <section
      id={ch.id}
      className={`relative scroll-mt-24 border-b lg:scroll-mt-0 ${
        ch.dark
          ? "grid-dark border-hairline-dark bg-ink text-paper"
          : "border-hairline bg-paper"
      }`}
    >
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <ChapterHeader ch={ch} />
        <div className="mt-9">
          <Blocks ch={ch} />
        </div>
      </div>
    </section>
  );
}

/* ---------- скачивание .docx ---------- */
function FooterDownload() {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  const run = async () => {
    if (state === "busy") return;
    setState("busy");
    try {
      const { downloadGuideDocx } = await import("./lib/docx");
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
      className={`inline-flex shrink-0 cursor-pointer items-center gap-3 border px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] transition-all duration-300 active:translate-y-px disabled:cursor-wait ${
        state === "done"
          ? "border-gold-bright/80 bg-gold-bright/10 text-gold-bright"
          : "border-gold-bright/70 bg-gold text-ink-deep hover:bg-gold-bright"
      }`}
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
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
          : "Скачать .docx"}
    </button>
  );
}

/* ---------- финал ---------- */
function Footer() {
  return (
    <footer className="glow-gold grid-dark relative overflow-hidden bg-ink-deep px-6 py-16 text-paper sm:px-10 lg:px-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-3">
              <Diamond className="h-2 w-2 text-gold-bright" />
              <span className="font-display text-3xl font-semibold tracking-[0.28em] text-paper-bright">
                MELIORA
              </span>
            </p>
            <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-gold-bright">
              Beauty &amp; Spa · Medical
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-dark">
              Технический запуск рекламы в Instagram и геосервисах —
              внутренний регламент команды: кабинет, четыре кампании,
              лид-формы, Яндекс Карты / Google Maps / 2ГИС и нормативы метрик.
            </p>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.12em] text-gold-bright">
              <span>@meliora_almaty</span>
              <Diamond className="h-1.5 w-1.5 text-gold" />
              <span>@meliora_medical_almaty</span>
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-12 gap-y-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-dark">
            <div>
              <dt>Дата</dt>
              <dd className="mt-1.5 text-sm normal-case tracking-normal text-paper/85">
                Август 2026
              </dd>
            </div>
            <div>
              <dt>Город</dt>
              <dd className="mt-1.5 text-sm normal-case tracking-normal text-paper/85">
                Алматы · GMT+5
              </dd>
            </div>
            <div>
              <dt>Валюта</dt>
              <dd className="mt-1.5 text-sm normal-case tracking-normal text-paper/85">
                KZT · тенге
              </dd>
            </div>
            <div>
              <dt>Разделы</dt>
              <dd className="mt-1.5 text-sm normal-case tracking-normal text-paper/85">
                09 · два трека
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border border-hairline-dark bg-ink-soft/50 px-6 py-6 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="font-display text-xl font-semibold tracking-wide text-paper-bright">
              Регламент с собой — Word или один HTML-файл
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-dark">
              Два автономных формата:{" "}
              <span className="font-mono text-[12px] text-gold-bright">.docx</span>{" "}
              собирается прямо в браузере (обложка, таблицы, нумерация шагов,
              футер со страницами),{" "}
              <span className="font-mono text-[12px] text-gold-bright">.html</span>{" "}
              — один самодостаточный файл: открывается без интернета и
              печатается в PDF через Ctrl+P.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <FooterDownload />
            <a
              href="./meliora-guide.html"
              download="Meliora_Технический_запуск_рекламы.html"
              className="inline-flex shrink-0 items-center gap-3 border border-hairline-dark px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-paper transition-all duration-300 hover:border-gold-bright hover:bg-gold-bright/10 hover:text-gold-bright active:translate-y-px"
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M7 1v8m0 0L3.5 5.5M7 9l3.5-3.5M1.5 12.5h11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
              HTML · один файл
            </a>
          </div>
        </div>

        <OrnamentRule dark className="mt-12" />
        <p className="mt-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-dark/80">
          <span>Meliora · 2026 · составлено для команды</span>
          <span>сначала упаковка — потом реклама</span>
        </p>
      </div>
    </footer>
  );
}

/* ---------- приложение ---------- */
export default function App() {
  const ids = useMemo(() => CHAPTERS.map((c) => c.id), []);
  const active = useScrollSpy(ids);
  const progress = useReadingProgress();

  return (
    <div className="noise">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
        <div
          className="h-full bg-gold-bright"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <MobileNav active={active} />
      <Spine active={active} />
      <main className="lg:pl-[280px]">
        <Cover />
        <Ticker />
        {CHAPTERS.map((ch) => (
          <ChapterSection key={ch.id} ch={ch} />
        ))}
        <Footer />
      </main>
    </div>
  );
}
