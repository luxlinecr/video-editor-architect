// Copyright (c) 2026 Enrique Rocha (@soyenriquerocha)
// SPDX-License-Identifier: MIT
// id: er-2f298797
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CURVAS, avance} from '../../estilo/motion';
import {RESORTES, resorte} from '../../estilo/resorte';
import {FAMILIA_MONO, FAMILIA_TITULO, FAMILIA_UI} from './comun';

/**
 * Video 100 % código (25 s · 750 cuadros a 30 fps · 1080×1920) sobre Privacy Display del Galaxy S26 Ultra.
 *
 * Únicos textos permitidos en pantalla:
 *   1. "¿Te miran la pantalla?"
 *   2. "Privacy Display"
 *   3. "100 %"
 *   4. "3.5 %"
 *   5. "Solo para ti"
 *   6. "Galaxy S26 Ultra · Luxline CR"
 *
 * Toda la UI interna, el "?" del espía y el emblema final de Luxline CR se dibujan con geometría vectorial pura.
 */

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const tramo = (f: number, a: number, b: number, curva: (t: number) => number = CURVAS.mover): number => avance(f, a, Math.max(1, b - a), curva);

const PALETA = {
	fondoBase: '#050811',
	fondoNoche: '#091020',
	cian: '#38BDF8',
	cianVivo: '#0EA5E9',
	cianSuave: 'rgba(56, 189, 248, 0.18)',
	dorado: '#F5C451',
	doradoBrillo: '#FDE68A',
	titanioClaro: '#CBD5E1',
	titanioMedio: '#64748B',
	titanioOscuro: '#1E293B',
	blanco: '#F8FAFC',
	grisTexto: '#94A3B8',
	alerta: '#F59E0B',
} as const;

// ───────────────────────── 1. Cámara siguiendo lo importante ─────────────────────────

type EstadoCamara = {x: number; y: number; escala: number; rot: number};

function calcularCamara(f: number): EstadoCamara {
	let x = 540;
	let y = 940;
	let escala = 1.0;
	let rot = 0;

	// Escena 1 (0–3 s): plano abierto que acompaña el asomo del espía
	const p1 = tramo(f, 0, 88, CURVAS.salida);
	x = lerp(540, 515, p1);
	y = lerp(960, 945, p1);
	escala = lerp(0.98, 1.05, p1);

	// Escena 2 (3–7 s): push-in al cristal de la lupa sobre la pantalla
	if (f >= 88) {
		const p2 = tramo(f, 88, 126, CURVAS.mover);
		x = lerp(515, 570, p2);
		y = lerp(945, 955, p2);
		escala = lerp(1.05, 1.34, p2);
		rot = lerp(0, -1.2, p2);
	}

	// Escena 3 (7–11 s): reencuadre al S26 Ultra y el panel de ajustes superior
	if (f >= 208) {
		const p3 = tramo(f, 208, 238, CURVAS.mover);
		x = lerp(570, 540, p3);
		y = lerp(955, 890, p3);
		escala = lerp(1.34, 1.14, p3);
		rot = lerp(-1.2, 0, p3);
	}

	// Escena 4 (11–17 s): encuadre limpio de estudio para giro 3D 0° → 45° → 60°
	if (f >= 328) {
		const p4 = tramo(f, 328, 355, CURVAS.mover);
		x = lerp(540, 540, p4);
		y = lerp(890, 950, p4);
		escala = lerp(1.14, 1.05, p4);
	}

	// Escena 5 (17–21 s): paneo hacia el espía + lupa negra + "?" (f 508–562) y luego centro para giro horizontal + PIN
	if (f >= 508) {
		const p5a = tramo(f, 508, 534, CURVAS.mover);
		x = lerp(540, 475, p5a);
		y = lerp(950, 905, p5a);
		escala = lerp(1.05, 1.15, p5a);
		rot = lerp(0, 1.0, p5a);
	}
	if (f >= 558) {
		const p5b = tramo(f, 558, 582, CURVAS.mover);
		x = lerp(475, 540, p5b);
		y = lerp(905, 960, p5b);
		escala = lerp(1.15, 0.96, p5b);
		rot = lerp(1.0, 0, p5b);
	}

	// Escena 6 (21–25 s): centrado perfecto para el morph final a Luxline CR
	if (f >= 628) {
		const p6 = tramo(f, 628, 665, CURVAS.mover);
		x = lerp(540, 540, p6);
		y = lerp(960, 900, p6);
		escala = lerp(0.96, 1.02, p6);
	}

	return {x, y, escala, rot};
}

const CamaraEscena: React.FC<{f: number; children: React.ReactNode}> = ({f, children}) => {
	const cam = calcularCamara(f);
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				top: 0,
				width: 1080,
				height: 1920,
				transformOrigin: '0 0',
				transform: `translate(540px, 960px) rotate(${cam.rot.toFixed(3)}deg) scale(${cam.escala.toFixed(4)}) translate(${(-cam.x).toFixed(2)}px, ${(-cam.y).toFixed(2)}px)`,
			}}
		>
			{children}
		</div>
	);
};

// ───────────────────────── 2. Revelado de texto con máscara ─────────────────────────

type PropsTextoMascara = {
	texto: string;
	f: number;
	entra: number;
	sale: number;
	x?: number;
	y: number;
	tamano?: number;
	peso?: number;
	color?: string;
	direccion?: 'vertical' | 'horizontal';
	filo?: boolean;
	anchoMax?: number;
	espaciado?: number;
};

const TextoMascara: React.FC<PropsTextoMascara> = ({
	texto,
	f,
	entra,
	sale,
	x = 540,
	y,
	tamano = 56,
	peso = 700,
	color = PALETA.blanco,
	direccion = 'vertical',
	filo = true,
	anchoMax = 780,
	espaciado = -1.2,
}) => {
	if (f < entra || f > sale) return null;
	const pIn = tramo(f, entra, entra + 14, CURVAS.salida);
	const pOut = f > sale - 10 ? 1 - tramo(f, sale - 10, sale, CURVAS.mover) : 1;
	const p = Math.min(pIn, pOut);
	if (p <= 0.005) return null;

	const clip = direccion === 'vertical' ? `inset(${((1 - p) * 100).toFixed(1)}% 0% 0% 0%)` : `inset(0% ${((1 - p) * 100).toFixed(1)}% 0% 0%)`;
	const dy = direccion === 'vertical' ? (1 - pIn) * 28 - (1 - pOut) * 18 : 0;
	const dx = direccion === 'horizontal' ? (1 - pIn) * -22 : 0;

	return (
		<div
			style={{
				position: 'absolute',
				left: x - anchoMax / 2,
				top: y,
				width: anchoMax,
				transform: 'translateY(-50%)',
				display: 'flex',
				justifyContent: 'center',
				pointerEvents: 'none',
			}}
		>
			<div style={{position: 'relative', display: 'inline-block', overflow: 'hidden', padding: '6px 14px'}}>
				<div
					style={{
						fontFamily: FAMILIA_TITULO,
						fontWeight: peso,
						fontSize: tamano,
						lineHeight: 1.08,
						letterSpacing: espaciado,
						color,
						textAlign: 'center',
						textShadow: '0 8px 30px rgba(0,0,0,0.65)',
						clipPath: clip,
						WebkitClipPath: clip,
						transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`,
						opacity: clamp01(p * 1.4),
					}}
				>
					{texto}
				</div>
				{filo && pIn > 0.02 && pIn < 0.96 ? (
					<div
						style={{
							position: 'absolute',
							left: direccion === 'horizontal' ? `${(pIn * 100).toFixed(1)}%` : '8%',
							right: direccion === 'horizontal' ? undefined : '8%',
							top: direccion === 'vertical' ? `${((1 - pIn) * 100).toFixed(1)}%` : '10%',
							bottom: direccion === 'vertical' ? undefined : '10%',
							width: direccion === 'horizontal' ? 3 : undefined,
							height: direccion === 'vertical' ? 3 : undefined,
							background: PALETA.cian,
							boxShadow: `0 0 16px ${PALETA.cian}`,
							opacity: Math.sin(pIn * Math.PI),
						}}
					/>
				) : null}
			</div>
		</div>
	);
};

// ───────────────────────── 3. Contenido gráfico interno del S26 Ultra (0 texto extra) ─────────────────────────

const TarjetasSensibles: React.FC<{f: number; zoomLupa?: boolean}> = ({f, zoomLupa = false}) => {
	// Scroll continuo escalonado en Escena 2 (f 105–205)
	const s1 = tramo(f, 108, 134, CURVAS.mover);
	const s2 = tramo(f, 138, 168, CURVAS.mover);
	const s3 = tramo(f, 170, 200, CURVAS.mover);
	const scrollY = -(s1 * 56 + s2 * 78 + s3 * 64);

	return (
		<div style={{position: 'absolute', inset: '52px 18px 22px 18px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 18, transform: `translateY(${scrollY.toFixed(1)}px)`}}>
			{/* Card 1: Chat / mensajes gráficos (solo líneas geométricas y avatar) */}
			<div style={{borderRadius: 22, padding: 16, background: 'linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))', border: '1px solid rgba(148,163,184,0.22)', display: 'flex', flexDirection: 'column', gap: 12}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
					<div style={{width: 30, height: 30, borderRadius: 15, background: 'linear-gradient(135deg, #38BDF8, #818CF8)'}} />
					<div style={{width: 110, height: 10, borderRadius: 5, background: 'rgba(248,250,252,0.75)'}} />
				</div>
				<div style={{alignSelf: 'flex-start', width: '78%', padding: '12px 14px', borderRadius: '14px 14px 14px 4px', background: 'rgba(56,189,248,0.18)', border: '1px solid rgba(56,189,248,0.35)', display: 'flex', flexDirection: 'column', gap: 7}}>
					<div style={{width: '92%', height: 9, borderRadius: 4, background: zoomLupa ? '#E0F2FE' : 'rgba(224,242,254,0.8)'}} />
					<div style={{width: '65%', height: 9, borderRadius: 4, background: zoomLupa ? '#BAE6FD' : 'rgba(186,230,253,0.7)'}} />
				</div>
				<div style={{alignSelf: 'flex-end', width: '68%', padding: '12px 14px', borderRadius: '14px 14px 4px 14px', background: 'rgba(245,196,81,0.2)', border: '1px solid rgba(245,196,81,0.45)', display: 'flex', flexDirection: 'column', gap: 7}}>
					<div style={{width: '88%', height: 9, borderRadius: 4, background: '#FEF08A'}} />
					<div style={{width: '50%', height: 9, borderRadius: 4, background: 'rgba(254,240,138,0.75)'}} />
				</div>
			</div>

			{/* Card 2: Tarjeta bancaria abstracta (chip + bandas + puntos de seguridad) */}
			<div style={{borderRadius: 22, padding: 18, background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 55%, #0F172A 100%)', border: '1px solid rgba(250,204,21,0.4)', boxShadow: '0 10px 25px rgba(0,0,0,0.35)'}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
					<div style={{width: 42, height: 30, borderRadius: 6, background: 'linear-gradient(135deg, #FDE047, #CA8A04)', border: '1px solid rgba(255,255,255,0.4)'}} />
					<div style={{display: 'flex', gap: 6}}>
						<div style={{width: 22, height: 22, borderRadius: 11, background: '#EF4444', opacity: 0.9}} />
						<div style={{width: 22, height: 22, borderRadius: 11, background: '#F59E0B', marginLeft: -12, opacity: 0.9}} />
					</div>
				</div>
				<div style={{display: 'flex', gap: 10, marginBottom: 14}}>
					{[0, 1, 2, 3].map((g) => (
						<div key={g} style={{flex: 1, height: 10, borderRadius: 5, background: zoomLupa ? '#F8FAFC' : 'rgba(248,250,252,0.82)'}} />
					))}
				</div>
				<div style={{display: 'flex', justifyContent: 'space-between'}}>
					<div style={{width: 80, height: 8, borderRadius: 4, background: 'rgba(203,213,225,0.65)'}} />
					<div style={{width: 38, height: 8, borderRadius: 4, background: 'rgba(253,224,71,0.75)'}} />
				</div>
			</div>

			{/* Card 3: Banco / Ubicación (íconos vectoriales de columnas y pin, sin texto) */}
			<div style={{borderRadius: 22, padding: 16, background: 'rgba(15,23,42,0.94)', border: '1px solid rgba(56,189,248,0.28)', display: 'flex', alignItems: 'center', gap: 14}}>
				<div style={{width: 46, height: 46, borderRadius: 14, background: 'rgba(56,189,248,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={PALETA.cian} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M3 10h18M5 10v8M10 10v8M14 10v8M19 10v8M2 20h20M12 3l9 7H3l9-7z" />
					</svg>
				</div>
				<div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 8}}>
					<div style={{width: '75%', height: 10, borderRadius: 5, background: '#E2E8F0'}} />
					<div style={{width: '50%', height: 9, borderRadius: 4, background: '#38BDF8'}} />
				</div>
			</div>

			{/* Card 4: Gráfica de saldo */}
			<div style={{borderRadius: 22, padding: 16, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(148,163,184,0.2)'}}>
				<svg width="100%" height="58" viewBox="0 0 240 58" fill="none">
					<path d="M6 48 C48 44, 72 22, 114 28 C156 34, 188 10, 234 12" stroke="#34D399" strokeWidth="4" strokeLinecap="round" />
					<circle cx="234" cy="12" r="5" fill="#34D399" />
				</svg>
			</div>
		</div>
	);
};

/** Escena 3 (f 215–335): Panel de ajustes rápidos con íconos puros y el botón único "Privacy Display". */
const PanelAjustes: React.FC<{f: number}> = ({f}) => {
	const desliza = tramo(f, 222, 246, CURVAS.salida);
	const sale = f > 325 ? tramo(f, 325, 340, CURVAS.mover) : 0;
	const y = lerp(-430, 0, desliza) - sale * 440;
	const tapPulso = f >= 250 && f <= 272 ? Math.sin(tramo(f, 250, 272, CURVAS.salida) * Math.PI) : 0;
	const activo = f >= 254;
	const escalaBoton = 1 - 0.08 * tapPulso;
	const pMascaraTexto = tramo(f, 228, 244, CURVAS.salida);

	const iconos = [
		// Wi-Fi
		<svg key="w" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12.55a11 11 0 0 1 14.08 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" /></svg>,
		// Bluetooth
		<svg key="b" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 7 10 10-5 5V2l5 5L7 17" /></svg>,
		// Brillo
		<svg key="s" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>,
		// Candado
		<svg key="l" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>,
	];

	return (
		<div
			style={{
				position: 'absolute',
				left: 10,
				right: 10,
				top: 18,
				padding: '28px 16px 22px',
				borderRadius: 28,
				background: 'linear-gradient(180deg, rgba(15,23,42,0.96), rgba(9,14,26,0.94))',
				border: '1px solid rgba(255,255,255,0.14)',
				boxShadow: '0 24px 48px rgba(0,0,0,0.65)',
				transform: `translateY(${y.toFixed(1)}px)`,
				opacity: clamp01(desliza * 1.6) * (1 - sale),
			}}
		>
			{/* Fila de toggles circulares icónicos (sin texto) */}
			<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
				{iconos.map((ic, i) => (
					<div
						key={i}
						style={{
							width: 56,
							height: 56,
							borderRadius: 28,
							background: i < 2 ? 'rgba(56,189,248,0.22)' : 'rgba(255,255,255,0.08)',
							color: i < 2 ? PALETA.cian : PALETA.grisTexto,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							border: `1px solid ${i < 2 ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.08)'}`,
						}}
					>
						{ic}
					</div>
				))}
			</div>

			{/* Barra de brillo gráfica */}
			<div style={{height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.1)', marginBottom: 18, overflow: 'hidden', padding: 2}}>
				<div style={{width: '74%', height: '100%', borderRadius: 6, background: 'linear-gradient(90deg, #38BDF8, #BAE6FD)'}} />
			</div>

			{/* Botón protagonista: Privacy Display */}
			<div style={{position: 'relative'}}>
				<div
					style={{
						height: 68,
						borderRadius: 22,
						padding: '0 18px',
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						background: activo ? 'linear-gradient(90deg, #0284C7, #0EA5E9)' : 'rgba(255,255,255,0.09)',
						border: `1.5px solid ${activo ? '#7DD3FC' : 'rgba(255,255,255,0.16)'}`,
						boxShadow: activo ? '0 0 28px rgba(14,165,233,0.55)' : 'none',
						transform: `scale(${escalaBoton.toFixed(4)})`,
					}}
				>
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M12 2 4 5.5v6.2c0 5 3.4 9.6 8 10.8 4.6-1.2 8-5.8 8-10.8V5.5L12 2Z" fill={activo ? 'rgba(255,255,255,0.22)' : 'none'} />
						<path d="M9 12.2 11.2 14.4 15.5 9.8" />
					</svg>
					<span
						style={{
							fontFamily: FAMILIA_UI,
							fontWeight: 700,
							fontSize: 22,
							color: '#FFFFFF',
							whiteSpace: 'nowrap',
							clipPath: `inset(0% ${((1 - pMascaraTexto) * 100).toFixed(1)}% 0% 0%)`,
						}}
					>
						Privacy Display
					</span>
				</div>

				{/* Onda de toque sobre el botón */}
				{f >= 248 && f <= 284 ? (
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							width: 72,
							height: 72,
							borderRadius: 36,
							border: '3px solid #7DD3FC',
							transform: `translate(-50%, -50%) scale(${(0.5 + 1.8 * tramo(f, 248, 284, CURVAS.salida)).toFixed(3)})`,
							opacity: 1 - tramo(f, 248, 284, CURVAS.salida),
							pointerEvents: 'none',
						}}
					/>
				) : null}
			</div>
		</div>
	);
};

/** Escena 5 (f 590–630): Pantalla de PIN puramente gráfica (4 puntos que se llenan + teclado de círculos). */
const PantallaPinGrafica: React.FC<{f: number}> = ({f}) => {
	const vis = tramo(f, 588, 600, CURVAS.salida);
	if (vis <= 0.01) return null;
	const pinLlenos = [596, 603, 610, 617].filter((t) => f >= t).length;
	const pulsoFinal = f >= 618 ? Math.sin(tramo(f, 618, 630, CURVAS.salida) * Math.PI) : 0;

	return (
		<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0B1324, #060913)', opacity: vis, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '44px 26px'}}>
			{/* Candado que se cierra/ilumina */}
			<div style={{width: 56, height: 56, borderRadius: 28, background: pinLlenos === 4 ? 'rgba(56,189,248,0.24)' : 'rgba(255,255,255,0.08)', border: `1.5px solid ${pinLlenos === 4 ? PALETA.cian : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${(1 + 0.14 * pulsoFinal).toFixed(3)})`}}>
				<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={pinLlenos === 4 ? PALETA.cian : '#E2E8F0'} strokeWidth="2.2" strokeLinecap="round">
					<rect x="5" y="11" width="14" height="10" rx="2" />
					<path d="M8 11V7a4 4 0 0 1 8 0v4" />
				</svg>
			</div>

			{/* 4 círculos de PIN */}
			<div style={{display: 'flex', gap: 18}}>
				{[0, 1, 2, 3].map((i) => {
					const activo = i < pinLlenos;
					const s = activo ? resorte(f - (596 + i * 7), RESORTES.vivo) : 0;
					return (
						<div
							key={i}
							style={{
								width: 22,
								height: 22,
								borderRadius: 11,
								border: `2px solid ${activo ? PALETA.cian : 'rgba(148,163,184,0.45)'}`,
								background: activo ? PALETA.cian : 'transparent',
								boxShadow: activo ? '0 0 16px rgba(56,189,248,0.8)' : 'none',
								transform: `scale(${(activo ? 0.7 + 0.3 * s : 1).toFixed(3)})`,
							}}
						/>
					);
				})}
			</div>

			{/* Rejilla de botones táctiles sin texto */}
			<div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 54px)', gap: 16, marginTop: 8}}>
				{Array.from({length: 9}, (_, idx) => {
					const tocado = (pinLlenos === 1 && idx === 1) || (pinLlenos === 2 && idx === 4) || (pinLlenos === 3 && idx === 7) || (pinLlenos === 4 && idx === 3);
					return (
						<div
							key={idx}
							style={{
								width: 54,
								height: 54,
								borderRadius: 27,
								background: tocado ? 'rgba(56,189,248,0.32)' : 'rgba(255,255,255,0.08)',
								border: `1px solid ${tocado ? PALETA.cian : 'rgba(255,255,255,0.12)'}`,
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};

// ───────────────────────── 4. Galaxy S26 Ultra 3D + Morph a Logo Luxline CR ─────────────────────────

function geometriaTelefono(f: number): {cx: number; cy: number; rotY: number; rotZ: number; privacidad: number; oscuridadAngulo: number; escudo: number} {
	// Posición horizontal: cede espacio al espía en Escenas 1–2 y inicio de 5; centra en Escenas 3, 4, giro de 5 y 6
	let cx = 605;
	if (f >= 208 && f < 508) {
		cx = lerp(605, 540, tramo(f, 208, 236, CURVAS.mover));
	} else if (f >= 508 && f < 628) {
		const vaEspia = tramo(f, 508, 530, CURVAS.mover);
		const regresaCentro = tramo(f, 558, 580, CURVAS.mover);
		cx = lerp(540, 610, vaEspia) - (610 - 540) * regresaCentro;
	} else if (f >= 628) {
		cx = 540;
	}

	const cy = f >= 628 ? lerp(970, 900, tramo(f, 628, 665, CURVAS.mover)) : f >= 208 && f < 330 ? lerp(970, 920, tramo(f, 208, 238, CURVAS.mover)) : 970;

	// Rotación 3D en Y (Escena 4: 0° → 45° → 58°; en Escena 5 mantiene 42° frente al espía y vuelve a 0° para giro/PIN)
	let rotY = 0;
	if (f >= 390 && f < 465) rotY = lerp(0, 45, tramo(f, 390, 455, CURVAS.mover));
	else if (f >= 465 && f < 510) rotY = lerp(45, 58, tramo(f, 465, 505, CURVAS.mover));
	else if (f >= 510 && f < 560) rotY = lerp(58, 38, tramo(f, 510, 535, CURVAS.mover));
	else if (f >= 560 && f < 584) rotY = lerp(38, 0, tramo(f, 560, 580, CURVAS.mover));

	// Rotación Z en Escena 5 (vertical → horizontal → vertical)
	let rotZ = 0;
	if (f >= 562 && f < 586) rotZ = lerp(0, -90, tramo(f, 562, 582, CURVAS.mover));
	else if (f >= 586 && f < 606) rotZ = lerp(-90, 0, tramo(f, 586, 603, CURVAS.mover));

	// Privacidad activa desde toque en f 254
	const privacidad = f >= 254 ? clamp01(tramo(f, 254, 276, CURVAS.salida)) : 0;
	// Oscuridad simulada por ángulo (0 a 0°, ~0.92 a 45°, ~0.985 a 58°)
	const normAng = clamp01(rotY / 58);
	const oscuridadAngulo = privacidad * clamp01(Math.pow(normAng / 0.77, 1.4) * 0.96);

	// Escudo hero en Escena 3 (f 266–334) y pulso de activación tras PIN (f 617–632)
	const escudoIn = f >= 266 ? resorte(f - 266, RESORTES.vivo) : 0;
	const escudoOut = f >= 325 ? 1 - tramo(f, 325, 342, CURVAS.mover) : 1;
	const escudoPin = f >= 617 && f <= 634 ? Math.sin(tramo(f, 617, 634, CURVAS.salida) * Math.PI) * 0.85 : 0;
	const escudo = Math.max(escudoIn * escudoOut, escudoPin);

	return {cx, cy, rotY, rotZ, privacidad, oscuridadAngulo, escudo};
}

const TelefonoYMorph: React.FC<{f: number}> = ({f}) => {
	const g = geometriaTelefono(f);
	// Morph en Escena 6 (f 632–676): S26 Ultra (340×700, rx 18) → Emblema Luxline CR (250×250, rx 52)
	const m = tramo(f, 632, 676, CURVAS.mover);
	const brilloLogo = tramo(f, 665, 700, CURVAS.salida);
	const trazoLogo = tramo(f, 654, 688, CURVAS.trazo);

	const w = lerp(340, 260, m);
	const h = lerp(700, 260, m);
	const rx = lerp(18, 56, m);
	const rotLogo = lerp(0, 45, m);
	const canto = Math.sin((g.rotY * Math.PI) / 180) * 20;

	return (
		<div
			style={{
				position: 'absolute',
				left: g.cx,
				top: g.cy,
				width: 0,
				height: 0,
				perspective: 1400,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: -w / 2,
					top: -h / 2,
					width: w,
					height: h,
					transform: `rotateY(${g.rotY.toFixed(2)}deg) rotateZ(${(g.rotZ + rotLogo).toFixed(2)}deg)`,
					transformStyle: 'preserve-3d',
				}}
			>
				{/* Canto 3D de titanio (extrusión lateral visible al girar) */}
				{canto > 0.5 && m < 0.8 ? (
					<div
						style={{
							position: 'absolute',
							left: -canto,
							top: 8,
							width: canto + 10,
							height: h - 16,
							borderRadius: `${rx}px 0 0 ${rx}px`,
							background: 'linear-gradient(90deg, #334155, #CBD5E1 45%, #475569)',
							opacity: 1 - m,
						}}
					/>
				) : null}

				{/* Chasis Galaxy S26 Ultra (esquinas rectas características rx=18) -> Marco Luxline CR */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						borderRadius: rx,
						background: m > 0.5 ? 'linear-gradient(145deg, #0F172A, #050811)' : 'linear-gradient(145deg, #090D16, #131B2E)',
						border: `${lerp(5, 4, m).toFixed(1)}px solid ${m > 0.4 ? PALETA.dorado : PALETA.titanioMedio}`,
						boxShadow:
							m > 0.3
								? `0 0 ${45 * brilloLogo}px rgba(56,189,248,0.45), 0 0 ${85 * brilloLogo}px rgba(245,196,81,0.28), inset 0 0 28px rgba(56,189,248,0.22)`
								: `0 32px 80px rgba(0,0,0,0.75), inset 0 0 0 2px rgba(255,255,255,0.12)`,
						overflow: 'hidden',
					}}
				>
					{/* Contenido interno de pantalla del S26 Ultra (desaparece al iniciar el morph) */}
					{m < 0.92 ? (
						<div style={{position: 'absolute', inset: 0, opacity: 1 - m * 1.4}}>
							{/* Punch-hole de cámara frontal S26 Ultra */}
							<div style={{position: 'absolute', left: '50%', top: 14, width: 14, height: 14, borderRadius: 7, background: '#020408', border: '1.5px solid #334155', transform: 'translateX(-50%)', zIndex: 20}} />

							{/* Fondo de pantalla limpio */}
							<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 85% 60% at 50% 25%, rgba(56,189,248,0.22), rgba(15,23,42,0.98) 70%)'}} />

							{/* Escenas 1–4: tarjetas sensibles */}
							{f < 588 ? <TarjetasSensibles f={f} /> : null}

							{/* Escena 3: Panel de ajustes rápidos */}
							{f >= 218 && f <= 345 ? <PanelAjustes f={f} /> : null}

							{/* Escena 5 (tramo final): Pantalla de PIN gráfica */}
							{f >= 588 ? <PantallaPinGrafica f={f} /> : null}

							{/* Capa Privacy Display (microlouver direccional al girar en 3D) */}
							{g.oscuridadAngulo > 0.01 ? (
								<div
									style={{
										position: 'absolute',
										inset: 0,
										background: `rgba(2, 4, 10, ${g.oscuridadAngulo.toFixed(3)})`,
										backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.45) 0px, rgba(0,0,0,0.45) 2px, transparent 2px, transparent 5px)',
										zIndex: 12,
									}}
								/>
							) : null}

							{/* Escudo 3D emergiendo tras tocar Privacy Display (Escena 3) */}
							{g.escudo > 0.01 ? (
								<div
									style={{
										position: 'absolute',
										inset: 0,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: `rgba(5, 12, 26, ${(0.58 * g.escudo).toFixed(3)})`,
										zIndex: 15,
									}}
								>
									<div style={{transform: `scale(${(0.65 + 0.35 * g.escudo).toFixed(3)})`, opacity: clamp01(g.escudo * 1.4), filter: 'drop-shadow(0 0 28px rgba(56,189,248,0.85))'}}>
										<svg width="142" height="162" viewBox="0 0 120 136" fill="none">
											<path d="M60 8 L108 26 V64 C108 96 86 119 60 128 C34 119 12 96 12 64 V26 L60 8Z" fill="rgba(14,165,233,0.28)" stroke="#7DD3FC" strokeWidth="4.5" />
											<path d="M60 22 L94 35 V63 C94 87 78 104 60 112 C42 104 26 87 26 63 V35 L60 22Z" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="6 4" />
											<path d="M44 68 L55 79 L78 54" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</div>
								</div>
							) : null}

							{/* Destello cian sutil de cristal polarizado */}
							{g.privacidad > 0.01 ? (
								<div
									style={{
										position: 'absolute',
										inset: 0,
										boxShadow: `inset 0 0 ${24 + 14 * g.privacidad}px rgba(56,189,248,${(0.32 * g.privacidad).toFixed(3)})`,
										pointerEvents: 'none',
										zIndex: 18,
									}}
								/>
							) : null}
						</div>
					) : null}

					{/* Emblema geométrico Luxline CR (emerge al completar el morph, contrarrotado -45° para quedar recto) */}
					{m > 0.25 ? (
						<div
							style={{
								position: 'absolute',
								inset: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								transform: `rotate(${(-rotLogo).toFixed(2)}deg) scale(${lerp(0.65, 1.0, trazoLogo).toFixed(3)})`,
								opacity: clamp01((m - 0.25) * 1.5),
							}}
						>
							<svg width="180" height="180" viewBox="0 0 180 180" fill="none">
								<defs>
									<linearGradient id="luxGrad" x1="20" y1="20" x2="160" y2="160" gradientUnits="userSpaceOnUse">
										<stop offset="0%" stopColor={PALETA.doradoBrillo} />
										<stop offset="52%" stopColor={PALETA.dorado} />
										<stop offset="100%" stopColor={PALETA.cian} />
									</linearGradient>
								</defs>
								{/* Hexágono / escudo interior */}
								<path
									d="M90 22 L148 55 V125 L90 158 L32 125 V55 L90 22 Z"
									stroke="url(#luxGrad)"
									strokeWidth="5"
									strokeDasharray="460"
									strokeDashoffset={460 * (1 - trazoLogo)}
									strokeLinejoin="round"
								/>
								{/* Monograma geométrico L + prisma de luz (sin nodos de texto) */}
								<path
									d="M68 54 V120 H116"
									stroke="#FFFFFF"
									strokeWidth="12"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeDasharray="140"
									strokeDashoffset={140 * (1 - trazoLogo)}
								/>
								<path
									d="M96 62 L122 88 L96 114"
									stroke={PALETA.cian}
									strokeWidth="7"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeDasharray="100"
									strokeDashoffset={100 * (1 - trazoLogo)}
								/>
							</svg>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

// ───────────────────────── 5. Silueta de Persona + Espía con Lupa + "?" Vectorial ─────────────────────────

const PersonaSosteniendo: React.FC<{f: number}> = ({f}) => {
	// Solo Escenas 1–2 (f 0–225) para enmarcar quién usa el celular
	const out = f >= 205 ? 1 - tramo(f, 205, 226, CURVAS.mover) : 1;
	if (out <= 0.01) return null;

	return (
		<svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, opacity: 0.72 * out, pointerEvents: 'none'}}>
			{/* Hombro y cabeza estilizada del usuario detrás/derecha del celular */}
			<ellipse cx="735" cy="655" rx="76" ry="88" fill="#0E172A" stroke="rgba(148,163,184,0.22)" strokeWidth="2.5" />
			<path d="M570 1180 C585 920 655 785 750 785 C845 785 900 920 915 1190 L915 1420 H570 Z" fill="#0B1324" stroke="rgba(148,163,184,0.2)" strokeWidth="2.5" />
		</svg>
	);
};

const EspiaConLupa: React.FC<{f: number}> = ({f}) => {
	// Entra en f 10, se retira en Escena 3 (f 205–232), regresa en Escena 5 (f 508–632)
	const entra1 = tramo(f, 10, 34, CURVAS.salida);
	const sale1 = f >= 204 ? tramo(f, 204, 232, CURVAS.mover) : 0;
	const fase1 = f < 240 ? entra1 * (1 - sale1) : 0;

	const entra5 = f >= 506 ? tramo(f, 506, 528, CURVAS.salida) : 0;
	const sale5 = f >= 560 ? tramo(f, 560, 580, CURVAS.mover) : 0;
	const fase5 = f >= 506 ? entra5 * (1 - sale5) : 0;

	const visibilidad = Math.max(fase1, fase5);
	if (visibilidad <= 0.01) return null;

	const enBloqueo = f >= 506;
	const posX = lerp(90, 305, visibilidad);
	const posY = enBloqueo ? 935 : 955;

	// Lupa levantada en f 24–48 (resorte) y acercándose al teléfono en Escena 2 (f 90–124)
	const levantaLupa = enBloqueo ? 1 : resorte(f - 22, RESORTES.vivo);
	const acercaLupa = enBloqueo ? tramo(f, 512, 532, CURVAS.salida) : tramo(f, 90, 124, CURVAS.mover);

	// Centro del lente de la lupa (acompaña el desplazamiento lateral del espía y sube desde abajo al levantarse)
	const offsetEspiaX = posX - 305;
	const lenteCx = (enBloqueo ? lerp(410, 575, acercaLupa) : lerp(415, 575, acercaLupa)) + offsetEspiaX;
	const lenteCy = (enBloqueo ? lerp(955, 935, acercaLupa) : lerp(960, 955, acercaLupa)) + (1 - levantaLupa) * 150;
	const lenteR = lerp(112, 134, acercaLupa);
	const opLupa = enBloqueo ? 1 : clamp01(levantaLupa * 1.6);

	// Pupilas del espía siguen el scroll de tarjetas en Escena 2 o se entrecierran en Escena 5
	const pupilaY = enBloqueo ? 0 : Math.sin(f * 0.14) * 5;
	const pupilaX = enBloqueo ? 2 : 6;

	// Signo "?" vectorial puro (Escena 5: f 530–578)
	const pInt = f >= 530 && f < 582 ? resorte(f - 530, RESORTES.vivo) * (f > 562 ? 1 - tramo(f, 562, 578, CURVAS.mover) : 1) : 0;

	// Teléfono para proyectar dentro del lente en Escena 2
	const tel = geometriaTelefono(f);

	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: clamp01(visibilidad * 1.4), pointerEvents: 'none'}}>
			{/* Cuerpo del espía en silueta SVG */}
			<svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
				<g transform={`translate(${(posX - 305).toFixed(1)}, ${(posY - 955).toFixed(1)})`}>
					{/* Gabardina con cuello levantado */}
					<path
						d="M145 1290 L185 920 L235 835 L305 885 L375 835 L425 925 L455 1290 Z"
						fill="#080D18"
						stroke="rgba(56,189,248,0.42)"
						strokeWidth="3"
						strokeLinejoin="round"
					/>
					{/* Solapa interior */}
					<path d="M250 865 L305 1030 L360 865" fill="none" stroke="rgba(148,163,184,0.28)" strokeWidth="2.5" />

					{/* Cabeza */}
					<ellipse cx="305" cy="795" rx="68" ry="76" fill="#080D18" stroke="rgba(56,189,248,0.38)" strokeWidth="2.5" />

					{/* Ojos recortados */}
					{enBloqueo ? (
						<>
							{/* Ojos entrecerrados confundidos */}
							<path d="M272 795 H304" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
							<path d="M322 795 H354" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
						</>
					) : (
						<>
							<ellipse cx="290" cy="795" rx="15" ry="11" fill="#F8FAFC" />
							<ellipse cx="336" cy="795" rx="15" ry="11" fill="#F8FAFC" />
							<circle cx={290 + pupilaX} cy={795 + pupilaY} r="6" fill="#090D16" />
							<circle cx={336 + pupilaX} cy={795 + pupilaY} r="6" fill="#090D16" />
						</>
					)}

					{/* Sombrero Fedora */}
					<path d="M225 745 C235 670 375 670 385 745 Z" fill="#0B1120" stroke="rgba(56,189,248,0.45)" strokeWidth="2.5" />
					<ellipse cx="305" cy="746" rx="108" ry="16" fill="#080D18" stroke="rgba(56,189,248,0.5)" strokeWidth="2.5" />
					<path d="M242 732 H368" stroke="#38BDF8" strokeWidth="4" strokeOpacity="0.6" />

					{/* Signo "?" 100 % vectorial sobre el sombrero (Escena 5, sin <text>) */}
					{pInt > 0.01 ? (
						<g transform={`translate(305, 610) scale(${(0.75 + 0.25 * pInt).toFixed(3)})`} opacity={clamp01(pInt * 1.4)}>
							<circle cx="0" cy="-12" r="46" fill="rgba(245,158,11,0.16)" stroke={PALETA.alerta} strokeWidth="3" />
							<path d="M-14 -24 C-14 -40 16 -40 16 -22 C16 -10 0 -8 0 4" fill="none" stroke="#FDE68A" strokeWidth="8.5" strokeLinecap="round" />
							<circle cx="0" cy="20" r="5" fill="#FDE68A" />
						</g>
					) : null}
				</g>
			</svg>

			{/* Interior del cristal de la lupa: ampliado en Escena 1–2, o 100 % NEGRO en Escena 5 */}
			{opLupa > 0.01 ? (
				<div
					style={{
						position: 'absolute',
						left: lenteCx - lenteR,
						top: lenteCy - lenteR,
						width: lenteR * 2,
						height: lenteR * 2,
						borderRadius: '50%',
						overflow: 'hidden',
						background: enBloqueo ? '#020408' : '#091020',
						boxShadow: '0 22px 60px rgba(0,0,0,0.85)',
						opacity: opLupa,
					}}
				>
					{enBloqueo ? (
						/* Escena 5: pantalla completamente negra + patrón polarizado sutil */
						<div
							style={{
								position: 'absolute',
								inset: 0,
								background: '#03050A',
								backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 7px)',
							}}
						/>
					) : (
						/* Escena 1–2: lectura ampliada (×1.42) de las tarjetas del S26 Ultra con marco de titanio */
						<div
							style={{
								position: 'absolute',
								left: (tel.cx - lenteCx) * 1.42 + lenteR - (340 * 1.42) / 2,
								top: (tel.cy - lenteCy) * 1.42 + lenteR - (700 * 1.42) / 2,
								width: 340,
								height: 700,
								transform: 'scale(1.42)',
								transformOrigin: '0 0',
								borderRadius: 18,
								border: `5px solid ${PALETA.titanioMedio}`,
								background: '#0C1426',
								overflow: 'hidden',
							}}
						>
							<TarjetasSensibles f={f} zoomLupa />
						</div>
					)}

					{/* Reflejo diagonal del cristal */}
					<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 42%)', pointerEvents: 'none'}} />
				</div>
			) : null}

			{/* Aro metálico y mango de la lupa */}
			{opLupa > 0.01 ? (
				<svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, opacity: opLupa}}>
					<defs>
						<linearGradient id="aroLupa" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#F1F5F9" />
							<stop offset="50%" stopColor="#64748B" />
							<stop offset="100%" stopColor="#CBD5E1" />
						</linearGradient>
					</defs>
					{/* Mango */}
					<line x1={lenteCx - lenteR * 0.7} y1={lenteCy + lenteR * 0.7} x2={lenteCx - lenteR * 1.75} y2={lenteCy + lenteR * 1.75} stroke="#334155" strokeWidth="26" strokeLinecap="round" />
					<line x1={lenteCx - lenteR * 0.7} y1={lenteCy + lenteR * 0.7} x2={lenteCx - lenteR * 1.75} y2={lenteCy + lenteR * 1.75} stroke="#94A3B8" strokeWidth="10" strokeLinecap="round" />
					{/* Aro */}
					<circle cx={lenteCx} cy={lenteCy} r={lenteR} fill="none" stroke="url(#aroLupa)" strokeWidth="14" />
					<circle cx={lenteCx} cy={lenteCy} r={lenteR - 7} fill="none" stroke="rgba(56,189,248,0.45)" strokeWidth="2" />
				</svg>
			) : null}
		</div>
	);
};

// ───────────────────────── 6. Indicador de luz sincronizado con ángulo 3D (Escena 4) ─────────────────────────

const IndicadorAngulo: React.FC<{f: number}> = ({f}) => {
	if (f < 332 || f > 512) return null;
	const entra = tramo(f, 332, 348, CURVAS.salida);
	const sale = f > 498 ? 1 - tramo(f, 498, 512, CURVAS.mover) : 1;
	const op = Math.min(entra, sale);

	// Sincronización exacta con la rotación 3D: 0° = "100 %", desde f 418 (al girar hacia 45°) pasa a "3.5 %"
	const enAngulo = f >= 418;
	const pCambio = tramo(f, 418, 434, CURVAS.salida);
	const porcentajeBarra = f < 395 ? 100 : f < 465 ? lerp(100, 3.5, tramo(f, 395, 460, CURVAS.mover)) : lerp(3.5, 0.7, tramo(f, 465, 505, CURVAS.mover));

	return (
		<div
			style={{
				position: 'absolute',
				left: 240,
				top: 295,
				width: 600,
				padding: '22px 32px',
				borderRadius: 28,
				background: 'rgba(11, 17, 32, 0.88)',
				border: `1.5px solid ${enAngulo ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.16)'}`,
				boxShadow: '0 18px 46px rgba(0,0,0,0.55)',
				opacity: op,
				transform: `translateY(${((1 - entra) * 20).toFixed(1)}px)`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 14,
				pointerEvents: 'none',
			}}
		>
			{/* Número revelado con ventana de máscara sincronizado al giro 3D */}
			<div style={{position: 'relative', overflow: 'hidden', width: '100%', height: 78}}>
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: -78 * pCambio,
						height: 78,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: FAMILIA_MONO,
						fontWeight: 700,
						fontSize: 66,
						lineHeight: 1,
						letterSpacing: -2,
						color: PALETA.blanco,
						fontVariantNumeric: 'tabular-nums',
					}}
				>
					100 %
				</div>
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 78 * (1 - pCambio),
						height: 78,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: FAMILIA_MONO,
						fontWeight: 700,
						fontSize: 66,
						lineHeight: 1,
						letterSpacing: -2,
						color: PALETA.cian,
						fontVariantNumeric: 'tabular-nums',
					}}
				>
					3.5 %
				</div>
			</div>

			{/* Barra física de luz emitida (baja de 100 % → 3.5 % → < 1 %) */}
			<div style={{width: '100%', height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.12)', overflow: 'hidden'}}>
				<div
					style={{
						width: `${Math.max(0.8, porcentajeBarra).toFixed(2)}%`,
						height: '100%',
						borderRadius: 7,
						background: enAngulo ? 'linear-gradient(90deg, #0EA5E9, #7DD3FC)' : 'linear-gradient(90deg, #F8FAFC, #BAE6FD)',
						boxShadow: `0 0 18px ${enAngulo ? PALETA.cian : '#FFFFFF'}`,
					}}
				/>
			</div>
		</div>
	);
};

// ───────────────────────── Composición principal ─────────────────────────

export const PrivacyDisplayS26: React.FC<{dur: number}> = ({dur: _dur}) => {
	const f = useCurrentFrame();

	// Pulso ambiental sutil sincronizado con cada transición (sin texto extra)
	const brilloEscena = f >= 254 && f < 630 ? 0.24 : 0.16;

	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, overflow: 'hidden', background: PALETA.fondoBase}}>
			{/* Fondo de estudio oscuro + rejilla técnica */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: `radial-gradient(ellipse 85% 55% at 50% 42%, rgba(14, 165, 233, ${brilloEscena}), rgba(5, 8, 17, 1) 76%)`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage: 'radial-gradient(rgba(148,163,184,0.12) 1.4px, transparent 1.5px)',
					backgroundSize: '40px 40px',
					WebkitMaskImage: 'radial-gradient(ellipse 72% 62% at 50% 50%, black 25%, transparent 80%)',
					maskImage: 'radial-gradient(ellipse 72% 62% at 50% 50%, black 25%, transparent 80%)',
				}}
			/>

			{/* Escenario con cámara animada */}
			<CamaraEscena f={f}>
				<PersonaSosteniendo f={f} />
				<TelefonoYMorph f={f} />
				<EspiaConLupa f={f} />
			</CamaraEscena>

			{/* Capa HUD en zona segura (x 135–945, y 220–1600) — exclusivamente los 6 textos permitidos */}
			<TextoMascara texto="¿Te miran la pantalla?" f={f} entra={18} sale={204} y={325} tamano={56} color={PALETA.blanco} direccion="vertical" />

			<TextoMascara texto="Privacy Display" f={f} entra={250} sale={332} y={325} tamano={60} color={PALETA.cian} direccion="horizontal" />

			<IndicadorAngulo f={f} />

			<TextoMascara texto="Solo para ti" f={f} entra={642} sale={750} y={420} tamano={66} color={PALETA.blanco} direccion="vertical" />

			<TextoMascara texto="Galaxy S26 Ultra · Luxline CR" f={f} entra={672} sale={750} y={1350} tamano={42} peso={600} color={PALETA.doradoBrillo} direccion="horizontal" anchoMax={780} espaciado={-0.6} />
		</div>
	);
};
