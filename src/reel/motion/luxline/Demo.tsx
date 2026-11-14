import {useEffect, useState} from 'react';
import {AbsoluteFill, Img, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CameraFollow, ChainMove, MaskReveal, ObjectMorph, SpeechVisualSync, ZONA_SEGURA_LUXLINE, chainStarts, progress} from './Techniques';
import cueData from './demo-cues.json';
import dictionary from './word-assets.json';

const FONT_PATH = 'biblioteca/fuentes/NotoSansDisplay-Variable.ttf';
const MARGEN_IZQ = ZONA_SEGURA_LUXLINE.x0;
const ANCHO_UTIL = Math.min(780, ZONA_SEGURA_LUXLINE.x1 - MARGEN_IZQ);

export const Demo = () => {
	const f = useCurrentFrame();
	const {width} = useVideoConfig();
	const escala = width / 1080;
	const [handle] = useState(() => delayRender('Luxline fonts'));

	useEffect(() => {
		const font = new FontFace('Luxline', 'url(' + staticFile(FONT_PATH) + ')', {weight: '100 900'});
		font
			.load()
			.then((loaded) => {
				(document.fonts as unknown as {add: (f: FontFace) => void}).add(loaded);
				continueRender(handle);
			})
			.catch((err) => cancelRender(err));
	}, [handle]);

	const starts = chainStarts([42, 42, 42], 12);
	const camera = progress(f, 126, 66) * (1 - progress(f, 216, 36));
	const moveX = 80 * Math.sin(f / 65);
	const moveY = 20 * Math.cos(f / 75);
	const last = f >= 480;

	return (
		<AbsoluteFill style={{background: '#F8F7F4', color: '#111111', fontFamily: 'Luxline', overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: 1080,
					height: 1920,
					transform: `scale(${escala})`,
					transformOrigin: 'top left',
				}}
			>
				<div
					style={{
						position: 'absolute',
						left: 140 + Math.sin(f / 120) * 40,
						top: 560,
						width: 800,
						height: 800,
						borderRadius: '50%',
						background: 'radial-gradient(circle,#B8A4CF30,transparent 68%)',
					}}
				/>
				<Img
					src={staticFile('assets/marca/logos/logo-negro.svg')}
					style={{position: 'absolute', left: MARGEN_IZQ, top: 290, width: 210, height: 65, objectFit: 'contain'}}
				/>
				{f < 360 && (
					<MaskReveal
						from={6}
						duration={30}
						style={{position: 'absolute', left: MARGEN_IZQ, top: 410, width: ANCHO_UTIL, fontSize: 82, fontWeight: 600, lineHeight: 1.03, letterSpacing: '-.04em'}}
					>
						{f < 240 ? 'Mirá más de cerca.' : 'Todo se conecta.'}
					</MaskReveal>
				)}
				{f < 240 && (
					<CameraFollow targetX={540 + moveX} targetY={820 + moveY} strength={camera} zoom={1 + 0.18 * camera}>
						<Img
							src={staticFile(dictionary.iphone.src)}
							style={{
								position: 'absolute',
								left: 335 + moveX,
								top: 650 + moveY,
								width: 410,
								height: 430,
								objectFit: 'contain',
								transform: 'rotate(' + (-8 + Math.sin(f / 80) * 5) + 'deg)',
							}}
						/>
					</CameraFollow>
				)}
				{f < 240 && (
					<div style={{position: 'absolute', left: MARGEN_IZQ, top: 1125, display: 'flex', gap: 18, maxWidth: ANCHO_UTIL}}>
						{['Forma', 'Luz', 'Detalle'].map((word, i) => (
							<ChainMove key={word} from={54 + starts[i]} duration={42} dx={55}>
								<div style={{padding: '14px 24px', border: '1px solid #AEBACB', borderRadius: 40, fontSize: 28, background: '#FFFFFF80'}}>{word}</div>
							</ChainMove>
						))}
					</div>
				)}
				{f >= 240 && f < 366 && (
					<ObjectMorph
						from={{x: 190, y: 730, width: 700, height: 115, radius: 58}}
						to={{x: 210, y: 650, width: 660, height: 430, radius: 55}}
						start={252}
						duration={54}
						style={{
							background: 'linear-gradient(130deg,#FFFFFFdd,#AEBACB33,#B8A4CF44)',
							border: '2px solid #FFFFFF',
							boxShadow: '0 25px 70px #11111118',
							overflow: 'hidden',
						}}
					>
						<div style={{opacity: progress(f, 306, 18), textAlign: 'center', padding: 50, fontSize: 54, lineHeight: 1.1}}>
							Una nueva
							<br />
							perspectiva.
							<div
								style={{
									height: 100,
									marginTop: 35,
									borderRadius: 70,
									background: 'linear-gradient(110deg,#AEBACB,#FFFFFF,#B8A4CF)',
									transform: 'rotate(' + Math.sin(f / 40) * 8 + 'deg)',
								}}
							/>
						</div>
					</ObjectMorph>
				)}
				{/* demo-cues.json se usa únicamente en esta demo silenciosa con simulation={true}. */}
				<SpeechVisualSync cues={cueData.cues} dictionary={dictionary} mode="sales" voiceApproved={false} simulation={true} />
				{last && (
					<>
						<MaskReveal
							from={480}
							duration={30}
							style={{position: 'absolute', left: MARGEN_IZQ, top: 470, fontSize: 90, fontWeight: 600, lineHeight: 1.03, width: ANCHO_UTIL}}
						>
							Elegí con
							<br />
							otra mirada.
						</MaskReveal>
						<Img
							src={staticFile(dictionary.iphone.src)}
							style={{position: 'absolute', left: 340 + Math.sin(f / 70) * 15, top: 730, width: 360, height: 350, objectFit: 'contain'}}
						/>
						<ChainMove from={510} duration={36} dy={30} style={{position: 'absolute', left: MARGEN_IZQ, top: 1130, fontSize: 44}}>
							luxline.tech
						</ChainMove>
					</>
				)}
				<div style={{position: 'absolute', left: MARGEN_IZQ, top: 1220, width: ANCHO_UTIL, height: 2, background: '#AEBACB44'}}>
					<div style={{height: 2, width: (f / 599) * 100 + '%', background: '#AEBACB'}} />
				</div>
			</div>
		</AbsoluteFill>
	);
};
