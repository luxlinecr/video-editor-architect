import data from "./presets.json";
export const scenePresets = data;
export type ScenePreset = (typeof scenePresets)[number];
