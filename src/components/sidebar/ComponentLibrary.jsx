import React from 'react';
import { Icon } from '../common/Icon.jsx';
import { getComponentsByCategory } from '../../registry/componentRegistry.js';
import { useStudioDnd } from '../../dnd/DndContext.jsx';

export const ComponentLibrary = ({
  height = 320,
  componentesReutilizables = [],
  componenteSeleccionado,
  onAgregarComponente
}) => {
  const { startDrag, endDrag } = useStudioDnd();
  const catalogoPorCategorias = getComponentsByCategory();

  const idPadreParaInsertar = 
    componenteSeleccionado?.tipo === 'Box' ||
    componenteSeleccionado?.tipo === 'Row' ||
    componenteSeleccionado?.tipo === 'Column' ||
    componenteSeleccionado?.tipo === 'Card' ||
    componenteSeleccionado?.tipo === 'contenedor' ||
    componenteSeleccionado?.tipo === 'tarjeta'
      ? componenteSeleccionado.id
      : null;

  const handlePaletteDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item.type || item.tipo);
    e.dataTransfer.effectAllowed = 'copy';
    startDrag('palette', {
      tipo: item.type || item.tipo,
      etiqueta: item.name || item.etiqueta,
      defaultProps: item.defaultProps,
      esTriggerOverlay: item.esTriggerOverlay
    });
  };

  return (
    <div style={{ height }} className="overflow-y-auto p-3 bg-slate-900 custom-scrollbar select-none shrink-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Icon name="box" className="w-3.5 h-3.5 text-amber-400" />
          Biblioteca de Componentes
        </span>
        <span className="text-[10px] text-slate-500 font-mono">Arrastra o Clic</span>
      </div>

      <div className="space-y-3">
        {Object.entries(catalogoPorCategorias).map(([categoria, items]) => (
          <div key={categoria}>
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 px-1 tracking-wide">
              {categoria}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handlePaletteDragStart(e, item)}
                  onDragEnd={endDrag}
                  onClick={() => onAgregarComponente({
                    tipo: item.type,
                    etiqueta: item.name,
                    defaultProps: item.defaultProps,
                    esTriggerOverlay: item.esTriggerOverlay
                  }, idPadreParaInsertar)}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:border-blue-500/60 hover:bg-slate-800 text-slate-300 transition text-center group cursor-grab active:cursor-grabbing hover:shadow-md"
                  title={`${item.description} (Arrastra al lienzo o haz clic para agregar)`}
                >
                  <Icon name={item.icon} className="w-4 h-4 mb-1 text-slate-400 group-hover:text-blue-400 transition" />
                  <span className="text-[11px] font-medium leading-tight truncate w-full px-1">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Componentes Reutilizables Guardados */}
        {componentesReutilizables.length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[10px] text-amber-400 uppercase font-bold mb-1.5 px-1 tracking-wide">
              Mis Reutilizables ({componentesReutilizables.length})
            </div>
            <div className="grid grid-cols-1 gap-1">
              {componentesReutilizables.map((reut, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handlePaletteDragStart(e, {
                    type: reut.tipo,
                    name: reut.etiqueta,
                    defaultProps: reut.props
                  })}
                  onDragEnd={endDrag}
                  onClick={() => onAgregarComponente({
                    tipo: reut.tipo,
                    etiqueta: reut.etiqueta,
                    defaultProps: reut.props
                  }, idPadreParaInsertar)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-200 text-xs text-left hover:bg-amber-900/30 transition cursor-grab active:cursor-grabbing"
                >
                  <Icon name="box" className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate flex-1">{reut.etiqueta}</span>
                  <span className="text-[9px] text-amber-500 font-mono">Reutilizable</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
