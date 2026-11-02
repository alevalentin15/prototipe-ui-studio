import React from 'react';
import { Icon } from '../common/Icon.jsx';

export const ActionsTab = ({
  componenteSeleccionado,
  proyectoActual,
  onActualizarAccion,
  onActualizarOverlays,
  onCrearVistaOverlay,
  onActualizarVistaOverlay
}) => {
  if (!componenteSeleccionado) {
    return (
      <div className="text-slate-500 text-xs text-center py-8">
        Selecciona un componente para programar acciones.
      </div>
    );
  }

  const overlays = proyectoActual?.vistas?.filter(view => view.tipoOverlay) || proyectoActual?.overlays || [];
  const crearOverlay = (tipo) => {
    const item = onCrearVistaOverlay?.(tipo);
    if (item) onActualizarAccion({ tipo, vistaId: item.id });
  };

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
          ) : (componenteSeleccionado.accion.tipo === 'bottomsheet' || componenteSeleccionado.accion.tipo === 'dialog') ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-400">Contenido reutilizable</label>
                <select value={componenteSeleccionado.accion.vistaId || componenteSeleccionado.accion.overlayId || ''} onChange={(e) => onActualizarAccion({ ...componenteSeleccionado.accion, vistaId: e.target.value || undefined })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-slate-200">
                  <option value="">Contenido directo del evento</option>
                  {overlays.filter(item => (item.tipoOverlay || item.tipo) === componenteSeleccionado.accion.tipo).map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                </select>
              </div>
              {(componenteSeleccionado.accion.vistaId || componenteSeleccionado.accion.overlayId) ? null : <textarea rows={3} value={componenteSeleccionado.accion.payload || ''} onChange={(e) => onActualizarAccion({ ...componenteSeleccionado.accion, payload: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 resize-none" placeholder="Texto del evento" />}
              <div className="flex gap-2"><button type="button" onClick={() => crearOverlay('bottomsheet')} className="flex-1 px-2 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:text-white">+ Crear Sheet</button><button type="button" onClick={() => crearOverlay('dialog')} className="flex-1 px-2 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:text-white">+ Crear Dialog</button></div>
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

      {overlays.length > 0 && <div className="space-y-2 border-t border-slate-800 pt-3"><div className="text-slate-300 font-semibold">Overlays como vistas</div>{overlays.map(item => <div key={item.id} className="space-y-2 rounded border border-slate-800 bg-slate-950 p-2"><div className="text-[10px] text-slate-500">El contenido se edita como componentes en su vista del árbol del proyecto.</div><input value={item.nombre} onChange={e => onActualizarVistaOverlay?.(item.id, { nombre: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200" aria-label="Nombre del overlay" /><label className="flex items-center gap-2 text-slate-300"><input type="checkbox" checked={item.mostrarTitulo !== false} onChange={e => onActualizarVistaOverlay?.(item.id, { mostrarTitulo: e.target.checked })} />Mostrar título</label><input value={item.titulo || ''} onChange={e => onActualizarVistaOverlay?.(item.id, { titulo: e.target.value })} disabled={item.mostrarTitulo === false} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 disabled:opacity-50" placeholder="Título del sheet/dialog" /></div>)}</div>}
    </div>
  );
};
