import React, { createContext, useContext, useState, useCallback } from 'react';

const DndContext = createContext(null);

export const DndProvider = ({ children, onInsertComponent, onMoveComponent, canAcceptDrop }) => {
  // Estado del arrastre activo
  const [dragState, setDragState] = useState({
    isDragging: false,
    source: null, // 'palette' | 'canvas' | 'layers'
    draggedItem: null, // { type, id?, etiqueta?, defaultProps?, ... }
    hoverTarget: null  // { targetId, position: 'before' | 'after' | 'inside', orientation: 'vertical' | 'horizontal', isValid: boolean }
  });

  const startDrag = useCallback((source, draggedItem) => {
    setDragState({
      isDragging: true,
      source,
      draggedItem,
      hoverTarget: null
    });
  }, []);

  const updateHoverTarget = useCallback((hoverTarget) => {
    setDragState(prev => {
      // Evitar re-renders si el hoverTarget es idéntico
      if (
        prev.hoverTarget?.targetId === hoverTarget?.targetId &&
        prev.hoverTarget?.position === hoverTarget?.position &&
        prev.hoverTarget?.isValid === hoverTarget?.isValid
      ) {
        return prev;
      }
      return { ...prev, hoverTarget };
    });
  }, []);

  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      source: null,
      draggedItem: null,
      hoverTarget: null
    });
  }, []);

  const handleDrop = useCallback((targetId, position = 'inside') => {
    if (!dragState.isDragging || !dragState.draggedItem) {
      endDrag();
      return;
    }

    const { source, draggedItem } = dragState;

    // 1. Caso arrastre desde la biblioteca -> Inserción de nueva instancia
    if (source === 'palette') {
      if (onInsertComponent) {
        onInsertComponent(draggedItem, targetId, position);
      }
    } 
    // 2. Caso arrastre dentro del canvas o capas -> Movimiento de instancia existente
    else if (source === 'canvas' || source === 'layers') {
      if (onMoveComponent && draggedItem.id) {
        onMoveComponent(draggedItem.id, targetId, position);
      }
    }

    endDrag();
  }, [dragState, onInsertComponent, onMoveComponent, endDrag]);

  return (
    <DndContext.Provider
      value={{
        ...dragState,
        startDrag,
        updateHoverTarget,
        endDrag,
        handleDrop,
        canAcceptDrop
      }}
    >
      {children}
    </DndContext.Provider>
  );
};

export const useStudioDnd = () => {
  const context = useContext(DndContext);
  if (!context) {
    throw new Error('useStudioDnd debe ser utilizado dentro de un DndProvider');
  }
  return context;
};
