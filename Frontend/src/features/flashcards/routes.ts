export function getFlashcardWorkspacePath() {
  return "/flashcards/workspace";
}

export function getFlashcardMajorDeckPath(majorDeckSqid: string) {
  return `/flashcards/workspace/${encodeURIComponent(majorDeckSqid)}`;
}

export function getFlashcardCourseDocumentsPath(studentCourseSqid: string) {
  return getFlashcardMajorDeckPath(studentCourseSqid);
}

export function getFlashcardDocumentCardsPath(
  majorDeckSqid: string,
  documentSqid: string,
) {
  return `${getFlashcardMajorDeckPath(majorDeckSqid)}/${encodeURIComponent(documentSqid)}/cards`;
}

export function getFlashcardCreateCardPath(
  majorDeckSqid: string,
  documentSqid: string,
) {
  return `${getFlashcardDocumentCardsPath(majorDeckSqid, documentSqid)}/create`;
}

export function getFlashcardLearnPath(
  majorDeckSqid: string,
  documentSqid: string,
) {
  return `${getFlashcardDocumentCardsPath(majorDeckSqid, documentSqid)}/learn`;
}

export function getFlashcardSessionPath(
  majorDeckSqid: string,
  documentSqid: string,
) {
  return `${getFlashcardDocumentCardsPath(majorDeckSqid, documentSqid)}/session`;
}

export function getFlashcardChallengePath(
  majorDeckSqid: string,
  documentSqid: string,
  flashcardSqid?: string,
) {
  const path = `${getFlashcardDocumentCardsPath(majorDeckSqid, documentSqid)}/challenge`;
  return flashcardSqid ? `${path}?flashcard=${encodeURIComponent(flashcardSqid)}` : path;
}

export function getFlashcardPerformancePath(
  majorDeckSqid: string,
  documentSqid: string,
) {
  return `${getFlashcardDocumentCardsPath(majorDeckSqid, documentSqid)}/performance`;
}
