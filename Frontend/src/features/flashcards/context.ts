const FLASHCARD_COURSE_STORAGE_KEY = "educaite.flashcards.course";

export function getLastSelectedFlashcardCourseSqid() {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(FLASHCARD_COURSE_STORAGE_KEY);
  return value?.trim() ? value : null;
}

export function persistLastSelectedFlashcardCourseSqid(studentCourseSqid: string | null) {
  if (typeof window === "undefined" || !studentCourseSqid?.trim()) {
    return;
  }

  window.localStorage.setItem(FLASHCARD_COURSE_STORAGE_KEY, studentCourseSqid);
}
