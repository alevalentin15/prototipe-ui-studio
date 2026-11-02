import React from 'react';
import { ProjectsTree } from './ProjectsTree.jsx';
import { ComponentLibrary } from './ComponentLibrary.jsx';

export const Sidebar = ({
  proyectos,
  pestanaActual,
  onCrearProyecto,
  onAgregarVista,
  onAbrirPestana,
  componentesReutilizables,
  componenteSeleccionado,
  onAgregarComponente
}) => {
  return (
    <aside className="w-72 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0">
      <ProjectsTree
        proyectos={proyectos}
        pestanaActual={pestanaActual}
        onCrearProyecto={onCrearProyecto}
        onAgregarVista={onAgregarVista}
        onAbrirPestana={onAbrirPestana}
      />
      <ComponentLibrary
        componentesReutilizables={componentesReutilizables}
        componenteSeleccionado={componenteSeleccionado}
        onAgregarComponente={onAgregarComponente}
      />
    </aside>
  );
};
