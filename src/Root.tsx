// Copyright (c) 2026 Enrique Rocha (@soyenriquerocha)
// SPDX-License-Identifier: MIT
// id: er-2f298797
import {Composition} from 'remotion';
import {Reel} from './reel/Reel';
import {EdicionBase, edicionVacia, type Edicion} from './esquema/edicion';
import {DemoComposition} from './reel/motion/luxline/DemoComposition';
import {PrivacyDisplayS26U} from './reel/motion/luxline/PrivacyDisplayS26U';

/**
 * Composiciones de Remotion:
 *  - `Reel`: composición principal del editor (1440×2560 a 30 fps; salida final estándar a 1080×1920), con duración
 *    dinámica desde la EDL (`duracion_s`) vía calculateMetadata.
 *  - `Luxline-Style-Demo`: demo de estilo LUXLINE CR (1080×1920 a 60 fps, 600 cuadros).
 *  - `Luxline-PrivacyDisplay-S26U`: video 100 % código para Galaxy S26 Ultra (1080×1920 a 60 fps, 1500 cuadros).
 * Ojo: Remotion NO valida las props contra el schema al renderizar; eso lo hace herramientas/validar.ts.
 */
export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="Reel"
			component={Reel}
			schema={EdicionBase}
			fps={30}
			width={1440}
			height={2560}
			durationInFrames={90}
			defaultProps={edicionVacia}
			calculateMetadata={({props}: {props: Edicion}) => ({
				durationInFrames: Math.max(1, Math.round(props.duracion_s * 30)),
			})}
		/>
		<DemoComposition />
		<Composition
			id="Luxline-PrivacyDisplay-S26U"
			component={PrivacyDisplayS26U}
			durationInFrames={1500}
			fps={60}
			width={1080}
			height={1920}
		/>
	</>
);
