import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
	AbsoluteFill,
	Audio,
	Easing,
	Img,
	Sequence,
	cancelRender,
	continueRender,
	delayRender,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {
	CameraFollow,
	ChainMove,
	MaskReveal,
	ObjectMorph,
	SpeechVisualSync,
	ZONA_SEGURA_LUXLINE,
	chainStarts,
	progress,
	type AssetDictionary,
} from './Techniques';
import { SceneFade } from './SceneFade';
import {
	CUES_SFX_PRIVACY_DISPLAY_S26U,
	obtenerEfectoPorId,
} from './sfx-tonales';
import privacyCues from './privacy-s26u-cues.json';

/**
 * Paleta oficial del universo `android` (estilo/luxline-marca.json).
 * `#22C55E` se usa exclusivamente para estados activos etiquetados.
 */
export const PALETA_ANDROID = {
	background: '#F6F5F2',
	ink: '#0D0D0D',
	accent: '#9E9E9E',
	secondary: '#2E2E2E',
	highlight: '#FFFFFF',
	metalDark: '#383838',
	frosted: '#E2E2E2',
	statusActive: '#22C55E',
} as const;

export const PRIVACY_S26U_ASSETS = {
	logo: 'assets/marca/logos/logo-negro.svg',
	front: 'assets/marca/imagenes/products/android/galaxy-s26-ultra-white/front-cutout.png',
	angle: 'assets/marca/imagenes/products/android/galaxy-s26-ultra-white/angle.png',
	shield: 'assets/marca/imagenes/asset-library/shield.svg',
	fontDisplay: 'biblioteca/fuentes/NotoSansDisplay-Variable.ttf',
	fontMono: 'biblioteca/fuentes/Mono-Regular.ttf',
} as const;

/** Diccionario autorizado para SpeechVisualSync cuando se agregue locución aprobada. */
export const PRIVACY_S26U_WORD_ASSETS: AssetDictionary = {
	pantalla: { src: PRIVACY_S26U_ASSETS.front, label: 'Galaxy S26 Ultra' },
	ultra: { src: PRIVACY_S26U_ASSETS.front, label: 'Galaxy S26 Ultra' },
	s26: { src: PRIVACY_S26U_ASSETS.front, label: 'Galaxy S26 Ultra' },
	privacy: { src: PRIVACY_S26U_ASSETS.shield, label: 'Privacy Display' },
	display: { src: PRIVACY_S26U_ASSETS.shield, label: 'Privacy Display' },
	'45': { src: PRIVACY_S26U_ASSETS.angle, label: 'Ángulo lateral 45°' },
	luxline: { src: PRIVACY_S26U_ASSETS.logo, label: 'Luxline CR' },
};

const ANCHO_UTIL = ZONA_SEGURA_LUXLINE.x1 - ZONA_SEGURA_LUXLINE.x0; // 810 px
const RATIO_S26U = 1076 / 524;
const BASE_PHONE_X = 482;
const BASE_PHONE_Y = 678;
const BASE_PHONE_W = 358;
const BASE_PHONE_H = Math.round(BASE_PHONE_W * RATIO_S26U); // 735 px

/**
 * Encuadra el diorama dueño + espía en y: 541..1461 bajo los títulos superiores,
 * aprovechando el alto completo de la zona segura de Reels sin subtítulos inferiores.
 */
const DIORAMA_WRAPPER_STYLE = {
	position: 'absolute',
	inset: 0,
	transform: 'translate(0px, -16px) scale(0.95)',
	transformOrigin: '540px 580px',
} as const;

const DIORAMA_CLIP_STYLE = {
	position: 'absolute',
	inset: 0,
	clipPath: 'inset(512px 135px 320px 135px)',
	pointerEvents: 'none',
} as const;

/**
 * Curva determinista de brillo remanente según ángulo lateral:
 *  - 0°  → 1.000 (100 %)
 *  - 45° → 0.035 (3.5 %)
 *  - 60° → 0.008 (menos de 1 %)
 */
export function brilloDesdeAngulo(anguloGrados: number): number {
	return interpolate(anguloGrados, [0, 15, 30, 45, 60], [1, 0.52, 0.14, 0.035, 0.008], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
}

function clampMix(frame: number, start: number, duration: number, from: number, to: number): number {
	return from + (to - from) * progress(frame, start, duration);
}

/** Etiqueta superior con máscara horizontal limpia para el encabezado de cada escena. */
const SceneContextHeader = ({
	tag,
	title,
	from = 0,
	exitAt,
}: {
	tag: string;
	title: string;
	from?: number;
	exitAt?: number;
}) => {
	const f = useCurrentFrame();
	const tagReveal = progress(f, from, 20);
	const exitFade = exitAt !== undefined ? 1 - progress(f, exitAt, 14) : 1;
	const exitShift = exitAt !== undefined ? progress(f, exitAt, 14) * -14 : 0;

	if (exitFade <= 0.01) return null;

	return (
		<div
			style={{
				position: 'absolute',
				left: ZONA_SEGURA_LUXLINE.x0,
				top: 326,
				width: ANCHO_UTIL,
				opacity: exitFade,
				transform: `translateY(${exitShift}px)`,
				pointerEvents: 'none',
			}}
		>
			<div
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					gap: 9,
					padding: '7px 16px',
					borderRadius: 999,
					background: PALETA_ANDROID.ink,
					color: PALETA_ANDROID.highlight,
					fontFamily: 'LuxlineMono',
					fontSize: 18,
					letterSpacing: '0.07em',
					clipPath: `inset(0 ${(1 - tagReveal) * 100}% 0 0)`,
					marginBottom: 12,
				}}
			>
				<span
					style={{
						width: 7,
						height: 7,
						borderRadius: '50%',
						background: PALETA_ANDROID.accent,
						display: 'inline-block',
					}}
				/>
				<span>{tag}</span>
			</div>

			<MaskReveal
				from={from + 6}
				duration={26}
				style={{
					width: ANCHO_UTIL,
					fontFamily: 'LuxlineDisplay',
					fontSize: 54,
					fontWeight: 700,
					lineHeight: 1.06,
					letterSpacing: '-0.03em',
					color: PALETA_ANDROID.ink,
				}}
			>
				{title}
			</MaskReveal>
		</div>
	);
};

/** Logo superior fijo dentro de la zona segura. */
const BrandHeaderLogo = () => (
	<Img
		src={staticFile(PRIVACY_S26U_ASSETS.logo)}
		style={{
			position: 'absolute',
			left: ZONA_SEGURA_LUXLINE.x0,
			top: 248,
			width: 205,
			height: 62,
			objectFit: 'contain',
			objectPosition: 'left center',
		}}
	/>
);

/** Contenido de pantalla compartido dentro del marco real del Galaxy S26 Ultra. */
const PhoneScreenContent = ({
	pinFocused = true,
	pinLockedBadge = false,
}: {
	pinFocused?: boolean;
	pinLockedBadge?: boolean;
}) => (
	<div
		style={{
			width: '100%',
			height: '100%',
			background: PALETA_ANDROID.highlight,
			padding: '20px 18px',
			display: 'flex',
			flexDirection: 'column',
			gap: 13,
			fontFamily: 'LuxlineDisplay',
			color: PALETA_ANDROID.ink,
			boxSizing: 'border-box',
		}}
	>
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				paddingTop: 18,
				paddingBottom: 6,
				fontFamily: 'LuxlineMono',
				fontSize: 13,
				color: PALETA_ANDROID.secondary,
			}}
		>
			<span>09:41</span>
			<div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
				<div style={{ width: 5, height: 9, borderRadius: 2, background: PALETA_ANDROID.ink }} />
				<div style={{ width: 5, height: 12, borderRadius: 2, background: PALETA_ANDROID.ink }} />
				<div style={{ width: 5, height: 15, borderRadius: 2, background: PALETA_ANDROID.ink }} />
			</div>
		</div>

		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				paddingBottom: 10,
				borderBottom: `1.5px solid ${PALETA_ANDROID.frosted}`,
			}}
		>
			<div
				style={{
					width: 32,
					height: 32,
					borderRadius: '50%',
					background: PALETA_ANDROID.secondary,
					color: PALETA_ANDROID.highlight,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: 14,
					fontWeight: 600,
				}}
			>
				M
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
				<div style={{ width: 112, height: 10, borderRadius: 5, background: PALETA_ANDROID.ink }} />
				<div style={{ width: 68, height: 8, borderRadius: 4, background: PALETA_ANDROID.accent }} />
			</div>
		</div>

		<div
			style={{
				alignSelf: 'flex-start',
				background: PALETA_ANDROID.background,
				border: `1px solid ${PALETA_ANDROID.frosted}`,
				borderRadius: '16px 16px 16px 6px',
				padding: '12px 14px',
				width: '74%',
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
			}}
		>
			<div style={{ width: '90%', height: 9, borderRadius: 5, background: PALETA_ANDROID.metalDark, opacity: 0.72 }} />
			<div style={{ width: '62%', height: 9, borderRadius: 5, background: PALETA_ANDROID.accent }} />
		</div>

		{/* Tarjeta compacta centrada: se mantiene dentro de la pantalla y con holgura bajo el lente */}
		<div
			style={{
				alignSelf: 'center',
				width: 156,
				background: pinFocused ? PALETA_ANDROID.ink : PALETA_ANDROID.secondary,
				color: PALETA_ANDROID.highlight,
				borderRadius: 18,
				padding: '13px 12px',
				boxShadow: '0 8px 18px rgba(13, 13, 13, 0.14)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 5,
			}}
		>
			<div style={{ fontSize: 12, color: PALETA_ANDROID.frosted, letterSpacing: '0.03em' }}>Acceso privado</div>
			<div style={{ fontFamily: 'LuxlineMono', fontSize: 22, letterSpacing: '0.16em', fontWeight: 400 }}>
				{pinLockedBadge ? '••••' : '4829'}
			</div>
		</div>

		<div
			style={{
				alignSelf: 'flex-end',
				background: PALETA_ANDROID.frosted,
				borderRadius: '16px 16px 6px 16px',
				padding: '12px 14px',
				width: '68%',
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
			}}
		>
			<div style={{ width: '86%', height: 9, borderRadius: 5, background: PALETA_ANDROID.secondary, opacity: 0.68 }} />
			<div style={{ width: '50%', height: 9, borderRadius: 5, background: PALETA_ANDROID.accent }} />
		</div>

		<div
			style={{
				marginTop: 'auto',
				background: PALETA_ANDROID.background,
				borderRadius: 16,
				padding: 10,
				border: `1px solid ${PALETA_ANDROID.frosted}`,
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gap: 7,
			}}
		>
			{['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
				<div
					key={n}
					style={{
						height: 34,
						borderRadius: 9,
						background: PALETA_ANDROID.highlight,
						border: `1px solid ${PALETA_ANDROID.frosted}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: 'LuxlineMono',
						fontSize: 15,
						color: PALETA_ANDROID.ink,
					}}
				>
					{n}
				</div>
			))}
		</div>
	</div>
);

/** Chasis oficial Galaxy S26 Ultra (front-cutout.png) con pantalla interior y orificio de cámara. */
const GalaxyS26UFrame = ({
	width,
	height,
	darkness = 0,
	children,
}: {
	width: number;
	height: number;
	darkness?: number;
	children: ReactNode;
}) => (
	<div style={{ position: 'relative', width, height }}>
		<Img
			src={staticFile(PRIVACY_S26U_ASSETS.front)}
			style={{
				position: 'absolute',
				inset: 0,
				width: '100%',
				height: '100%',
				objectFit: 'contain',
				pointerEvents: 'none',
			}}
		/>
		<div
			style={{
				position: 'absolute',
				left: Math.round(width * 0.039),
				right: Math.round(width * 0.045),
				top: Math.round(height * 0.019),
				bottom: Math.round(height * 0.02),
				borderRadius: Math.round(width * 0.072),
				overflow: 'hidden',
			}}
		>
			{children}
			{darkness > 0 && (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						backgroundColor: PALETA_ANDROID.ink,
						opacity: Math.min(1, Math.max(0, darkness)),
						pointerEvents: 'none',
					}}
				/>
			)}
			<div
				style={{
					position: 'absolute',
					top: Math.round(height * 0.014),
					left: '50%',
					transform: 'translateX(-50%)',
					width: Math.max(10, Math.round(width * 0.036)),
					height: Math.max(10, Math.round(width * 0.036)),
					borderRadius: '50%',
					background: PALETA_ANDROID.ink,
				}}
			/>
		</div>
	</div>
);

/** Silueta de mayor contraste del dueño y su mano sujetando firmemente el S26 Ultra. */
const OwnerWithPhone = ({
	phoneX,
	phoneY,
	phoneW,
	phoneH,
	phoneRotationDeg = 0,
	screenDarkness = 0,
	pinLockedBadge = false,
	showHorizontalHint = false,
}: {
	phoneX: number;
	phoneY: number;
	phoneW: number;
	phoneH: number;
	phoneRotationDeg?: number;
	screenDarkness?: number;
	pinLockedBadge?: boolean;
	showHorizontalHint?: boolean;
}) => {
	const pivotX = phoneX + phoneW / 2;
	const pivotY = phoneY + phoneH / 2;
	return (
		<>
			<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
				<defs>
					<clipPath id="clipZonaDueno">
						<rect
							x={ZONA_SEGURA_LUXLINE.x0}
							y={ZONA_SEGURA_LUXLINE.y0}
							width={ANCHO_UTIL}
							height={ZONA_SEGURA_LUXLINE.y1 - ZONA_SEGURA_LUXLINE.y0}
						/>
					</clipPath>
				</defs>
				<g clipPath="url(#clipZonaDueno)">
					<ellipse cx={730} cy={1524} rx={198} ry={24} fill={PALETA_ANDROID.accent} opacity={0.42} />
					<circle cx={792} cy={636} r={54} fill="#BDBDBD" stroke={PALETA_ANDROID.metalDark} strokeWidth={3} />
					<path
						d="M 598 1510 L 616 934 C 624 790 698 724 796 724 C 884 724 934 786 938 922 L 940 1510 Z"
						fill="#AEAEAE"
						stroke={PALETA_ANDROID.metalDark}
						strokeWidth={3}
					/>
					<path
						d="M 738 730 L 796 815 L 854 730"
						fill="none"
						stroke={PALETA_ANDROID.metalDark}
						strokeWidth={3}
						strokeLinejoin="round"
					/>
					{/* Antebrazo continuo desde la manga del torso sosteniendo la base del teléfono */}
					<path
						d="M 938 1030 C 942 1150 928 1265 864 1340 C 792 1424 630 1444 508 1396 L 522 1322 C 632 1352 758 1338 820 1236 C 852 1184 872 1112 886 1052 C 902 1032 922 1024 938 1030 Z"
						fill={PALETA_ANDROID.accent}
						stroke={PALETA_ANDROID.metalDark}
						strokeWidth={3}
						strokeLinejoin="round"
					/>
				</g>
			</svg>

			<div
				style={{
					position: 'absolute',
					left: phoneX,
					top: phoneY,
					width: phoneW,
					height: phoneH,
					transform: `rotate(${phoneRotationDeg}deg)`,
					transformOrigin: `${phoneW / 2}px ${phoneH / 2}px`,
					filter: 'drop-shadow(0 24px 38px rgba(13, 13, 13, 0.18))',
				}}
			>
				<GalaxyS26UFrame width={phoneW} height={phoneH} darkness={screenDarkness}>
					<PhoneScreenContent pinLockedBadge={pinLockedBadge} />
				</GalaxyS26UFrame>
				{showHorizontalHint && (
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: -54,
							transform: `translateX(-50%) rotate(${-phoneRotationDeg}deg)`,
							padding: '6px 14px',
							borderRadius: 999,
							background: PALETA_ANDROID.ink,
							color: PALETA_ANDROID.highlight,
							fontFamily: 'LuxlineMono',
							fontSize: 18,
							whiteSpace: 'nowrap',
						}}
					>
						↻ 0° / 90°
					</div>
				)}
			</div>

			{/* Mano abrazando la base, el borde izquierdo (abajo de la lupa) y el bisel derecho */}
			<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
				<defs>
					<clipPath id="clipManoDueno">
						<rect
							x={ZONA_SEGURA_LUXLINE.x0}
							y={ZONA_SEGURA_LUXLINE.y0}
							width={ANCHO_UTIL}
							height={ZONA_SEGURA_LUXLINE.y1 - ZONA_SEGURA_LUXLINE.y0}
						/>
					</clipPath>
				</defs>
				<g clipPath="url(#clipManoDueno)" transform={`rotate(${phoneRotationDeg * 0.25} ${pivotX} ${pivotY})`}>
					<path
						d="M 484 1326 C 534 1408 776 1424 858 1308 C 878 1344 854 1396 812 1418 C 714 1468 538 1456 476 1372 C 468 1358 472 1336 484 1326 Z"
						fill={PALETA_ANDROID.accent}
						stroke={PALETA_ANDROID.metalDark}
						strokeWidth={3}
						strokeLinejoin="round"
					/>
					<rect x={464} y={1208} width={44} height={28} rx={14} fill="#B8B8B8" stroke={PALETA_ANDROID.metalDark} strokeWidth={3} />
					<rect x={462} y={1246} width={46} height={28} rx={14} fill="#B8B8B8" stroke={PALETA_ANDROID.metalDark} strokeWidth={3} />
					<rect x={466} y={1284} width={42} height={28} rx={14} fill="#B8B8B8" stroke={PALETA_ANDROID.metalDark} strokeWidth={3} />
					<rect
						x={818}
						y={1140}
						width={40}
						height={82}
						rx={20}
						transform="rotate(-12 838 1181)"
						fill="#B8B8B8"
						stroke={PALETA_ANDROID.metalDark}
						strokeWidth={3}
					/>
				</g>
			</svg>
		</>
	);
};

/** Espía en vector plano con lupa apuntando a (lensCx, lensCy). */
const SpyWithMagnifier = ({
	spyShiftX = 0,
	lensCx,
	lensCy,
	lensR,
	showQuestionMarkProgress = 0,
	lensMode = 'zoom',
	phoneX = BASE_PHONE_X,
	phoneY = BASE_PHONE_Y,
	phoneW = BASE_PHONE_W,
	phoneH = BASE_PHONE_H,
}: {
	spyShiftX?: number;
	lensCx: number;
	lensCy: number;
	lensR: number;
	showQuestionMarkProgress?: number;
	lensMode?: 'zoom' | 'black';
	phoneX?: number;
	phoneY?: number;
	phoneW?: number;
	phoneH?: number;
}) => {
	const handX = 488 + spyShiftX * 0.45;
	const handY = 1094;
	const handleAngleDeg = (Math.atan2(handY - lensCy, handX - lensCx) * 180) / Math.PI;

	return (
		<div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
			<div
				style={{
					position: 'absolute',
					left: lensCx - lensR,
					top: lensCy - lensR,
					width: lensR * 2,
					height: lensR * 2,
					borderRadius: '50%',
					overflow: 'hidden',
					background: lensMode === 'black' ? PALETA_ANDROID.ink : PALETA_ANDROID.highlight,
					boxShadow:
						lensMode === 'black'
							? 'inset 0 0 28px rgba(0,0,0,0.85), 0 18px 34px rgba(13,13,13,0.22)'
							: 'inset 0 0 20px rgba(13,13,13,0.14), 0 18px 34px rgba(13,13,13,0.16)',
				}}
			>
				{lensMode === 'zoom' ? (
					<div
						style={{
							position: 'absolute',
							left: phoneX - (lensCx - lensR),
							top: phoneY - (lensCy - lensR),
							width: phoneW,
							height: phoneH,
							transform: 'scale(1.13)',
							transformOrigin: `${lensCx - phoneX}px ${lensCy - phoneY}px`,
						}}
					>
						<div
							style={{
								position: 'absolute',
								left: Math.round(phoneW * 0.039),
								right: Math.round(phoneW * 0.045),
								top: Math.round(phoneH * 0.019),
								bottom: Math.round(phoneH * 0.02),
								borderRadius: Math.round(phoneW * 0.072),
								overflow: 'hidden',
							}}
						>
							<PhoneScreenContent />
						</div>
					</div>
				) : (
					<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
						<svg width={76} height={88} viewBox="0 0 76 88">
							<path
								d="M38 6 L66 18 V42 C66 60 53 74 38 82 C23 74 10 60 10 42 V18 Z"
								fill="none"
								stroke={PALETA_ANDROID.metalDark}
								strokeWidth={3.5}
								opacity={0.7}
							/>
							<circle cx={38} cy={43} r={5} fill={PALETA_ANDROID.metalDark} opacity={0.7} />
						</svg>
					</AbsoluteFill>
				)}
			</div>

			<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', left: 0, top: 0 }}>
				<defs>
					<clipPath id="clipEspiaZona">
						<rect
							x={ZONA_SEGURA_LUXLINE.x0}
							y={ZONA_SEGURA_LUXLINE.y0}
							width={ANCHO_UTIL}
							height={ZONA_SEGURA_LUXLINE.y1 - ZONA_SEGURA_LUXLINE.y0}
						/>
					</clipPath>
				</defs>
				<g clipPath="url(#clipEspiaZona)">
					<g transform={`translate(${spyShiftX}, 0)`}>
						<ellipse cx={292} cy={1524} rx={142} ry={22} fill={PALETA_ANDROID.accent} opacity={0.34} />
						<line
							x1={382}
							y1={838}
							x2={lensCx - lensR - spyShiftX - 6}
							y2={lensCy - 10}
							stroke={PALETA_ANDROID.metalDark}
							strokeWidth={2.5}
							strokeDasharray="8 8"
							opacity={0.55}
						/>

						{/* Gabardina */}
						<path
							d="M 145 1510 L 154 1110 C 158 1002 214 962 292 962 C 358 962 400 1004 416 1082 L 434 1510 Z"
							fill={PALETA_ANDROID.secondary}
						/>
						<path d="M 294 962 C 358 962 400 1004 416 1082 L 434 1510 L 308 1510 Z" fill={PALETA_ANDROID.ink} />
						<path
							d="M 234 972 L 302 1205 L 368 978"
							fill="none"
							stroke={PALETA_ANDROID.accent}
							strokeWidth={2.5}
							strokeLinejoin="round"
						/>
						<path d="M 218 972 L 244 882 L 386 886 L 398 982 L 302 1018 Z" fill={PALETA_ANDROID.metalDark} />
						<path
							d="M 218 972 L 244 882 L 386 886"
							fill="none"
							stroke={PALETA_ANDROID.accent}
							strokeWidth={2.5}
							strokeLinejoin="round"
						/>

						{/* Cabeza en 3/4 */}
						<path
							d="M 248 790 C 248 732 372 732 380 796 C 383 808 389 818 394 824 C 397 829 392 835 384 837 L 380 886 L 254 886 Z"
							fill={PALETA_ANDROID.frosted}
							stroke={PALETA_ANDROID.ink}
							strokeWidth={2.5}
							strokeLinejoin="round"
						/>
						<path d="M 248 788 L 382 798 L 382 820 L 250 814 Z" fill={PALETA_ANDROID.secondary} />
						<ellipse cx={330} cy={835} rx={15} ry={8} fill={PALETA_ANDROID.highlight} />
						<circle cx={338} cy={835} r={5.5} fill={PALETA_ANDROID.ink} />
						<ellipse cx={367} cy={834} rx={11} ry={7.5} fill={PALETA_ANDROID.highlight} />
						<circle cx={373} cy={834} r={4.8} fill={PALETA_ANDROID.ink} />
						<path d="M 314 818 L 380 822" stroke={PALETA_ANDROID.ink} strokeWidth={4} strokeLinecap="round" />

						{/* Sombrero Fedora */}
						<path
							d="M 232 782 L 266 672 C 270 662 282 658 294 662 L 316 670 L 340 662 C 350 659 360 665 363 676 L 384 782 Z"
							fill={PALETA_ANDROID.secondary}
						/>
						<path d="M 238 758 L 380 762 L 384 782 L 232 782 Z" fill={PALETA_ANDROID.ink} />
						<line x1={240} y1={758} x2={380} y2={762} stroke={PALETA_ANDROID.accent} strokeWidth={2} />
						<path
							d="M 178 788 C 238 770 382 772 454 800 C 414 808 250 802 178 788 Z"
							fill={PALETA_ANDROID.ink}
							stroke={PALETA_ANDROID.accent}
							strokeWidth={2}
							strokeLinejoin="round"
						/>

						{/* Brazo hacia el mango */}
						<path
							d={`M 322 1138 L 412 1132 L ${handX - spyShiftX} ${handY - 6} L ${handX - spyShiftX + 14} ${handY + 34} L 420 1196 L 316 1194 Z`}
							fill={PALETA_ANDROID.metalDark}
							stroke={PALETA_ANDROID.ink}
							strokeWidth={2.5}
							strokeLinejoin="round"
						/>

						{/* Signo de interrogación "?" en Escena 5 */}
						{showQuestionMarkProgress > 0.01 && (
							<g transform={`translate(324, 598) scale(${showQuestionMarkProgress})`} opacity={showQuestionMarkProgress}>
								<circle cx={0} cy={0} r={42} fill={PALETA_ANDROID.highlight} stroke={PALETA_ANDROID.ink} strokeWidth={4} />
								<path
									d="M -8 38 L -2 54 L 12 39 Z"
									fill={PALETA_ANDROID.highlight}
									stroke={PALETA_ANDROID.ink}
									strokeWidth={3}
									strokeLinejoin="round"
								/>
								<text x={0} y={16} textAnchor="middle" fill={PALETA_ANDROID.ink} fontFamily="LuxlineDisplay" fontSize={52} fontWeight={700}>
									?
								</text>
							</g>
						)}
					</g>

					<g transform={`translate(${lensCx}, ${lensCy}) rotate(${handleAngleDeg})`}>
						<rect
							x={lensR + 8}
							y={-11}
							width={24}
							height={22}
							rx={4}
							fill={PALETA_ANDROID.accent}
							stroke={PALETA_ANDROID.ink}
							strokeWidth={2.5}
						/>
						<rect x={lensR + 32} y={-14} width={118} height={28} rx={14} fill={PALETA_ANDROID.ink} />
						<rect x={lensR + 46} y={-5} width={84} height={6} rx={3} fill={PALETA_ANDROID.metalDark} />
					</g>

					<ellipse
						cx={handX}
						cy={handY}
						rx={28}
						ry={22}
						transform={`rotate(-28 ${handX} ${handY})`}
						fill={PALETA_ANDROID.ink}
						stroke={PALETA_ANDROID.accent}
						strokeWidth={2.5}
					/>

					<circle cx={lensCx} cy={lensCy} r={lensR + 10} fill="none" stroke={PALETA_ANDROID.ink} strokeWidth={13} />
					<circle cx={lensCx} cy={lensCy} r={lensR + 4} fill="none" stroke={PALETA_ANDROID.accent} strokeWidth={4.5} />
					<circle
						cx={lensCx}
						cy={lensCy}
						r={lensR}
						fill={PALETA_ANDROID.frosted}
						fillOpacity={0.08}
						stroke={PALETA_ANDROID.highlight}
						strokeWidth={2}
					/>

					{/* Reflejos curvos pegados al aro interior (r = lensR - 14) lejos de las letras */}
					<path
						d={`M ${lensCx - (lensR - 16)} ${lensCy - 18} A ${lensR - 14} ${lensR - 14} 0 0 1 ${lensCx - 22} ${lensCy - (lensR - 16)}`}
						fill="none"
						stroke={PALETA_ANDROID.highlight}
						strokeWidth={5}
						strokeLinecap="round"
						opacity={0.55}
					/>
					<path
						d={`M ${lensCx + 48} ${lensCy + (lensR - 32)} A ${lensR - 14} ${lensR - 14} 0 0 1 ${lensCx + 22} ${lensCy + (lensR - 16)}`}
						fill="none"
						stroke={PALETA_ANDROID.highlight}
						strokeWidth={3.5}
						strokeLinecap="round"
						opacity={0.35}
					/>
				</g>
			</svg>
		</div>
	);
};

const ShieldEmblem = ({ size = 136 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 120 120">
		<path
			d="M60 10 L102 27 V59 C102 85 83 103 60 112 C37 103 18 85 18 59 V27 Z"
			fill={PALETA_ANDROID.ink}
			stroke={PALETA_ANDROID.accent}
			strokeWidth={3}
		/>
		<path d="M60 22 L90 34 V58 C90 77 76 91 60 98 C44 91 30 77 30 58 V34 Z" fill={PALETA_ANDROID.secondary} />
		<path d="M39 60 C46 49 74 49 81 60 C74 71 46 71 39 60 Z" fill="none" stroke={PALETA_ANDROID.highlight} strokeWidth={3.5} />
		<circle cx={60} cy={60} r={6} fill={PALETA_ANDROID.highlight} />
		<line x1={43} y1={77} x2={77} y2={43} stroke={PALETA_ANDROID.accent} strokeWidth={4} strokeLinecap="round" />
	</svg>
);

/** Escenas 1 y 2 (0–7 s, f0..420): el espía se asoma (gancho ¿Sabías que…?) y la lupa se acerca leyendo la pantalla. */
const EscenasSpyIntro = () => {
	const f = useCurrentFrame();
	const spyShift = clampMix(f, 8, 44, -170, 0);
	const lensApproach = progress(f, 186, 54);
	const lensCx = clampMix(f, 20, 52, 578, 661) + lensApproach * 2;
	const lensCy = clampMix(f, 20, 52, 998, 956) - lensApproach * 4;
	const camZoom = progress(f, 192, 60) * (1 - progress(f, 368, 44));

	return (
		<SceneFade span={420}>
			<div style={DIORAMA_CLIP_STYLE}>
				<CameraFollow
					targetX={632}
					targetY={910}
					centerX={525}
					centerY={940}
					strength={camZoom}
					zoom={1 + 0.11 * camZoom}
				>
					<div style={DIORAMA_WRAPPER_STYLE}>
						<OwnerWithPhone
							phoneX={BASE_PHONE_X}
							phoneY={BASE_PHONE_Y}
							phoneW={BASE_PHONE_W}
							phoneH={BASE_PHONE_H}
						/>
						<SpyWithMagnifier
							spyShiftX={spyShift}
							lensCx={lensCx}
							lensCy={lensCy}
							lensR={108}
							lensMode="zoom"
							phoneX={BASE_PHONE_X}
							phoneY={BASE_PHONE_Y}
							phoneW={BASE_PHONE_W}
							phoneH={BASE_PHONE_H}
						/>
					</div>
				</CameraFollow>
			</div>

			<BrandHeaderLogo />
			<SceneContextHeader
				tag="¿SABÍAS QUE…?"
				title="Una pantalla normal conserva ~40 % de lado"
				from={6}
				exitAt={216}
			/>
			<SceneContextHeader
				tag="VISTA LATERAL"
				title="Desde un costado se lee todo"
				from={228}
			/>
		</SceneFade>
	);
};

/** Escena 3 (7–11 s, local f0..240): panel rápido → toque en "Privacy Display" → morph al escudo. */
const EscenaQuickSettingsEscudo = () => {
	const f = useCurrentFrame();
	const panelDrop = progress(f, 8, 36);
	const tapRing = progress(f, 62, 22);
	const toggledOn = f >= 76;
	const morphActive = f >= 122;
	const contentOutPhone = 1 - progress(f, 110, 12); // retira contenido 0.20 s antes del morph
	const shieldReveal = progress(f, 138, 18);

	return (
		<SceneFade span={240}>
			<BrandHeaderLogo />
			<SceneContextHeader
				tag="EXCLUSIVO GALAXY S26 ULTRA"
				title="Privacy Display en un toque"
				from={6}
			/>

			{!morphActive ? (
				<div
					style={{
						position: 'absolute',
						left: 344,
						top: 500,
						width: 392,
						height: Math.round(392 * RATIO_S26U),
						opacity: contentOutPhone,
						filter: 'drop-shadow(0 28px 44px rgba(13, 13, 13, 0.16))',
					}}
				>
					<GalaxyS26UFrame width={392} height={Math.round(392 * RATIO_S26U)}>
						<PhoneScreenContent pinFocused={false} />
						<div
							style={{
								position: 'absolute',
								inset: 0,
								background: 'rgba(246, 245, 242, 0.94)',
								transform: `translateY(${(1 - panelDrop) * -520}px)`,
								padding: '54px 18px 24px',
								display: 'flex',
								flexDirection: 'column',
								gap: 16,
								boxSizing: 'border-box',
							}}
						>
							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
								{[0, 1, 2, 3].map((idx) => (
									<div
										key={idx}
										style={{
											height: 60,
											borderRadius: 18,
											background: idx === 0 ? PALETA_ANDROID.ink : PALETA_ANDROID.frosted,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<div
											style={{
												width: 18,
												height: 18,
												borderRadius: idx % 2 === 0 ? '50%' : 5,
												border: `2.5px solid ${idx === 0 ? PALETA_ANDROID.highlight : PALETA_ANDROID.metalDark}`,
											}}
										/>
									</div>
								))}
							</div>

							<div
								style={{
									height: 44,
									borderRadius: 22,
									background: PALETA_ANDROID.frosted,
									padding: 5,
									boxSizing: 'border-box',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<div style={{ width: '72%', height: '100%', borderRadius: 18, background: PALETA_ANDROID.highlight }} />
							</div>

							<div style={{ position: 'relative', marginTop: 12 }}>
								<div
									style={{
										borderRadius: 28,
										padding: '22px 20px',
										background: toggledOn ? PALETA_ANDROID.ink : PALETA_ANDROID.highlight,
										color: toggledOn ? PALETA_ANDROID.highlight : PALETA_ANDROID.ink,
										border: `2px solid ${toggledOn ? PALETA_ANDROID.ink : PALETA_ANDROID.accent}`,
										boxShadow: '0 14px 28px rgba(13, 13, 13, 0.14)',
										transform: `scale(${tapRing > 0 && tapRing < 0.7 ? 0.96 : 1})`,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
										<div style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-0.02em' }}>Privacy Display</div>
										{toggledOn && (
											<div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: PALETA_ANDROID.frosted }}>
												<span
													style={{
														width: 8,
														height: 8,
														borderRadius: '50%',
														background: PALETA_ANDROID.statusActive,
														display: 'inline-block',
													}}
												/>
												<span>Privacy Display · Activo</span>
											</div>
										)}
									</div>
									<div
										style={{
											width: 60,
											height: 32,
											borderRadius: 16,
											background: toggledOn ? PALETA_ANDROID.metalDark : PALETA_ANDROID.frosted,
											border: `1.5px solid ${toggledOn ? PALETA_ANDROID.accent : PALETA_ANDROID.accent}`,
											padding: 3,
											boxSizing: 'border-box',
											display: 'flex',
											alignItems: 'center',
											justifyContent: toggledOn ? 'flex-end' : 'flex-start',
										}}
									>
										<div style={{ width: 24, height: 24, borderRadius: '50%', background: PALETA_ANDROID.highlight }} />
									</div>
								</div>

								{tapRing > 0 && tapRing < 1 && (
									<div
										style={{
											position: 'absolute',
											right: 26,
											top: 28,
											width: 56,
											height: 56,
											borderRadius: '50%',
											border: `3px solid ${PALETA_ANDROID.ink}`,
											opacity: 1 - tapRing,
											transform: `scale(${0.6 + 0.9 * tapRing})`,
										}}
									/>
								)}
							</div>

							{/* Tiles complementarios inferiores del panel de ajustes rápidos */}
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
								{[0, 1].map((idx) => (
									<div
										key={idx}
										style={{
											height: 68,
											borderRadius: 20,
											background: PALETA_ANDROID.frosted,
											border: `1px solid ${PALETA_ANDROID.accent}40`,
											padding: '0 16px',
											display: 'flex',
											alignItems: 'center',
											gap: 10,
										}}
									>
										<div style={{ width: 20, height: 20, borderRadius: '50%', background: PALETA_ANDROID.accent }} />
										<div style={{ width: idx === 0 ? 74 : 58, height: 10, borderRadius: 5, background: PALETA_ANDROID.metalDark, opacity: 0.45 }} />
									</div>
								))}
							</div>

							{/* Tirador inferior de la cortina de ajustes */}
							<div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
								<div style={{ width: 96, height: 6, borderRadius: 3, background: PALETA_ANDROID.accent }} />
							</div>
						</div>
					</GalaxyS26UFrame>
				</div>
			) : (
				<ObjectMorph
					from={{ x: 364, y: 730, width: 352, height: 108, radius: 28 }}
					to={{ x: 280, y: 610, width: 520, height: 520, radius: 76 }}
					start={122}
					duration={45}
					style={{
						background: PALETA_ANDROID.highlight,
						border: `2px solid ${PALETA_ANDROID.accent}`,
						boxShadow: '0 28px 64px rgba(13, 13, 13, 0.16)',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 24,
						padding: 36,
						boxSizing: 'border-box',
					}}
				>
					<div
						style={{
							opacity: shieldReveal,
							transform: `scale(${0.86 + 0.14 * shieldReveal})`,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 22,
						}}
					>
						<ShieldEmblem size={172} />
						<div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em', color: PALETA_ANDROID.ink }}>
							Privacy Display
						</div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 10,
								padding: '10px 20px',
								borderRadius: 999,
								background: PALETA_ANDROID.background,
								border: `1px solid ${PALETA_ANDROID.frosted}`,
								fontFamily: 'LuxlineMono',
								fontSize: 22,
								color: PALETA_ANDROID.ink,
							}}
						>
							<span
								style={{
									width: 11,
									height: 11,
									borderRadius: '50%',
									background: PALETA_ANDROID.statusActive,
									display: 'inline-block',
								}}
							/>
							<span>Privacy Display · Activo</span>
						</div>
					</div>
				</ObjectMorph>
			)}
		</SceneFade>
	);
};

/** Escena 4 (11–17 s, local f0..360): rotación 3D real con front-cutout.png + angle.png e indicador de 3 marcas. */
const EscenaRotacion3D = () => {
	const f = useCurrentFrame();
	const angleDeg =
		f < 55
			? 0
			: f < 175
				? interpolate(f, [55, 175], [0, 45], {
					easing: Easing.inOut(Easing.cubic),
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				})
				: f < 235
					? 45
					: interpolate(f, [235, 315], [45, 60], {
						easing: Easing.inOut(Easing.cubic),
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					});
	const darkness = 1 - brilloDesdeAngulo(angleDeg);
	// En el paso por ~30° (22°..36°), integra angle.png con su misma proyección horizontal sin doble borde
	const angleAssetWeight =
		angleDeg <= 22 || angleDeg >= 36
			? 0
			: angleDeg < 30
				? interpolate(angleDeg, [22, 30], [0, 0.72], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
				: interpolate(angleDeg, [30, 36], [0.72, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const angleScaleX = Math.cos((angleDeg * Math.PI) / 180) / Math.cos((30 * Math.PI) / 180);

	const starts = chainStarts([28, 28, 28], 10);
	const marcas = [
		{ texto: '0° = 100 %', activa: angleDeg < 22 },
		{ texto: '45° = 3.5 %', activa: angleDeg >= 22 && angleDeg < 53 },
		{ texto: '60° = menos de 1 %', activa: angleDeg >= 53 },
	] as const;

	return (
		<SceneFade span={360}>
			<BrandHeaderLogo />

			<div
				style={{
					position: 'absolute',
					right: 1080 - ZONA_SEGURA_LUXLINE.x1,
					top: 252,
					padding: '10px 22px',
					borderRadius: 999,
					background: PALETA_ANDROID.highlight,
					border: `1.5px solid ${PALETA_ANDROID.accent}`,
					fontFamily: 'LuxlineMono',
					fontSize: 30,
					color: PALETA_ANDROID.ink,
				}}
			>
				{Math.round(angleDeg)}°
			</div>

			<SceneContextHeader
				tag="ÁNGULO DE VISIÓN"
				title="Brillo medido por ángulo"
				from={4}
			/>

			<div
				style={{
					position: 'absolute',
					left: 374,
					top: 492,
					width: 332,
					height: Math.round(332 * RATIO_S26U), // 682 px
					perspective: 1200,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{angleAssetWeight > 0.01 && (
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							width: 1117,
							height: 1117,
							transform: `translate(-50%, -50%) scaleX(${angleScaleX})`,
							opacity: angleAssetWeight,
							pointerEvents: 'none',
						}}
					>
						<Img
							src={staticFile(PRIVACY_S26U_ASSETS.angle)}
							style={{ width: '100%', height: '100%', objectFit: 'contain' }}
						/>
					</div>
				)}

				<div
					style={{
						position: 'relative',
						width: 332,
						height: Math.round(332 * RATIO_S26U),
						transformStyle: 'preserve-3d',
						transform: `rotateY(${angleDeg}deg)`,
						filter: 'drop-shadow(0 30px 48px rgba(13, 13, 13, 0.18))',
					}}
				>
					{[-16, -12, -8, -4].map((zOffset) => (
						<div
							key={zOffset}
							style={{
								position: 'absolute',
								inset: 0,
								transform: `translateZ(${zOffset}px)`,
								pointerEvents: 'none',
								opacity: 1 - angleAssetWeight * 0.7,
							}}
						>
							<Img
								src={staticFile(PRIVACY_S26U_ASSETS.front)}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'contain',
									filter: 'brightness(0.84) contrast(1.08)',
								}}
							/>
						</div>
					))}

					<div style={{ position: 'absolute', inset: 0, transform: 'translateZ(2px)' }}>
						<GalaxyS26UFrame width={332} height={Math.round(332 * RATIO_S26U)} darkness={darkness}>
							<PhoneScreenContent pinFocused={false} />
						</GalaxyS26UFrame>
					</div>
				</div>
			</div>

			<div
				style={{
					position: 'absolute',
					left: ZONA_SEGURA_LUXLINE.x0,
					top: 1212,
					width: ANCHO_UTIL,
					display: 'flex',
					flexDirection: 'column',
					gap: 20,
				}}
			>
				<div
					style={{
						width: '100%',
						height: 14,
						borderRadius: 7,
						background: PALETA_ANDROID.frosted,
						overflow: 'hidden',
						border: `1px solid ${PALETA_ANDROID.accent}`,
					}}
				>
					<div
						style={{
							width: `${(angleDeg / 60) * 100}%`,
							height: '100%',
							background: PALETA_ANDROID.ink,
						}}
					/>
				</div>

				<div style={{ display: 'flex', gap: 18, width: '100%' }}>
					{marcas.map((m, idx) => (
						<ChainMove key={m.texto} from={8 + starts[idx]} duration={30} dy={24} dx={0} style={{ flex: 1 }}>
							<div
								style={{
									height: 178,
									borderRadius: 28,
									padding: '22px 18px',
									boxSizing: 'border-box',
									background: m.activa ? PALETA_ANDROID.ink : PALETA_ANDROID.highlight,
									color: m.activa ? PALETA_ANDROID.highlight : PALETA_ANDROID.ink,
									border: `2px solid ${m.activa ? PALETA_ANDROID.ink : PALETA_ANDROID.accent}`,
									boxShadow: m.activa ? '0 18px 34px rgba(13,13,13,0.18)' : '0 8px 18px rgba(13,13,13,0.06)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									textAlign: 'center',
								}}
							>
								<MaskReveal from={12 + starts[idx]} duration={22}>
									<div
										style={{
											fontFamily: 'LuxlineDisplay',
											fontSize: 32,
											fontWeight: 700,
											lineHeight: 1.18,
											letterSpacing: '-0.02em',
										}}
									>
										{m.texto}
									</div>
								</MaskReveal>
							</div>
						</ChainMove>
					))}
				</div>
			</div>
		</SceneFade>
	);
};

/** Escena 5 (17–21 s, local f0..240): el espía solo ve negro en la lupa y aparece "?". */
const EscenaEspiaSoloNegro = () => {
	const f = useCurrentFrame();
	const orientRot =
		f < 12
			? 0
			: f < 56
				? clampMix(f, 12, 22, 0, -90)
				: clampMix(f, 56, 24, -90, 0);
	const spyShift = clampMix(f, 18, 36, -150, 0);
	const camZoom = progress(f, 76, 48) * (1 - progress(f, 202, 30));
	const questionPop = progress(f, 72, 26);

	return (
		<SceneFade span={240}>
			<div style={DIORAMA_CLIP_STYLE}>
				<CameraFollow
					targetX={612}
					targetY={910}
					centerX={525}
					centerY={940}
					strength={camZoom}
					zoom={1 + 0.095 * camZoom}
				>
					<div style={DIORAMA_WRAPPER_STYLE}>
						<OwnerWithPhone
							phoneX={BASE_PHONE_X}
							phoneY={BASE_PHONE_Y + 34}
							phoneW={BASE_PHONE_W}
							phoneH={BASE_PHONE_H}
							phoneRotationDeg={orientRot}
							screenDarkness={0.96}
							pinLockedBadge
							showHorizontalHint={f >= 10 && f < 96}
						/>
						<SpyWithMagnifier
							spyShiftX={spyShift}
							lensCx={655}
							lensCy={990}
							lensR={108}
							lensMode="black"
							showQuestionMarkProgress={questionPop}
						/>
					</div>
				</CameraFollow>
			</div>

			<BrandHeaderLogo />
			<MaskReveal
				from={6}
				duration={26}
				style={{
					position: 'absolute',
					left: ZONA_SEGURA_LUXLINE.x0,
					top: 328,
					width: ANCHO_UTIL,
					fontSize: 58,
					fontWeight: 700,
					lineHeight: 1.06,
					letterSpacing: '-0.03em',
					color: PALETA_ANDROID.ink,
				}}
			>
				Vertical u horizontal
			</MaskReveal>
			<ChainMove
				from={24}
				duration={28}
				dx={0}
				dy={24}
				style={{
					position: 'absolute',
					left: ZONA_SEGURA_LUXLINE.x0,
					top: 404,
					width: ANCHO_UTIL,
					fontSize: 38,
					fontWeight: 500,
					lineHeight: 1.15,
					letterSpacing: '-0.02em',
					color: PALETA_ANDROID.secondary,
				}}
			>
				Puede activarse sola con tu PIN
			</ChainMove>
		</SceneFade>
	);
};

/** Escena 6 (21–25 s, local f0..240): el teléfono se transforma en el logo Luxline CR y cierre. */
const EscenaCierreLogo = () => {
	const f = useCurrentFrame();
	const phoneFadeOut = 1 - progress(f, 0, 14);
	const logoReveal = progress(f, 28, 22);

	return (
		<SceneFade span={240} last>
			{phoneFadeOut > 0.01 && (
				<div
					style={{
						position: 'absolute',
						left: 360,
						top: 500,
						width: 360,
						height: Math.round(360 * RATIO_S26U),
						opacity: phoneFadeOut,
						transform: `scale(${interpolate(phoneFadeOut, [0, 1], [0.88, 1])})`,
					}}
				>
					<GalaxyS26UFrame width={360} height={Math.round(360 * RATIO_S26U)}>
						<PhoneScreenContent pinLockedBadge />
					</GalaxyS26UFrame>
				</div>
			)}

			<ObjectMorph
				from={{ x: 360, y: 500, width: 360, height: 739, radius: 36 }}
				to={{ x: 205, y: 550, width: 670, height: 260, radius: 48 }}
				start={2}
				duration={46}
				style={{
					background: PALETA_ANDROID.highlight,
					border: `2px solid ${PALETA_ANDROID.accent}`,
					boxShadow: '0 26px 60px rgba(13, 13, 13, 0.14)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: 40,
					boxSizing: 'border-box',
				}}
			>
				<Img
					src={staticFile(PRIVACY_S26U_ASSETS.logo)}
					style={{
						width: 540,
						height: 170,
						objectFit: 'contain',
						opacity: logoReveal,
						transform: `scale(${0.92 + 0.08 * logoReveal})`,
					}}
				/>
			</ObjectMorph>

			<MaskReveal
				from={44}
				duration={28}
				style={{
					position: 'absolute',
					left: ZONA_SEGURA_LUXLINE.x0,
					top: 890,
					width: ANCHO_UTIL,
					textAlign: 'center',
					fontSize: 74,
					fontWeight: 600,
					lineHeight: 1.06,
					letterSpacing: '-0.03em',
					color: PALETA_ANDROID.ink,
				}}
			>
				Tu pantalla, solo para ti.
			</MaskReveal>

			<ChainMove
				from={62}
				duration={30}
				dx={0}
				dy={24}
				style={{
					position: 'absolute',
					left: ZONA_SEGURA_LUXLINE.x0,
					top: 1090,
					width: ANCHO_UTIL,
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						padding: '16px 32px',
						borderRadius: 999,
						background: PALETA_ANDROID.ink,
						color: PALETA_ANDROID.highlight,
						fontFamily: 'LuxlineMono',
						fontSize: 32,
						fontWeight: 400,
						letterSpacing: '0.02em',
						boxShadow: '0 16px 34px rgba(13, 13, 13, 0.18)',
					}}
				>
					Galaxy S26 Ultra · luxline.tech
				</div>
			</ChainMove>
		</SceneFade>
	);
};

export interface PrivacyDisplayS26UProps {
	conAudio?: boolean;
}

export const PrivacyDisplayS26U: React.FC<PrivacyDisplayS26UProps> = ({
	conAudio = true,
}) => {
	const { width } = useVideoConfig();
	const escala = width / 1080;
	const [handle] = useState(() => delayRender('Luxline PrivacyDisplay fonts'));

	useEffect(() => {
		const display = new FontFace(
			'LuxlineDisplay',
			`url(${staticFile(PRIVACY_S26U_ASSETS.fontDisplay)})`,
			{ weight: '100 900' },
		);
		const mono = new FontFace(
			'LuxlineMono',
			`url(${staticFile(PRIVACY_S26U_ASSETS.fontMono)})`,
			{ weight: '400' },
		);
		Promise.all([display.load(), mono.load()])
			.then(([loadedDisplay, loadedMono]) => {
				const fonts = document.fonts as unknown as { add: (font: FontFace) => void };
				fonts.add(loadedDisplay);
				fonts.add(loadedMono);
				continueRender(handle);
			})
			.catch((err) => cancelRender(err));
	}, [handle]);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: PALETA_ANDROID.background,
				color: PALETA_ANDROID.ink,
				fontFamily: 'LuxlineDisplay',
				overflow: 'hidden',
			}}
		>
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
						inset: 0,
						background:
							'radial-gradient(circle at 60% 52%, rgba(255,255,255,0.96) 0%, rgba(246,245,242,0.55) 48%, rgba(226,226,226,0.58) 100%)',
					}}
				/>

				<Sequence from={0} durationInFrames={420}>
					<EscenasSpyIntro />
				</Sequence>
				<Sequence from={420} durationInFrames={240}>
					<EscenaQuickSettingsEscudo />
				</Sequence>
				<Sequence from={660} durationInFrames={360}>
					<EscenaRotacion3D />
				</Sequence>
				<Sequence from={1020} durationInFrames={240}>
					<EscenaEspiaSoloNegro />
				</Sequence>
				<Sequence from={1260} durationInFrames={240}>
					<EscenaCierreLogo />
				</Sequence>

				<SpeechVisualSync
					mode={privacyCues.mode as 'sales'}
					voiceApproved={privacyCues.voiceApproved}
					simulation={privacyCues.simulation}
					transcripcion={privacyCues}
					dictionary={PRIVACY_S26U_WORD_ASSETS}
				/>

				{conAudio &&
					CUES_SFX_PRIVACY_DISPLAY_S26U.map((cue) => {
						const efecto = obtenerEfectoPorId(cue.efectoId);
						if (!efecto) return null;
						return (
							<Sequence
								key={`sfx-${cue.efectoId}-${cue.cuadro}`}
								from={cue.cuadro}
								durationInFrames={Math.round(efecto.duracion_s * 60)}
							>
								<Audio
									src={staticFile(
										`biblioteca/${efecto.archivo_relativo_biblioteca}`,
									)}
									volume={cue.volumen * 0.45}
								/>
							</Sequence>
						);
					})}
			</div>
		</AbsoluteFill>
	);
};
