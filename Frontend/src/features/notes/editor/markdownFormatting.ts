export type EditorUpdate = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

function resolveSelection(selectionStart: number, selectionEnd: number) {
  return { selectionStart, selectionEnd };
}

export function wrapSelection(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  prefix: string,
  suffix: string,
  placeholder: string,
): EditorUpdate {
  const resolved = resolveSelection(selectionStart, selectionEnd);
  const selectedText = value.slice(resolved.selectionStart, resolved.selectionEnd) || placeholder;
  const nextValue =
    value.slice(0, resolved.selectionStart) +
    `${prefix}${selectedText}${suffix}` +
    value.slice(resolved.selectionEnd);

  return {
    value: nextValue,
    selectionStart: resolved.selectionStart + prefix.length,
    selectionEnd: resolved.selectionStart + prefix.length + selectedText.length,
  };
}

export function formatLines(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  mode: "bullet" | "numbered",
): EditorUpdate {
  const lineStart = value.lastIndexOf("\n", Math.max(selectionStart - 1, 0)) + 1;
  const lineEnd = value.indexOf("\n", selectionEnd);
  const resolvedLineEnd = lineEnd === -1 ? value.length : lineEnd;
  const selectedBlock = value.slice(lineStart, resolvedLineEnd);
  const lines = selectedBlock.split("\n");
  const formatted = lines.map((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      return line;
    }

    return mode === "bullet" ? `- ${trimmedLine}` : `${index + 1}. ${trimmedLine}`;
  });

  const nextBlock = formatted.join("\n");
  const nextValue = value.slice(0, lineStart) + nextBlock + value.slice(resolvedLineEnd);

  return {
    value: nextValue,
    selectionStart: lineStart,
    selectionEnd: lineStart + nextBlock.length,
  };
}
