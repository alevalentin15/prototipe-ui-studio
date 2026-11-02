import React from 'react';
import { Icon } from '../../common/Icon.jsx';

export const BottomSheetOverlay = ({ activo, onClose, children }) => {
  if (!activo?.abierto) return null;

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end">
      <div className="bg-slate-900 border-t border-slate-700 rounded-t-2xl p-5 space-y-3">
        <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-2" />
        <div className="flex justify-between items-center">
          {activo.mostrarTitulo !== false && <h4 className="font-bold text-sm text-slate-100">{activo.titulo}</h4>}
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
        {children?.length ? <div className="space-y-3 max-h-[60vh] overflow-auto">{children}</div> : <p className="text-xs text-slate-300 whitespace-pre-line">{activo.contenido}</p>}
        <button
          onClick={onClose}
          className="w-full py-2 bg-blue-600 text-white font-medium text-xs rounded-lg shadow hover:bg-blue-500"
        >
          Cerrar Ventana
        </button>
      </div>
    </div>
  );
};
