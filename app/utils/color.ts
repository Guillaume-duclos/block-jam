// Modifie une couleur pour l'assombrir
export function darken(color: string, factor: number = 0.2): string {
  // Clamp factor entre 0 et 1
  const f = Math.min(Math.max(factor, 0), 1);

  // Convertie color -> r, g, b
  const bigint = parseInt(color.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Applique le facteur (réduction proportionnelle vers 0)
  const newR = Math.round(r * (1 - f));
  const newG = Math.round(g * (1 - f));
  const newB = Math.round(b * (1 - f));

  // Retourner en hex
  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB)
    .toString(16)
    .slice(1)}`;
}

// Modifie une couleur pour l'éclaircir
export function lighten(color: string, factor: number = 0.2): string {
  // Clamp factor entre 0 et 1
  const f = Math.min(Math.max(factor, 0), 1);

  // Convertit color -> r, g, b
  const bigint = parseInt(color.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Déplace chaque canal vers 255 (blanc)
  const newR = Math.round(r + (255 - r) * f);
  const newG = Math.round(g + (255 - g) * f);
  const newB = Math.round(b + (255 - b) * f);

  // Retour en hex
  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB)
    .toString(16)
    .slice(1)}`;
}
