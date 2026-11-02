import React from 'react';
import { Icon } from '../../common/Icon.jsx';
import { resolveM3Color } from '../../../theme/materialTheme.js';

export const BottomSheetOverlay = ({ activo, onClose, children, modoTema, paletaPersonalizada }) => {
  if (!activo?.abierto) return null;
  const view = activo.vista || {};
  const surface = resolveM3Color(view.bg || 'surface', modoTema, paletaPersonalizada);
  const text = resolveM3Color(view.textColor || 'onSurface', modoTema, paletaPersonalizada);
  const primary = resolveM3Color(view.primaryButtonColor || 'primary', modoTema, paletaPersonalizada);
  const scrim = view.backdropColor ? resolveM3Color(view.backdropColor, modoTema, paletaPersonalizada) : 'rgba(0,0,0,.60)';

  return (
    <div className="absolute inset-0 backdrop-blur-sm z-50 flex flex-col justify-end" style={{ background: scrim }} onClick={e => { if (e.target === e.currentTarget && view.closeOnOutside !== false) onClose(); }}>
      <div className="border-t space-y-3 max-h-[90%] overflow-auto" style={{ background: surface, color: text, borderColor: resolveM3Color(view.outlineColor || 'outlineVariant', modoTema, paletaPersonalizada), borderTopLeftRadius: view.borderRadius || '20px', borderTopRightRadius: view.borderRadius || '20px', padding: view.overlayPadding || '20px' }} onClick={e => e.stopPropagation()}>
        {view.showHandle !== false && <div className="w-12 h-1 rounded-full mx-auto mb-2 opacity-50" style={{ background: resolveM3Color(view.handleColor || 'onSurfaceVariant', modoTema, paletaPersonalizada) }} />}
        {(activo.mostrarTitulo !== false || view.showCloseButton !== false) && <div className="flex justify-between items-center">
          {activo.mostrarTitulo !== false ? <h4 className="font-bold text-sm">{activo.titulo}</h4> : <span />}
          {view.showCloseButton !== false && <button onClick={onClose} className="opacity-70 hover:opacity-100" aria-label="Cerrar"><Icon name="x" className="w-4 h-4" /></button>}
        </div>}
        {children?.length ? <div className="space-y-3 max-h-[60vh] overflow-auto">{children}</div> : <p className="text-xs opacity-80 whitespace-pre-line">{activo.contenido}</p>}
        {view.showCloseActionButton !== false && <button onClick={onClose} className="w-full py-2 font-medium text-xs rounded-lg shadow" style={{ background: primary, color: resolveM3Color(view.confirmTextColor || 'onPrimary', modoTema, paletaPersonalizada) }}>{view.closeText || 'Cerrar'}</button>}
      </div>
    </div>
  );
};
