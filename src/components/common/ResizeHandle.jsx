import React from 'react';

export const ResizeHandle = ({ direction = 'vertical', onResize, className = '' }) => {
  const horizontal = direction === 'horizontal';
  return <div
    role="separator"
    aria-orientation={horizontal ? 'horizontal' : 'vertical'}
    onPointerDown={event => {
      event.preventDefault();
      const start = horizontal ? event.clientY : event.clientX;
      const move = e => onResize((horizontal ? e.clientY : e.clientX) - start);
      const stop = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', stop, { once: true });
    }}
    className={`${horizontal ? 'h-1.5 w-full cursor-row-resize' : 'h-full w-1.5 cursor-col-resize'} shrink-0 z-30 bg-slate-800 hover:bg-blue-500 active:bg-blue-400 transition-colors ${className}`}
  />;
};
