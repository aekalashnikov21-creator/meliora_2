import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import {
  CAMPAIGNS,
  CHAPTERS,
  KPI_ROWS,
  LEVELS,
  TRACKS,
} from "./data";
import type { Block, Chapter, StepItem } from "./data";

/* ---------- ЦВЕТА И ШРИФТЫ БРЕНДА ---------- */
const GOLD = "8B6F47";
const DARK = "1F1B16";
const MUTED = "6B645A";
const WHITE = "FFFFFF";
const CREAM = "F5F1E8";
const STRIPE = "F1ECE4";
const LINE = "C9BBA0";

const pt = (v: number) => v * 2; // half-points
const tw = (v: number) => v * 20; // twips из пунктов

const thinBorder = { style: BorderStyle.SINGLE, size: 6, color: LINE };
const tableBorders = {
  top: thinBorder,
  bottom: thinBorder,
  left: thinBorder,
  right: thinBorder,
  insideHorizontal: thinBorder,
  insideVertical: thinBorder,
};
const cellMargins = { top: 90, bottom: 90, left: 140, right: 140 };

/* ---------- СЛУЖЕБНЫЕ ПОСТРОИТЕЛИ ---------- */

function cover(
  text: string,
  size: number,
  color: string,
  after: number,
  opts: { bold?: boolean; ls?: number; font?: string } = {}
): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: tw(after) },
    children: [
      new TextRun({
        text,
        size: pt(size),
        color,
        bold: opts.bold,
        font: opts.font ?? "Calibri",
        characterSpacing: opts.ls,
      }),
    ],
  });
}

function h1(num: string, text: string): Paragraph {
  return new Paragraph({
    spacing: { before: tw(20), after: tw(10) },
    children: [
      new TextRun({
        text: `${num}  `,
        bold: true,
        size: pt(15),
        color: GOLD,
      }),
      new TextRun({
        text,
        bold: true,
        size: pt(15),
        color: DARK,
        font: "Georgia",
      }),
    ],
  });
}

function h2(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: tw(12), after: tw(6) },
    children: [
      new TextRun({
        text,
        bold: true,
        italics: true,
        size: pt(12),
        color: DARK,
        font: "Georgia",
      }),
    ],
  });
}

function step(n: number, lead: string, body = ""): Paragraph {
  const children: TextRun[] = [
    new TextRun({ text: `${n}. `, bold: true, color: GOLD }),
  ];
  if (lead) children.push(new TextRun({ text: lead, bold: true }));
  if (body) children.push(new TextRun({ text: ` ${body}` }));
  return new Paragraph({
    indent: { left: tw(14) },
    spacing: { after: tw(5) },
    children,
  });
}

function para(
  text: string,
  opts: { italic?: boolean; color?: string } = {}
): Paragraph {
  return new Paragraph({
    spacing: { after: tw(6) },
    children: [
      new TextRun({
        text,
        italics: opts.italic,
        color: opts.color,
      }),
    ],
  });
}

function spacer(after = 2): Paragraph {
  return new Paragraph({ spacing: { after: tw(after) }, children: [] });
}

function callout(lead: string, text: string): Table {
  const cell = new TableCell({
    shading: { type: ShadingType.CLEAR, fill: CREAM, color: "auto" },
    borders: {
      top: thinBorder,
      bottom: thinBorder,
      left: thinBorder,
      right: thinBorder,
    },
    margins: { top: 130, bottom: 130, left: 180, right: 180 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: `${lead.toUpperCase()}: `,
            bold: true,
            color: GOLD,
            size: pt(10),
          }),
          new TextRun({ text, size: pt(10) }),
        ],
      }),
    ],
  });
  return new Table({
    rows: [new TableRow({ children: [cell] })],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function dataTable(
  headers: string[],
  rows: string[][],
  widths?: number[]
): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(
      (h) =>
        new TableCell({
          shading: { type: ShadingType.CLEAR, fill: GOLD, color: "auto" },
          margins: cellMargins,
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: h,
                  bold: true,
                  color: WHITE,
                  size: pt(10),
                }),
              ],
            }),
          ],
        })
    ),
  });
  const bodyRows = rows.map(
    (row, ri) =>
      new TableRow({
        children: row.map(
          (val) =>
            new TableCell({
              shading: {
                type: ShadingType.CLEAR,
                fill: ri % 2 === 0 ? WHITE : STRIPE,
                color: "auto",
              },
              margins: cellMargins,
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: val, size: pt(9.5) })],
                }),
              ],
            })
        ),
      })
  );
  return new Table({
    rows: [headerRow, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: widths,
    alignment: AlignmentType.CENTER,
    borders: tableBorders,
  });
}

/* ---------- РЕНДЕР БЛОКОВ РАЗДЕЛА ---------- */

function renderBlock(
  block: Block,
  stepCounter: { n: number }
): (Paragraph | Table)[] {
  switch (block.kind) {
    case "para":
      return [para(block.text)];
    case "sub":
      return [h2(block.text)];
    case "steps": {
      const items: StepItem[] = block.items;
      return items.map((s) => {
        stepCounter.n += 1;
        return step(stepCounter.n, s.lead, s.body ?? "");
      });
    }
    case "table": {
      const out: (Paragraph | Table)[] = [];
      if (block.caption) out.push(h2(block.caption));
      out.push(
        dataTable(
          block.headers,
          block.rows,
          block.headers.length === 2 ? [2600, 6400] : undefined
        )
      );
      out.push(spacer());
      return out;
    }
    case "callout": {
      return [callout(block.tag, block.text), spacer()];
    }
    case "levels":
      return [
        dataTable(
          ["Уровень", "Что это", "Простая аналогия"],
          LEVELS.map((l) => [l.level, l.what, l.analogy]),
          [2100, 3600, 3300]
        ),
        spacer(),
      ];
    case "campaigns":
      return [
        dataTable(
          ["Кампания", "Цель", "Бюджет в день", "Зачем"],
          CAMPAIGNS.map((c) => [
            c.name,
            c.goal,
            `${c.budget.toLocaleString("ru-RU")} тг`,
            c.why,
          ]),
          [1900, 1700, 1900, 3500]
        ),
        spacer(),
      ];
    case "kpi":
      return [
        dataTable(
          ["Показатель", "Что это", "Норма"],
          KPI_ROWS.map((k) => [k.metric, k.desc, k.norm]),
          [2600, 3400, 3000]
        ),
        spacer(),
      ];
    case "list":
      return block.items.map(
        (text) =>
          new Paragraph({
            indent: { left: tw(14) },
            spacing: { after: tw(5) },
            children: [
              new TextRun({ text: "◆  ", color: GOLD, bold: true }),
              new TextRun({ text }),
            ],
          })
      );
    case "tracks": {
      const out: (Paragraph | Table)[] = [];
      for (const track of TRACKS) {
        out.push(h2(`${track.name} — ${track.sub}`));
        track.phases.forEach((p, i) => {
          out.push(step(i + 1, `${p.badge} · ${p.title}.`, p.text));
        });
      }
      return out;
    }
    default:
      return [];
  }
}

function renderChapter(ch: Chapter, first: boolean): (Paragraph | Table)[] {
  const counter = { n: 0 };
  const out: (Paragraph | Table)[] = [];
  const title = new Paragraph({
    spacing: { before: tw(20), after: tw(10) },
    pageBreakBefore: first,
    children: [
      new TextRun({ text: `${ch.num}  `, bold: true, size: pt(15), color: GOLD }),
      new TextRun({
        text: ch.title,
        bold: true,
        size: pt(15),
        color: DARK,
        font: "Georgia",
      }),
      ...(ch.titleNote
        ? [
            new TextRun({
              text: `  (${ch.titleNote})`,
              bold: true,
              size: pt(11),
              color: MUTED,
              font: "Georgia",
            }),
          ]
        : []),
    ],
  });
  out.push(title);
  for (const block of ch.blocks) out.push(...renderBlock(block, counter));
  return out;
}

/* ---------- ОБЛОЖКА И ОГЛАВЛЕНИЕ ---------- */

function coverPage(): Paragraph[] {
  return [
    new Paragraph({ children: [] }),
    cover("MELIORA", 30, DARK, 4, { bold: true, ls: 30 }),
    cover("BEAUTY & SPA  ·  MEDICAL", 11, GOLD, 26, { ls: 20 }),
    cover("Технический запуск рекламы: Instagram + ГЕО", 17, DARK, 6, {
      bold: true,
    }),
    cover("Кабинет, кампании, объявления — и геосервисы:", 11, MUTED, 2),
    cover("Яндекс Карты · Google Maps · 2ГИС — простыми словами, для всей команды", 11, MUTED, 26),
    cover("@meliora_almaty  ·  @meliora_medical_almaty", 11, GOLD, 4, { ls: 10 }),
    cover("Август 2026 · Алматы", 10, MUTED, 0),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function tocPage(): Paragraph[] {
  const out: Paragraph[] = [h2("Содержание")];
  for (const ch of CHAPTERS) {
    out.push(
      new Paragraph({
        spacing: { after: tw(4) },
        children: [
          new TextRun({ text: `${ch.num}   `, bold: true, color: GOLD }),
          new TextRun({
            text: ch.titleNote
              ? `${ch.title} (${ch.titleNote})`
              : ch.title,
          }),
        ],
      })
    );
  }
  return out;
}

/* ---------- СБОРКА И СКАЧИВАНИЕ ---------- */

export async function downloadGuideDocx(): Promise<void> {
  const children: (Paragraph | Table)[] = [
    ...coverPage(),
    ...tocPage(),
  ];
  CHAPTERS.forEach((ch, i) => {
    children.push(...renderChapter(ch, i === 0));
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: pt(10.5), color: DARK },
        },
      },
    },
    sections: [
      {
        properties: {},
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Meliora · ", size: pt(9), color: MUTED }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: pt(9),
                    color: MUTED,
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Meliora_Технический_запуск_рекламы.docx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
