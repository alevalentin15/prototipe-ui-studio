import React, { useState } from 'react';
import { Icon } from '../common/Icon.jsx';
import { M3_SCHEMES, M3_TOKENS, resolveM3Color, resolveEffectiveThemeMode } from '../../theme/materialTheme.js';

export const CanvasPropertiesTab = ({
  vistaActual,
  proyectoActual,
  modoTema = 'claro',
  paletaPersonalizada = null,
  paletasTema = null,
  onActualizarLienzo,
  onCambiarModoTema,
  onActualizarColorTema
}) => {
  const [modoPaletaEditando, setModoPaletaEditando] = useState(modoTema === 'oscuro' ? 'oscuro' : 'claro');
  if (!vistaActual) {
    return (
      <div className="text-slate-500 text-xs text-center py-8 select-none">
        No hay ninguna vista activa para inspeccionar el lienzo.
      </div>
    );
  }

  const modoEfectivo = resolveEffectiveThemeMode(modoTema);
  const paletaBase = M3_SCHEMES[modoEfectivo] || M3_SCHEMES.claro;
  const modoPaleta = modoPaletaEditando === 'oscuro' ? 'oscuro' : 'claro';
  const paletaEfectiva = { ...(M3_SCHEMES[modoPaleta] || M3_SCHEMES.claro), ...(paletasTema?.[modoPaleta] || (modoPaleta === modoTema ? paletaPersonalizada : {})) };
  const resolvedBgColor = resolveM3Color(vistaActual.esTransparente ? 'surface' : (vistaActual.bg || 'background'), modoTema, paletaPersonalizada);

  const padTop = vistaActual.paddingTop !== undefined ? vistaActual.paddingTop : (vistaActual.padding ?? 0);
  const padBottom = vistaActual.paddingBottom !== undefined ? vistaActual.paddingBottom : (vistaActual.padding ?? 0);
  const padLeft = vistaActual.paddingLeft !== undefined ? vistaActual.paddingLeft : (vistaActual.padding ?? 0);
  const padRight = vistaActual.paddingRight !== undefined ? vistaActual.paddingRight : (vistaActual.padding ?? 0);

  const rolesFondo = [
    { token: 'background', label: 'Background (Fondo general)' },
    { token: 'surface', label: 'Surface (Superficie base)' },
    { token: 'surfaceVariant', label: 'Surface Variant (Contraste suave)' },
    { token: 'primaryContainer', label: 'Primary Container (Tonalidad primaria)' }
  ];
  const rolesEditables = [
    { token: 'primary', label: 'Primary' },
    { token: 'primaryContainer', label: 'Primary Container' },
    { token: 'secondary', label: 'Secondary' },
    { token: 'surface', label: 'Surface' },
    { token: 'surfaceVariant', label: 'Surface Variant' },
    { token: 'background', label: 'Background' },
    { token: 'onSurface', label: 'Texto sobre superficie' },
    { token: 'outline', label: 'Outline' }
  ];

  const presetsSombra = [
    { label: 'Ninguna', valor: 'none' },
    { label: 'Suave', valor: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
    { label: 'Media', valor: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)' },
    { label: 'Elevada', valor: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.15)' }
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* Encabezado del Lienzo */}
      <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
        <div>
          <span className="font-bold text-teal-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Icon name="monitor" className="w-3.5 h-3.5" />
            Propiedades del Lienzo
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Vista: {vistaActual.nombre} ({vistaActual.dispositivo === 'movil' ? 'Móvil' : 'Web'})
          </span>
        </div>
        <span className="text-[9px] bg-teal-950/60 border border-teal-800/60 text-teal-300 px-2 py-0.5 rounded font-mono">
          Canvas
        </span>
      </div>

      {/* 1. SECCIÓN: TEMA DEL PROYECTO */}
      <div className="space-y-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 text-[11px] flex items-center gap-1.5">
            <Icon name={modoEfectivo === 'claro' ? 'sun' : 'moon'} className={`w-3.5 h-3.5 ${modoEfectivo === 'claro' ? 'text-amber-400' : 'text-indigo-400'}`} />
            Tema del Proyecto
          </span>
          <div className="flex rounded-md overflow-hidden border border-slate-700 font-mono text-[10px]">
            <button
              onClick={() => onCambiarModoTema('claro')}
              className={`px-2 py-1 transition ${modoTema === 'claro' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              title="Modo Claro Material 3"
            >
              Claro
            </button>
            <button
              onClick={() => onCambiarModoTema('oscuro')}
              className={`px-2 py-1 transition ${modoTema === 'oscuro' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              title="Modo Oscuro Material 3"
            >
              Oscuro
            </button>
            <button
              onClick={() => onCambiarModoTema('system')}
              className={`px-2 py-1 transition ${modoTema === 'system' ? 'bg-teal-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              title="Seguir tema del Sistema Operativo"
            >
              Sistema
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-500">
          Afecta a todo el proyecto. El lienzo actualizará su fondo y componentes respetando la paleta semántica.
        </p>
      </div>

      {/* 2. SECCIÓN: DIMENSIONES */}
      <div className="space-y-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
        <span className="font-semibold text-slate-200 text-[11px] block">Tokens del Proyecto</span>
        <p className="text-[10px] text-slate-500">Los colores personalizados se guardan con este proyecto y se aplican al lienzo y sus componentes.</p>
        <div className="flex gap-1"><button type="button" onClick={() => setModoPaletaEditando('claro')} className={`flex-1 rounded px-2 py-1 ${modoPaleta === 'claro' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Editar claro</button><button type="button" onClick={() => setModoPaletaEditando('oscuro')} className={`flex-1 rounded px-2 py-1 ${modoPaleta === 'oscuro' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Editar oscuro</button></div>
        <div className="space-y-1.5">
          {rolesEditables.map(({ token, label }) => (
            <div key={token} className="flex items-center gap-2">
              <input type="color" value={paletaEfectiva[token] || '#000000'} onChange={(e) => onActualizarColorTema(token, e.target.value, modoPaleta)} className="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent p-0" title={`Editar token ${token}`} />
              <span className="flex-1 text-[10px] text-slate-400">{label}</span>
              <input type="text" value={paletaEfectiva[token] || ''} onChange={(e) => onActualizarColorTema(token, e.target.value, modoPaleta)} className="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-right font-mono text-[10px] text-slate-200" aria-label={`Color del token ${token}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 border-b border-slate-800 pb-3">
        <span className="font-semibold text-slate-300 block text-[11px]">Dimensiones del Marco</span>

        {/* Presets Rápidos de Dispositivo */}
        <div className="space-y-1">
          <label className="text-slate-400 block mb-1">Preset de Pantalla</label>
          <select
            value={vistaActual.dispositivo === 'movil' ? 'movil' : (vistaActual.ancho === 768 ? 'tablet' : 'web')}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'movil') {
                onActualizarLienzo('dispositivo', 'movil');
                onActualizarLienzo('ancho', 375);
                onActualizarLienzo('alto', 812);
              } else if (val === 'tablet') {
                onActualizarLienzo('dispositivo', 'web');
                onActualizarLienzo('ancho', 768);
                onActualizarLienzo('alto', 1024);
              } else {
                onActualizarLienzo('dispositivo', 'web');
                onActualizarLienzo('ancho', 1024);
                onActualizarLienzo('alto', 640);
              }
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200"
          >
            <option value="movil">Móvil Smartphone (375 x 812 px)</option>
            <option value="tablet">Tablet / iPad (768 x 1024 px)</option>
            <option value="web">Pantalla Web Escritorio (1024 x 640 px)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-1">Ancho (px)</label>
            <input
              type="number"
              value={vistaActual.ancho || ''}
              onChange={(e) => onActualizarLienzo('ancho', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Alto (px)</label>
            <input
              type="number"
              value={vistaActual.alto || ''}
              onChange={(e) => onActualizarLienzo('alto', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-1">Ancho Mínimo</label>
            <input
              type="number"
              placeholder="Ej. 320"
              value={vistaActual.minWidth || ''}
              onChange={(e) => onActualizarLienzo('minWidth', e.target.value ? parseInt(e.target.value) : '')}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Alto Mínimo</label>
            <input
              type="number"
              placeholder="Ej. 600"
              value={vistaActual.minHeight || ''}
              onChange={(e) => onActualizarLienzo('minHeight', e.target.value ? parseInt(e.target.value) : '')}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-1">Ancho Máximo</label>
            <input
              type="number"
              placeholder="Ej. 1200"
              value={vistaActual.maxWidth || ''}
              onChange={(e) => onActualizarLienzo('maxWidth', e.target.value ? parseInt(e.target.value) : '')}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Alto Máximo</label>
            <input
              type="number"
              placeholder="Ej. 1600"
              value={vistaActual.maxHeight || ''}
              onChange={(e) => onActualizarLienzo('maxHeight', e.target.value ? parseInt(e.target.value) : '')}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="fitContentCheck"
            checked={Boolean(vistaActual.fitContent)}
            onChange={(e) => onActualizarLienzo('fitContent', e.target.checked)}
            className="rounded border-slate-700 text-teal-600 focus:ring-0 bg-slate-950"
          />
          <label htmlFor="fitContentCheck" className="text-slate-300 text-[11px] cursor-pointer">
            Ajustar automáticamente al contenido (Fit content)
          </label>
        </div>
      </div>

      {/* 3. SECCIÓN: APARIENCIA */}
      <div className="space-y-2.5 border-b border-slate-800 pb-3">
        <span className="font-semibold text-slate-300 block text-[11px]">Apariencia y Fondo</span>

        {/* Fondo transparente */}
        <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
          <span className="text-slate-300 text-[11px]">Fondo Transparente</span>
          <input
            type="checkbox"
            checked={Boolean(vistaActual.esTransparente)}
            onChange={(e) => onActualizarLienzo('esTransparente', e.target.checked)}
            className="rounded border-slate-700 text-teal-600 focus:ring-0 bg-slate-950 cursor-pointer"
          />
        </div>

        {/* Color de fondo */}
        {!vistaActual.esTransparente && (
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-500">El token seleccionado hereda el color del tema del proyecto. Un color HEX aplica un valor manual.</p>
            <div className="flex items-center justify-between">
              <label className="text-slate-400">Color de Fondo</label>
              {M3_TOKENS.includes(vistaActual.bg) && (
                <span className="text-[9px] text-teal-400 font-mono bg-teal-950/40 px-1.5 py-0.2 rounded border border-teal-800/40">
                  Token: {vistaActual.bg}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  vistaActual.bg?.startsWith('#')
                    ? vistaActual.bg
                    : resolveM3Color(vistaActual.bg || 'background', modoTema, paletaPersonalizada)
                }
                onChange={(e) => onActualizarLienzo('bg', e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border border-slate-700 bg-transparent p-0"
              />
              <input
                type="text"
                value={vistaActual.bg || 'background'}
                onChange={(e) => onActualizarLienzo('bg', e.target.value)}
                placeholder="background / #ffffff"
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
              />
            </div>

            {/* Selector de tokens de fondo */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-slate-500 block">Tokens de Fondo Recomendados:</span>
              <div className="grid grid-cols-2 gap-1">
                {rolesFondo.map(({ token, label }) => (
                  <button
                    key={token}
                    onClick={() => {
                      onActualizarLienzo('bg', token);
                      onActualizarLienzo('esTransparente', false);
                      onActualizarLienzo('gradient', '');
                      onActualizarLienzo('backgroundImage', '');
                    }}
                    className={`px-1.5 py-1 text-[10px] rounded border text-left truncate transition ${
                      vistaActual.bg === token
                        ? 'bg-teal-900/60 border-teal-500 text-teal-200 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={label}
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            onActualizarLienzo('bg', 'background');
            onActualizarLienzo('esTransparente', false);
            onActualizarLienzo('gradient', '');
            onActualizarLienzo('backgroundImage', '');
          }}
          className="w-full px-2 py-1.5 rounded border border-slate-700 bg-slate-950 text-[10px] text-slate-300 hover:text-white hover:border-teal-500 transition"
          title="Restablecer el fondo para heredar el token Background del tema del proyecto"
        >
          Restablecer a Background del tema
        </button>

        {/* Gradiente */}
        <div className="space-y-1">
          <label className="text-slate-400 block mb-1">Gradiente CSS (Opcional)</label>
          <input
            type="text"
            value={vistaActual.gradient || ''}
            placeholder="linear-gradient(135deg, #667eea, #764ba2)"
            onChange={(e) => onActualizarLienzo('gradient', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[10px]"
          />
        </div>

        {/* Imagen de fondo */}
        <div className="space-y-1">
          <label className="text-slate-400 block mb-1">Imagen de Fondo (URL)</label>
          <input
            type="text"
            value={vistaActual.backgroundImage || ''}
            placeholder="https://ejemplo.com/fondo.jpg"
            onChange={(e) => onActualizarLienzo('backgroundImage', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-[11px]"
          />
        </div>

        {vistaActual.dispositivo === 'movil' && (
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 text-[11px]">Barra de estado del dispositivo</span>
              <button
                type="button"
                onClick={() => {
                  onActualizarLienzo('statusBarBg', 'transparent');
                  onActualizarLienzo('statusBarContentColor', 'auto');
                }}
                className="text-[10px] text-teal-400 hover:text-teal-300"
                title="Restablecer barra transparente con contraste automático"
              >Restablecer</button>
            </div>
            <p className="text-[10px] text-slate-500">Fija sobre el contenido y transparente por defecto, como en un teléfono real.</p>
            <label className="text-slate-400 block">Alto de barra (px)
              <input type="number" min="0" max="80" value={vistaActual.statusBarHeight ?? 24} onChange={(e) => onActualizarLienzo('statusBarHeight', Number(e.target.value))} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200" />
            </label>
            <label className="text-slate-400 block">Fondo de la barra (transparent o token)
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={vistaActual.statusBarBg?.startsWith('#') ? vistaActual.statusBarBg : (resolvedBgColor.startsWith('#') ? resolvedBgColor : '#ffffff')}
                  onChange={(e) => onActualizarLienzo('statusBarBg', e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border border-slate-700 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={vistaActual.statusBarBg ?? 'transparent'}
                  onChange={(e) => onActualizarLienzo('statusBarBg', e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[10px]"
                />
              </div>
            </label>
            <label className="text-slate-400 block">Color del contenido
              <select
                value={vistaActual.statusBarContentColor || 'auto'}
                onChange={(e) => onActualizarLienzo('statusBarContentColor', e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200"
              >
                <option value="auto">Automático según el fondo</option>
                <option value="#000000">Negro</option>
                <option value="#FFFFFF">Blanco</option>
              </select>
            </label>
          </div>
        )}

        {/* Opacidad */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <label>Opacidad del Lienzo</label>
            <span className="font-mono text-[10px]">{vistaActual.opacity !== undefined ? vistaActual.opacity : 1}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={vistaActual.opacity !== undefined ? vistaActual.opacity : 1}
            onChange={(e) => onActualizarLienzo('opacity', parseFloat(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 4. SECCIÓN: ESPACIADO (PADDING 4 LADOS) */}
      <div className="space-y-2.5 border-b border-slate-800 pb-3">
        <span className="font-semibold text-slate-300 block text-[11px]">Relleno del Lienzo (Padding)</span>

        {/* Presets Rápidos */}
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 8, 16, 24].map(p => (
            <button
              key={p}
              onClick={() => {
                onActualizarLienzo('padding', p);
                onActualizarLienzo('paddingTop', p);
                onActualizarLienzo('paddingBottom', p);
                onActualizarLienzo('paddingLeft', p);
                onActualizarLienzo('paddingRight', p);
              }}
              className={`py-1 rounded border text-center font-mono ${
                padTop === p && padBottom === p && padLeft === p && padRight === p
                  ? 'bg-teal-600 text-white border-teal-400 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {p}px
            </button>
          ))}
        </div>

        {/* Padding Individual 4 Lados */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-slate-400 block mb-1">Superior (Top)</label>
            <input
              type="number"
              value={padTop}
              onChange={(e) => onActualizarLienzo('paddingTop', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Inferior (Bottom)</label>
            <input
              type="number"
              value={padBottom}
              onChange={(e) => onActualizarLienzo('paddingBottom', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Izquierdo (Left)</label>
            <input
              type="number"
              value={padLeft}
              onChange={(e) => onActualizarLienzo('paddingLeft', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Derecho (Right)</label>
            <input
              type="number"
              value={padRight}
              onChange={(e) => onActualizarLienzo('paddingRight', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* 5. SECCIÓN: BORDES Y PRESENTACIÓN */}
      <div className="space-y-2.5 border-b border-slate-800 pb-3">
        <span className="font-semibold text-slate-300 block text-[11px]">Bordes y Presentación</span>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-1">Radio de Borde (px)</label>
            <input
              type="number"
              value={vistaActual.borderRadius !== undefined ? vistaActual.borderRadius : (vistaActual.dispositivo === 'movil' ? 28 : 12)}
              onChange={(e) => onActualizarLienzo('borderRadius', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Estilo de Borde</label>
            <input
              type="text"
              value={vistaActual.border || ''}
              placeholder="1px solid #334155"
              onChange={(e) => onActualizarLienzo('border', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-slate-400 block mb-1">Sombra de Presentación</label>
          <div className="grid grid-cols-2 gap-1.5">
            {presetsSombra.map(({ label, valor }) => (
              <button
                key={label}
                onClick={() => onActualizarLienzo('sombra', valor === 'none' ? '' : valor)}
                className={`py-1 px-2 rounded border text-[10px] text-center transition ${
                  (vistaActual.sombra === valor || (!vistaActual.sombra && valor === 'none'))
                    ? 'bg-teal-600 text-white border-teal-400 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6. SECCIÓN: COMPORTAMIENTO Y SCROLL */}
      <div className="space-y-2.5 border-b border-slate-800 pb-3">
        <span className="font-semibold text-slate-300 block text-[11px]">Comportamiento y Flujo</span>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-1">Dirección del Flujo</label>
            <select
              value={vistaActual.direccion || 'column'}
              onChange={(e) => onActualizarLienzo('direccion', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
            >
              <option value="column">Columna (Vertical)</option>
              <option value="row">Fila (Horizontal)</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Espacio (Gap)</label>
            <input
              type="number"
              value={vistaActual.gap ?? 16}
              onChange={(e) => onActualizarLienzo('gap', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <label className="text-slate-400 block">Desbordamiento (Overflow)</label>
          <select
            value={vistaActual.overflow || 'auto'}
            onChange={(e) => onActualizarLienzo('overflow', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
          >
            <option value="hidden">Oculto (Hidden)</option>
            <option value="auto">Automático (Scroll con contenido)</option>
            <option value="visible">Visible (Permitir desborde)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800">
            <input
              type="checkbox"
              id="scrollVertCheck"
              checked={Boolean(vistaActual.scrollVertical)}
              onChange={(e) => onActualizarLienzo('scrollVertical', e.target.checked)}
              className="rounded border-slate-700 text-teal-600 focus:ring-0 bg-slate-950 cursor-pointer"
            />
            <label htmlFor="scrollVertCheck" className="text-slate-300 text-[10px] cursor-pointer">
              Scroll Vertical
            </label>
          </div>

          <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800">
            <input
              type="checkbox"
              id="scrollHorizCheck"
              checked={Boolean(vistaActual.scrollHorizontal)}
              onChange={(e) => onActualizarLienzo('scrollHorizontal', e.target.checked)}
              className="rounded border-slate-700 text-teal-600 focus:ring-0 bg-slate-950 cursor-pointer"
            />
            <label htmlFor="scrollHorizCheck" className="text-slate-300 text-[10px] cursor-pointer">
              Scroll Horizontal
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
