// Assombrit une couleur en préservant la teinte (espace HSL)
export function darkenHsl(color: string, factor: number = 0.2): string {
  const f = Math.min(Math.max(factor, 0), 1);
  const bigint = parseInt(color.slice(1), 16);

  let r = ((bigint >> 16) & 255) / 255;
  let g = ((bigint >> 8) & 255) / 255;
  let b = (bigint & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;

  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  const newL = Math.max(0, l - f * l);

  const c = (1 - Math.abs(2 * newL - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = newL - c / 2;

  let r2 = 0,
    g2 = 0,
    b2 = 0;
  if (h < 60) {
    r2 = c;
    g2 = x;
    b2 = 0;
  } else if (h < 120) {
    r2 = x;
    g2 = c;
    b2 = 0;
  } else if (h < 180) {
    r2 = 0;
    g2 = c;
    b2 = x;
  } else if (h < 240) {
    r2 = 0;
    g2 = x;
    b2 = c;
  } else if (h < 300) {
    r2 = x;
    g2 = 0;
    b2 = c;
  } else {
    r2 = c;
    g2 = 0;
    b2 = x;
  }

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
}

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
