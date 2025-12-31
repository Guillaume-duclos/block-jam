import i18n from "../translations/translation";

// Format la valeur du score
export function formatScore(value: number | string): string {
  return value.toLocaleString(i18n.language || "fr-FR");
}
