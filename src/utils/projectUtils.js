import { proyectosIniciales } from '../data/initialProjects.js';

/** Completa el tema de proyectos anteriores y migra los ajustes globales heredados. */
export const normalizarTemasProyectos = (proyectos, { modoHeredado, paletaHeredada } = {}) => {
  const lista = Array.isArray(proyectos) ? proyectos : proyectosIniciales;

  return lista.map(proyecto => {
    const modo = modoHeredado || proyecto.tema?.modo || 'claro';
    const legacy = { ...(paletaHeredada || {}), ...(proyecto.tema?.paletaPersonalizada || {}) };
    const paletas = proyecto.tema?.paletas || {};
    const vistasExistentes = proyecto.vistas || [];
    const overlaysLegacy = (proyecto.overlays || []).filter(item => !vistasExistentes.some(view => view.id === item.id)).map(item => ({
      id: item.id,
      nombre: item.nombre || (item.tipo === 'dialog' ? 'Dialog personalizado' : 'Sheet personalizado'),
      tipoOverlay: item.tipo === 'dialog' ? 'dialog' : 'bottomsheet',
      titulo: item.titulo || '', mostrarTitulo: item.mostrarTitulo !== false,
      showCloseButton: item.showCloseButton !== false, closeOnOutside: item.closeOnOutside !== false,
      bg: item.bg || 'surface', textColor: item.textColor || 'onSurface', outlineColor: item.outlineColor || 'outlineVariant',
      backdropColor: item.backdropColor || 'rgba(0,0,0,.60)', borderRadius: item.borderRadius || '20px', overlayPadding: item.overlayPadding || '20px',
      showConfirmButton: item.showConfirmButton !== false, showCancelButton: item.showCancelButton !== false,
      showCloseActionButton: item.showCloseActionButton !== false, showHandle: item.showHandle !== false,
      primaryButtonColor: item.primaryButtonColor || 'primary', cancelButtonColor: item.cancelButtonColor || 'surfaceVariant', confirmTextColor: item.confirmTextColor || 'onPrimary',
      dispositivo: 'web', ancho: item.tipo === 'dialog' ? 420 : 375, alto: item.tipo === 'dialog' ? 320 : 360,
      padding: 16, gap: 12, direccion: 'column', bg: 'surface',
      componentes: item.componentes || (item.contenido ? [{ id: `${item.id}-content`, tipo: 'Text', etiqueta: 'Contenido', props: { texto: item.contenido, width: '100%' } }] : [])
    }));
    let vistas = [...vistasExistentes, ...overlaysLegacy];
    const vistasCreadasPorMigracion = [];
    const migrarComponentes = componentes => (componentes || []).map(componente => {
      const actualizado = { ...componente };
      if (proyecto.id === 'proj-1' && ['cmp-4', 'cmp-5'].includes(actualizado.id) && actualizado.props?.width === '100%') {
        actualizado.props = { ...actualizado.props, width: 'auto' };
      }
      if (actualizado.accion && ['dialog', 'bottomsheet'].includes(actualizado.accion.tipo)) {
        const targetId = actualizado.accion.vistaId || actualizado.accion.overlayId;
        if (targetId) actualizado.accion = { ...actualizado.accion, vistaId: targetId };
        else if (actualizado.accion.payload) {
          const id = `overlay-${actualizado.id}`;
          if (!vistas.some(view => view.id === id) && !vistasCreadasPorMigracion.some(view => view.id === id)) vistasCreadasPorMigracion.push({
            id, nombre: `${actualizado.accion.tipo === 'dialog' ? 'Dialog' : 'Sheet'} - ${actualizado.etiqueta || actualizado.id}`,
            tipoOverlay: actualizado.accion.tipo, titulo: actualizado.accion.tipo === 'dialog' ? 'Confirmación' : 'Opciones', mostrarTitulo: true,
            showCloseButton: true, closeOnOutside: true, bg: 'surface', textColor: 'onSurface', outlineColor: 'outlineVariant', backdropColor: 'rgba(0,0,0,.65)',
            borderRadius: actualizado.accion.tipo === 'dialog' ? '16px' : '20px', overlayPadding: '20px', showConfirmButton: true, showCancelButton: true,
            confirmText: 'Aceptar', cancelText: 'Cancelar', showCloseActionButton: true, closeText: 'Cerrar', showHandle: true,
            primaryButtonColor: 'primary', cancelButtonColor: 'surfaceVariant', confirmTextColor: 'onPrimary', handleColor: 'onSurfaceVariant',
            dispositivo: 'web', ancho: actualizado.accion.tipo === 'dialog' ? 420 : 375, alto: actualizado.accion.tipo === 'dialog' ? 320 : 360,
            padding: 16, gap: 12, direccion: 'column', bg: 'surface',
            componentes: [{ id: `${id}-content`, tipo: 'Text', etiqueta: 'Contenido', props: { texto: actualizado.accion.payload, width: 'auto' } }]
          });
          actualizado.accion = { ...actualizado.accion, vistaId: id };
        }
      }
      if (actualizado.hijos) actualizado.hijos = migrarComponentes(actualizado.hijos);
      return actualizado;
    });
    vistas = [...vistas.map(view => ({ ...view, componentes: migrarComponentes(view.componentes) })), ...vistasCreadasPorMigracion];
    return { ...proyecto, vistas, tema: {
      ...proyecto.tema, modo,
      paletas: {
        claro: { ...(paletas.claro || {}), ...(modo === 'claro' ? legacy : {}) },
        oscuro: { ...(paletas.oscuro || {}), ...(modo === 'oscuro' ? legacy : {}) }
      },
      paletaPersonalizada: legacy
    } };
  });
};

export const obtenerPaletaTema = (proyecto, modo = 'claro') => {
  const clave = modo === 'oscuro' ? 'oscuro' : 'claro';
  return { ...(proyecto?.tema?.paletas?.[clave] || {}) };
};
