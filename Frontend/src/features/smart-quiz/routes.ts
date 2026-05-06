export function getSmartQuizPath() {
  return "/smart-quiz";
}

export function getSmartQuizDeckPath(deckSqid: string) {
  return `/smart-quiz?deckSqid=${encodeURIComponent(deckSqid)}`;
}

export function getSmartQuizSessionPath(sessionSqid: string) {
  return `/smart-quiz/session/${encodeURIComponent(sessionSqid)}`;
}
