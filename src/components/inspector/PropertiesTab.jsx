import React from 'react';
import { getComponentDefinition } from '../../registry/componentRegistry.js';
import { isSemanticToken, resolveM3Color } from '../../theme/materialTheme.js';

export const PropertiesTab = ({
  componenteSeleccionado,
  modoTema = 'claro',
  paletaPersonalizada = null,
  onActualizarProp,
  onGuardarComoReutilizable
}) => {
  if (!componenteSeleccionado) {
    return (
      <div className="text-slate-500 text-xs text-center py-8 select-none">
        Selecciona un elemento en el lienzo o en el árbol de capas para ajustar sus propiedades.
      </div>
    );
  }

  const def = getComponentDefinition(componenteSeleccionado.tipo);
  const sections = def?.propertySections || ['dimensiones', 'espaciado', 'estilos'];
  const props = componenteSeleccionado.props || {};

  return (
    <div className="space-y-4 text-xs">
      {/* Encabezado del Componente */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div>
          <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] block">
            {componenteSeleccionado.etiqueta || def?.name}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Tipo: {def?.type || componenteSeleccionado.tipo}
          </span>
        </div>
        <button
          onClick={onGuardarComoReutilizable}
          className="text-[10px] bg-amber-950/40 border border-amber-800/60 text-amber-300 px-2 py-0.5 rounded hover:bg-amber-900/50 transition"
          title="Guardar en biblioteca como reutilizable"
        >
          + Guardar Reutilizable
        </button>
      </div>

      {/* SECCIÓN: TEXTO */}
      {sections.includes('contenido_texto') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Contenido de Texto</span>
          <div className="space-y-1">
            <label className="text-slate-400">Texto Visible</label>
            <input
              type="text"
              value={props.texto || ''}
              onChange={(e) => onActualizarProp('texto', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Tamaño Fuente</label>
              <input
                type="text"
                value={props.fontSize || ''}
                placeholder="16px"
                onChange={(e) => onActualizarProp('fontSize', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Grosor (Weight)</label>
              <select
                value={props.fontWeight || 'normal'}
                onChange={(e) => onActualizarProp('fontWeight', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              >
                <option value="normal">Normal</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semibold (600)</option>
                <option value="bold">Bold (700)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN: BOTÓN */}
      {sections.includes('contenido_boton') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Contenido del Botón</span>
          <div className="space-y-1">
            <label className="text-slate-400">Texto del Botón</label>
            <input
              type="text"
              value={props.texto || ''}
              onChange={(e) => onActualizarProp('texto', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* SECCIÓN: ICON BUTTON */}
      {sections.includes('contenido_iconbutton') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración IconButton</span>
          <div className="space-y-1">
            <label className="text-slate-400">Nombre de Ícono</label>
            <select
              value={props.icon || 'settings'}
              onChange={(e) => onActualizarProp('icon', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            >
              <option value="settings">Settings (Configuración)</option>
              <option value="plus">Plus (Agregar)</option>
              <option value="search">Search (Buscar)</option>
              <option value="trash">Trash (Papelera)</option>
              <option value="check">Check (Verificado)</option>
              <option value="menu">Menu (Hamburguesa)</option>
              <option value="zap">Zap (Rayo)</option>
            </select>
          </div>
        </div>
      )}

      {/* SECCIÓN: FAB */}
      {sections.includes('contenido_fab') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración FAB (Floating Button)</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Ícono</label>
              <select
                value={props.icon || 'plus'}
                onChange={(e) => onActualizarProp('icon', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              >
                <option value="plus">Plus (+)</option>
                <option value="zap">Zap (Acción)</option>
                <option value="search">Search</option>
                <option value="settings">Settings</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Texto (Extended FAB)</label>
              <input
                type="text"
                value={props.texto || ''}
                placeholder="Opcional"
                onChange={(e) => onActualizarProp('texto', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN: ENTRADA TEXTFIELD */}
      {sections.includes('contenido_input') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración de Entrada</span>
          <div className="space-y-1">
            <label className="text-slate-400">Texto Placeholder</label>
            <input
              type="text"
              value={props.placeholder || ''}
              onChange={(e) => onActualizarProp('placeholder', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* SECCIÓN: SEARCHBAR */}
      {sections.includes('contenido_searchbar') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración Buscador</span>
          <div className="space-y-1">
            <label className="text-slate-400">Texto Placeholder</label>
            <input
              type="text"
              value={props.placeholder || ''}
              onChange={(e) => onActualizarProp('placeholder', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400">Consulta Simulada (Query)</label>
            <input
              type="text"
              value={props.query || ''}
              placeholder="Vacío por defecto"
              onChange={(e) => onActualizarProp('query', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
        </div>
      )}

      {/* SECCIÓN: CHECKBOX */}
      {sections.includes('contenido_checkbox') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración Checkbox</span>
          <div className="space-y-1">
            <label className="text-slate-400">Etiqueta</label>
            <input
              type="text"
              value={props.etiqueta || ''}
              onChange={(e) => onActualizarProp('etiqueta', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="checkbox-checked"
              checked={Boolean(props.checked)}
              onChange={(e) => onActualizarProp('checked', e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
            />
            <label htmlFor="checkbox-checked" className="text-slate-300 cursor-pointer">Marcado por defecto</label>
          </div>
        </div>
      )}

      {/* SECCIÓN: RADIO BUTTON */}
      {sections.includes('contenido_radio') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración RadioButton</span>
          <div className="space-y-1">
            <label className="text-slate-400">Etiqueta</label>
            <input
              type="text"
              value={props.etiqueta || ''}
              onChange={(e) => onActualizarProp('etiqueta', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="radio-selected"
              checked={Boolean(props.selected)}
              onChange={(e) => onActualizarProp('selected', e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
            />
            <label htmlFor="radio-selected" className="text-slate-300 cursor-pointer">Seleccionado por defecto</label>
          </div>
        </div>
      )}

      {/* SECCIÓN: SLIDER */}
      {sections.includes('contenido_slider') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración Deslizador</span>
          <div className="space-y-1">
            <label className="text-slate-400">Etiqueta</label>
            <input
              type="text"
              value={props.etiqueta || ''}
              onChange={(e) => onActualizarProp('etiqueta', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Valor</label>
              <input
                type="number"
                value={props.value || 50}
                onChange={(e) => onActualizarProp('value', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Mínimo</label>
              <input
                type="number"
                value={props.min || 0}
                onChange={(e) => onActualizarProp('min', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Máximo</label>
              <input
                type="number"
                value={props.max || 100}
                onChange={(e) => onActualizarProp('max', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN: DROPDOWN MENU */}
      {sections.includes('contenido_dropdown') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración Desplegable</span>
          <div className="space-y-1">
            <label className="text-slate-400">Etiqueta Superior</label>
            <input
              type="text"
              value={props.etiqueta || ''}
              onChange={(e) => onActualizarProp('etiqueta', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400">Opciones (separadas por coma)</label>
            <input
              type="text"
              value={props.opciones || ''}
              placeholder="Opción 1, Opción 2, Opción 3"
              onChange={(e) => onActualizarProp('opciones', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400">Opción Seleccionada</label>
            <input
              type="text"
              value={props.seleccionado || ''}
              onChange={(e) => onActualizarProp('seleccionado', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
        </div>
      )}

      {/* SECCIÓN: CHIP */}
      {sections.includes('contenido_chip') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración Chip M3</span>
          <div className="space-y-1">
            <label className="text-slate-400">Texto del Chip</label>
            <input
              type="text"
              value={props.texto || ''}
              onChange={(e) => onActualizarProp('texto', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="chip-selected"
              checked={Boolean(props.selected)}
              onChange={(e) => onActualizarProp('selected', e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
            />
            <label htmlFor="chip-selected" className="text-slate-300 cursor-pointer">Estado Activo / Seleccionado</label>
          </div>
        </div>
      )}

      {/* SECCIÓN: SWITCH */}
      {sections.includes('contenido_switch') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración de Interruptor</span>
          <div className="space-y-1">
            <label className="text-slate-400">Etiqueta</label>
            <input
              type="text"
              value={props.etiqueta || ''}
              onChange={(e) => onActualizarProp('etiqueta', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="switch-checked"
              checked={Boolean(props.checked)}
              onChange={(e) => onActualizarProp('checked', e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
            />
            <label htmlFor="switch-checked" className="text-slate-300 cursor-pointer">Activo por defecto</label>
          </div>
        </div>
      )}

      {/* SECCIÓN: IMAGEN */}
      {sections.includes('contenido_imagen') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración de Imagen</span>
          <div className="space-y-1">
            <label className="text-slate-400">URL de la imagen (src)</label>
            <input
              type="text"
              value={props.src || ''}
              onChange={(e) => onActualizarProp('src', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Ajuste (Object Fit)</label>
              <select
                value={props.objectFit || 'cover'}
                onChange={(e) => onActualizarProp('objectFit', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              >
                <option value="cover">Cubrir (cover)</option>
                <option value="contain">Contener (contain)</option>
                <option value="fill">Rellenar (fill)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Texto Alternativo</label>
              <input
                type="text"
                value={props.alt || ''}
                onChange={(e) => onActualizarProp('alt', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN: TOP APP BAR */}
      {sections.includes('contenido_topappbar') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración TopAppBar</span>
          <div className="space-y-1">
            <label className="text-slate-400">Título de Barra</label>
            <input
              type="text"
              value={props.titulo || ''}
              onChange={(e) => onActualizarProp('titulo', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Ícono Navegación</label>
              <select
                value={props.navigationIcon || 'menu'}
                onChange={(e) => onActualizarProp('navigationIcon', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              >
                <option value="menu">Menu (Hamburguesa)</option>
                <option value="arrowLeft">Flecha Atrás</option>
                <option value="x">Cerrar (X)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Ícono Acción</label>
              <select
                value={props.actionIcon || 'moreVertical'}
                onChange={(e) => onActualizarProp('actionIcon', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              >
                <option value="moreVertical">Más Opciones</option>
                <option value="search">Buscar</option>
                <option value="settings">Ajustes</option>
                <option value="bell">Notificaciones</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN: NAVIGATION BAR */}
      {sections.includes('contenido_navigationbar') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración NavigationBar (Inferior)</span>
          <div className="space-y-1">
            <label className="text-slate-400">Destinos (Etiqueta:Ícono separados por coma)</label>
            <input
              type="text"
              value={props.items || ''}
              placeholder="Inicio:home, Buscar:search, Perfil:user"
              onChange={(e) => onActualizarProp('items', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono text-[11px]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 block mb-1">Índice Activo (0, 1, 2...)</label>
            <input
              type="number"
              min="0"
              value={props.activo ?? 0}
              onChange={(e) => onActualizarProp('activo', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
        </div>
      )}

      {/* SECCIÓN: TABS */}
      {sections.includes('contenido_tabs') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración Tabs (Pestañas)</span>
          <div className="space-y-1">
            <label className="text-slate-400">Pestañas (Separadas por comas)</label>
            <input
              type="text"
              value={props.tabs || ''}
              placeholder="General, Detalles, Configuración"
              onChange={(e) => onActualizarProp('tabs', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 block mb-1">Pestaña Activa (Índice 0, 1, 2...)</label>
            <input
              type="number"
              min="0"
              value={props.activo ?? 0}
              onChange={(e) => onActualizarProp('activo', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
        </div>
      )}

      {/* SECCIÓN: LIST ITEM */}
      {sections.includes('contenido_listitem') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración ListItem</span>
          <div className="space-y-1">
            <label className="text-slate-400">Título Principal (Headline)</label>
            <input
              type="text"
              value={props.headline || ''}
              onChange={(e) => onActualizarProp('headline', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400">Texto Secundario (Supporting text)</label>
            <input
              type="text"
              value={props.supportingText || ''}
              onChange={(e) => onActualizarProp('supportingText', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Ícono Líder</label>
              <select
                value={props.leadingIcon || 'box'}
                onChange={(e) => onActualizarProp('leadingIcon', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              >
                <option value="box">Caja</option>
                <option value="user">Usuario</option>
                <option value="bell">Campana</option>
                <option value="home">Inicio</option>
                <option value="heart">Corazón</option>
                <option value="">(Ninguno)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Ícono Final</label>
              <select
                value={props.trailingIcon || 'chevronRight'}
                onChange={(e) => onActualizarProp('trailingIcon', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              >
                <option value="chevronRight">Flecha (Chevron)</option>
                <option value="moreVertical">Más Opciones</option>
                <option value="check">Check</option>
                <option value="">(Ninguno)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN: AVATAR */}
      {sections.includes('contenido_avatar') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración Avatar</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Iniciales (Texto)</label>
              <input
                type="text"
                value={props.texto || ''}
                placeholder="JD"
                maxLength={3}
                onChange={(e) => onActualizarProp('texto', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Tamaño (Size)</label>
              <input
                type="text"
                value={props.size || '44px'}
                onChange={(e) => onActualizarProp('size', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-slate-400">URL Foto (Opcional)</label>
            <input
              type="text"
              value={props.src || ''}
              placeholder="https://..."
              onChange={(e) => onActualizarProp('src', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 text-[11px]"
            />
          </div>
        </div>
      )}

      {/* SECCIÓN: BADGE */}
      {sections.includes('contenido_badge') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración Badge</span>
          <div className="space-y-1">
            <label className="text-slate-400">Texto / Conteo Numérico</label>
            <input
              type="text"
              value={props.texto || ''}
              placeholder="3 o 99+"
              onChange={(e) => onActualizarProp('texto', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono"
            />
          </div>
        </div>
      )}

      {/* SECCIÓN: CIRCULAR PROGRESS */}
      {sections.includes('contenido_circularprogress') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración CircularProgress</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Diámetro (px)</label>
              <input
                type="text"
                value={props.size || '36px'}
                onChange={(e) => onActualizarProp('size', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Grosor (Stroke)</label>
              <input
                type="text"
                value={props.strokeWidth || '4px'}
                onChange={(e) => onActualizarProp('strokeWidth', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN: LINEAR PROGRESS */}
      {sections.includes('contenido_linearprogress') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración LinearProgress</span>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <label>Porcentaje de Avance</label>
              <span className="font-mono text-[11px] font-semibold text-teal-400">{props.progress ?? 65}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={props.progress ?? 65}
              onChange={(e) => onActualizarProp('progress', parseInt(e.target.value) || 0)}
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 block mb-1">Altura de la Barra</label>
            <input
              type="text"
              value={props.height || '6px'}
              onChange={(e) => onActualizarProp('height', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
            />
          </div>
        </div>
      )}

      {/* SECCIÓN: SNACKBAR */}
      {sections.includes('contenido_snackbar') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Configuración Snackbar</span>
          <div className="space-y-1">
            <label className="text-slate-400">Mensaje de Notificación</label>
            <input
              type="text"
              value={props.mensaje || props.texto || ''}
              onChange={(e) => onActualizarProp('mensaje', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400">Texto de Acción (Opcional)</label>
            <input
              type="text"
              value={props.actionText || ''}
              placeholder="Deshacer"
              onChange={(e) => onActualizarProp('actionText', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            />
          </div>
        </div>
      )}

      {/* SECCIÓN: MOTOR DE LAYOUTS (BOX, ROW, COLUMN) */}
      {sections.includes('contenido_rangeslider') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Range Slider</span>
          <label className="text-slate-400 block">Etiqueta<input value={props.etiqueta || ''} onChange={(e) => onActualizarProp('etiqueta', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200" /></label>
          <div className="grid grid-cols-2 gap-2">
            {['valueStart', 'valueEnd', 'min', 'max'].map(key => <label key={key} className="text-slate-400">{key}<input type="number" value={props[key] ?? 0} onChange={(e) => onActualizarProp(key, Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200" /></label>)}
          </div>
        </div>
      )}

      {sections.includes('contenido_segmentedbutton') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Segmented Button</span>
          <label className="text-slate-400 block">Opciones separadas por coma<input value={props.items || ''} onChange={(e) => onActualizarProp('items', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200" /></label>
          <label className="text-slate-400 block">Opcion seleccionada<input type="number" min="0" value={props.activo ?? 0} onChange={(e) => onActualizarProp('activo', Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200" /></label>
        </div>
      )}

      {sections.includes('contenido_navigationrail') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Navigation Rail</span>
          <label className="text-slate-400 block">Items: etiqueta:icono<input value={props.items || ''} onChange={(e) => onActualizarProp('items', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200" /></label>
          <label className="text-slate-400 block">Indice activo<input type="number" min="0" value={props.activo ?? 0} onChange={(e) => onActualizarProp('activo', Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200" /></label>
        </div>
      )}

      {sections.includes('layout_box') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Alineación Box (Jetpack Compose)</span>
          <div className="space-y-1">
            <label className="text-slate-400">Alineación del Contenido</label>
            <select
              value={props.alignment || 'center'}
              onChange={(e) => onActualizarProp('alignment', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            >
              <option value="top-start">Arriba Izquierda (TopStart)</option>
              <option value="top-center">Arriba Centro (TopCenter)</option>
              <option value="top-end">Arriba Derecha (TopEnd)</option>
              <option value="center-start">Centro Izquierda (CenterStart)</option>
              <option value="center">Centro Total (Center)</option>
              <option value="center-end">Centro Derecha (CenterEnd)</option>
              <option value="bottom-start">Abajo Izquierda (BottomStart)</option>
              <option value="bottom-center">Abajo Centro (BottomCenter)</option>
              <option value="bottom-end">Abajo Derecha (BottomEnd)</option>
            </select>
          </div>
        </div>
      )}

      {sections.includes('layout_row') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Disposición Row (Horizontal)</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Distribución Horizontal</label>
              <select
                value={props.horizontalArrangement || 'start'}
                onChange={(e) => onActualizarProp('horizontalArrangement', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200"
              >
                <option value="start">Inicio (Start)</option>
                <option value="center">Centro (Center)</option>
                <option value="end">Final (End)</option>
                <option value="space-between">Separados (Between)</option>
                <option value="space-around">Alrededor (Around)</option>
                <option value="space-evenly">Equitativo (Evenly)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Alineación Vertical</label>
              <select
                value={props.verticalAlignment || 'center'}
                onChange={(e) => onActualizarProp('verticalAlignment', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200"
              >
                <option value="top">Arriba (Top)</option>
                <option value="center">Centro (Center)</option>
                <option value="bottom">Abajo (Bottom)</option>
                <option value="stretch">Estirar (Stretch)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-slate-400 block mb-1">Separación (Gap)</label>
              <input
                type="text"
                value={props.gap || ''}
                placeholder="12px"
                onChange={(e) => onActualizarProp('gap', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="row-wrap"
                checked={Boolean(props.wrap)}
                onChange={(e) => onActualizarProp('wrap', e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
              />
              <label htmlFor="row-wrap" className="text-slate-300 cursor-pointer">Multilínea (Wrap)</label>
            </div>
          </div>
        </div>
      )}

      {sections.includes('layout_column') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Disposición Column (Vertical)</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Distribución Vertical</label>
              <select
                value={props.verticalArrangement || 'start'}
                onChange={(e) => onActualizarProp('verticalArrangement', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200"
              >
                <option value="start">Inicio (Top)</option>
                <option value="center">Centro (Center)</option>
                <option value="end">Final (Bottom)</option>
                <option value="space-between">Separados (Between)</option>
                <option value="space-around">Alrededor (Around)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Alineación Horizontal</label>
              <select
                value={props.horizontalAlignment || 'stretch'}
                onChange={(e) => onActualizarProp('horizontalAlignment', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200"
              >
                <option value="stretch">Estirar (Stretch)</option>
                <option value="start">Izquierda (Start)</option>
                <option value="center">Centro (Center)</option>
                <option value="end">Derecha (End)</option>
              </select>
            </div>
          </div>
          <div className="space-y-1 pt-1">
            <label className="text-slate-400 block mb-1">Separación (Gap)</label>
            <input
              type="text"
              value={props.gap || ''}
              placeholder="12px"
              onChange={(e) => onActualizarProp('gap', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
            />
          </div>
        </div>
      )}

      {/* SECCIÓN: DIMENSIONES */}
      {sections.includes('dimensiones') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Dimensiones</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Ancho (Width)</label>
              <input
                type="text"
                value={props.width || props.ancho || ''}
                placeholder="100% / auto"
                onChange={(e) => onActualizarProp('width', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Alto (Height)</label>
              <input
                type="text"
                value={props.height || ''}
                placeholder="auto / 120px"
                onChange={(e) => onActualizarProp('height', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Ancho Máximo</label>
              <input
                type="text"
                value={props.maxWidth || ''}
                placeholder="Ej. 100%"
                onChange={(e) => onActualizarProp('maxWidth', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Alto Mínimo</label>
              <input
                type="text"
                value={props.minHeight || ''}
                placeholder="Ej. 60px"
                onChange={(e) => onActualizarProp('minHeight', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN: ESPACIADO */}
      {sections.includes('espaciado') && (
        <div className="space-y-2 border-b border-slate-800 pb-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Espaciado y Márgenes</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Relleno (Padding)</label>
              <input
                type="text"
                value={props.padding ?? ''}
                placeholder="16px"
                onChange={(e) => onActualizarProp('padding', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Margen (Margin)</label>
              <input
                type="text"
                value={props.margin ?? ''}
                placeholder="0 auto"
                onChange={(e) => onActualizarProp('margin', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN: ESTILOS VISUALES Y COLORES */}
      {sections.includes('estilos') && (
        <div className="space-y-3">
          <span className="font-semibold text-slate-300 block text-[11px]">Estilos y Colores</span>

          {/* Color de Fondo */}
          <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 text-[11px] font-medium">Color de Fondo</label>
              {isSemanticToken(props.bg) ? (
                <span className="text-[9px] text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800/60 font-mono font-semibold">
                  Heredado: {props.bg}
                </span>
              ) : (
                <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60 font-mono font-semibold">
                  Personalizado manual
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  props.bg?.startsWith('#')
                    ? props.bg
                    : resolveM3Color(props.bg || 'surface', modoTema, paletaPersonalizada)
                }
                onChange={(e) => onActualizarProp('bg', e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border border-slate-700 bg-transparent p-0"
                title="Personalizar color manualmente"
              />
              <input
                type="text"
                value={props.bg || ''}
                placeholder="primary / #hex"
                onChange={(e) => onActualizarProp('bg', e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
              />
              {!isSemanticToken(props.bg) && (
                <button
                  onClick={() => onActualizarProp('bg', def?.defaultProps?.bg || 'surface')}
                  className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
                  title="Restablecer al token de tema por defecto"
                >
                  Restablecer
                </button>
              )}
            </div>

            {/* Tokens M3 rápidos para Fondo */}
            <div className="pt-1">
              <span className="text-[10px] text-slate-500 block mb-1">Tokens del Tema:</span>
              <div className="flex flex-wrap gap-1">
                {['primary', 'primaryContainer', 'secondary', 'secondaryContainer', 'surface', 'surfaceVariant', 'background', 'transparent'].map(tok => (
                  <button
                    key={tok}
                    onClick={() => onActualizarProp('bg', tok)}
                    className={`px-1.5 py-0.5 rounded text-[10px] border font-mono transition ${
                      props.bg === tok
                        ? 'bg-teal-900/60 border-teal-500 text-teal-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tok}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color de Texto */}
          <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 text-[11px] font-medium">Color de Texto</label>
              {isSemanticToken(props.textColor || props.color) ? (
                <span className="text-[9px] text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800/60 font-mono font-semibold">
                  Heredado: {props.textColor || props.color}
                </span>
              ) : (
                <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60 font-mono font-semibold">
                  Personalizado manual
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  (props.textColor || props.color)?.startsWith('#')
                    ? (props.textColor || props.color)
                    : resolveM3Color(props.textColor || props.color || 'onSurface', modoTema, paletaPersonalizada)
                }
                onChange={(e) => onActualizarProp(componenteSeleccionado.tipo === 'Text' || componenteSeleccionado.tipo === 'texto' ? 'color' : 'textColor', e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border border-slate-700 bg-transparent p-0"
                title="Personalizar color de texto manualmente"
              />
              <input
                type="text"
                value={props.textColor || props.color || ''}
                placeholder="onSurface / #hex"
                onChange={(e) => onActualizarProp(componenteSeleccionado.tipo === 'Text' || componenteSeleccionado.tipo === 'texto' ? 'color' : 'textColor', e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
              />
              {!isSemanticToken(props.textColor || props.color) && (
                <button
                  onClick={() => onActualizarProp(
                    componenteSeleccionado.tipo === 'Text' || componenteSeleccionado.tipo === 'texto' ? 'color' : 'textColor',
                    def?.defaultProps?.color || def?.defaultProps?.textColor || 'onSurface'
                  )}
                  className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
                  title="Restablecer al token de tema por defecto"
                >
                  Restablecer
                </button>
              )}
            </div>

            {/* Tokens M3 rápidos para Texto */}
            <div className="pt-1">
              <span className="text-[10px] text-slate-500 block mb-1">Tokens del Tema:</span>
              <div className="flex flex-wrap gap-1">
                {['onPrimary', 'onPrimaryContainer', 'onSecondary', 'onSecondaryContainer', 'onSurface', 'onSurfaceVariant', 'onBackground', 'primary'].map(tok => (
                  <button
                    key={tok}
                    onClick={() => onActualizarProp(componenteSeleccionado.tipo === 'Text' || componenteSeleccionado.tipo === 'texto' ? 'color' : 'textColor', tok)}
                    className={`px-1.5 py-0.5 rounded text-[10px] border font-mono transition ${
                      (props.textColor === tok || props.color === tok)
                        ? 'bg-teal-900/60 border-teal-500 text-teal-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tok}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-slate-400 block mb-1">Borde Redondeado</label>
              <input
                type="text"
                value={props.borderRadius || ''}
                placeholder="8px / 50%"
                onChange={(e) => onActualizarProp('borderRadius', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Opacidad (0 - 1)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={props.opacity !== undefined ? props.opacity : 1}
                onChange={(e) => onActualizarProp('opacity', parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
