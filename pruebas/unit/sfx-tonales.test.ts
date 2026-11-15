// id: er-2f298797
import {createHash} from 'node:crypto';
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {
	buscarEfectosPorEtiqueta,
	CATALOGO_SFX_TONALES,
	CUES_SFX_PRIVACY_DISPLAY_S26U,
	EFECTOS_TONALES,
	elegirEfectoTonal,
	obtenerEfectoPorId,
	obtenerEfectosTonales,
	type TipoSfxTonal,
} from '../../src/reel/motion/luxline/sfx-tonales';
import {
	elegirEfectoTonalPorTipo,
	leerCatalogoTonales,
	obtenerEfectosTonalesPorTipo,
	RUTA_CATALOGO_TONALES,
} from '../../herramientas/lib/sfx-tonales';

describe('sfx tonales — catálogo y metadatos', () => {
	it('contiene exactamente 30 efectos sonoros con las 6 etiquetas solicitadas', () => {
		expect(EFECTOS_TONALES).toHaveLength(30);
		expect(CATALOGO_SFX_TONALES.total_efectos).toBe(30);

		const conteos: Record<TipoSfxTonal, number> = {
			campana: 5,
			kalimba: 4,
			arpa: 1,
			cristalino: 8,
			destello: 9,
			transicion: 3,
		};

		for (const [tipo, totalEsperado] of Object.entries(conteos) as [TipoSfxTonal, number][]) {
			const filtrados = obtenerEfectosTonales(tipo);
			expect(filtrados).toHaveLength(totalEsperado);
			expect(CATALOGO_SFX_TONALES.conteo_por_tipo[tipo]).toBe(totalEsperado);
		}
	});

	it('cada efecto tiene licencia CC0 1.0 y URL de origen válida en sfxmint.com', () => {
		for (const efecto of EFECTOS_TONALES) {
			expect(efecto.licencia).toBe('CC0 1.0');
			expect(efecto.fuente_url).toMatch(/^https:\/\/sfxmint\.com\/sounds\//);
			expect(efecto.formato).toBe('MP3');
			expect(efecto.duracion_s).toBeGreaterThan(0);
		}
	});

	it('todos los 30 archivos MP3 existen en disco y su hash sha256 coincide con el catálogo', () => {
		for (const efecto of EFECTOS_TONALES) {
			const rutaAbsoluta = resolve(efecto.archivo);
			expect(existsSync(rutaAbsoluta), `Falta el archivo: ${efecto.archivo}`).toBe(true);

			const bytes = readFileSync(rutaAbsoluta);
			const hash = createHash('sha256').update(bytes).digest('hex');
			expect(hash, `El hash sha256 de ${efecto.archivo_nombre} no coincide`).toBe(efecto.sha256);
		}
	});

	it('los archivos son accesibles para Remotion a través de public/biblioteca', () => {
		for (const efecto of EFECTOS_TONALES) {
			const rutaPublic = resolve('public', 'biblioteca', efecto.archivo_relativo_biblioteca);
			expect(
				existsSync(rutaPublic),
				`El archivo no es accesible vía public/biblioteca: ${rutaPublic}`,
			).toBe(true);
		}
	});
});

describe('sfx tonales — helpers de selección y búsqueda', () => {
	it('obtiene un efecto por su id único o undefined si no existe', () => {
		const vibrafono = obtenerEfectoPorId('vibrafono-calido');
		expect(vibrafono).toBeDefined();
		expect(vibrafono?.nombre).toBe('Vibrafono calido');
		expect(vibrafono?.tipo).toBe('campana');

		expect(obtenerEfectoPorId('no-existe')).toBeUndefined();
	});

	it('busca efectos por etiqueta primaria o secundaria', () => {
		const campanas = buscarEfectosPorEtiqueta('campana');
		expect(campanas.length).toBeGreaterThanOrEqual(5);

		const vibrafono = buscarEfectosPorEtiqueta('vibrafono');
		expect(vibrafono.length).toBeGreaterThanOrEqual(2);
	});

	it('elige de forma determinista usando una semilla', () => {
		const eleccion1 = elegirEfectoTonal('cristalino', 'semilla-a');
		const eleccion2 = elegirEfectoTonal('cristalino', 'semilla-a');
		expect(eleccion1.id).toBe(eleccion2.id);

		const eleccion3 = elegirEfectoTonal('cristalino', 'semilla-b');
		expect(eleccion1.tipo).toBe('cristalino');
		expect(eleccion3.tipo).toBe('cristalino');
	});

	it('herramientas/lib/sfx-tonales lee el catálogo y soporta selección por tipo', () => {
		expect(existsSync(RUTA_CATALOGO_TONALES)).toBe(true);
		const cat = leerCatalogoTonales();
		expect(cat.efectos).toHaveLength(30);

		const kalimbas = obtenerEfectosTonalesPorTipo('kalimba');
		expect(kalimbas).toHaveLength(4);

		const elegida = elegirEfectoTonalPorTipo('destello', 42);
		expect(elegida.tipo).toBe('destello');
	});
});

describe('sfx tonales — cues de Privacy Display S26U', () => {
	it('los cues sugeridos están ordenados cronológicamente y referencian IDs existentes', () => {
		expect(CUES_SFX_PRIVACY_DISPLAY_S26U.length).toBeGreaterThanOrEqual(5);

		for (let i = 0; i < CUES_SFX_PRIVACY_DISPLAY_S26U.length; i++) {
			const cue = CUES_SFX_PRIVACY_DISPLAY_S26U[i];
			const efecto = obtenerEfectoPorId(cue.efectoId);
			expect(efecto, `El efectoId ${cue.efectoId} no existe en el catálogo`).toBeDefined();
			expect(cue.tipo).toBe(efecto?.tipo);
			expect(cue.cuadro).toBeGreaterThanOrEqual(0);
			expect(cue.cuadro).toBeLessThanOrEqual(1500);

			if (i > 0) {
				expect(cue.cuadro).toBeGreaterThan(CUES_SFX_PRIVACY_DISPLAY_S26U[i - 1].cuadro);
			}
		}
	});
});

describe('sfx tonales — registro en LICENCIAS.md', () => {
	it('los 30 archivos están debidamente documentados en biblioteca/LICENCIAS.md', () => {
		const contenido = readFileSync(resolve('biblioteca/LICENCIAS.md'), 'utf8');

		for (const efecto of EFECTOS_TONALES) {
			expect(
				contenido.includes(efecto.archivo_relativo_biblioteca),
				`LICENCIAS.md no contiene la ruta ${efecto.archivo_relativo_biblioteca}`,
			).toBe(true);

			expect(
				contenido.includes(efecto.sha256),
				`LICENCIAS.md no contiene el sha256 de ${efecto.archivo_nombre}`,
			).toBe(true);
		}
	});
});
