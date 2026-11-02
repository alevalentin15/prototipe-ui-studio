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
      dispositivo: 'web', ancho: item.tipo === 'dialog' ? 420 : 375, alto: item.tipo === 'dialog' ? 320 : 360,
      padding: 16, gap: 12, direccion: 'column', bg: 'surface',
      componentes: item.componentes || (item.contenido ? [{ id: `${item.id}-content`, tipo: 'Text', etiqueta: 'Contenido', props: { texto: item.contenido, width: '100%' } }] : [])
    }));
    return { ...proyecto, vistas: [...vistasExistentes, ...overlaysLegacy], tema: {
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
