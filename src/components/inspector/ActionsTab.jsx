import React from 'react';
import { Icon } from '../common/Icon.jsx';

const valoresOverlayDefault = tipo => ({ tipoOverlay: tipo, titulo: tipo === 'dialog' ? 'Nueva confirmaciÃ³n' : 'Nuevo menÃº', mostrarTitulo: true, showCloseButton: true, closeOnOutside: true, bg: 'surface', textColor: 'onSurface', outlineColor: 'outlineVariant', backdropColor: 'rgba(0,0,0,.65)', borderRadius: tipo === 'dialog' ? '16px' : '20px', overlayPadding: '20px', showConfirmButton: true, showCancelButton: true, confirmText: 'Aceptar', cancelText: 'Cancelar', showCloseActionButton: true, closeText: 'Cerrar', showHandle: true, primaryButtonColor: 'primary', confirmTextColor: 'onPrimary', cancelButtonColor: 'surfaceVariant', handleColor: 'onSurfaceVariant' });

const OverlayProjectEditor = ({ views, onUpdate }) => views.map(view => {
  const patch = changes => onUpdate?.(view.id, changes);
  const check = (key, label) => <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" checked={view[key] !== false} onChange={e => patch({ [key]: e.target.checked })} />{label}</label>;
  const field = (key, label, fallback = '') => <label className="block text-slate-400">{label}<input value={view[key] ?? fallback} onChange={e => patch({ [key]: e.target.value })} className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200" /></label>;
  return <div key={view.id} className="space-y-2 rounded border border-slate-800 bg-slate-950 p-2.5">
    <div className="flex items-center justify-between"><strong className="text-slate-200">{view.nombre}</strong><button type="button" onClick={() => patch(valoresOverlayDefault(view.tipoOverlay))} className="text-[10px] text-teal-400">Restablecer valores</button></div>
    {check('mostrarTitulo', 'Mostrar tÃ­tulo')}{field('titulo', 'TÃ­tulo')}{check('showCloseButton', 'Mostrar icono cerrar')}{check('closeOnOutside', 'Cerrar al tocar fuera')}
    {view.tipoOverlay === 'dialog' ? <>{check('showCancelButton', 'Mostrar botÃ³n cancelar')}{check('showConfirmButton', 'Mostrar botÃ³n confirmar')}{field('cancelText', 'Texto cancelar', 'Cancelar')}{field('confirmText', 'Texto confirmar', 'Aceptar')}</> : <>{check('showHandle', 'Mostrar indicador')}{check('showCloseActionButton', 'Mostrar botÃ³n cerrar')}{field('closeText', 'Texto botÃ³n cerrar', 'Cerrar')}</>}
    <div className="grid grid-cols-2 gap-2">{field('bg', 'Fondo (token/HEX)', 'surface')}{field('textColor', 'Texto (token/HEX)', 'onSurface')}{field('primaryButtonColor', 'AcciÃ³n (token/HEX)', 'primary')}{field('cancelButtonColor', 'Secundario (token/HEX)', 'surfaceVariant')}{field('outlineColor', 'Borde (token/HEX)', 'outlineVariant')}{field('backdropColor', 'Fondo exterior', 'rgba(0,0,0,.65)')}</div>
    <div className="grid grid-cols-2 gap-2">{field('borderRadius', 'Radio', '16px')}{field('overlayPadding', 'Padding', '20px')}</div>
    {view.tipoOverlay === 'dialog' && <div className="grid grid-cols-2 gap-2">{field('confirmTextColor', 'Texto botÃ³n', 'onPrimary')}{field('dialogWidth', 'Ancho', '100%')}</div>}
  </div>;
});

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
        <label className="text-slate-400">Seleccionar AcciÃ³n</label>
        <select
          value={componenteSeleccionado.accion?.tipo || 'ninguna'}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'ninguna') onActualizarAccion(null);
            else onActualizarAccion({ tipo: v, payload: 'Contenido predeterminado' });
          }}
          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
        >
          <option value="ninguna">Sin AcciÃ³n</option>
          <option value="bottomsheet">Abrir Bottom Sheet (MÃ³vil)</option>
          <option value="dialog">Abrir DiÃ¡logo Modal</option>
          <option value="alerta">Lanzar Alerta / NotificaciÃ³n</option>
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
                <select value={componenteSeleccionado.accion.vistaId || componenteSeleccionado.accion.overlayId || ''} onChange={(e) => onActualizarAccion({ ...componenteSeleccionado.accion, vistaId: e.target.value || undefined, overlayId: undefined })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-slate-200">
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

      {overlays.length > 0 && <div className="space-y-2 border-t border-slate-800 pt-3"><div className="text-slate-300 font-semibold">Overlays del proyecto</div><OverlayProjectEditor views={overlays} onUpdate={onActualizarVistaOverlay} /></div>}
    </div>
  );
};
