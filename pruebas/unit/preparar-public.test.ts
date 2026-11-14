// Copyright (c) 2026 Enrique Rocha (@soyenriquerocha)
// SPDX-License-Identifier: MIT
// id: er-2f298797
import {mkdirSync, mkdtempSync, readlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {prepararPublic} from '../../herramientas/preparar-public.ts';

describe('prepararPublic', () => {
	it('crea los cuatro accesos y la segunda vez no toca nada', () => {
		const raiz = mkdtempSync(join(tmpdir(), 'public-'));
		expect(prepararPublic(raiz, process.platform).map((r) => r.estado)).toEqual(['creado', 'creado', 'creado', 'creado']);
		const destino = readlinkSync(join(raiz, 'public', 'p'));
		expect(resolve(raiz, 'public', destino)).toBe(resolve(raiz, 'proyectos'));
		if (process.platform !== 'win32') expect(destino).toBe(join('..', 'proyectos'));
		expect(prepararPublic(raiz, process.platform).every((r) => r.estado === 'ya-estaba')).toBe(true);
	});

	it('enlaza public/assets cuando assets/ existe sin alterar los 4 accesos base ni romper en re-ejecución', () => {
		const raiz = mkdtempSync(join(tmpdir(), 'public-assets-'));
		mkdirSync(join(raiz, 'assets', 'marca'), {recursive: true});
		expect(prepararPublic(raiz, process.platform).map((r) => r.estado)).toEqual(['creado', 'creado', 'creado', 'creado']);
		const destinoAssets = readlinkSync(join(raiz, 'public', 'assets'));
		expect(resolve(raiz, 'public', destinoAssets)).toBe(resolve(raiz, 'assets'));
		expect(prepararPublic(raiz, process.platform).every((r) => r.estado === 'ya-estaba')).toBe(true);
	});

	it('en el repo actual deja los accesos bien puestos (los crea si faltan)', () => {
		prepararPublic(undefined, process.platform);
		expect(prepararPublic(undefined, process.platform).every((r) => r.estado === 'ya-estaba')).toBe(true);
	});
});
