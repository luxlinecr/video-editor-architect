// id: er-2f298797
/**
 * Herramientas y helpers para los Efectos Tonales CC0 de LUXLINE CR en herramientas/ y /editar.
 */
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {RAIZ} from './manifest.ts';
import type {EfectoTonal, TipoSfxTonal} from '../../src/reel/motion/luxline/sfx-tonales.ts';

export const RUTA_CATALOGO_TONALES = join(
	RAIZ,
	'biblioteca',
	'sfx',
	'tonales',
	'catalogo.json',
);

export function leerCatalogoTonales(): {
	version: number;
	titulo: string;
	descripcion: string;
	licencia: string;
	efectos: EfectoTonal[];
	conteo_por_tipo: Record<TipoSfxTonal, number>;
} {
	if (!existsSync(RUTA_CATALOGO_TONALES)) {
		throw new Error(
			`No existe el catálogo de efectos tonales en ${RUTA_CATALOGO_TONALES}`,
		);
	}
	return JSON.parse(readFileSync(RUTA_CATALOGO_TONALES, 'utf8'));
}

export function obtenerEfectosTonalesPorTipo(
	tipo?: TipoSfxTonal,
): EfectoTonal[] {
	const cat = leerCatalogoTonales();
	if (!tipo) return cat.efectos;
	return cat.efectos.filter((e) => e.tipo === tipo);
}

export function elegirEfectoTonalPorTipo(
	tipo: TipoSfxTonal,
	semilla: string | number = 0,
): EfectoTonal {
	const lista = obtenerEfectosTonalesPorTipo(tipo);
	if (lista.length === 0) {
		throw new Error(`No hay efectos tonales para el tipo: ${tipo}`);
	}
	let hash = 0;
	const s = String(semilla);
	for (let i = 0; i < s.length; i++) {
		hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
	}
	return lista[hash % lista.length];
}

export type {EfectoTonal, TipoSfxTonal};
