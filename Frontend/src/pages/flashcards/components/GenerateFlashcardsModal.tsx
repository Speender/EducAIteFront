import type {
  CognitiveSkillDto,
  FlashcardItemTypeDto,
  LearningDomainDto,
} from "@/features/flashcards/api/dto";
import { useEffect, useMemo, useState } from "react";

type NoteOption = {
  sqid: string;
  name: string;
};

type GenerateFlashcardsModalProps = {
  isOpen: boolean;
  notes: NoteOption[];
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (payload: {
    noteSqid: string;
    flashcardCount: number;
    itemTypes: FlashcardItemTypeDto[];
    learningDomain: LearningDomainDto;
    cognitiveSkill: CognitiveSkillDto | null;
    technicalLanguage: string | null;
    programContext: string | null;
  }) => Promise<void>;
};

const itemTypeOptions: FlashcardItemTypeDto[] = [
  "Flashcard",
  "Conceptual",
  "CodeReading",
  "Debugging",
  "Sql",
  "Algorithm",
  "OutputPrediction",
  "FillInCode",
  "MultipleChoice",
  "ShortAnswer",
];

const learningDomainOptions: LearningDomainDto[] = [
  "Unknown",
  "Programming",
  "Database",
  "Math",
  "Writing",
  "Business",
  "GeneralEducation",
];

const cognitiveSkillOptions: CognitiveSkillDto[] = [
  "Recall",
  "Understand",
  "Apply",
  "Analyze",
  "Debug",
  "Design",
];

const GenerateFlashcardsModal = ({
  isOpen,
  notes,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: GenerateFlashcardsModalProps) => {
  const [selectedNoteSqid, setSelectedNoteSqid] = useState("");
  const [flashcardCount, setFlashcardCount] = useState("5");
  const [selectedItemTypes, setSelectedItemTypes] = useState<FlashcardItemTypeDto[]>(["Flashcard"]);
  const [learningDomain, setLearningDomain] = useState<LearningDomainDto>("Unknown");
  const [cognitiveSkill, setCognitiveSkill] = useState<CognitiveSkillDto | "Auto">("Auto");
  const [technicalLanguage, setTechnicalLanguage] = useState("");
  const [programContext, setProgramContext] = useState("");
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedNoteSqid(notes[0]?.sqid ?? "");
    setFlashcardCount("5");
    setSelectedItemTypes(["Flashcard"]);
    setLearningDomain("Unknown");
    setCognitiveSkill("Auto");
    setTechnicalLanguage("");
    setProgramContext("");
    setHasTriedSubmit(false);
  }, [isOpen, notes]);

  const parsedCount = Number.parseInt(flashcardCount, 10);
  const isCountValid = Number.isInteger(parsedCount) && parsedCount >= 1 && parsedCount <= 10;
  const validationMessage = useMemo(() => {
    if (!hasTriedSubmit) {
      return null;
    }

    if (!selectedNoteSqid) {
      return "Select a note first.";
    }

    if (!isCountValid) {
      return "Flashcard count must be between 1 and 10.";
    }

    return null;
  }, [hasTriedSubmit, isCountValid, selectedNoteSqid]);

  async function handleSubmit() {
    setHasTriedSubmit(true);

    if (!selectedNoteSqid || !isCountValid || isSubmitting) {
      return;
    }

    await onSubmit({
      noteSqid: selectedNoteSqid,
      flashcardCount: parsedCount,
      itemTypes: selectedItemTypes,
      learningDomain,
      cognitiveSkill: cognitiveSkill === "Auto" ? null : cognitiveSkill,
      technicalLanguage: technicalLanguage.trim() || null,
      programContext: programContext.trim() || null,
    });
  }

  function toggleItemType(itemType: FlashcardItemTypeDto) {
    setSelectedItemTypes((current) => {
      if (current.includes(itemType)) {
        const next = current.filter((value) => value !== itemType);
        return next.length > 0 ? next : ["Flashcard"];
      }

      return [...current, itemType];
    });
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md"
      onClick={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-lg rounded-[32px] border border-white/15 bg-[#050505] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">Create Flashcards with AI</h3>
            <p className="mt-2 text-sm text-white/50">
              Pick the source note and let educAIte generate the flashcards into this document.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-white/40 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white/70">Source note</span>
            <select
              value={selectedNoteSqid}
              onChange={(event) => setSelectedNoteSqid(event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-[20px] border border-white/10 bg-white px-5 py-4 text-black outline-none transition focus:border-[#00CEC8] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {notes.map((note) => (
                <option key={note.sqid} value={note.sqid}>
                  {note.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white/70">Flashcard count</span>
            <input
              type="number"
              min={1}
              max={10}
              value={flashcardCount}
              onChange={(event) => setFlashcardCount(event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-[20px] border border-white/10 bg-white px-5 py-4 text-black outline-none transition focus:border-[#00CEC8] disabled:cursor-not-allowed disabled:opacity-70"
            />
          </label>

          <div>
            <span className="mb-2 block text-sm font-semibold text-white/70">Flashcard behavior</span>
            <div className="flex flex-wrap gap-2">
              {itemTypeOptions.map((itemType) => {
                const isSelected = selectedItemTypes.includes(itemType);
                return (
                  <button
                    key={itemType}
                    type="button"
                    onClick={() => toggleItemType(itemType)}
                    disabled={isSubmitting}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      isSelected
                        ? "border-[#00CEC8]/50 bg-[#00CEC8]/10 text-[#00CEC8]"
                        : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {itemType}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white/70">Learning domain</span>
              <select
                value={learningDomain}
                onChange={(event) => setLearningDomain(event.target.value as LearningDomainDto)}
                disabled={isSubmitting}
                className="w-full rounded-[20px] border border-white/10 bg-white px-5 py-4 text-black outline-none transition focus:border-[#00CEC8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {learningDomainOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white/70">Cognitive skill</span>
              <select
                value={cognitiveSkill}
                onChange={(event) => setCognitiveSkill(event.target.value as CognitiveSkillDto | "Auto")}
                disabled={isSubmitting}
                className="w-full rounded-[20px] border border-white/10 bg-white px-5 py-4 text-black outline-none transition focus:border-[#00CEC8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <option value="Auto">Auto</option>
                {cognitiveSkillOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white/70">Technical language</span>
              <input
                value={technicalLanguage}
                onChange={(event) => setTechnicalLanguage(event.target.value)}
                placeholder="C#, SQL, JavaScript..."
                disabled={isSubmitting}
                className="w-full rounded-[20px] border border-white/10 bg-white px-5 py-4 text-black outline-none transition focus:border-[#00CEC8] disabled:cursor-not-allowed disabled:opacity-70"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white/70">Class context</span>
              <input
                value={programContext}
                onChange={(event) => setProgramContext(event.target.value)}
                placeholder="e.g. BSIT data structures"
                disabled={isSubmitting}
                className="w-full rounded-[20px] border border-white/10 bg-white px-5 py-4 text-black outline-none transition focus:border-[#00CEC8] disabled:cursor-not-allowed disabled:opacity-70"
              />
            </label>
          </div>
        </div>

        <div className="min-h-7 px-1 pt-4 text-sm">
          {validationMessage ? (
            <p className="text-rose-300">{validationMessage}</p>
          ) : errorMessage ? (
            <p className="text-rose-300">{errorMessage}</p>
          ) : (
            <p className="text-white/35">The generated flashcards will be added to the current document.</p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting || !selectedNoteSqid || !isCountValid}
            className="rounded-full bg-[#00CEC8] px-8 py-3 text-sm font-bold text-black shadow-[0_10px_40px_-10px_rgba(0,206,200,0.7)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? "Generating..." : "Generate flashcards"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateFlashcardsModal;
