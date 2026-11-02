import React from 'react';
import { Icon } from '../../common/Icon.jsx';
import { resolveM3Color } from '../../../theme/materialTheme.js';

export const DialogOverlay = ({ activo, onClose, onConfirm, children, modoTema, paletaPersonalizada }) => {
  if (!activo?.abierto) return null;
  const view = activo.vista || {};
  const surface = resolveM3Color(view.bg || 'surface', modoTema, paletaPersonalizada);
  const text = resolveM3Color(view.textColor || 'onSurface', modoTema, paletaPersonalizada);
  const primary = resolveM3Color(view.primaryButtonColor || 'primary', modoTema, paletaPersonalizada);
  const secondary = resolveM3Color(view.cancelButtonColor || 'surfaceVariant', modoTema, paletaPersonalizada);
  const scrim = view.backdropColor ? resolveM3Color(view.backdropColor, modoTema, paletaPersonalizada) : 'rgba(0,0,0,.68)';
  const mostrarAcciones = view.showCancelButton !== false || view.showConfirmButton !== false;

  return (
    <div className="absolute inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ background: scrim }} onClick={e => { if (e.target === e.currentTarget && view.closeOnOutside !== false) onClose(); }}>
      <div className="border w-full space-y-3 shadow-2xl" style={{ background: surface, color: text, borderColor: resolveM3Color(view.outlineColor || 'outlineVariant', modoTema, paletaPersonalizada), borderRadius: view.borderRadius || '16px', padding: view.overlayPadding || '20px', width: view.dialogWidth || '420px', maxWidth: '100%' }}>
        {(activo.mostrarTitulo !== false || view.showCloseButton !== false) && <div className="flex justify-between items-center">
          {activo.mostrarTitulo !== false ? <h4 className="font-bold text-sm">{activo.titulo}</h4> : <span />}
          {view.showCloseButton !== false && <button onClick={onClose} className="opacity-70 hover:opacity-100" aria-label="Cerrar"><Icon name="x" className="w-4 h-4" /></button>}
        </div>}
        {children?.length ? <div className="space-y-3 max-h-[60vh] overflow-auto">{children}</div> : <p className="text-xs opacity-80">{activo.contenido}</p>}
        {mostrarAcciones && <div className="flex gap-2 justify-end pt-2">
          {view.showCancelButton !== false && <button onClick={onClose} className="px-3 py-1.5 text-xs rounded" style={{ background: secondary, color: text }}>{view.cancelText || 'Cancelar'}</button>}
          {view.showConfirmButton !== false && <button onClick={onConfirm} className="px-3 py-1.5 text-xs rounded font-medium" style={{ background: primary, color: resolveM3Color(view.confirmTextColor || 'onPrimary', modoTema, paletaPersonalizada) }}>{view.confirmText || 'Aceptar'}</button>}
        </div>}
      </div>
    </div>
  );
};
