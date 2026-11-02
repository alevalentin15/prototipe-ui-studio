import React, { useState } from 'react';
import { Icon } from '../common/Icon.jsx';
import { useStudioDnd } from '../../dnd/DndContext.jsx';
import { getComponentDefinition } from '../../registry/componentRegistry.js';

export const LayersTree = ({
  componentes = [],
  idComponenteSeleccionado,
  onSeleccionarComponente,
  onEliminarComponente
}) => {
  const {
    isDragging,
    draggedItem,
    hoverTarget,
    startDrag,
    updateHoverTarget,
    endDrag,
    handleDrop,
    canAcceptDrop
  } = useStudioDnd();

  // Estado para expandir / contraer nodos contenedor
  const [collapsedNodes, setCollapsedNodes] = useState({});

  const toggleCollapse = (id, e) => {
    e.stopPropagation();
    setCollapsedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleLayerDragStart = (e, c) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', c.id);
    e.dataTransfer.effectAllowed = 'move';
    startDrag('layers', c);
  };

  const handleLayerDragOver = (e, c, esContenedor) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();

    const isValid = canAcceptDrop ? canAcceptDrop(draggedItem?.id, c.id) : true;
    const rect = e.currentTarget.getBoundingClientRect();
    const yRel = e.clientY - rect.top;

    let position = 'inside';
    if (esContenedor) {
      if (yRel < rect.height * 0.25) position = 'before';
      else if (yRel > rect.height * 0.75) position = 'after';
      else position = 'inside';
    } else {
      position = yRel < rect.height * 0.5 ? 'before' : 'after';
    }

    e.dataTransfer.dropEffect = isValid ? 'move' : 'none';
    updateHoverTarget({
      targetId: c.id,
      position,
      orientation: 'vertical',
      isValid
    });
  };

  const handleLayerDrop = (e, c) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();

    const isValid = canAcceptDrop ? canAcceptDrop(draggedItem?.id, c.id) : true;
    if (isValid && hoverTarget?.targetId === c.id) {
      handleDrop(c.id, hoverTarget.position || 'inside');
    } else {
      endDrag();
    }
  };

  const renderizarNodosArbol = (lista, profundidad = 0) => {
    return lista.map(c => {
      const def = getComponentDefinition(c.tipo);
      const esContenedor = def?.isContainer || Boolean(c.hijos);
      const tieneHijos = Boolean(c.hijos && c.hijos.length > 0);
      const estaColapsado = Boolean(collapsedNodes[c.id]);
      const esSeleccionado = idComponenteSeleccionado === c.id;
      const isTarget = hoverTarget?.targetId === c.id;

      let iconoTipo = def?.icon || 'box';
      let tagTipo = def?.type || c.tipo;

      return (
        <div key={c.id} className="relative">
          {/* Indicador de soltado en el árbol de capas */}
          {isTarget && (
            <div
              className={`absolute left-0 right-0 z-20 pointer-events-none ${
                hoverTarget.position === 'before'
                  ? 'top-0 h-0.5 bg-blue-500 shadow-md'
                  : hoverTarget.position === 'after'
                  ? 'bottom-0 h-0.5 bg-blue-500 shadow-md'
                  : 'inset-0 border border-blue-500 bg-blue-500/10 rounded'
              }`}
            />
          )}

          <div
            draggable
            onDragStart={(e) => handleLayerDragStart(e, c)}
            onDragOver={(e) => handleLayerDragOver(e, c, esContenedor)}
            onDrop={(e) => handleLayerDrop(e, c)}
            onClick={() => onSeleccionarComponente(c.id)}
            style={{ paddingLeft: `${profundidad * 16 + 8}px` }}
            className={`flex items-center justify-between py-1.5 pr-2.5 text-xs cursor-pointer select-none transition group ${
              esSeleccionado 
                ? 'bg-blue-600/25 text-blue-300 font-medium border-l-2 border-blue-500 shadow-sm' 
                : 'text-slate-300 hover:bg-slate-800/60'
            } ${isDragging && draggedItem?.id === c.id ? 'opacity-40' : ''}`}
          >
            <div className="flex items-center gap-1.5 truncate">
              {/* Botón de expandir / contraer para contenedores */}
              {esContenedor ? (
                <button
                  onClick={(e) => toggleCollapse(c.id, e)}
                  className="p-0.5 hover:bg-slate-700/60 rounded text-slate-400 hover:text-white"
                  title={estaColapsado ? 'Expandir' : 'Contraer'}
                >
                  <Icon
                    name={estaColapsado ? 'chevronRight' : 'chevronDown'}
                    className="w-3 h-3"
                  />
                </button>
              ) : (
                <div className="w-4 h-4" />
              )}

              <Icon name={iconoTipo} className={`w-3.5 h-3.5 shrink-0 ${esContenedor ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="truncate text-[11px]">{c.etiqueta || def?.name || c.tipo}</span>
              
              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800/80 text-slate-500 font-mono">
                {tagTipo}
              </span>

              {esContenedor && tieneHijos && (
                <span className="text-[9px] text-slate-500 font-mono">
                  ({c.hijos.length})
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <Icon name="grip" className="w-3 h-3 text-slate-500 cursor-grab" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEliminarComponente(c.id);
                }}
                className="text-slate-500 hover:text-red-400 p-0.5"
                title="Eliminar elemento"
              >
                <Icon name="trash" className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Subárbol recursivo de hijos si no está colapsado */}
          {esContenedor && tieneHijos && !estaColapsado && (
            <div className="border-l border-slate-800/60 ml-3">
              {renderizarNodosArbol(c.hijos, profundidad + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!componentes || componentes.length === 0) {
    return (
      <div className="p-4 text-center text-[11px] text-slate-500 select-none">
        No hay elementos en esta pantalla.
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden py-1 max-h-72 overflow-y-auto custom-scrollbar">
      {/* Elemento Raíz del Lienzo para selección directa */}
      <div
        onClick={() => onSeleccionarComponente('canvas')}
        className={`flex items-center justify-between px-2.5 py-1.5 cursor-pointer text-xs transition border-b border-slate-800/80 ${
          idComponenteSeleccionado === 'canvas'
            ? 'bg-blue-600/30 text-blue-300 font-semibold border-l-2 border-l-blue-500'
            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <Icon name="monitor" className="w-3.5 h-3.5 text-teal-400" />
          <span className="truncate">Lienzo Principal</span>
        </div>
        <span className="text-[9px] text-slate-500 font-mono">Frame</span>
      </div>

      {renderizarNodosArbol(componentes)}
    </div>
  );
};
