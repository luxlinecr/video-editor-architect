import {Composition} from 'remotion';
import {Demo} from './Demo';

export const DemoComposition = () => (
	<Composition id="Luxline-Style-Demo" component={Demo} durationInFrames={600} fps={60} width={1080} height={1920} />
);
