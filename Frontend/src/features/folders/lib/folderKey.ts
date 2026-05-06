function appendSuffix(baseKey: string, suffix: number) {
  const suffixText = `-${suffix}`;
  const maxBaseLength = Math.max(1, 100 - suffixText.length);
  const truncatedBase = (baseKey.length > maxBaseLength ? baseKey.slice(0, maxBaseLength) : baseKey).replace(/-+$/g, "");

  return `${truncatedBase || "course"}${suffixText}`;
}

export function slugifyFolderKey(value: string) {
  let normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  if (!normalized) {
    normalized = "course";
  }

  return normalized.length <= 100 ? normalized : normalized.slice(0, 100).replace(/-+$/g, "") || "course";
}

export function buildUniqueFolderKey(source: string, reservedKeys: Iterable<string>) {
  const existingKeys = new Set(
    Array.from(reservedKeys, (item) => item.trim()).filter((item) => item.length > 0),
  );

  const baseKey = slugifyFolderKey(source);
  let candidate = baseKey;
  let suffix = 2;

  while (existingKeys.has(candidate)) {
    candidate = appendSuffix(baseKey, suffix);
    suffix += 1;
  }

  return candidate;
}
