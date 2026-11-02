import React from 'react';
import { Icon } from '../common/Icon.jsx';

export const CanvasToolbar = ({
  vistaActual,
  nivelZoom,
  modoTema = 'claro',
  onCambiarZoom,
  onToggleModoTema
}) => {
  if (!vistaActual) return null;

  return (
    <div className="h-9 bg-slate-900/40 border-b border-slate-800/60 px-4 flex items-center justify-between text-xs text-slate-400 shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-slate-200">{vistaActual.nombre}</span>
        <span className="text-slate-700">|</span>
        <span>Marco: {vistaActual.dispositivo === 'movil' ? 'Móvil Smartphone' : 'Escritorio Web'} ({vistaActual.ancho}x{vistaActual.alto}px)</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Switch de Tema Material 3 (Claro / Oscuro) */}
        <button
          onClick={onToggleModoTema}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition text-[11px]"
          title="Alternar entre Tema Claro y Oscuro de Material 3"
        >
          <Icon name={modoTema === 'claro' ? 'sun' : 'moon'} className={`w-3.5 h-3.5 ${modoTema === 'claro' ? 'text-amber-400' : 'text-indigo-400'}`} />
          <span>Tema {modoTema === 'claro' ? 'Claro (M3)' : 'Oscuro (M3)'}</span>
        </button>

        <div className="h-3.5 w-[1px] bg-slate-800" />

        {/* Control de Zoom */}
        <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 font-mono">
          <button
            onClick={() => onCambiarZoom(Math.max(25, nivelZoom - 10))}
            className="px-1 hover:text-white"
            title="Reducir zoom"
          >
            -
          </button>
          <span className="w-10 text-center">{nivelZoom}%</span>
          <button
            onClick={() => onCambiarZoom(Math.min(200, nivelZoom + 10))}
            className="px-1 hover:text-white"
            title="Aumentar zoom"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
