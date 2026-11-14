import { interpolate } from "remotion";
import { smooth } from "./math";

/** Width/height relative to the host; radius relative to the current shorter side. */
export type GlassPose = {
  width: number;
  height: number;
  radius: number;
  frost: number;
  contentOpacity: number;
  compactOpacity: number;
};
export type GlassKeyframe = GlassPose & { at: number };
export type GlassMotion = {
  fromFrame?: number;
  durationInFrames: number;
  keyframes: readonly GlassKeyframe[];
};
export const restingGlass: GlassPose = {
  width: 1,
  height: 1,
  radius: 0.06,
  frost: 0.55,
  contentOpacity: 1,
  compactOpacity: 0,
};
export function validateGlassMotion(motion: GlassMotion) {
  if (
    !Number.isFinite(motion.durationInFrames) ||
    motion.durationInFrames <= 1 ||
    !Number.isFinite(motion.fromFrame ?? 0) ||
    motion.keyframes.length < 2 ||
    motion.keyframes.length > 64
  )
    throw Error("Glass motion requires a finite duration and 2–64 keyframes");
  let previous = -1;
  for (const k of motion.keyframes) {
    if (!Number.isFinite(k.at) || k.at < 0 || k.at > 1 || k.at <= previous)
      throw Error("Glass keyframe positions must increase within 0..1");
    previous = k.at;
    for (const field of ["width", "height"] as const)
      if (!Number.isFinite(k[field]) || k[field] < 0.02 || k[field] > 1)
        throw Error("Glass dimensions must stay within 0.02..1");
    for (const field of [
      "radius",
      "frost",
      "contentOpacity",
      "compactOpacity",
    ] as const)
      if (
        !Number.isFinite(k[field]) ||
        k[field] < 0 ||
        k[field] > (field === "radius" ? 0.5 : 1)
      )
        throw Error("Glass radius/material/content values are out of range");
  }
  if (
    motion.keyframes[0].at !== 0 ||
    motion.keyframes[motion.keyframes.length - 1].at !== 1
  )
    throw Error("Glass motion must include endpoints 0 and 1");
}
export function sampleGlassMotion(
  frame: number,
  motion?: GlassMotion,
): GlassPose {
  if (!Number.isFinite(frame)) throw Error("Glass frame must be finite");
  if (!motion) return restingGlass;
  validateGlassMotion(motion);
  const progress = Math.max(
    0,
    Math.min(
      1,
      (frame - (motion.fromFrame ?? 0)) / (motion.durationInFrames - 1),
    ),
  );
  const times = motion.keyframes.map((k) => k.at);
  const value = (field: keyof GlassPose) =>
    interpolate(
      progress,
      times,
      motion.keyframes.map((k) => k[field]),
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth },
    );
  return {
    width: value("width"),
    height: value("height"),
    radius: value("radius"),
    frost: value("frost"),
    contentOpacity: value("contentOpacity"),
    compactOpacity: value("compactOpacity"),
  };
}

/** Persistent template surface: fade content before contracting, reveal after opening. */
export function glassShotSequence(
  durationInFrames: number,
  fps: number,
  shots: number,
): GlassMotion {
  if (
    !Number.isInteger(shots) ||
    shots < 1 ||
    !Number.isFinite(fps) ||
    fps <= 0 ||
    durationInFrames / shots < fps * 2
  )
    throw Error("Glass shot sequence needs at least two seconds per shot");
  const span = durationInFrames / shots;
  const compact: GlassPose = {
    width: 0.72,
    height: 0.13,
    radius: 0.5,
    frost: 0.8,
    contentOpacity: 0,
    compactOpacity: 1,
  };
  const panel = { ...restingGlass, contentOpacity: 0 };
  const keyframes: GlassKeyframe[] = [{ ...compact, at: 0 }];
  const add = (f: number, pose: GlassPose) =>
    keyframes.push({ ...pose, at: f / (durationInFrames - 1) });
  for (let i = 0; i < shots; i++) {
    const start = i * span;
    add(start + fps * 0.55, panel);
    add(start + fps * 0.75, restingGlass);
    if (i < shots - 1) {
      add(start + span - fps * 0.55, restingGlass);
      add(start + span - fps * 0.35, panel);
      add(start + span, compact);
    }
  }
  keyframes.push({ ...restingGlass, at: 1 });
  const motion = { durationInFrames, keyframes };
  validateGlassMotion(motion);
  return motion;
}
