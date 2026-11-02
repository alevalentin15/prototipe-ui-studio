import React from 'react';
import { Icon } from '../common/Icon.jsx';
import { CanvasRenderer } from './CanvasRenderer.jsx';
import { BottomSheetOverlay } from './overlays/BottomSheetOverlay.jsx';
import { DialogOverlay } from './overlays/DialogOverlay.jsx';
import { useStudioDnd } from '../../dnd/DndContext.jsx';
import { DropIndicator } from '../../dnd/DropIndicator.jsx';
import { getContrastingTextColor, resolveM3Color, resolveM3StyleValue } from '../../theme/materialTheme.js';

export const DeviceFrame = ({
  vistaActual,
  modoVistaPrevia,
  modoTema = 'claro',
  paletaPersonalizada = null,
  idComponenteSeleccionado,
  onSeleccionarComponente,
  onEliminarComponente,
  onEjecutarAccion,
  bottomSheetActivo,
  onCloseBottomSheet,
  dialogoActivo,
  onCloseDialogo,
  onConfirmDialogo
}) => {
  const { isDragging, hoverTarget, updateHoverTarget, handleDrop, endDrag } = useStudioDnd();

  if (!vistaActual) return null;

  const isRootHovered = hoverTarget?.targetId === 'canvas-root';
  const esLienzoSeleccionado = idComponenteSeleccionado === 'canvas' && !modoVistaPrevia;

  // Resolución de fondo (Soporte M3 Tokens, Transparente, Gradiente o Imagen)
  const esTransparente = Boolean(vistaActual.esTransparente);
  const bgColorRaw = esTransparente ? 'transparent' : (vistaActual.bg || 'background');
  const resolvedBgColor = resolveM3Color(bgColorRaw, modoTema, paletaPersonalizada);

  // Espaciado individual (4 lados) con fallback a padding general
  const padTop = vistaActual.paddingTop !== undefined ? `${vistaActual.paddingTop}px` : (vistaActual.padding !== undefined ? `${vistaActual.padding}px` : '16px');
  const padBottom = vistaActual.paddingBottom !== undefined ? `${vistaActual.paddingBottom}px` : (vistaActual.padding !== undefined ? `${vistaActual.padding}px` : '16px');
  const padLeft = vistaActual.paddingLeft !== undefined ? `${vistaActual.paddingLeft}px` : (vistaActual.padding !== undefined ? `${vistaActual.padding}px` : '16px');
  const padRight = vistaActual.paddingRight !== undefined ? `${vistaActual.paddingRight}px` : (vistaActual.padding !== undefined ? `${vistaActual.padding}px` : '16px');

  // Dimensiones
  const anchoEstilo = vistaActual.fitContent ? 'auto' : (vistaActual.ancho ? `${vistaActual.ancho}px` : '375px');
  const altoEstilo = vistaActual.fitContent ? 'auto' : (vistaActual.alto ? `${vistaActual.alto}px` : 'auto');

  // Control de scroll y overflow
  const overflowX = vistaActual.scrollHorizontal ? 'auto' : (vistaActual.overflow || 'hidden');
  const overflowY = vistaActual.scrollVertical ? 'auto' : (vistaActual.overflow || 'auto');
  const statusBarBackground = resolveM3Color(vistaActual.statusBarBg || 'transparent', modoTema, paletaPersonalizada);
  const statusBarContrastBackground = statusBarBackground === 'transparent'
    ? (resolvedBgColor === 'transparent' ? resolveM3Color('surface', modoTema, paletaPersonalizada) : resolvedBgColor)
    : statusBarBackground;
  const statusBarTextColor = vistaActual.statusBarContentColor && vistaActual.statusBarContentColor !== 'auto'
    ? resolveM3Color(vistaActual.statusBarContentColor, modoTema, paletaPersonalizada)
    : getContrastingTextColor(statusBarContrastBackground);

  // Estilos del contenedor del Lienzo
  const estiloLienzo = {
    width: anchoEstilo,
    height: altoEstilo,
    minWidth: vistaActual.minWidth ? `${vistaActual.minWidth}px` : undefined,
    maxWidth: vistaActual.maxWidth ? `${vistaActual.maxWidth}px` : '100%',
    minHeight: vistaActual.minHeight ? `${vistaActual.minHeight}px` : (vistaActual.alto ? `${vistaActual.alto}px` : 'auto'),
    maxHeight: vistaActual.maxHeight ? `${vistaActual.maxHeight}px` : undefined,
    backgroundColor: resolvedBgColor,
    backgroundImage: vistaActual.gradient
      ? vistaActual.gradient
      : vistaActual.backgroundImage
        ? (vistaActual.backgroundImage.startsWith('url') ? vistaActual.backgroundImage : `url("${vistaActual.backgroundImage}")`)
        : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: vistaActual.opacity !== undefined ? vistaActual.opacity : 1,
    display: 'flex',
    flexDirection: 'column',
    border: resolveM3StyleValue(vistaActual.border, modoTema, paletaPersonalizada) || undefined,
    borderRadius: vistaActual.borderRadius !== undefined 
      ? `${vistaActual.borderRadius}px` 
      : (vistaActual.dispositivo === 'movil' ? '28px' : '12px'),
    boxShadow: vistaActual.sombra || undefined,
    overflow: 'hidden',
    boxSizing: 'border-box',
    position: 'relative'
  };

  const estiloContenido = {
    flex: '1 1 auto',
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
    flexDirection: vistaActual.direccion || 'column',
    gap: `${vistaActual.gap ?? 16}px`,
    paddingTop: padTop,
    paddingBottom: padBottom,
    paddingLeft: padLeft,
    paddingRight: padRight,
    overflowX,
    overflowY,
    overscrollBehavior: 'contain',
    scrollbarGutter: 'stable',
    boxSizing: 'border-box'
  };

  const handleCanvasDragOver = (e) => {
    if (modoVistaPrevia || !isDragging) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Los componentes detienen la propagaciÃ³n en su destino; aquÃ­ llegan los
    // espacios vacÃ­os, los gaps y el placeholder de un lienzo sin contenido.
    updateHoverTarget({
      targetId: 'canvas-root',
      position: 'inside',
      orientation: vistaActual.direccion === 'row' ? 'horizontal' : 'vertical',
      isValid: true
    });
  };

  const handleCanvasDrop = (e) => {
    if (modoVistaPrevia || !isDragging) return;
    e.preventDefault();
    if (hoverTarget?.targetId === 'canvas-root') {
      handleDrop('canvas-root', 'inside');
    } else {
      endDrag();
    }
  };

  const handleCanvasClick = (e) => {
    if (modoVistaPrevia) return;
    e.stopPropagation();
    // Selección del lienzo independiente
    onSeleccionarComponente('canvas');
  };

  return (
    <div className="relative">
      {/* Badge de selección del lienzo */}
      {esLienzoSeleccionado && (
        <div className="absolute -top-7 left-0 bg-blue-600 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-t flex items-center gap-1.5 shadow-md z-30 select-none">
          <Icon name="monitor" className="w-3.5 h-3.5" />
          <span>Lienzo Seleccionado: {vistaActual.nombre}</span>
        </div>
      )}

      <div
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
        onClick={handleCanvasClick}
        style={estiloLienzo}
        className={`canvas-surface transition-all duration-150 ${
          modoVistaPrevia 
            ? 'border-emerald-500/50 shadow-2xl shadow-emerald-950/40' 
            : esLienzoSeleccionado
              ? 'ring-2 ring-blue-500 shadow-2xl border-2 border-blue-400'
              : isRootHovered 
                ? 'border-blue-500 shadow-2xl ring-4 ring-blue-500/20' 
                : 'border-slate-800 shadow-2xl border-4'
        }`}
      >
        {/* Indicador de soltado en el marco raíz */}
        {isRootHovered && (
          <DropIndicator
            position="inside"
            orientation={vistaActual.direccion === 'row' ? 'horizontal' : 'vertical'}
            isValid={true}
          />
        )}

        {/* Barra de Estado Móvil Simulado */}
        {vistaActual.dispositivo === 'movil' && (
          <div
            className="device-status-bar w-full flex justify-between items-center text-[10px] px-3 shrink-0 select-none pointer-events-none"
            style={{ minHeight: '24px', backgroundColor: statusBarBackground, color: statusBarTextColor }}
          >
            <span>09:41</span>
            <div className="flex gap-1 font-mono">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Renderizado de Componentes o Estado Vacío */}
        <div className="device-content-scroll" style={estiloContenido}>
        {vistaActual.componentes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-700/50 rounded-xl my-auto select-none">
            <Icon name="box" className="w-8 h-8 text-slate-400 mb-2 opacity-60" />
            <p className="text-slate-500 text-xs font-medium">Lienzo Vacío</p>
            <p className="text-slate-400 text-[11px] mt-1">
              Arrastra componentes desde la biblioteca o haz clic sobre ellos para agregarlos.
            </p>
          </div>
        ) : (
          vistaActual.componentes.map(cmp => (
            <CanvasRenderer
              key={cmp.id}
              cmp={cmp}
              idComponenteSeleccionado={idComponenteSeleccionado}
              modoVistaPrevia={modoVistaPrevia}
              parentOrientation={vistaActual.direccion === 'row' ? 'horizontal' : 'vertical'}
              modoTema={modoTema}
              paletaPersonalizada={paletaPersonalizada}
              onSeleccionarComponente={onSeleccionarComponente}
              onEliminarComponente={onEliminarComponente}
              onEjecutarAccion={onEjecutarAccion}
            />
          ))
        )}
        </div>

        {/* Overlays Interactivos para Vista Previa */}
        <BottomSheetOverlay
          activo={bottomSheetActivo}
          onClose={onCloseBottomSheet}
        />

        <DialogOverlay
          activo={dialogoActivo}
          onClose={onCloseDialogo}
          onConfirm={onConfirmDialogo}
        />
      </div>
    </div>
  );
};
