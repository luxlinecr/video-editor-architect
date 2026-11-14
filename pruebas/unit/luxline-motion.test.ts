// id: er-2f298797
import {describe, expect, it} from 'vitest';
import {ZONA_SEGURA, fueraDeZona} from '../../src/estilo/zona-segura';
import {
	ASSETS_PROHIBIDOS_VIDEO,
	ZONA_SEGURA_LUXLINE,
	acotarPoseZonaSegura,
	chainStarts,
	cuesDesdeTranscripcion,
	esAssetProhibido,
	normalizeWord,
	type AssetDictionary,
} from '../../src/reel/motion/luxline/Techniques';
import {glassShotSequence, sampleGlassMotion} from '../../src/reel/motion/luxline/glass-motion';
import dictionary from '../../src/reel/motion/luxline/word-assets.json';

describe('luxline motion — transcripción real del editor a cues', () => {
	it('convierte palabras de transcripcion.json a cuadros en 30 fps y 60 fps sin solaparse', () => {
		const transcripcion = {
			palabras: [
				{i: 0, t: 'Tu', d: 0.1, h: 0.25},
				{i: 1, t: 'iPhone', d: 0.3, h: 0.75},
				{i: 2, t: 'tiene', d: 0.8, h: 1.05},
				{i: 3, t: 'Detalle!', d: 1.1, h: 1.5},
			],
		};

		const cues30 = cuesDesdeTranscripcion(transcripcion, dictionary, 30);
		expect(cues30).toHaveLength(2);
		expect(cues30[0]).toEqual({word: 'iPhone', start: 9, end: 33});
		expect(cues30[1]).toEqual({word: 'Detalle!', start: 33, end: 69});

		const cues60 = cuesDesdeTranscripcion(transcripcion, dictionary, 60);
		expect(cues60).toHaveLength(2);
		expect(cues60[0]).toEqual({word: 'iPhone', start: 18, end: 66});
		expect(cues60[1]).toEqual({word: 'Detalle!', start: 66, end: 138});
	});

	it('lee subtitulos[].palabras de EDL, ordena cronológicamente y mantiene end > start sin solape', () => {
		const edlSubtitulos = {
			subtitulos: [
				{palabras: [{i: 0, t: 'El', d: 2.0, h: 2.1}, {i: 1, t: 'detalle', d: 2.15, h: 2.5}]},
				{palabras: [{i: 2, t: 'de', d: 0.2, h: 0.35}, {i: 3, t: 'iPhone', d: 0.4, h: 0.9}]},
				{palabras: [{i: 4, t: 'otro', d: 2.16, h: 2.2}, {i: 5, t: 'iPhone', d: 2.17, h: 2.4}]},
			],
		};

		const cues = cuesDesdeTranscripcion(edlSubtitulos, dictionary, 30);
		expect(cues.map((c) => normalizeWord(c.word))).toEqual(['iphone', 'detalle', 'iphone']);
		for (let i = 0; i < cues.length; i++) {
			expect(cues[i].end).toBeGreaterThan(cues[i].start);
			if (i > 0) expect(cues[i].start).toBeGreaterThanOrEqual(cues[i - 1].end);
		}
	});
});

describe('luxline motion — bloqueo de archivos prohibidos y normalización', () => {
	it('detecta fondo-mesh-elevenlabs.png y foto-producto.jpg en cualquier ruta y omite sus cues', () => {
		for (const nombre of ASSETS_PROHIBIDOS_VIDEO) {
			expect(esAssetProhibido(nombre)).toBe(true);
			expect(esAssetProhibido(`assets/marca/imagenes/${nombre}`)).toBe(true);
			expect(esAssetProhibido(`C:\\tmp\\${nombre.toUpperCase()}`)).toBe(true);
		}
		expect(esAssetProhibido('assets/marca/imagenes/promo-iphone/iphone.png')).toBe(false);

		const dicConProhibidos: AssetDictionary = {
			...dictionary,
			mesh: {src: 'assets/marca/imagenes/marca/bocetos-ui/fondo-mesh-elevenlabs.png', label: 'Prohibido'},
			foto: {src: 'assets/marca/imagenes/referencias/foto-producto.jpg', label: 'Prohibido'},
		};
		const cues = cuesDesdeTranscripcion(
			[
				{t: 'mesh', d: 0.1, h: 0.4},
				{t: 'foto', d: 0.5, h: 0.8},
				{t: 'iPhone', d: 1.0, h: 1.4},
			],
			dicConProhibidos,
			30,
		);
		expect(cues.map((c) => c.word)).toEqual(['iPhone']);
	});
});

describe('luxline motion — zona segura del editor y curvas', () => {
	it('prioriza ZONA_SEGURA.capas de src/estilo/zona-segura.ts sobre el kit y acota ObjectMorph', () => {
		expect(ZONA_SEGURA_LUXLINE).toEqual(ZONA_SEGURA.capas);

		const acotada = acotarPoseZonaSegura({x: 90, y: 180, width: 900, height: 1500, radius: 58});
		expect(acotada.x).toBe(ZONA_SEGURA.capas.x0);
		expect(acotada.y).toBe(ZONA_SEGURA.capas.y0);
		expect(acotada.width).toBe(ZONA_SEGURA.capas.x1 - ZONA_SEGURA.capas.x0);
		expect(acotada.y + acotada.height).toBeLessThanOrEqual(ZONA_SEGURA.capas.y1);
		expect(
			fueraDeZona(
				{x0: acotada.x, y0: acotada.y, x1: acotada.x + acotada.width, y1: acotada.y + acotada.height},
				'capa',
			),
		).toEqual([]);
	});

	it('chainStarts y glassShotSequence funcionan a 60 fps en 600 cuadros', () => {
		expect(chainStarts([42, 42, 42], 12)).toEqual([0, 30, 60]);
		const seq = glassShotSequence(600, 60, 3);
		expect(sampleGlassMotion(0, seq).width).toBeCloseTo(0.72, 4);
		expect(sampleGlassMotion(599, seq).width).toBeCloseTo(1, 4);
	});
});
