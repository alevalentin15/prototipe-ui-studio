import React from 'react';
import { Icon } from '../common/Icon.jsx';
import { M3_SCHEMES } from '../../theme/materialTheme.js';

export const CanvasSettingsTab = ({
  vistaActual,
  modoTema = 'claro',
  paletaPersonalizada = null,
  onActualizarLienzo,
  onCambiarModoTema,
  onActualizarColorTema
}) => {
  if (!vistaActual) return null;

  const paletaBase = M3_SCHEMES[modoTema] || M3_SCHEMES.claro;
  const paletaEfectiva = {
    ...paletaBase,
    ...(paletaPersonalizada || {})
  };

  const rolesPrincipales = [
    { key: 'primary', label: 'Primary (Acción principal)' },
    { key: 'primaryContainer', label: 'Primary Container (Contenedores clave)' },
    { key: 'surface', label: 'Surface (Superficie base)' },
    { key: 'surfaceVariant', label: 'Surface Variant (Tarjetas/Inputs)' },
    { key: 'background', label: 'Background (Fondo de pantalla)' },
    { key: 'outline', label: 'Outline (Bordes)' }
  ];

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center gap-1.5 text-teal-400 font-semibold border-b border-slate-800 pb-2">
        <Icon name="settings" className="w-4 h-4" />
        <span>Ajustes del Lienzo y Márgenes</span>
      </div>

      {/* TEMA MATERIAL 3 (CLARO / OSCURO) */}
      <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 text-[11px] flex items-center gap-1.5">
            <Icon name={modoTema === 'claro' ? 'sun' : 'moon'} className={`w-3.5 h-3.5 ${modoTema === 'claro' ? 'text-amber-400' : 'text-indigo-400'}`} />
            Tema Material 3
          </span>
          <div className="flex rounded-lg overflow-hidden border border-slate-700 font-mono text-[10px]">
            <button
              onClick={() => onCambiarModoTema('claro')}
              className={`px-2.5 py-1 transition ${modoTema === 'claro' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              Claro
            </button>
            <button
              onClick={() => onCambiarModoTema('oscuro')}
              className={`px-2.5 py-1 transition ${modoTema === 'oscuro' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              Oscuro
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-500">
          Modo por defecto: <strong>Claro</strong>. Los componentes adaptan su contraste automáticamente.
        </p>
      </div>

      {/* PALETA DE COLORES EDITABLE (MATERIAL 3) */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-300 block">
            Paleta M3 Editable ({modoTema === 'claro' ? 'Claro' : 'Oscuro'})
          </span>
        </div>

        <div className="space-y-2">
          {rolesPrincipales.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate flex-1">
                <input
                  type="color"
                  value={paletaEfectiva[key] || '#000000'}
                  onChange={(e) => onActualizarColorTema(key, e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer border border-slate-700 bg-transparent p-0"
                  title="Seleccionar color"
                />
                <span className="text-[10px] text-slate-400 truncate" title={label}>{label}</span>
              </div>
              <input
                type="text"
                value={paletaEfectiva[key] || ''}
                onChange={(e) => onActualizarColorTema(key, e.target.value)}
                className="w-20 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-right font-mono text-[10px] text-slate-200"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CONFIGURACIÓN BÁSICA DE VISTA */}
      <div className="space-y-1 pt-2 border-t border-slate-800">
        <label className="text-slate-400">Nombre de la Vista</label>
        <input
          type="text"
          value={vistaActual.nombre}
          onChange={(e) => onActualizarLienzo('nombre', e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
        />
      </div>

      <div className="space-y-1">
        <label className="text-slate-400">Dispositivo Marco</label>
        <select
          value={vistaActual.dispositivo}
          onChange={(e) => {
            const d = e.target.value;
            if (d === 'movil') {
              onActualizarLienzo('dispositivo', 'movil');
              onActualizarLienzo('ancho', 375);
              onActualizarLienzo('alto', 812);
            } else {
              onActualizarLienzo('dispositivo', 'web');
              onActualizarLienzo('ancho', 1024);
              onActualizarLienzo('alto', 640);
            }
          }}
          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
        >
          <option value="movil">Móvil Smartphone (375 x 812 px)</option>
          <option value="web">Pantalla Web Escritorio (1024 x 640 px)</option>
        </select>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-slate-400 block">Relleno Base del Lienzo (Padding)</label>
        <div className="grid grid-cols-4 gap-1.5">
          {[8, 16, 24, 32].map(p => (
            <button
              key={p}
              onClick={() => onActualizarLienzo('padding', p)}
              className={`py-1 rounded border text-center font-mono ${vistaActual.padding === p ? 'bg-teal-600 text-white border-teal-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
            >
              {p}px
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-slate-400 block">Espaciado entre Elementos (Gap)</label>
        <div className="grid grid-cols-4 gap-1.5">
          {[8, 12, 16, 24].map(g => (
            <button
              key={g}
              onClick={() => onActualizarLienzo('gap', g)}
              className={`py-1 rounded border text-center font-mono ${vistaActual.gap === g ? 'bg-teal-600 text-white border-teal-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
            >
              {g}px
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
