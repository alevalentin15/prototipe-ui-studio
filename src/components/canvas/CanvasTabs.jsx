import React from 'react';
import { Icon } from '../common/Icon.jsx';

export const CanvasTabs = ({
  pestanasAbiertas,
  pestanaActiva,
  proyectos,
  onSeleccionarPestana,
  onCerrarPestana
}) => {
  return (
    <div className="h-10 bg-slate-900/80 border-b border-slate-800 flex items-center px-2 gap-1 overflow-x-auto shrink-0">
      {pestanasAbiertas.map((tab, idx) => {
        const p = proyectos.find(proj => proj.id === tab.proyectoId);
        const v = p?.vistas.find(vis => vis.id === tab.vistaId);
        if (!v) return null;
        const esActiva = pestanaActiva === idx;

        return (
          <div
            key={idx}
            onClick={() => onSeleccionarPestana(idx)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-md text-xs font-medium cursor-pointer transition border-t-2 ${
              esActiva 
                ? 'bg-slate-950 border-blue-500 text-slate-100 shadow-inner' 
                : 'bg-slate-900 border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <Icon name={v.dispositivo === 'movil' ? 'mobile' : 'monitor'} className="w-3.5 h-3.5 text-indigo-400" />
            <span>{v.nombre}</span>
            <button onClick={(e) => onCerrarPestana(idx, e)} className="hover:text-white">
              <Icon name="x" className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
