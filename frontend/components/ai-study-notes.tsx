import type { ReactNode } from "react";

type AiStudyNotesProps = {
  text: string;
  tone?: "default" | "error";
};

type NoteBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

const headingLabels = new Set([
  "introduction",
  "key concepts",
  "step by step explanation",
  "step-by-step explanation",
  "formula explanation",
  "real world example",
  "real-world example",
  "practical applications",
  "interview tips",
  "study plan",
  "daily plan",
  "revision plan",
  "recommended labs",
  "recommended quizzes",
  "coding practice",
  "summary",
  "next steps",
]);

function stripMarkdown(value: string) {
  return value
    .replace(/```[a-z]*\s*/gi, "")
    .replace(/```/g, "")
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/^#+\s*/g, "")
    .replace(/^>\s*/g, "")
    .replace(/#/g, "")
    .replace(/>/g, "")
    .trim();
}

function cleanLine(value: string) {
  return stripMarkdown(value)
    .replace(/^\s*[-•]\s+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isHeading(rawLine: string, line: string) {
  const normalized = line.replace(/:$/, "").toLowerCase();

  return (
    /^#{1,6}\s+/.test(rawLine) ||
    headingLabels.has(normalized) ||
    (line.endsWith(":") && line.length <= 72 && !/^\d/.test(line))
  );
}

function parseStudyNotes(text: string): NoteBlock[] {
  const blocks: NoteBlock[] = [];
  let pendingList: string[] = [];

  function flushList() {
    if (pendingList.length > 0) {
      blocks.push({ type: "list", items: pendingList });
      pendingList = [];
    }
  }

  text.split(/\r?\n/).forEach((rawLine) => {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    const numbered = trimmed.match(/^\d+[\).]\s+(.+)$/);
    const bullet = trimmed.match(/^[-*•]\s+(.+)$/);
    const line = cleanLine(numbered?.[1] ?? bullet?.[1] ?? trimmed);

    if (!line) {
      return;
    }

    if (numbered || bullet) {
      pendingList.push(line);
      return;
    }

    flushList();

    if (isHeading(trimmed, line)) {
      blocks.push({ type: "heading", text: line.replace(/:$/, "") });
      return;
    }

    blocks.push({ type: "paragraph", text: line });
  });

  flushList();
  return blocks;
}

function renderInline(text: string) {
  const parts: ReactNode[] = [];
  const pattern =
    /\b(important|formula|example|summary|interview tip|step|real world|practical|remember|key concept|application|revision|quiz|lab|coding)\b/gi;
  let cursor = 0;

  text.replace(pattern, (match, _word, offset: number) => {
    if (offset > cursor) {
      parts.push(text.slice(cursor, offset));
    }

    parts.push(
      <strong key={`${match}-${offset}`} className="font-bold text-slate-950 dark:text-white">
        {match}
      </strong>,
    );
    cursor = offset + match.length;
    return match;
  });

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts.length > 0 ? parts : text;
}

export function cleanAiResponseText(text: string) {
  return parseStudyNotes(text)
    .map((block) => {
      if (block.type === "list") {
        return block.items.map((item, index) => `${index + 1}. ${item}`).join("\n");
      }

      return block.text;
    })
    .join("\n\n");
}

export function AiStudyNotes({ text, tone = "default" }: AiStudyNotesProps) {
  const blocks = parseStudyNotes(text);

  return (
    <div
      className={`space-y-4 text-left text-sm leading-7 ${
        tone === "error"
          ? "text-rose-700 dark:text-rose-200"
          : "text-slate-700 dark:text-slate-200"
      }`}
    >
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h3
              key={`${block.text}-${index}`}
              className="text-base font-black tracking-[-0.02em] text-slate-950 dark:text-white"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "list") {
          return (
            <ol key={`list-${index}`} className="space-y-3">
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`} className="flex gap-3">
                  <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-cyan-50 text-[11px] font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                    {itemIndex + 1}
                  </span>
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ol>
          );
        }

        return <p key={`${block.text}-${index}`}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}
