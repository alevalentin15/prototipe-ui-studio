import React, { useRef } from 'react';
import { Icon } from '../common/Icon.jsx';
import { CanvasTabs } from './CanvasTabs.jsx';
import { CanvasToolbar } from './CanvasToolbar.jsx';
import { DeviceFrame } from './DeviceFrame.jsx';

export const CanvasArea = ({
  pestanasAbiertas,
  pestanaActiva,
  proyectos,
  vistaActual,
  nivelZoom,
  modoVistaPrevia,
  modoTema = 'claro',
  paletaPersonalizada = null,
  idComponenteSeleccionado,
  bottomSheetActivo,
  dialogoActivo,
  onSeleccionarPestana,
  onCerrarPestana,
  onCambiarZoom,
  onToggleModoTema,
  onSeleccionarComponente,
  onEliminarComponente,
  onEjecutarAccion,
  onCloseBottomSheet,
  onCloseDialogo,
  onConfirmDialogo
}) => {
  const pinchStart = useRef(null);
  const frameWidth = vistaActual?.fitContent ? null : (vistaActual?.ancho || 375);
  const frameHeight = vistaActual?.fitContent ? null : (vistaActual?.alto || 812);
  const zoomRatio = nivelZoom / 100;

  const handleCanvasWheel = (e) => {
    // Trackpad pinch emite Ctrl+wheel en Chromium; Ctrl+wheel también sirve con mouse.
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    onCambiarZoom(Math.min(200, Math.max(25, Math.round(nivelZoom * Math.exp(-e.deltaY * 0.01)))));
  };

  const touchDistance = (touches) => Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      pinchStart.current = { distance: touchDistance(e.touches), zoom: nivelZoom };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length !== 2 || !pinchStart.current) return;
    e.preventDefault();
    const ratio = touchDistance(e.touches) / pinchStart.current.distance;
    onCambiarZoom(Math.min(200, Math.max(25, Math.round(pinchStart.current.zoom * ratio))));
  };

  const handleTouchEnd = () => {
    pinchStart.current = null;
  };

  return (
    <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
      {/* Barra de Pestañas de Vistas */}
      <CanvasTabs
        pestanasAbiertas={pestanasAbiertas}
        pestanaActiva={pestanaActiva}
        proyectos={proyectos}
        onSeleccionarPestana={onSeleccionarPestana}
        onCerrarPestana={onCerrarPestana}
      />

      {/* Barra de Control del Canvas */}
      <CanvasToolbar
        vistaActual={vistaActual}
        nivelZoom={nivelZoom}
        modoTema={modoTema}
        onCambiarZoom={onCambiarZoom}
        onToggleModoTema={onToggleModoTema}
      />

      {/* Superficie del Lienzo / Canvas */}
      <div
        className="flex-1 overflow-auto p-8 flex justify-center items-start bg-grid-pattern cursor-default"
        onClick={() => !modoVistaPrevia && onSeleccionarComponente('canvas')}
        onWheelCapture={handleCanvasWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-x pan-y' }}
      >
        {vistaActual ? (
          <div
            style={{
              width: frameWidth ? `${frameWidth * zoomRatio}px` : undefined,
              height: frameHeight ? `${frameHeight * zoomRatio}px` : undefined,
              flex: '0 0 auto'
            }}
          >
          <div
            style={{
              transform: `scale(${nivelZoom / 100})`,
              transformOrigin: 'top left',
              transition: 'transform 0.1s ease-out',
              width: frameWidth ? `${frameWidth}px` : undefined,
              height: frameHeight ? `${frameHeight}px` : undefined
            }}
          >
            <DeviceFrame
              vistaActual={vistaActual}
              modoVistaPrevia={modoVistaPrevia}
              modoTema={modoTema}
              paletaPersonalizada={paletaPersonalizada}
              idComponenteSeleccionado={idComponenteSeleccionado}
              onSeleccionarComponente={onSeleccionarComponente}
              onEliminarComponente={onEliminarComponente}
              onEjecutarAccion={onEjecutarAccion}
              bottomSheetActivo={bottomSheetActivo}
              onCloseBottomSheet={onCloseBottomSheet}
              dialogoActivo={dialogoActivo}
              onCloseDialogo={onCloseDialogo}
              onConfirmDialogo={onConfirmDialogo}
            />
          </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Icon name="layers" className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">Selecciona una vista para comenzar a editar.</p>
          </div>
        )}
      </div>
    </main>
  );
};
