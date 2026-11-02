import React, { useState } from 'react';
import { ProjectsTree } from './ProjectsTree.jsx';
import { ComponentLibrary } from './ComponentLibrary.jsx';
import { ResizeHandle } from '../common/ResizeHandle.jsx';

export const Sidebar = ({
  proyectos,
  pestanaActual,
  onCrearProyecto,
  onAgregarVista,
  onEliminarProyecto,
  onEliminarVista,
  onAbrirPestana,
  componentesReutilizables,
  componenteSeleccionado,
  onAgregarComponente
}) => {
  const [width, setWidth] = useState(288);
  const [libraryHeight, setLibraryHeight] = useState(320);
  return (
    <aside style={{ width }} className="relative bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0">
      <ProjectsTree
        proyectos={proyectos}
        pestanaActual={pestanaActual}
        onCrearProyecto={onCrearProyecto}
        onAgregarVista={onAgregarVista}
        onEliminarProyecto={onEliminarProyecto}
        onEliminarVista={onEliminarVista}
        onAbrirPestana={onAbrirPestana}
      />
      <ResizeHandle direction="horizontal" onResize={delta => {
        setLibraryHeight(Math.max(160, Math.min(640, libraryHeight - delta)));
      }} />
      <ComponentLibrary
        height={libraryHeight}
        componentesReutilizables={componentesReutilizables}
        componenteSeleccionado={componenteSeleccionado}
        onAgregarComponente={onAgregarComponente}
      />
      <ResizeHandle className="absolute right-[-3px] top-0" direction="vertical" onResize={delta => {
        setWidth(Math.max(220, Math.min(520, width + delta)));
      }} />
    </aside>
  );
};
