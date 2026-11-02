import React from 'react';
import { Icon } from '../common/Icon.jsx';

export const ProjectsTree = ({
  proyectos,
  pestanaActual,
  onCrearProyecto,
  onAgregarVista,
  onAbrirPestana
}) => {
  return (
    <div className="flex-1 overflow-y-auto border-b border-slate-800 p-3">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Icon name="folder" className="w-3.5 h-3.5 text-blue-400" />
          Proyectos y Vistas
        </span>
        <button
          onClick={onCrearProyecto}
          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
          title="Crear Nuevo Proyecto"
        >
          <Icon name="plus" className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {proyectos.map(proj => (
          <div key={proj.id} className="rounded-lg bg-slate-950/50 border border-slate-800/80 overflow-hidden">
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-800/50 text-xs font-semibold text-slate-200">
              <span className="truncate">{proj.nombre}</span>
              <button
                onClick={() => onAgregarVista(proj.id)}
                className="p-0.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                title="Agregar Vista/Pantalla"
              >
                <Icon name="plus" className="w-3 h-3" />
              </button>
            </div>
            <div className="py-1">
              {proj.vistas.map(v => (
                <div
                  key={v.id}
                  onClick={() => onAbrirPestana(proj.id, v.id)}
                  className={`flex items-center justify-between px-3 py-1.5 text-xs cursor-pointer transition ${
                    pestanaActual?.vistaId === v.id 
                      ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500 font-medium' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon name={v.dispositivo === 'movil' ? 'mobile' : 'monitor'} className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="truncate">{v.nombre}</span>
                  </div>
                  <span className="text-[10px] text-slate-600 uppercase">{v.dispositivo}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
