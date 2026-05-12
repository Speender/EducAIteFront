import type { ExecuteFlashcardCodeResponseDto } from "@/features/flashcards/api/dto";

export type ToneClasses = {
  border: string;
  background: string;
  badge: string;
};

export const technicalItemTypes = new Set([
  "CodeReading",
  "Debugging",
  "Sql",
  "Algorithm",
  "OutputPrediction",
  "FillInCode",
  "Programming",
]);

export const runnableItemTypes = new Set(["Debugging", "Sql", "Algorithm", "FillInCode", "Programming"]);

export type JsonRecord = Record<string, unknown>;

export type RuntimeLanguage = "cpp" | "csharp" | "java" | "python" | "javascript" | "sql";

export type ExecutionTestCase = {
  name: string;
  stdin: string;
  expectedOutput: string;
};

export type ChoiceOption = {
  id: string;
  text: string;
};

export const runtimeLanguageOptions: RuntimeLanguage[] = [
  "cpp",
  "csharp",
  "java",
  "python",
  "javascript",
  "sql",
];

export function normalizeItemType(value: string) {
  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "sql":
      return "Sql";
    case "code_reading":
    case "codereading":
    case "code reading":
      return "CodeReading";
    case "debugging":
      return "Debugging";
    case "algorithm":
      return "Algorithm";
    case "output_prediction":
    case "outputprediction":
    case "output prediction":
      return "OutputPrediction";
    case "fill_in_code":
    case "fillincode":
    case "fill in code":
      return "FillInCode";
    case "programming":
      return "Programming";
    default:
      return value;
  }
}

export function formatItemTypeLabel(itemType: string) {
  return normalizeItemType(itemType).replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function getReviewToneClasses(tone: string): ToneClasses {
  switch (tone) {
    case "correct":
      return { border: "border-emerald-500/20", background: "bg-emerald-500/[0.03]", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    case "close":
      return { border: "border-sky-500/20", background: "bg-sky-500/[0.03]", badge: "bg-sky-500/10 text-sky-300 border-sky-500/20" };
    case "partial":
      return { border: "border-amber-500/20", background: "bg-amber-500/[0.03]", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    default:
      return { border: "border-rose-500/20", background: "bg-rose-500/[0.03]", badge: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
  }
}

export function parseJsonObject(value?: string): JsonRecord {
  try {
    const parsed = JSON.parse(value || "{}") as unknown;
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function readString(source: JsonRecord, keys: string[]) {
  for (const key of keys) {
    if (typeof source[key] === "string") {
      return source[key] as string;
    }
  }

  return "";
}

export function readSupportedLanguages(source: JsonRecord, fallbackLanguage?: string, isRunnable?: boolean) {
  const configured = Array.isArray(source.supportedLanguages) ? source.supportedLanguages : [];
  const normalizedConfigured = configured
    .map((language) => normalizeRuntimeLanguage(language))
    .filter((language): language is RuntimeLanguage => Boolean(language));

  if (normalizedConfigured.length > 0) {
    return Array.from(new Set(normalizedConfigured));
  }

  const fallback = normalizeRuntimeLanguage(fallbackLanguage);
  if (fallback) {
    return [fallback];
  }

  return isRunnable ? runtimeLanguageOptions : [];
}

export function normalizeRuntimeLanguage(value: unknown): RuntimeLanguage | null {
  if (typeof value !== "string") return null;

  const lowered = value.trim().toLowerCase();

  switch (lowered) {
    case "c#":
    case "cs":
    case "csharp":
    case "c-sharp":
      return "csharp";
    case "c++":
    case "cpp":
    case "cplusplus":
      return "cpp";
    case "js":
    case "javascript":
    case "node":
    case "nodejs":
      return "javascript";
    case "py":
    case "python":
    case "python3":
      return "python";
    case "java":
      return "java";
    case "sql":
      return "sql";
    default:
      return null;
  }
}

export function readExecutionTests(source: JsonRecord, keys: string[]) {
  const entries = readRecordArray(source, keys);
  return entries.flatMap((entry, index) => {
    const expectedOutput = readString(entry, ["expectedOutput", "expected_output", "output"]);
    if (!expectedOutput.trim()) {
      return [];
    }

    return [{
      name: readString(entry, ["name", "label"]).trim() || `Example ${index + 1}`,
      stdin: readString(entry, ["stdin", "input", "args"]),
      expectedOutput,
    }];
  });
}

export function readChoiceOptions(source: JsonRecord): ChoiceOption[] {
  const raw = source.options;
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    const id = typeof entry.id === "string" ? entry.id.trim() : "";
    const text = typeof entry.text === "string" ? entry.text.trim() : "";
    if (!id || !text) return [];
    return [{ id, text }];
  });
}

export function readSingleSelect(source: JsonRecord) {
  return source.singleSelect !== false;
}

export function readStarterCode(source: JsonRecord, language: RuntimeLanguage | "") {
  if (!language) {
    return "";
  }

  const starterCodeByLanguage = source.starterCodeByLanguage;
  if (!isRecord(starterCodeByLanguage)) {
    return "";
  }

  const direct = starterCodeByLanguage[language];
  if (typeof direct === "string") {
    return direct;
  }

  const matchedKey = Object.keys(starterCodeByLanguage).find((key) => normalizeRuntimeLanguage(key) === language);
  const matchedValue = matchedKey ? starterCodeByLanguage[matchedKey] : undefined;
  return typeof matchedValue === "string" ? matchedValue : "";
}

export function readPrefilledCode(
  source: JsonRecord,
  language: RuntimeLanguage | "",
  fallbacks: Array<string | null | undefined> = [],
) {
  const seededCode = readStarterCode(source, language)
    || readString(source, ["starterCode", "initialCode", "template", "codeTemplate", "starterTemplate"])
    || readString(source, ["codeSnippet", "referenceCode", "exampleCode", "buggyCode"]);

  if (seededCode.trim()) {
    return seededCode;
  }

  return fallbacks.find((value): value is string => typeof value === "string" && value.trim().length > 0) ?? "";
}

export function formatTestValue(value: unknown) {
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

export function didExecutionPass(result: ExecuteFlashcardCodeResponseDto) {
  if (result.executionStatus !== "completed") {
    return false;
  }

  return result.visibleTestsTotal === 0 || result.visibleTestsPassed === result.visibleTestsTotal;
}

export function getExecutionOutcome(result: ExecuteFlashcardCodeResponseDto) {
  if (result.executionStatus === "completed") {
    return didExecutionPass(result) ? "passed" : "failed";
  }

  return result.executionStatus;
}

export function getExecutionStatusClasses(status: ExecuteFlashcardCodeResponseDto["executionStatus"]) {
  switch (status) {
    case "completed":
      return { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    case "sandboxUnavailable":
      return { badge: "bg-amber-500/10 text-amber-300 border-amber-500/20" };
    default:
      return { badge: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
  }
}

export function formatExecutionStatus(status: ExecuteFlashcardCodeResponseDto["executionStatus"]) {
  return status.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function formatExecutionOutcome(result: ExecuteFlashcardCodeResponseDto) {
  switch (getExecutionOutcome(result)) {
    case "passed":
      return "Passed";
    case "failed":
      return "Failed";
    case "compileError":
      return "Compile Error";
    case "runtimeError":
      return "Runtime Error";
    case "timeout":
      return "Time Limit Exceeded";
    case "memoryLimitExceeded":
      return "Memory Limit Exceeded";
    case "sandboxUnavailable":
      return "Execution Unavailable";
    default:
      return formatExecutionStatus(result.executionStatus);
  }
}

export function getExecutionOutcomeClasses(result: ExecuteFlashcardCodeResponseDto) {
  switch (getExecutionOutcome(result)) {
    case "passed":
      return {
        badge: "border-emerald-500/25 bg-emerald-500/12 text-emerald-300",
        panel: "border-emerald-500/20 bg-emerald-500/[0.05]",
        accent: "text-emerald-300",
      };
    case "sandboxUnavailable":
      return {
        badge: "border-amber-500/25 bg-amber-500/12 text-amber-200",
        panel: "border-amber-500/20 bg-amber-500/[0.05]",
        accent: "text-amber-200",
      };
    default:
      return {
        badge: "border-rose-500/25 bg-rose-500/12 text-rose-200",
        panel: "border-rose-500/20 bg-rose-500/[0.05]",
        accent: "text-rose-200",
      };
  }
}

function readRecordArray(source: JsonRecord, keys: string[]) {
  for (const key of keys) {
    if (Array.isArray(source[key])) {
      return source[key].filter(isRecord) as JsonRecord[];
    }
  }

  return [];
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
