import React, { useState, useEffect, useCallback } from 'react';
import { proyectosIniciales } from './data/initialProjects.js';
import {
  actualizarEnArbol,
  buscarComponente,
  buscarPadre,
  eliminarEnArbol,
  insertarEnArbol,
  moverEnArbol,
  duplicarEnArbol,
  esDescendiente,
  normalizarComponente
} from './utils/treeUtils.js';
import { exportarProyectosJSON } from './utils/exportUtils.js';
import { getComponentDefinition } from './registry/componentRegistry.js';
import { normalizarTemasProyectos, obtenerPaletaTema } from './utils/projectUtils.js';

import { DndProvider } from './dnd/DndContext.jsx';
import { Toast } from './components/common/Toast.jsx';
import { Header } from './components/layout/Header.jsx';
import { Sidebar } from './components/sidebar/Sidebar.jsx';
import { CanvasArea } from './components/canvas/CanvasArea.jsx';
import { InspectorPanel } from './components/inspector/InspectorPanel.jsx';

function App() {
  // Estado principal de proyectos
  const [proyectos, setProyectos] = useState(() => {
    try {
      const guardado = localStorage.getItem('proyectos_ui_lowcode');
      const modoHeredado = localStorage.getItem('studio_m3_theme');
      const paletaHeredada = JSON.parse(localStorage.getItem('studio_m3_custom_palette') || '{}');
      const proyectosNormalizados = normalizarTemasProyectos(guardado ? JSON.parse(guardado) : proyectosIniciales, {
        modoHeredado,
        paletaHeredada
      });
      // Migrar una sola vez los ajustes globales anteriores a la configuración por proyecto.
      localStorage.removeItem('studio_m3_theme');
      localStorage.removeItem('studio_m3_custom_palette');
      return proyectosNormalizados;
    } catch (e) {
      return normalizarTemasProyectos(proyectosIniciales);
    }
  });

  // Estado de componentes reutilizables
  const [componentesReutilizables, setComponentesReutilizables] = useState(() => {
    try {
      const guardado = localStorage.getItem('componentes_reutilizables');
      return guardado ? JSON.parse(guardado) : [];
    } catch (e) {
      return [];
    }
  });

  // Pestañas abiertas en el editor
  const [pestanasAbiertas, setPestanasAbiertas] = useState([
    { proyectoId: proyectos[0]?.id, vistaId: proyectos[0]?.vistas[0]?.id }
  ]);
  const [pestanaActiva, setPestanaActiva] = useState(0);
  const [historialNavegacion, setHistorialNavegacion] = useState([]);

  // Selección y modos de interfaz
  const [idComponenteSeleccionado, setIdComponenteSeleccionado] = useState(null);
  const [modoVistaPrevia, setModoVistaPrevia] = useState(false);
  const [pestanaInspector, setPestanaInspector] = useState('propiedades');
  const [nivelZoom, setNivelZoom] = useState(100);

  // Estado para overlays interactivos en Vista Previa
  const [bottomSheetActivo, setBottomSheetActivo] = useState({ abierto: false, titulo: '', contenido: '' });
  const [dialogoActivo, setDialogoActivo] = useState({ abierto: false, titulo: '', contenido: '' });
  const [mensajeToast, setMensajeToast] = useState(null);

  // Persistencia en LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('proyectos_ui_lowcode', JSON.stringify(proyectos));
    } catch (e) {}
  }, [proyectos]);

  useEffect(() => {
    try {
      localStorage.setItem('componentes_reutilizables', JSON.stringify(componentesReutilizables));
    } catch (e) {}
  }, [componentesReutilizables]);

  // Selección activa actual
  const pestanaActual = pestanasAbiertas[pestanaActiva];
  const proyectoActual = proyectos.find(p => p.id === pestanaActual?.proyectoId);
  const vistaActual = proyectoActual?.vistas.find(v => v.id === pestanaActual?.vistaId)
    || proyectoActual?.overlays?.find(v => v.id === pestanaActual?.vistaId);
  const modoTema = proyectoActual?.tema?.modo || 'claro';
  const paletaPersonalizada = obtenerPaletaTema(proyectoActual, modoTema);
  const componenteSeleccionado = vistaActual ? (buscarComponente(vistaActual.componentes, idComponenteSeleccionado)
    || proyectoActual?.vistas.map(v => buscarComponente(v.componentes, idComponenteSeleccionado)).find(Boolean)) : null;

  // Notificaciones Toast
  const mostrarToast = (msg) => {
    setMensajeToast(msg);
    setTimeout(() => setMensajeToast(null), 3000);
  };

  // Validación de seguridad para Drag & Drop (prevención de ciclos)
  const canAcceptDrop = useCallback((idOrigen, idDestino) => {
    if (!vistaActual || !idOrigen || !idDestino) return true;
    if (idOrigen === idDestino) return false;
    return !esDescendiente(vistaActual.componentes, idOrigen, idDestino);
  }, [vistaActual]);

  // Inserción de nuevo componente (desde la biblioteca o por clic)
  const handleInsertarComponente = useCallback((itemBase, idDestino = null, position = 'inside') => {
    if (!vistaActual) return;

    const def = getComponentDefinition(itemBase.tipo);
    const esContenedor = def?.isContainer;

    const nuevoCmp = normalizarComponente({
      id: `cmp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tipo: def?.type || itemBase.tipo,
      etiqueta: itemBase.etiqueta || def?.name || 'Componente',
      props: { ...(def?.defaultProps || {}), ...(itemBase.defaultProps || {}) },
      accion: itemBase.esTriggerOverlay ? {
        tipo: itemBase.tipo === 'bottomsheet' ? 'bottomsheet' : 'dialog',
        payload: 'Contenido del elemento'
      } : null,
      hijos: esContenedor ? [] : undefined
    });

    setProyectos(prev => prev.map(p => {
      if (p.id !== proyectoActual.id) return p;
      return {
        ...p,
        vistas: p.vistas.map(v => {
          if (v.id !== vistaActual.id) return v;

          let nuevosComponentes;

          // Inserción en la raíz del canvas
          if (!idDestino || idDestino === 'canvas-root' || idDestino === 'root') {
            nuevosComponentes = position === 'before'
              ? [nuevoCmp, ...v.componentes]
              : [...v.componentes, nuevoCmp];
          } else {
            const nodoDestino = buscarComponente(v.componentes, idDestino);
            const defDestino = getComponentDefinition(nodoDestino?.tipo);
            const destinoEsContenedor = defDestino?.isContainer || Boolean(nodoDestino?.hijos);

            if (position === 'inside' && destinoEsContenedor) {
              nuevosComponentes = insertarEnArbol(v.componentes, nuevoCmp, idDestino, -1);
            } else {
              const infoPadre = buscarPadre(v.componentes, idDestino);
              if (infoPadre) {
                const targetIndex = position === 'before' ? infoPadre.index : infoPadre.index + 1;
                const idPadre = infoPadre.padre ? infoPadre.padre.id : null;
                nuevosComponentes = insertarEnArbol(v.componentes, nuevoCmp, idPadre, targetIndex);
              } else {
                nuevosComponentes = [...v.componentes, nuevoCmp];
              }
            }
          }

          return { ...v, componentes: nuevosComponentes };
        })
      };
    }));

    setIdComponenteSeleccionado(nuevoCmp.id);
    mostrarToast(`Componente "${nuevoCmp.etiqueta}" agregado`);
  }, [vistaActual, proyectoActual]);

  // Movimiento de componente existente (Drag & Drop en canvas o capas)
  const handleMoverComponente = useCallback((idOrigen, idDestino, position = 'inside') => {
    if (!vistaActual || !idOrigen || idOrigen === idDestino) return;

    if (idDestino !== 'canvas-root' && esDescendiente(vistaActual.componentes, idOrigen, idDestino)) {
      mostrarToast('Destino no válido: No puedes mover un elemento dentro de sí mismo.');
      return;
    }

    setProyectos(prev => prev.map(p => {
      if (p.id !== proyectoActual.id) return p;
      return {
        ...p,
        vistas: p.vistas.map(v => {
          if (v.id !== vistaActual.id) return v;

          let nuevosComponentes;

          if (!idDestino || idDestino === 'canvas-root' || idDestino === 'root') {
            const targetIndex = position === 'before' ? 0 : -1;
            nuevosComponentes = moverEnArbol(v.componentes, idOrigen, null, targetIndex);
          } else {
            const nodoDestino = buscarComponente(v.componentes, idDestino);
            const defDestino = getComponentDefinition(nodoDestino?.tipo);
            const destinoEsContenedor = defDestino?.isContainer || Boolean(nodoDestino?.hijos);

            if (position === 'inside' && destinoEsContenedor) {
              nuevosComponentes = moverEnArbol(v.componentes, idOrigen, idDestino, -1);
            } else {
              const infoPadre = buscarPadre(v.componentes, idDestino);
              if (infoPadre) {
                const targetIndex = position === 'before' ? infoPadre.index : infoPadre.index + 1;
                const idPadre = infoPadre.padre ? infoPadre.padre.id : null;
                nuevosComponentes = moverEnArbol(v.componentes, idOrigen, idPadre, targetIndex);
              } else {
                nuevosComponentes = v.componentes;
              }
            }
          }

          return { ...v, componentes: nuevosComponentes };
        })
      };
    }));

    setIdComponenteSeleccionado(idOrigen);
    mostrarToast('Componente reubicado correctamente');
  }, [vistaActual, proyectoActual]);

  // Duplicar componente (Figma Ctrl+D)
  const handleDuplicarComponente = useCallback((id) => {
    if (!vistaActual || !id) return;
    const { nuevaLista, nuevoId } = duplicarEnArbol(vistaActual.componentes, id);
    if (nuevoId) {
      setProyectos(prev => prev.map(p => {
        if (p.id !== proyectoActual.id) return p;
        return {
          ...p,
          vistas: p.vistas.map(v => {
            if (v.id !== vistaActual.id) return v;
            return { ...v, componentes: nuevaLista };
          })
        };
      }));
      setIdComponenteSeleccionado(nuevoId);
      mostrarToast('Componente duplicado (Ctrl+D)');
    }
  }, [vistaActual, proyectoActual]);

  // Eliminar componente
  const handleEliminarComponente = useCallback((id) => {
    setProyectos(prev => prev.map(p => {
      if (p.id !== proyectoActual.id) return p;
      return {
        ...p,
        vistas: p.vistas.map(v => ({ ...v, componentes: eliminarEnArbol(v.componentes, id) }))
      };
    }));

    if (idComponenteSeleccionado === id) setIdComponenteSeleccionado(null);
  }, [proyectoActual, idComponenteSeleccionado]);

  // Acciones de Teclado Globales estilo Figma
  useEffect(() => {
    const handleKeyDown = (e) => {
      const targetTag = document.activeElement?.tagName?.toLowerCase();
      const isInputActive = targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select';
      if (isInputActive) return;

      // Eliminar componente seleccionado (Delete o Backspace)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (idComponenteSeleccionado && !modoVistaPrevia) {
          e.preventDefault();
          handleEliminarComponente(idComponenteSeleccionado);
          mostrarToast('Componente eliminado');
        }
      }

      // Deseleccionar (Escape)
      if (e.key === 'Escape') {
        if (idComponenteSeleccionado) {
          setIdComponenteSeleccionado(null);
        }
      }

      // Duplicar componente (Ctrl+D o Cmd+D)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        if (idComponenteSeleccionado && vistaActual && !modoVistaPrevia) {
          e.preventDefault();
          handleDuplicarComponente(idComponenteSeleccionado);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [idComponenteSeleccionado, vistaActual, modoVistaPrevia, handleEliminarComponente, handleDuplicarComponente]);

  // Guardar como componente reutilizable
  const handleGuardarComoReutilizable = () => {
    if (!componenteSeleccionado) return;
    const copia = JSON.parse(JSON.stringify(componenteSeleccionado));
    copia.id = `reutilizable-${Date.now()}`;
    setComponentesReutilizables([...componentesReutilizables, copia]);
    mostrarToast(`Componente "${copia.etiqueta}" guardado en la librería.`);
  };

  // Actualizar propiedad del componente seleccionado
  const handleActualizarProp = (llave, valor) => {
    if (!idComponenteSeleccionado || !vistaActual) return;
    setProyectos(prev => prev.map(p => {
      if (p.id !== proyectoActual.id) return p;
      return {
        ...p,
        vistas: p.vistas.map(v => ({
          ...v,
          componentes: actualizarEnArbol(v.componentes, idComponenteSeleccionado, item => ({
            ...item, props: { ...item.props, [llave]: valor }
          }))
        }))
      };
    }));
  };

  // Actualizar acción del componente seleccionado
  const handleActualizarAccion = (datosAccion) => {
    if (!idComponenteSeleccionado || !vistaActual) return;
    setProyectos(prev => prev.map(p => {
      if (p.id !== proyectoActual.id) return p;
      return {
        ...p,
        vistas: p.vistas.map(v => {
          if (v.id !== vistaActual.id) return v;
          return {
            ...v,
            componentes: actualizarEnArbol(v.componentes, idComponenteSeleccionado, item => ({
              ...item,
              accion: datosAccion
            }))
          };
        })
      };
    }));
  };

  const handleActualizarOverlays = (overlays) => {
    if (!proyectoActual) return;
    setProyectos(prev => prev.map(p => p.id === proyectoActual.id ? { ...p, overlays } : p));
  };

  const handleActualizarVistaOverlay = (overlayId, cambios) => {
    if (!proyectoActual) return;
    setProyectos(prev => prev.map(p => p.id === proyectoActual.id ? { ...p, vistas: p.vistas.map(v => v.id === overlayId ? { ...v, ...cambios } : v) } : p));
  };

  // Actualizar configuración del lienzo/vista
  const handleActualizarLienzo = (llave, valor) => {
    if (!vistaActual) return;
    setProyectos(prev => prev.map(p => {
      if (p.id !== proyectoActual.id) return p;
      return {
        ...p,
        vistas: p.vistas.map(v => {
          if (v.id !== vistaActual.id) return v;
          return { ...v, [llave]: valor };
        })
      };
    }));
  };

  // Manejo de Tema Material 3
  const handleCambiarModoTema = (modo) => {
    if (!proyectoActual) return;
    setProyectos(prev => prev.map(proyecto => proyecto.id === proyectoActual.id
      ? { ...proyecto, tema: { ...proyecto.tema, modo } }
      : proyecto));
  };

  const handleToggleModoTema = () => {
    handleCambiarModoTema(modoTema === 'claro' ? 'oscuro' : 'claro');
  };

  const handleActualizarColorTema = (key, valor, modoEdicion = modoTema) => {
    if (!proyectoActual) return;
    setProyectos(prev => prev.map(proyecto => proyecto.id === proyectoActual.id
      ? {
          ...proyecto,
          tema: {
            ...proyecto.tema,
            paletaPersonalizada: modoEdicion === (proyecto.tema?.modo === 'oscuro' ? 'oscuro' : 'claro')
              ? { ...(proyecto.tema?.paletaPersonalizada || {}), [key]: valor }
              : (proyecto.tema?.paletaPersonalizada || {}),
            paletas: {
              ...proyecto.tema?.paletas,
              [modoEdicion === 'oscuro' ? 'oscuro' : 'claro']: {
                ...(proyecto.tema?.paletas?.[modoEdicion === 'oscuro' ? 'oscuro' : 'claro'] || {}), [key]: valor
              }
            }
          }
        }
      : proyecto));
  };

  const handleSeleccionarComponente = (id) => {
    setIdComponenteSeleccionado(id);
    if (id === 'canvas') setPestanaInspector('lienzo');
    else if (id) setPestanaInspector('propiedades');
  };

  // Gestión de pestañas y proyectos
  const handleAbrirPestana = (proyectoId, vistaId) => {
    const vistaDestino = proyectos.find(p => p.id === proyectoId)?.vistas.find(v => v.id === vistaId);
    setIdComponenteSeleccionado(vistaDestino?.tipoOverlay ? 'canvas' : null);
    if (vistaDestino?.tipoOverlay) setPestanaInspector('lienzo');
    const indiceExistente = pestanasAbiertas.findIndex(t => t.proyectoId === proyectoId && t.vistaId === vistaId);
    if (indiceExistente >= 0) {
      setPestanaActiva(indiceExistente);
    } else {
      setPestanasAbiertas([...pestanasAbiertas, { proyectoId, vistaId }]);
      setPestanaActiva(pestanasAbiertas.length);
    }
  };

  const handleCerrarPestana = (idx, e) => {
    e.stopPropagation();
    const nuevas = pestanasAbiertas.filter((_, i) => i !== idx);
    setPestanasAbiertas(nuevas);
    if (pestanaActiva >= nuevas.length) {
      setPestanaActiva(Math.max(0, nuevas.length - 1));
    }
  };

  const handleCrearProyecto = (dispositivo = 'movil') => {
    const esMovil = dispositivo === 'movil';
    const nuevo = {
      id: `proj-${Date.now()}`,
      nombre: `Proyecto Nuevo ${proyectos.length + 1}`,
      tema: { modo: 'claro', paletas: { claro: {}, oscuro: {} }, paletaPersonalizada: {} },
      vistas: [
        {
          id: `vista-${Date.now()}`,
          nombre: 'Vista Principal',
          dispositivo: esMovil ? 'movil' : 'web',
          ancho: esMovil ? 375 : 1024,
          alto: esMovil ? 812 : 640,
          padding: 0,
          gap: 16,
          direccion: 'column',
          bg: 'background',
          componentes: []
        }
      ]
    };
    setProyectos([...proyectos, nuevo]);
    handleAbrirPestana(nuevo.id, nuevo.vistas[0].id);
  };

  const handleAgregarVista = (proyectoId) => {
    const nuevaVista = {
      id: `vista-${Date.now()}`,
      nombre: `Vista ${Date.now().toString().slice(-4)}`,
      dispositivo: 'movil',
      ancho: 375,
      alto: 812,
      padding: 0,
      gap: 16,
      direccion: 'column',
      bg: 'background',
      componentes: []
    };
    setProyectos(prev => prev.map(p => {
      if (p.id === proyectoId) {
        return { ...p, vistas: [...p.vistas, nuevaVista] };
      }
      return p;
    }));
    handleAbrirPestana(proyectoId, nuevaVista.id);
  };

  const handleCrearVistaOverlay = (tipo) => {
    if (!proyectoActual) return null;
    const nueva = {
      id: `overlay-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      nombre: tipo === 'bottomsheet' ? 'Sheet nuevo' : 'Dialog nuevo',
      tipoOverlay: tipo,
      titulo: tipo === 'bottomsheet' ? 'Nuevo menú' : 'Nueva confirmación',
      mostrarTitulo: true,
      showCloseButton: true, closeOnOutside: true, bg: 'surface', textColor: 'onSurface', outlineColor: 'outlineVariant',
      backdropColor: tipo === 'dialog' ? 'rgba(0,0,0,.68)' : 'rgba(0,0,0,.60)',
      borderRadius: tipo === 'dialog' ? '16px' : '20px', overlayPadding: '20px',
      showConfirmButton: true, showCancelButton: true, confirmText: 'Aceptar', cancelText: 'Cancelar',
      showCloseActionButton: true, closeText: 'Cerrar', showHandle: true,
      primaryButtonColor: 'primary', confirmTextColor: 'onPrimary', cancelButtonColor: 'surfaceVariant', handleColor: 'onSurfaceVariant',
      dispositivo: 'web', ancho: tipo === 'bottomsheet' ? 375 : 420, alto: tipo === 'bottomsheet' ? 360 : 320,
      padding: 16, gap: 12, direccion: 'column', bg: 'surface', componentes: []
    };
    setProyectos(prev => prev.map(p => p.id === proyectoActual.id ? { ...p, vistas: [...p.vistas, nueva] } : p));
    handleAbrirPestana(proyectoActual.id, nueva.id);
    setIdComponenteSeleccionado('canvas');
    setPestanaInspector('lienzo');
    return nueva;
  };

  const handleEliminarProyecto = (proyectoId) => {
    if (proyectos.length <= 1) { mostrarToast('Debe permanecer al menos un proyecto.'); return; }
    const objetivo = proyectos.find(p => p.id === proyectoId);
    if (!window.confirm(`¿Eliminar el proyecto "${objetivo?.nombre}" y todas sus vistas?`)) return;
    const restantes = proyectos.filter(p => p.id !== proyectoId);
    setProyectos(restantes);
    const tabs = pestanasAbiertas.filter(tab => tab.proyectoId !== proyectoId);
    const fallback = restantes[0];
    const tabsFinales = tabs.length ? tabs : [{ proyectoId: fallback.id, vistaId: fallback.vistas[0].id }];
    setPestanasAbiertas(tabsFinales);
    setPestanaActiva(0);
    setIdComponenteSeleccionado(null);
  };

  const handleEliminarVista = (proyectoId, vistaId) => {
    const proyecto = proyectos.find(p => p.id === proyectoId);
    if (!proyecto || proyecto.vistas.length <= 1) { mostrarToast('Debe permanecer al menos una vista por proyecto.'); return; }
    const vista = proyecto.vistas.find(v => v.id === vistaId);
    if (!window.confirm(`¿Eliminar la vista "${vista?.nombre}"?`)) return;
    const nuevaVista = proyecto.vistas.find(v => v.id !== vistaId);
    setProyectos(prev => prev.map(p => p.id === proyectoId ? { ...p, vistas: p.vistas.filter(v => v.id !== vistaId) } : p));
    const tabs = pestanasAbiertas.filter(tab => !(tab.proyectoId === proyectoId && tab.vistaId === vistaId));
    const tabsFinales = tabs.length ? tabs : [{ proyectoId, vistaId: nuevaVista.id }];
    setPestanasAbiertas(tabsFinales);
    setPestanaActiva(0);
    setIdComponenteSeleccionado(null);
  };

  // Ejecución de acciones en Modo Vista Previa
  const handleEjecutarAccion = (accion) => {
    if (!accion) return;
    if (accion.tipo === 'alerta') {
      mostrarToast(accion.payload || '¡Acción ejecutada correctamente!');
    } else if (accion.tipo === 'bottomsheet') {
      const contenidoPersonalizado = proyectoActual?.vistas?.find(item => item.id === (accion.vistaId || accion.overlayId)) || proyectoActual?.overlays?.find(item => item.id === accion.overlayId);
      setBottomSheetActivo({
        abierto: true,
        titulo: contenidoPersonalizado?.titulo || 'Menú Desplegable (Bottom Sheet)',
        mostrarTitulo: contenidoPersonalizado?.mostrarTitulo !== false,
        vista: contenidoPersonalizado,
        contenido: contenidoPersonalizado?.contenido ?? accion.payload ?? 'Opciones del componente activadas.'
      });
    } else if (accion.tipo === 'dialog') {
      const contenidoPersonalizado = proyectoActual?.vistas?.find(item => item.id === (accion.vistaId || accion.overlayId)) || proyectoActual?.overlays?.find(item => item.id === accion.overlayId);
      setDialogoActivo({
        abierto: true,
        titulo: contenidoPersonalizado?.titulo || 'Diálogo Modal',
        mostrarTitulo: contenidoPersonalizado?.mostrarTitulo !== false,
        vista: contenidoPersonalizado,
        contenido: contenidoPersonalizado?.contenido ?? accion.payload ?? '¿Desea confirmar esta acción?'
      });
    } else if (accion.tipo === 'navegar') {
      const vistaDestino = proyectoActual?.vistas.find(v => v.id === accion.vistaId);
      if (vistaDestino) {
        if (pestanaActual?.vistaId !== vistaDestino.id) setHistorialNavegacion(prev => [...prev, pestanaActual].filter(Boolean));
        handleAbrirPestana(proyectoActual.id, vistaDestino.id);
        mostrarToast(`Navegando a: ${vistaDestino.nombre}`);
      }
    }
  };

  const handleDeviceBack = () => {
    const destino = historialNavegacion.at(-1);
    if (!destino) { mostrarToast('No hay una pantalla anterior.'); return; }
    setHistorialNavegacion(prev => prev.slice(0, -1));
    handleAbrirPestana(destino.proyectoId, destino.vistaId);
  };
  const handleDeviceHome = () => {
    const home = proyectoActual?.vistas.find(view => !view.tipoOverlay);
    if (home) { setHistorialNavegacion([]); handleAbrirPestana(proyectoActual.id, home.id); }
  };
  const handleDeviceRecent = handleDeviceBack;

  // Importar archivo JSON
  const handleImportarJSON = (e) => {
    const lector = new FileReader();
    if (e.target.files && e.target.files[0]) {
      lector.readAsText(e.target.files[0], "UTF-8");
      lector.onload = (evt) => {
        try {
          const parseado = JSON.parse(evt.target.result);
          if (Array.isArray(parseado)) {
            setProyectos(normalizarTemasProyectos(parseado));
            if (parseado[0]?.vistas[0]) {
              setPestanasAbiertas([{ proyectoId: parseado[0].id, vistaId: parseado[0].vistas[0].id }]);
              setPestanaActiva(0);
            }
            mostrarToast("Proyectos importados con éxito");
          }
        } catch (err) {
          alert('El archivo JSON proporcionado no es válido');
        }
      };
    }
  };

  return (
    <DndProvider
      onInsertComponent={handleInsertarComponente}
      onMoveComponent={handleMoverComponente}
      canAcceptDrop={canAcceptDrop}
    >
      <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
        {/* Toast Notificación */}
        <Toast mensaje={mensajeToast} />

        {/* BARRA SUPERIOR DE NAVEGACIÓN */}
        <Header
          modoVistaPrevia={modoVistaPrevia}
          onToggleModoVistaPrevia={() => setModoVistaPrevia(!modoVistaPrevia)}
          onExportarJSON={() => exportarProyectosJSON(proyectos)}
          onImportarJSON={handleImportarJSON}
        />

        {/* CUERPO PRINCIPAL DEL EDITOR */}
        <div className="flex-1 flex overflow-hidden">
          {/* PANEL IZQUIERDO: ÁRBOL Y COMPONENTES */}
          <Sidebar
            proyectos={proyectos}
            pestanaActual={pestanaActual}
            onCrearProyecto={handleCrearProyecto}
            onAgregarVista={handleAgregarVista}
            onEliminarProyecto={handleEliminarProyecto}
            onEliminarVista={handleEliminarVista}
            onAbrirPestana={handleAbrirPestana}
            componentesReutilizables={componentesReutilizables}
            componenteSeleccionado={componenteSeleccionado}
            onAgregarComponente={handleInsertarComponente}
          />

          {/* ÁREA CENTRAL - CANVAS LIENZO */}
          <CanvasArea
            pestanasAbiertas={pestanasAbiertas}
            pestanaActiva={pestanaActiva}
            proyectos={proyectos}
            vistaActual={vistaActual}
            nivelZoom={nivelZoom}
            modoVistaPrevia={modoVistaPrevia}
            modoTema={modoTema}
            paletaPersonalizada={paletaPersonalizada}
            paletasTema={proyectoActual?.tema?.paletas || { claro: {}, oscuro: {} }}
            idComponenteSeleccionado={idComponenteSeleccionado}
            bottomSheetActivo={bottomSheetActivo}
            dialogoActivo={dialogoActivo}
            onSeleccionarPestana={setPestanaActiva}
            onCerrarPestana={handleCerrarPestana}
            onCambiarZoom={setNivelZoom}
            onToggleModoTema={handleToggleModoTema}
            onSeleccionarComponente={handleSeleccionarComponente}
            onEliminarComponente={handleEliminarComponente}
            onActualizarProp={handleActualizarProp}
            onEjecutarAccion={handleEjecutarAccion}
            onDeviceBack={handleDeviceBack}
            onDeviceHome={handleDeviceHome}
            onDeviceRecent={handleDeviceRecent}
            onCloseBottomSheet={() => setBottomSheetActivo({ abierto: false, titulo: '', contenido: '' })}
            onCloseDialogo={() => setDialogoActivo({ abierto: false, titulo: '', contenido: '' })}
            onConfirmDialogo={() => {
              setDialogoActivo({ abierto: false, titulo: '', contenido: '' });
              mostrarToast("Acción confirmada");
            }}
          />

          {/* PANEL DERECHO - INSPECTOR Y CONFIGURACIÓN */}
          <InspectorPanel
            pestanaInspector={pestanaInspector}
            onCambiarPestanaInspector={setPestanaInspector}
            componenteSeleccionado={componenteSeleccionado}
            vistaActual={vistaActual}
            proyectoActual={proyectoActual}
            modoTema={modoTema}
            paletaPersonalizada={paletaPersonalizada}
            onActualizarProp={handleActualizarProp}
            onGuardarComoReutilizable={handleGuardarComoReutilizable}
            onActualizarAccion={handleActualizarAccion}
            onActualizarOverlays={handleActualizarOverlays}
            onCrearVistaOverlay={handleCrearVistaOverlay}
            onActualizarVistaOverlay={handleActualizarVistaOverlay}
            onActualizarLienzo={handleActualizarLienzo}
            onCambiarModoTema={handleCambiarModoTema}
            onActualizarColorTema={handleActualizarColorTema}
            idComponenteSeleccionado={idComponenteSeleccionado}
            onSeleccionarComponente={handleSeleccionarComponente}
            onEliminarComponente={handleEliminarComponente}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
