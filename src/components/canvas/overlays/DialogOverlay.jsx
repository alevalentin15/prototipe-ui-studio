import React from 'react';
import { Icon } from '../../common/Icon.jsx';

export const DialogOverlay = ({ activo, onClose, onConfirm, children }) => {
  if (!activo?.abierto) return null;

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-xs w-full space-y-3 shadow-2xl">
        <div className="flex justify-between items-center">
          {activo.mostrarTitulo !== false && <h4 className="font-bold text-sm text-slate-100">{activo.titulo}</h4>}
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
        {children?.length ? <div className="space-y-3 max-h-[60vh] overflow-auto">{children}</div> : <p className="text-xs text-slate-300">{activo.contenido}</p>}
        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded font-medium hover:bg-emerald-500"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
