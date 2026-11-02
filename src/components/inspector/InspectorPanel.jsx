import React, { useState } from 'react';
import { PropertiesTab } from './PropertiesTab.jsx';
import { ActionsTab } from './ActionsTab.jsx';
import { CanvasPropertiesTab } from './CanvasPropertiesTab.jsx';
import { LayersTree } from './LayersTree.jsx';
import { ResizeHandle } from '../common/ResizeHandle.jsx';

export const InspectorPanel = ({
  pestanaInspector,
  onCambiarPestanaInspector,
  componenteSeleccionado,
  vistaActual,
  proyectoActual,
  modoTema = 'claro',
  paletaPersonalizada = null,
  paletasTema = null,
  onActualizarProp,
  onGuardarComoReutilizable,
  onActualizarAccion,
  onActualizarOverlays,
  onCrearVistaOverlay,
  onActualizarVistaOverlay,
  onActualizarLienzo,
  onCambiarModoTema,
  onActualizarColorTema,
  idComponenteSeleccionado,
  onSeleccionarComponente,
  onEliminarComponente
}) => {
  const [width, setWidth] = useState(320);
  const esLienzoSeleccionado = idComponenteSeleccionado === 'canvas';

  return (
    <aside style={{ width }} className="relative bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
      <ResizeHandle className="absolute left-[-3px] top-0" direction="vertical" onResize={delta => {
        setWidth(Math.max(260, Math.min(560, width - delta)));
      }} />
      {/* Pestañas de Inspector */}
      <div className="h-10 border-b border-slate-800 flex items-center px-2 gap-1 bg-slate-900">
        <button
          onClick={() => {
            if (esLienzoSeleccionado) onSeleccionarComponente(null);
            onCambiarPestanaInspector('propiedades');
          }}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition ${
            pestanaInspector === 'propiedades'
              ? 'bg-slate-800 text-blue-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Propiedades
        </button>
        <button
          onClick={() => {
            if (esLienzoSeleccionado) onSeleccionarComponente(null);
            onCambiarPestanaInspector('acciones');
          }}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition ${
            pestanaInspector === 'acciones' 
                ? 'bg-slate-800 text-amber-400 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Acciones
        </button>
        <button
          onClick={() => {
            onSeleccionarComponente('canvas');
            onCambiarPestanaInspector('lienzo');
          }}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition ${
            pestanaInspector === 'lienzo'
              ? 'bg-slate-800 text-teal-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Lienzo
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* PROPIEDADES DEL LIENZO (CUANDO EL LIENZO ESTÁ SELECCIONADO O EN PESTAÑA LIENZO) */}
        {pestanaInspector === 'lienzo' && (
          <CanvasPropertiesTab
            vistaActual={vistaActual}
            proyectoActual={proyectoActual}
            modoTema={modoTema}
            paletaPersonalizada={paletaPersonalizada}
            paletasTema={paletasTema}
            onActualizarLienzo={onActualizarLienzo}
            onCambiarModoTema={onCambiarModoTema}
            onActualizarColorTema={onActualizarColorTema}
          />
        )}

        {/* CONFIGURACIÓN DE PROPIEDADES DEL COMPONENTE (CUANDO UN COMPONENTE ESTÁ SELECCIONADO) */}
        {pestanaInspector === 'propiedades' && (
          <PropertiesTab
            componenteSeleccionado={componenteSeleccionado}
            proyectoActual={proyectoActual}
            modoTema={modoTema}
            paletaPersonalizada={paletaPersonalizada}
            onActualizarProp={onActualizarProp}
            onGuardarComoReutilizable={onGuardarComoReutilizable}
          />
        )}

        {/* PROGRAMACIÓN DE ACCIONES / EVENTOS DEL COMPONENTE */}
        {pestanaInspector === 'acciones' && (
          <ActionsTab
            componenteSeleccionado={componenteSeleccionado}
            proyectoActual={proyectoActual}
            onActualizarAccion={onActualizarAccion}
            onActualizarOverlays={onActualizarOverlays}
            onCrearVistaOverlay={onCrearVistaOverlay}
            onActualizarVistaOverlay={onActualizarVistaOverlay}
          />
        )}

        {/* JERARQUÍA DE COMPONENTES DE LA VISTA */}
        {vistaActual && (
          <div className="pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Árbol de Capas de la Vista</span>
            <LayersTree
              componentes={vistaActual.componentes}
              idComponenteSeleccionado={idComponenteSeleccionado}
              onSeleccionarComponente={onSeleccionarComponente}
              onEliminarComponente={onEliminarComponente}
            />
          </div>
        )}
      </div>
    </aside>
  );
};
