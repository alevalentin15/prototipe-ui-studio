/**
 * UTILIDADES DE MANIPULACIÓN DEL ÁRBOL JERÁRQUICO
 * Operaciones inmutables para búsqueda, inserción, eliminación, movimiento y prevención de ciclos.
 */

/**
 * Busca recursivamente un componente por su ID en el árbol.
 */
export const buscarComponente = (lista, id) => {
  if (!lista || !Array.isArray(lista)) return null;
  for (let item of lista) {
    if (item.id === id) return item;
    if (item.hijos && item.hijos.length > 0) {
      const encontrado = buscarComponente(item.hijos, id);
      if (encontrado) return encontrado;
    }
  }
  return null;
};

/**
 * Busca el padre directo y el índice de un componente por su ID.
 * Retorna { padre: nodoPadre | null, index: number, esRaiz: boolean }
 */
export const buscarPadre = (lista, id) => {
  if (!lista || !Array.isArray(lista)) return null;

  // Verificar si está en la raíz
  const indexEnRaiz = lista.findIndex(item => item.id === id);
  if (indexEnRaiz !== -1) {
    return { padre: null, index: indexEnRaiz, esRaiz: true };
  }

  // Búsqueda recursiva en hijos
  for (let item of lista) {
    if (item.hijos && Array.isArray(item.hijos)) {
      const indexEnHijos = item.hijos.findIndex(h => h.id === id);
      if (indexEnHijos !== -1) {
        return { padre: item, index: indexEnHijos, esRaiz: false };
      }
      const resultadoSubarbol = buscarPadre(item.hijos, id);
      if (resultadoSubarbol) return resultadoSubarbol;
    }
  }

  return null;
};

/**
 * Verifica si idCandidatoHijo es el mismo idPadre o desciende de él.
 * CRÍTICO: Previene ciclos de anidamiento (un componente no puede contenerse a sí mismo).
 */
export const esDescendiente = (lista, idPadre, idCandidatoHijo) => {
  if (!idPadre || !idCandidatoHijo) return false;
  if (idPadre === idCandidatoHijo) return true;

  const nodoPadre = buscarComponente(lista, idPadre);
  if (!nodoPadre || !nodoPadre.hijos) return false;

  return Boolean(buscarComponente(nodoPadre.hijos, idCandidatoHijo));
};

/**
 * Actualiza un nodo en un árbol de componentes recursivo dado su id.
 */
export const actualizarEnArbol = (lista, id, callback) => {
  if (!lista || !Array.isArray(lista)) return [];
  return lista.map(item => {
    if (item.id === id) return callback(item);
    if (item.hijos && Array.isArray(item.hijos)) {
      return { ...item, hijos: actualizarEnArbol(item.hijos, id, callback) };
    }
    return item;
  });
};

/**
 * Elimina recursivamente un componente por su ID del árbol.
 */
export const eliminarEnArbol = (lista, id) => {
  if (!lista || !Array.isArray(lista)) return [];
  return lista
    .filter(item => item.id !== id)
    .map(item => ({
      ...item,
      hijos: item.hijos ? eliminarEnArbol(item.hijos, id) : undefined
    }));
};

/**
 * Inserta un nuevo elemento en el árbol.
 * Si idDestinoPadre es null o 'root', se inserta en la raíz.
 * Si index es null o negativo, se inserta al final.
 */
export const insertarEnArbol = (lista, nuevoItem, idDestinoPadre = null, index = -1) => {
  const clonLista = JSON.parse(JSON.stringify(lista || []));

  // Inserción en la raíz del canvas
  if (!idDestinoPadre || idDestinoPadre === 'root' || idDestinoPadre === 'canvas-root') {
    if (index === null || index === undefined || index < 0 || index >= clonLista.length) {
      return [...clonLista, nuevoItem];
    }
    const nuevaRaiz = [...clonLista];
    nuevaRaiz.splice(index, 0, nuevoItem);
    return nuevaRaiz;
  }

  // Inserción dentro de un contenedor específico
  return actualizarEnArbol(clonLista, idDestinoPadre, padre => {
    const hijosActuales = Array.isArray(padre.hijos) ? [...padre.hijos] : [];
    if (index === null || index === undefined || index < 0 || index >= hijosActuales.length) {
      return { ...padre, hijos: [...hijosActuales, nuevoItem] };
    }
    hijosActuales.splice(index, 0, nuevoItem);
    return { ...padre, hijos: hijosActuales };
  });
};

/**
 * Mueve un componente existente de su posición actual a un nuevo padre e índice.
 * Previene ciclos verificando descendencia.
 */
export const moverEnArbol = (lista, idOrigen, idDestinoPadre = null, indexDestino = -1) => {
  if (!idOrigen) return lista;

  // Validación de seguridad contra ciclos: no mover un nodo a sí mismo o a sus descendientes
  if (idDestinoPadre && esDescendiente(lista, idOrigen, idDestinoPadre)) {
    console.warn(`[DnD] Operación cancelada: El nodo ${idDestinoPadre} desciende de ${idOrigen}`);
    return lista;
  }

  const nodoAMover = buscarComponente(lista, idOrigen);
  if (!nodoAMover) return lista;

  // 1. Clonar el nodo
  const nodoClonado = JSON.parse(JSON.stringify(nodoAMover));

  // 2. Extraer el nodo de su posición original
  const listaSinNodo = eliminarEnArbol(lista, idOrigen);

  // 3. Insertar el nodo en la nueva posición
  return insertarEnArbol(listaSinNodo, nodoClonado, idDestinoPadre, indexDestino);
};

/**
 * Clona un componente y asigna identificadores únicos recursivamente a él y a todos sus descendientes.
 */
export const clonarConNuevosIds = (nodo) => {
  if (!nodo) return null;
  const nuevoId = `cmp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  return {
    ...nodo,
    id: nuevoId,
    etiqueta: `${nodo.etiqueta} (Copia)`,
    hijos: Array.isArray(nodo.hijos) ? nodo.hijos.map(clonarConNuevosIds) : undefined
  };
};

/**
 * Duplica un componente en su mismo padre justo después de su posición actual (estilo Figma Ctrl+D).
 * Retorna { nuevaLista, nuevoId }
 */
export const duplicarEnArbol = (lista, id) => {
  const infoPadre = buscarPadre(lista, id);
  const nodoOriginal = buscarComponente(lista, id);
  if (!nodoOriginal) return { nuevaLista: lista, nuevoId: null };

  const clon = clonarConNuevosIds(nodoOriginal);

  if (infoPadre && !infoPadre.esRaiz && infoPadre.padre) {
    const nuevaLista = insertarEnArbol(lista, clon, infoPadre.padre.id, infoPadre.index + 1);
    return { nuevaLista, nuevoId: clon.id };
  } else {
    // Está en la raíz
    const targetIndex = infoPadre ? infoPadre.index + 1 : -1;
    const nuevaLista = insertarEnArbol(lista, clon, null, targetIndex);
    return { nuevaLista, nuevoId: clon.id };
  }
};

/**
 * Normaliza cualquier componente para garantizar consistencia estructural:
 * id, tipo, etiqueta, props, accion, hijos (si aplica).
 */
export const normalizarComponente = (cmp) => {
  if (!cmp) return null;
  return {
    id: cmp.id || `cmp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    tipo: cmp.tipo || cmp.type || 'Text',
    etiqueta: cmp.etiqueta || cmp.name || cmp.tipo || 'Componente',
    props: { ...(cmp.props || {}) },
    accion: cmp.accion || null,
    hijos: Array.isArray(cmp.hijos) ? cmp.hijos.map(normalizarComponente) : undefined
  };
};

