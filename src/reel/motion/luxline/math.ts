export const TAU = Math.PI * 2;
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
};
export const seeded = (seed: number, index: number) => {
  let n = (seed ^ Math.imul(index + 1, 0x9e3779b1)) >>> 0;
  n = Math.imul(n ^ (n >>> 16), 0x21f0aaad);
  n = Math.imul(n ^ (n >>> 15), 0x735a2d97);
  return ((n ^ (n >>> 15)) >>> 0) / 4294967296;
};
export function envelopeAt(values: number[], progress: number) {
  if (!values.length) return 0;
  const x = Math.max(0, Math.min(1, progress)) * (values.length - 1),
    i = Math.floor(x);
  return mix(
    values[i],
    values[Math.min(i + 1, values.length - 1)],
    smooth(x - i),
  );
}
export function shapePoints(
  time: number,
  seed: number,
  lobes: number,
  amplitude: number,
  count = 96,
) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * TAU;
    const radius =
      1 +
      amplitude * Math.sin(lobes * a + time * 0.7 + seeded(seed, 0) * TAU) +
      amplitude * 0.5 * Math.cos((lobes + 1) * a - time * 0.43);
    return [Math.cos(a) * radius, Math.sin(a) * radius] as [number, number];
  });
}
export const shapePath = (
  time: number,
  seed: number,
  lobes: number,
  amplitude: number,
  count = 96,
) =>
  shapePoints(time, seed, lobes, amplitude, count)
    .map(
      ([x, y], i) =>
        `${i ? "L" : "M"}${(x * 210).toFixed(4)},${(y * 210).toFixed(4)}`,
    )
    .join(" ") + " Z";
export function track(progress: number, time: number, seed: number) {
  const phase = seeded(seed, 1) * TAU;
  return {
    x: Math.sin(time * 0.28 + phase) * 28,
    y: Math.cos(time * 0.23 + phase) * 24,
    scale: 1 + 0.08 * Math.sin(progress * TAU - Math.PI / 2),
    rotation: Math.sin(time * 0.17 + phase) * 12,
  };
}
