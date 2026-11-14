import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
/** Extraído del crossfade de Templates-V2. Usar dentro de una Sequence local. */
export function SceneFade({children, span, last=false}: {children: ReactNode; span: number; last?: boolean}) {
  const frame=useCurrentFrame(), {fps}=useVideoConfig();
  const opacity=interpolate(frame,[-fps*.18,0,span-fps*.3,span],[0,1,1,last?1:0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
}
