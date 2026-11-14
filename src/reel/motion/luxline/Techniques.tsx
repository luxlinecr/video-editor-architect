import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ZONA_SEGURA, type CajaZona} from '../../../estilo/zona-segura';

export const luxuryEase = Easing.bezier(0.22, 1, 0.36, 1);

/** Zona segura del editor (Reels 1080×1920): manda sobre los márgenes del kit. */
export const ZONA_SEGURA_LUXLINE: CajaZona = ZONA_SEGURA.capas;

/** Imágenes históricas/boceto del kit prohibidas en cualquier video final. */
export const ASSETS_PROHIBIDOS_VIDEO = ['fondo-mesh-elevenlabs.png', 'foto-producto.jpg'] as const;

export function progress(frame: number, from: number, duration: number) {
	if (duration <= 0) throw Error('duration must be positive');
	return interpolate(frame, [from, from + duration], [0, 1], {
		easing: luxuryEase,
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
}

export function MaskReveal({
	children,
	from = 0,
	duration = 30,
	style,
}: {
	children: ReactNode;
	from?: number;
	duration?: number;
	style?: CSSProperties;
}) {
	const t = progress(useCurrentFrame(), from, duration);
	return (
		<div style={{...style, clipPath: 'inset(' + (1 - t) * 100 + '% 0 0 0)'}}>
			<div style={{transform: 'translateY(' + (1 - t) * 24 + 'px)'}}>{children}</div>
		</div>
	);
}

export function chainStarts(durations: number[], overlap: number) {
	if (overlap < 0 || durations.some((d) => d <= overlap)) throw Error('Each duration must exceed overlap');
	let n = 0;
	return durations.map((d) => {
		const start = n;
		n += d - overlap;
		return start;
	});
}

export function ChainMove({
	children,
	from,
	duration = 36,
	dx = 80,
	dy = 0,
	style,
}: {
	children: ReactNode;
	from: number;
	duration?: number;
	dx?: number;
	dy?: number;
	style?: CSSProperties;
}) {
	const t = progress(useCurrentFrame(), from, duration);
	return (
		<div
			style={{
				...style,
				opacity: t,
				transform: 'translate(' + (1 - t) * dx + 'px,' + (1 - t) * dy + 'px)',
			}}
		>
			{children}
		</div>
	);
}

export function CameraFollow({
	children,
	targetX,
	targetY,
	centerX = 540,
	centerY = 820,
	zoom = 1,
	strength = 1,
}: {
	children: ReactNode;
	targetX: number;
	targetY: number;
	centerX?: number;
	centerY?: number;
	zoom?: number;
	strength?: number;
}) {
	const x = centerX + (targetX - centerX) * strength;
	const y = centerY + (targetY - centerY) * strength;
	return (
		<AbsoluteFill
			style={{
				transformOrigin: '0 0',
				transform: 'translate(' + centerX + 'px,' + centerY + 'px) scale(' + zoom + ') translate(' + -x + 'px,' + -y + 'px)',
			}}
		>
			{children}
		</AbsoluteFill>
	);
}

export type ShapePose = {x: number; y: number; width: number; height: number; radius: number};

/** Mantiene una caja `ShapePose` dentro de `ZONA_SEGURA.capas` (base 1080×1920). */
export function acotarPoseZonaSegura(pose: ShapePose): ShapePose {
	const z = ZONA_SEGURA_LUXLINE;
	const maxW = z.x1 - z.x0;
	const maxH = z.y1 - z.y0;
	const width = Math.max(0, Math.min(pose.width, maxW));
	const height = Math.max(0, Math.min(pose.height, maxH));
	const x = Math.min(Math.max(pose.x, z.x0), z.x1 - width);
	const y = Math.min(Math.max(pose.y, z.y0), z.y1 - height);
	return {x, y, width, height, radius: Math.max(0, pose.radius)};
}

export function ObjectMorph({
	from,
	to,
	start,
	duration = 42,
	children,
	style,
}: {
	from: ShapePose;
	to: ShapePose;
	start: number;
	duration?: number;
	children?: ReactNode;
	style?: CSSProperties;
}) {
	const t = progress(useCurrentFrame(), start, duration);
	const mix = (a: number, b: number) => a + (b - a) * t;
	const fromSegura = acotarPoseZonaSegura(from);
	const toSegura = acotarPoseZonaSegura(to);
	return (
		<div
			style={{
				position: 'absolute',
				left: mix(fromSegura.x, toSegura.x),
				top: mix(fromSegura.y, toSegura.y),
				width: mix(fromSegura.width, toSegura.width),
				height: mix(fromSegura.height, toSegura.height),
				borderRadius: mix(fromSegura.radius, toSegura.radius),
				...style,
			}}
		>
			{children}
		</div>
	);
}

export type WordCue = {word: string; start: number; end: number};
export type AssetDictionary = Record<string, {src: string; label: string}>;

/** Palabra cronometrada en el formato del editor (`transcripcion.json` / `edicion.subtitulos`). */
export type PalabraTranscripcion = {
	i?: number;
	t: string;
	d: number;
	h: number;
};

/** Cualquiera de las salidas reales de tiempo por palabra del editor. */
export type FuenteTranscripcionEditor =
	| readonly PalabraTranscripcion[]
	| {palabras: readonly PalabraTranscripcion[]}
	| {subtitulos: readonly {palabras?: readonly PalabraTranscripcion[]}[]};

export const normalizeWord = (word: string) =>
	word
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '');

/** Verifica si una ruta corresponde a un archivo prohibido en video. */
export function esAssetProhibido(src: string): boolean {
	const limpio = src.replaceAll('\\', '/').toLowerCase().trim();
	return ASSETS_PROHIBIDOS_VIDEO.some((archivo) => limpio === archivo || limpio.endsWith(`/${archivo}`));
}

function extraerPalabras(fuente: FuenteTranscripcionEditor): PalabraTranscripcion[] {
	if (Array.isArray(fuente)) return [...fuente];
	if ('palabras' in fuente && Array.isArray(fuente.palabras)) return [...fuente.palabras];
	if ('subtitulos' in fuente && Array.isArray(fuente.subtitulos)) {
		return fuente.subtitulos.flatMap((s) => (Array.isArray(s.palabras) ? s.palabras : []));
	}
	return [];
}

/**
 * Convierte tiempos reales por palabra de la transcripción del editor (`d`, `h` en segundos)
 * en marcadores de cuadros ordenados y sin solapamiento para `SpeechVisualSync`.
 */
export function cuesDesdeTranscripcion(
	fuente: FuenteTranscripcionEditor,
	dictionary: AssetDictionary,
	fps: number,
	opciones?: {retencionMaxS?: number; respiroEntreCuesS?: number},
): WordCue[] {
	if (!Number.isFinite(fps) || fps <= 0) throw Error('fps debe ser positivo');
	const retencionMaxS = opciones?.retencionMaxS ?? 1.2;
	const respiroCuadros = Math.max(0, Math.round((opciones?.respiroEntreCuesS ?? 0) * fps));

	const candidatas = extraerPalabras(fuente)
		.filter((p) => {
			if (!p || typeof p.t !== 'string' || !Number.isFinite(p.d) || !Number.isFinite(p.h) || p.d < 0 || p.h < p.d) {
				return false;
			}
			const clave = normalizeWord(p.t);
			const asset = dictionary[clave];
			return Boolean(clave && asset && !esAssetProhibido(asset.src));
		})
		.sort((a, b) => a.d - b.d || a.h - b.h);

	const resultado: WordCue[] = [];
	const retencionCuadros = Math.max(1, Math.round(retencionMaxS * fps));

	for (let i = 0; i < candidatas.length; i++) {
		const actual = candidatas[i];
		const minStart = resultado.length > 0 ? resultado[resultado.length - 1].end + respiroCuadros : 0;
		const start = Math.max(minStart, Math.round(actual.d * fps));
		const finPalabra = Math.max(start + 1, Math.round(actual.h * fps));
		const deseadoEnd = Math.max(finPalabra, start + retencionCuadros);

		const siguiente = candidatas[i + 1];
		let end = deseadoEnd;
		if (siguiente) {
			const siguienteStart = Math.round(siguiente.d * fps);
			const tope = siguienteStart - respiroCuadros;
			// Si dos palabras coinciden tan cerca que se solapan, respetamos al menos 1 cuadro sin retroceder.
			end = Math.max(start + 1, Math.min(deseadoEnd, tope));
		}

		resultado.push({word: actual.t, start, end});
	}

	return resultado;
}

/**
 * Muestra palabra y asset autorizado en sincronía con la voz.
 * En producción (`simulation=false`, `voiceApproved=true`), pasar `transcripcion` del editor (nunca `demo-cues.json`).
 */
export function SpeechVisualSync({
	cues,
	transcripcion,
	dictionary,
	mode,
	voiceApproved,
	simulation = false,
}: {
	cues?: WordCue[];
	transcripcion?: FuenteTranscripcionEditor;
	dictionary: AssetDictionary;
	mode: 'viral' | 'sales' | 'educational';
	voiceApproved: boolean;
	simulation?: boolean;
}) {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (!['viral', 'sales'].includes(mode) || (!voiceApproved && !simulation)) return null;

	const cuesActivos = !simulation && transcripcion ? cuesDesdeTranscripcion(transcripcion, dictionary, fps) : (cues ?? []);
	const cue = cuesActivos.find((c) => frame >= c.start && frame < c.end);
	if (!cue) return null;

	const asset = dictionary[normalizeWord(cue.word)];
	if (!asset || esAssetProhibido(asset.src)) return null;

	const t = progress(frame, cue.start, 6);
	const left = Math.max(ZONA_SEGURA_LUXLINE.x0, Math.round((1080 - 660) / 2));
	const ancho = Math.min(660, ZONA_SEGURA_LUXLINE.x1 - left);

	return (
		<div style={{position: 'absolute', left, top: 510, width: ancho, textAlign: 'center', opacity: t}}>
			<div style={{fontSize: 68, fontWeight: 600, marginBottom: 34}}>{cue.word}</div>
			<Img
				src={staticFile(asset.src)}
				alt={asset.label}
				style={{width: 500, height: 420, objectFit: 'contain', transform: 'scale(' + (0.96 + 0.04 * t) + ')'}}
			/>
		</div>
	);
}
