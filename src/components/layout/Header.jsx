import React from 'react';
import { Icon } from '../common/Icon.jsx';

export const Header = ({
  modoVistaPrevia,
  onToggleModoVistaPrevia,
  onExportarJSON,
  onImportarJSON
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between z-30 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 rounded-lg shadow-md">
          <Icon name="layers" className="w-5 h-5 text-white" />
          <span className="font-bold text-sm tracking-wide text-white">Prototipador UI Low-Code</span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">Español v2.0</span>
      </div>

      {/* Acciones del Sistema */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleModoVistaPrevia}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-medium text-xs transition ${
            modoVistaPrevia 
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400 shadow-lg' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          <Icon name="play" className="w-3.5 h-3.5" />
          {modoVistaPrevia ? 'Modo Interactivo' : 'Ejecutar Vista Previa'}
        </button>

        <div className="h-4 w-[1px] bg-slate-800 mx-1" />

        <button
          onClick={onExportarJSON}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 transition"
        >
          <Icon name="save" className="w-3.5 h-3.5" />
          Guardar Proyecto
        </button>

        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 cursor-pointer transition">
          <Icon name="upload" className="w-3.5 h-3.5" />
          Abrir (JSON)
          <input type="file" accept=".json" onChange={onImportarJSON} className="hidden" />
        </label>
      </div>
    </header>
  );
};
