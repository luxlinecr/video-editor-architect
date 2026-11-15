// id: er-2f298797
/**
 * Biblioteca de Efectos Tonales CC0 para LUXLINE CR (SFXMint).
 * 30 efectos sonoros clasificados por etiquetas de uso para Remotion,
 * motion graphics de marca y el selector de /editar.
 */
import catalogoDatos from '../../../../biblioteca/sfx/catalogo-tonales.json';

export type TipoSfxTonal =
	| 'campana'
	| 'kalimba'
	| 'arpa'
	| 'cristalino'
	| 'destello'
	| 'transicion';

export interface EfectoTonal {
	id: string;
	nombre: string;
	archivo: string;
	archivo_relativo_biblioteca: string;
	carpeta: string;
	archivo_nombre: string;
	tipo: TipoSfxTonal;
	etiquetas: string[];
	duracion_s: number;
	formato: string;
	licencia: string;
	fuente_url: string;
	sha256: string;
	uso_recomendado: string;
}

export const CATALOGO_SFX_TONALES = catalogoDatos as {
	version: number;
	titulo: string;
	descripcion: string;
	licencia: string;
	licencia_url: string;
	fuente_proveedor: string;
	fuente_licencia_url: string;
	fecha: string;
	total_efectos: number;
	tipos_disponibles: TipoSfxTonal[];
	conteo_por_tipo: Record<TipoSfxTonal, number>;
	efectos: EfectoTonal[];
};

export const EFECTOS_TONALES: EfectoTonal[] = CATALOGO_SFX_TONALES.efectos;

/**
 * Filtra efectos tonales por su etiqueta principal de tipo.
 */
export function obtenerEfectosTonales(tipo?: TipoSfxTonal): EfectoTonal[] {
	if (!tipo) return [...EFECTOS_TONALES];
	return EFECTOS_TONALES.filter((e) => e.tipo === tipo);
}

/**
 * Busca un efecto tonal por su ID único.
 */
export function obtenerEfectoPorId(id: string): EfectoTonal | undefined {
	return EFECTOS_TONALES.find((e) => e.id === id);
}

/**
 * Busca efectos que coincidan con una etiqueta secundaria.
 */
export function buscarEfectosPorEtiqueta(etiqueta: string): EfectoTonal[] {
	const limpia = etiqueta.trim().toLowerCase();
	return EFECTOS_TONALES.filter(
		(e) => e.etiquetas.includes(limpia) || e.tipo === limpia,
	);
}

/**
 * Elige un efecto tonal de forma determinista para un tipo dado usando una semilla.
 */
export function elegirEfectoTonal(
	tipo: TipoSfxTonal,
	semilla: string | number = 0,
): EfectoTonal {
	const candidatos = obtenerEfectosTonales(tipo);
	if (candidatos.length === 0) {
		throw new Error(`No hay efectos tonales para el tipo: ${tipo}`);
	}
	let hash = 0;
	const s = String(semilla);
	for (let i = 0; i < s.length; i++) {
		hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
	}
	return candidatos[hash % candidatos.length];
}

/**
 * Cues de efectos tonales sugeridos para la composición Luxline-PrivacyDisplay-S26U (60 fps, 1500 cuadros).
 */
export interface CueSfxPrivacyDisplay {
	cuadro: number;
	segundo: number;
	efectoId: string;
	tipo: TipoSfxTonal;
	volumen: number;
	motivo: string;
}

export const CUES_SFX_PRIVACY_DISPLAY_S26U: CueSfxPrivacyDisplay[] = [
	{
		cuadro: 18,
		segundo: 0.3,
		efectoId: 'vibrafono-calido',
		tipo: 'campana',
		volumen: 0.65,
		motivo: 'MaskReveal de pregunta inicial: ¿Te miran la pantalla?',
	},
	{
		cuadro: 200,
		segundo: 3.33,
		efectoId: 'destello-cristalino',
		tipo: 'destello',
		volumen: 0.55,
		motivo: 'Acercamiento de la lupa y detalle óptico del espía',
	},
	{
		cuadro: 435,
		segundo: 7.25,
		efectoId: 'revelacion-carga-sintetica',
		tipo: 'destello',
		volumen: 0.7,
		motivo: 'Toque de Privacy Display y aparición del escudo protector',
	},
	{
		cuadro: 680,
		segundo: 11.33,
		efectoId: 'transicion-fluida-cinematica',
		tipo: 'transicion',
		volumen: 0.6,
		motivo: 'Giro 3D del Galaxy S26 Ultra hacia 45° y 60°',
	},
	{
		cuadro: 1040,
		segundo: 17.33,
		efectoId: 'cuenco-grave',
		tipo: 'cristalino',
		volumen: 0.65,
		motivo: 'El espía solo ve negro; signo de interrogación de desconcierto',
	},
	{
		cuadro: 1280,
		segundo: 21.33,
		efectoId: 'revelacion-campana-de-cristal',
		tipo: 'destello',
		volumen: 0.7,
		motivo: 'Transformación del teléfono al emblema y logo de Luxline CR',
	},
];
