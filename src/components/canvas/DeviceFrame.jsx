import React, { useRef } from 'react';
import { Icon } from '../common/Icon.jsx';
import { CanvasRenderer } from './CanvasRenderer.jsx';
import { BottomSheetOverlay } from './overlays/BottomSheetOverlay.jsx';
import { DialogOverlay } from './overlays/DialogOverlay.jsx';
import { useStudioDnd } from '../../dnd/DndContext.jsx';
import { DropIndicator } from '../../dnd/DropIndicator.jsx';
import { getContrastingTextColor, resolveM3Color, resolveM3StyleValue } from '../../theme/materialTheme.js';

export const DeviceFrame = ({
  vistaActual,
  sharedTopBar,
  sharedBottomBar,
  modoVistaPrevia,
  modoTema = 'claro',
  paletaPersonalizada = null,
  idComponenteSeleccionado,
  onSeleccionarComponente,
  onEliminarComponente,
  onEjecutarAccion,
  onActualizarProp,
  onDeviceBack,
  onDeviceHome,
  onDeviceRecent,
  bottomSheetActivo,
  onCloseBottomSheet,
  dialogoActivo,
  onCloseDialogo,
  onConfirmDialogo
}) => {
  const { isDragging, hoverTarget, updateHoverTarget, handleDrop, endDrag } = useStudioDnd();
  const gestureStart = useRef(null);

  if (!vistaActual) return null;

  const isRootHovered = hoverTarget?.targetId === 'canvas-root';
  const esLienzoSeleccionado = idComponenteSeleccionado === 'canvas' && !modoVistaPrevia;

  // Resolución de fondo (Soporte M3 Tokens, Transparente, Gradiente o Imagen)
  const esTransparente = Boolean(vistaActual.esTransparente);
  const bgColorRaw = esTransparente ? 'transparent' : (vistaActual.bg || 'background');
  const resolvedBgColor = resolveM3Color(bgColorRaw, modoTema, paletaPersonalizada);

  // Espaciado individual (4 lados) con fallback a padding general
  const padTop = vistaActual.paddingTop !== undefined ? `${vistaActual.paddingTop}px` : (vistaActual.padding !== undefined ? `${vistaActual.padding}px` : '0px');
  const padBottom = vistaActual.paddingBottom !== undefined ? `${vistaActual.paddingBottom}px` : (vistaActual.padding !== undefined ? `${vistaActual.padding}px` : '0px');
  const padLeft = vistaActual.paddingLeft !== undefined ? `${vistaActual.paddingLeft}px` : (vistaActual.padding !== undefined ? `${vistaActual.padding}px` : '0px');
  const padRight = vistaActual.paddingRight !== undefined ? `${vistaActual.paddingRight}px` : (vistaActual.padding !== undefined ? `${vistaActual.padding}px` : '0px');

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
  const statusBarVisible = vistaActual.dispositivo === 'movil' && vistaActual.statusBarVisible !== false;
  const statusBarHeight = statusBarVisible ? Number(vistaActual.statusBarHeight ?? 24) : 0;
  const navigationMode = vistaActual.navigationMode || 'buttons';
  const navigationBarHeight = vistaActual.dispositivo === 'movil' && navigationMode !== 'none' ? (navigationMode === 'gestures' ? 18 : 28) : 0;
  const topLocalBar = vistaActual.componentes.find(cmp => cmp.props?.fixedPosition === 'top' && !['all', 'selected'].includes(cmp.props?.applyToScreens));
  const bottomLocalBar = vistaActual.componentes.find(cmp => cmp.props?.fixedPosition === 'bottom' && !['all', 'selected'].includes(cmp.props?.applyToScreens));
  const barHeight = (cmp, fallback) => {
    const parsed = Number.parseFloat(cmp?.props?.height);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };
  const localTopInset = sharedTopBar ? 0 : (topLocalBar ? barHeight(topLocalBar, 56) : 0);
  const localBottomInset = sharedBottomBar ? 0 : (bottomLocalBar ? barHeight(bottomLocalBar, 64) : 0);
  const topOffset = cmp => cmp.props?.fixedOffset !== undefined ? cmp.props.fixedOffset : statusBarHeight;
  const bottomOffset = cmp => cmp.props?.fixedOffset !== undefined ? cmp.props.fixedOffset : navigationBarHeight;
  const withDeviceOffsets = cmp => ({ ...cmp, props: { ...cmp.props, fixedOffset: cmp.props?.fixedPosition === 'top' ? topOffset(cmp) : cmp.props?.fixedPosition === 'bottom' ? bottomOffset(cmp) : cmp.props?.fixedOffset } });
  const browserVisible = vistaActual.dispositivo === 'web' && vistaActual.browserBarVisible !== false;
  const navigationBg = resolveM3Color(vistaActual.navigationBarBg || 'surface', modoTema, paletaPersonalizada);
  const navigationColor = vistaActual.navigationBarContentColor && vistaActual.navigationBarContentColor !== 'auto'
    ? resolveM3Color(vistaActual.navigationBarContentColor, modoTema, paletaPersonalizada)
    : getContrastingTextColor(navigationBg);
  const contentPaddingTop = `calc(${padTop} + ${localTopInset}px)`;
  const contentPaddingBottom = `calc(${padBottom} + ${localBottomInset}px)`;
  const handleTouchStart = event => {
    if (modoVistaPrevia && navigationMode === 'gestures' && event.touches.length === 1) gestureStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY, left: event.currentTarget.getBoundingClientRect().left };
  };
  const handleTouchEnd = event => {
    if (!gestureStart.current) return;
    const touch = event.changedTouches[0];
    if (gestureStart.current.x - gestureStart.current.left < 28 && touch.clientX - gestureStart.current.x > 60 && Math.abs(touch.clientY - gestureStart.current.y) < 80) onDeviceBack?.();
    gestureStart.current = null;
  };

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
    paddingTop: contentPaddingTop,
    paddingBottom: contentPaddingBottom,
    paddingLeft: padLeft,
    paddingRight: padRight,
    overflowX,
    overflowY,
    overscrollBehavior: 'contain',
    scrollbarGutter: 'auto',
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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
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
        {statusBarVisible && (
          <div
            className="device-status-bar w-full flex justify-between items-center text-[10px] px-3 shrink-0 select-none pointer-events-none"
            style={{ height: `${statusBarHeight}px`, minHeight: `${statusBarHeight}px`, backgroundColor: statusBarBackground, color: statusBarTextColor }}
          >
            <span>09:41</span>
            <div className="flex gap-1 font-mono">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {browserVisible && <div className="shrink-0 flex items-center gap-2 px-2 py-2 border-b border-slate-300 bg-slate-100 text-slate-700" onClick={e => e.stopPropagation()}>
          <button type="button" title="Atrás" onClick={onDeviceBack} className="p-1 hover:bg-slate-200 rounded"><Icon name="arrowLeft" /></button>
          <button type="button" title="Adelante" className="p-1 hover:bg-slate-200 rounded"><Icon name="chevronRight" /></button>
          <button type="button" title="Recargar" onClick={() => {}} className="p-1 hover:bg-slate-200 rounded"><Icon name="circle" /></button>
          <div className="flex-1 rounded-full bg-white border border-slate-300 px-3 py-1 text-[10px] truncate">{vistaActual.browserUrl || 'https://ejemplo.com'}</div>
          <button type="button" title="Más opciones" className="p-1 hover:bg-slate-200 rounded"><Icon name="moreVertical" /></button>
        </div>}

        {sharedTopBar && <div className="w-full shrink-0"><CanvasRenderer key={`shared-top-${sharedTopBar.component.id}`} cmp={{ ...sharedTopBar.component, props: { ...sharedTopBar.component.props, fixedPosition: '' } }} idComponenteSeleccionado={idComponenteSeleccionado} modoVistaPrevia={modoVistaPrevia} parentOrientation="vertical" modoTema={modoTema} paletaPersonalizada={paletaPersonalizada} onSeleccionarComponente={onSeleccionarComponente} onEliminarComponente={onEliminarComponente} onEjecutarAccion={onEjecutarAccion} onActualizarProp={onActualizarProp} /></div>}

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
          vistaActual.componentes.filter(cmp => !(['topappbar', 'appbar', 'navigationbar', 'bottomnav', 'bottomappbar'].includes(String(cmp.tipo).toLowerCase()) && ['all', 'selected'].includes(cmp.props?.applyToScreens))).map(cmp => (
            <CanvasRenderer
              key={cmp.id}
              cmp={withDeviceOffsets(cmp)}
              idComponenteSeleccionado={idComponenteSeleccionado}
              modoVistaPrevia={modoVistaPrevia}
              parentOrientation={vistaActual.direccion === 'row' ? 'horizontal' : 'vertical'}
              modoTema={modoTema}
              paletaPersonalizada={paletaPersonalizada}
              onSeleccionarComponente={onSeleccionarComponente}
              onEliminarComponente={onEliminarComponente}
              onEjecutarAccion={onEjecutarAccion}
              onActualizarProp={onActualizarProp}
            />
          ))
        )}
        </div>

        {sharedBottomBar && <div className="w-full shrink-0"><CanvasRenderer key={`shared-bottom-${sharedBottomBar.component.id}`} cmp={{ ...sharedBottomBar.component, props: { ...sharedBottomBar.component.props, fixedPosition: '' } }} idComponenteSeleccionado={idComponenteSeleccionado} modoVistaPrevia={modoVistaPrevia} parentOrientation="vertical" modoTema={modoTema} paletaPersonalizada={paletaPersonalizada} onSeleccionarComponente={onSeleccionarComponente} onEliminarComponente={onEliminarComponente} onEjecutarAccion={onEjecutarAccion} onActualizarProp={onActualizarProp} /></div>}

        {vistaActual.dispositivo === 'movil' && navigationMode !== 'none' && <div className="shrink-0 flex items-center justify-center select-none" style={{ height: `${navigationBarHeight}px`, minHeight: `${navigationBarHeight}px`, background: navigationBg, color: navigationColor }}>
          {navigationMode === 'gestures' ? <button type="button" aria-label="Inicio" onClick={onDeviceHome} className="w-32 h-1.5 rounded-full" style={{ background: navigationColor }} /> : <div className="w-full flex items-center justify-around">
            <button type="button" aria-label="Atrás" onClick={onDeviceBack} className="p-1"><Icon name="arrowLeft" className="w-4 h-4" /></button>
            <button type="button" aria-label="Inicio" onClick={onDeviceHome} className="p-1"><Icon name="circle" className="w-4 h-4" /></button>
            <button type="button" aria-label="Aplicaciones recientes" onClick={onDeviceRecent} className="p-1"><Icon name="square" className="w-4 h-4" /></button>
          </div>}
        </div>}

        {/* Overlays Interactivos para Vista Previa */}
        <BottomSheetOverlay
          activo={bottomSheetActivo}
          onClose={onCloseBottomSheet}
          modoTema={modoTema}
          paletaPersonalizada={paletaPersonalizada}
        >{bottomSheetActivo?.vista?.componentes?.map(cmp => <CanvasRenderer key={cmp.id} cmp={cmp} idComponenteSeleccionado={null} modoVistaPrevia={true} parentOrientation="vertical" modoTema={modoTema} paletaPersonalizada={paletaPersonalizada} onSeleccionarComponente={onSeleccionarComponente} onEliminarComponente={onEliminarComponente} onEjecutarAccion={onEjecutarAccion} onActualizarProp={onActualizarProp} />)}</BottomSheetOverlay>

        <DialogOverlay
          activo={dialogoActivo}
          onClose={onCloseDialogo}
          onConfirm={onConfirmDialogo}
          modoTema={modoTema}
          paletaPersonalizada={paletaPersonalizada}
        >{dialogoActivo?.vista?.componentes?.map(cmp => <CanvasRenderer key={cmp.id} cmp={cmp} idComponenteSeleccionado={null} modoVistaPrevia={true} parentOrientation="vertical" modoTema={modoTema} paletaPersonalizada={paletaPersonalizada} onSeleccionarComponente={onSeleccionarComponente} onEliminarComponente={onEliminarComponente} onEjecutarAccion={onEjecutarAccion} onActualizarProp={onActualizarProp} />)}</DialogOverlay>
      </div>
    </div>
  );
};

