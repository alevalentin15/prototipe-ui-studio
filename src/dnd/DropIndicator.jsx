import React from 'react';

/**
 * Indicador visual de inserción para Drag & Drop tipo Figma.
 * Muestra la línea de inserción (antes / después) con punto guía o resaltado del contenedor.
 */
export const DropIndicator = ({ position, orientation = 'vertical', isValid = true }) => {
  if (!position) return null;

  const colorClase = isValid ? 'bg-blue-500 shadow-blue-500/50' : 'bg-red-500 shadow-red-500/50';
  const ringColor = isValid ? 'border-blue-500 bg-blue-500/10' : 'border-red-500 bg-red-500/10';

  // Resaltado de contenedor al soltar dentro
  if (position === 'inside') {
    return (
      <div className={`pointer-events-none absolute inset-0 border-2 border-dashed ${ringColor} rounded-xl z-30 transition-all duration-150 animate-pulse flex items-center justify-center`}>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded shadow ${isValid ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
          {isValid ? 'Soltar dentro' : 'Destino inválido'}
        </span>
      </div>
    );
  }

  // Línea horizontal para distribuciones verticales (Column o Canvas root)
  if (orientation === 'vertical') {
    const posicionVertical = position === 'before' ? '-top-1.5' : '-bottom-1.5';
    return (
      <div className={`pointer-events-none absolute left-0 right-0 ${posicionVertical} h-1 ${colorClase} z-40 rounded-full shadow-lg transition-all`}>
        <div className={`absolute -left-1.5 -top-1 w-3 h-3 rounded-full ${colorClase} ring-2 ring-white`} />
        <div className={`absolute -right-1.5 -top-1 w-3 h-3 rounded-full ${colorClase} ring-2 ring-white`} />
      </div>
    );
  }

  // Línea vertical para distribuciones horizontales (Row)
  const posicionHorizontal = position === 'before' ? '-left-1.5' : '-right-1.5';
  return (
    <div className={`pointer-events-none absolute top-0 bottom-0 ${posicionHorizontal} w-1 ${colorClase} z-40 rounded-full shadow-lg transition-all`}>
      <div className={`absolute -top-1.5 -left-1 w-3 h-3 rounded-full ${colorClase} ring-2 ring-white`} />
      <div className={`absolute -bottom-1.5 -left-1 w-3 h-3 rounded-full ${colorClase} ring-2 ring-white`} />
    </div>
  );
};
