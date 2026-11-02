import { proyectosIniciales } from '../data/initialProjects.js';

/** Completa el tema de proyectos anteriores y migra los ajustes globales heredados. */
export const normalizarTemasProyectos = (proyectos, { modoHeredado, paletaHeredada } = {}) => {
  const lista = Array.isArray(proyectos) ? proyectos : proyectosIniciales;

  return lista.map(proyecto => ({
    ...proyecto,
    tema: {
      modo: modoHeredado || proyecto.tema?.modo || 'claro',
      paletaPersonalizada: {
        ...(paletaHeredada || {}),
        ...(proyecto.tema?.paletaPersonalizada || {})
      }
    }
  }));
};
