import React from 'react';
import { Icon } from '../common/Icon.jsx';

export const ActionsTab = ({
  componenteSeleccionado,
  proyectoActual,
  onActualizarAccion
}) => {
  if (!componenteSeleccionado) {
    return (
      <div className="text-slate-500 text-xs text-center py-8">
        Selecciona un componente para programar acciones.
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center gap-1.5 text-amber-400 font-semibold border-b border-slate-800 pb-2">
        <Icon name="zap" className="w-4 h-4" />
        <span>Evento: Al hacer clic (onClick)</span>
      </div>

      <div className="space-y-1">
        <label className="text-slate-400">Seleccionar Acción</label>
        <select
          value={componenteSeleccionado.accion?.tipo || 'ninguna'}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'ninguna') onActualizarAccion(null);
            else onActualizarAccion({ tipo: v, payload: 'Contenido predeterminado' });
          }}
          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
        >
          <option value="ninguna">Sin Acción</option>
          <option value="bottomsheet">Abrir Bottom Sheet (Móvil)</option>
          <option value="dialog">Abrir Diálogo Modal</option>
          <option value="alerta">Lanzar Alerta / Notificación</option>
          <option value="navegar">Navegar a otra Vista</option>
        </select>
      </div>

      {componenteSeleccionado.accion && (
        <div className="space-y-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
          {componenteSeleccionado.accion.tipo === 'navegar' ? (
            <div className="space-y-1">
              <label className="text-slate-400">Vista Destino</label>
              <select
                value={componenteSeleccionado.accion.vistaId || ''}
                onChange={(e) => onActualizarAccion({ ...componenteSeleccionado.accion, vistaId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200"
              >
                <option value="">Selecciona vista...</option>
                {proyectoActual?.vistas.map(v => (
                  <option key={v.id} value={v.id}>{v.nombre}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-slate-400">Texto o Mensaje del Evento</label>
              <textarea
                rows={3}
                value={componenteSeleccionado.accion.payload || ''}
                onChange={(e) => onActualizarAccion({ ...componenteSeleccionado.accion, payload: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 resize-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
