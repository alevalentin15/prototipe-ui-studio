/**
 * SISTEMA DE TOKENS DE DISEÑO Y PALETA DE COLORES MATERIAL 3 (M3)
 * Provee esquemas completos para Modo Claro (por defecto), Modo Oscuro y Detección de Sistema.
 * Todos los componentes consumen estos tokens semánticos por defecto.
 */

export const M3_TOKENS = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'background',
  'onBackground',
  'surface',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'outline',
  'outlineVariant',
  'error',
  'onError',
  'success',
  'warning',
  'inverseSurface',
  'inverseOnSurface'
];

export const M3_SCHEMES = {
  claro: {
    nombre: 'Material 3 Claro',
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',
    secondary: '#625B71',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8DEF8',
    onSecondaryContainer: '#1D192B',
    tertiary: '#7D5260',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFD8E4',
    onTertiaryContainer: '#31111D',
    background: '#FEF7FF',
    onBackground: '#1D1B20',
    surface: '#FFFFFF',
    onSurface: '#1D1B20',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    error: '#B3261E',
    onError: '#FFFFFF',
    success: '#2E7D32',
    warning: '#ED6C02',
    inverseSurface: '#313033',
    inverseOnSurface: '#F4EFF4'
  },
  oscuro: {
    nombre: 'Material 3 Oscuro',
    primary: '#D0BCFF',
    onPrimary: '#381E72',
    primaryContainer: '#4F378B',
    onPrimaryContainer: '#EADDFF',
    secondary: '#CCC2DC',
    onSecondary: '#332D41',
    secondaryContainer: '#4A4458',
    onSecondaryContainer: '#E8DEF8',
    tertiary: '#EFB8C8',
    onTertiary: '#492532',
    tertiaryContainer: '#633B48',
    onTertiaryContainer: '#FFD8E4',
    background: '#141218',
    onBackground: '#E6E0E9',
    surface: '#1D1B20',
    onSurface: '#E6E0E9',
    surfaceVariant: '#49454F',
    onSurfaceVariant: '#CAC4D0',
    outline: '#938F99',
    outlineVariant: '#49454F',
    error: '#F2B8B5',
    onError: '#601410',
    success: '#81C784',
    warning: '#FFB74D',
    inverseSurface: '#E6E1E5',
    inverseOnSurface: '#313033'
  }
};

/**
 * Obtiene el modo del sistema operativo ('claro' u 'oscuro')
 */
export const getSystemThemeMode = () => {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'oscuro';
  }
  return 'claro';
};

/**
 * Determina el modo de tema efectivo ('claro' u 'oscuro') a partir de la configuración del proyecto ('light', 'dark', 'system' o 'claro', 'oscuro')
 */
export const resolveEffectiveThemeMode = (modoConfigurado = 'claro') => {
  const norm = String(modoConfigurado).toLowerCase();
  if (norm === 'system') {
    return getSystemThemeMode();
  }
  if (norm === 'dark' || norm === 'oscuro') {
    return 'oscuro';
  }
  return 'claro';
};

/**
 * Determina si un valor de color es un token semántico heredado de la paleta
 */
export const isSemanticToken = (colorValue) => {
  if (!colorValue || typeof colorValue !== 'string') return false;
  return M3_TOKENS.includes(colorValue);
};

/**
 * Resuelve un valor de color respetando la jerarquía de herencia:
 * 1. Si es un token semántico de M3 -> Se evalúa en la paleta activa del tema del proyecto.
 * 2. Si es un color personalizado (#hex, rgb, transparent) -> Prevalece la personalización manual.
 */
export const resolveM3Color = (colorValue, modoTema = 'claro', paletaPersonalizada = null) => {
  if (!colorValue) return 'transparent';

  const modoEfectivo = resolveEffectiveThemeMode(modoTema);
  const paletaBase = M3_SCHEMES[modoEfectivo] || M3_SCHEMES.claro;
  const paletaActiva = {
    ...paletaBase,
    ...(paletaPersonalizada || {})
  };

  // Si coincide con un token de la paleta, resolvemos su valor dinámico
  if (paletaActiva[colorValue]) {
    return paletaActiva[colorValue];
  }

  // Si es un color explícito del usuario (#hex, rgba, transparent), se respeta la personalización
  return colorValue;
};

/** Resuelve tokens incluidos en valores CSS compuestos, como `1px solid outline`. */
export const resolveM3StyleValue = (value, modoTema = 'claro', paletaPersonalizada = null) => {
  if (typeof value !== 'string') return value;
  const tokenPattern = new RegExp(`\\b(${M3_TOKENS.join('|')})\\b`, 'g');
  return value.replace(tokenPattern, token => resolveM3Color(token, modoTema, paletaPersonalizada));
};

/** Elige negro o blanco para mantener contraste sobre fondos hex o rgb habituales. */
export const getContrastingTextColor = (color) => {
  if (typeof color !== 'string') return '#000000';
  let channels = null;
  const hex = color.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  const rgb = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);

  if (hex) {
    const value = hex[1].length === 3 ? hex[1].split('').map(ch => ch + ch).join('') : hex[1];
    channels = [0, 2, 4].map(index => parseInt(value.slice(index, index + 2), 16));
  } else if (rgb) {
    channels = rgb.slice(1, 4).map(Number);
  }

  if (!channels) return '#000000';
  const luminance = channels.map(channel => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);

  return luminance > 0.45 ? '#000000' : '#FFFFFF';
};
