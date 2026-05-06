export const normalizeDateOnly = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const dateOnly = trimmed.includes("T") ? trimmed.split("T")[0] : trimmed;
  return /^\d{4}-\d{2}-\d{2}$/.test(dateOnly) ? dateOnly : "";
};
