import React, { useEffect, useState } from 'react';
import { Icon } from '../common/Icon.jsx';
import { LayoutRenderer } from '../../layouts/LayoutRenderer.jsx';
import { DropIndicator } from '../../dnd/DropIndicator.jsx';
import { useStudioDnd } from '../../dnd/DndContext.jsx';
import { getComponentDefinition } from '../../registry/componentRegistry.js';
import { resolveM3Color, resolveM3StyleValue } from '../../theme/materialTheme.js';

export const CanvasRenderer = ({
  cmp: incomingCmp,
  vistaIdActual,
  runtimeVariables = {},
  onSetVariable,
  idComponenteSeleccionado,
  modoVistaPrevia,
  parentOrientation = 'vertical',
  modoTema = 'claro',
  paletaPersonalizada = null,
  onSeleccionarComponente,
  onEliminarComponente,
  onEjecutarAccion,
  onActualizarProp
}) => {
  const resolveBoundValue = value => {
    if (typeof value !== 'string') return value;
    const exact = value.match(/^\{\{\s*([\w.-]+)\s*\}\}$/);
    if (exact) return runtimeVariables[exact[1]] ?? '';
    return value.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, name) => runtimeVariables[name] ?? '');
  };
  const getBoundVariable = property => typeof incomingCmp.props?.[property] === 'string'
    ? incomingCmp.props[property].match(/^\{\{\s*([\w.-]+)\s*\}\}$/)?.[1]
    : undefined;
  const toDisplayValue = value => value == null ? '' : (typeof value === 'object' ? JSON.stringify(value) : String(value));
  const cmp = { ...incomingCmp, props: Object.fromEntries(Object.entries(incomingCmp.props || {}).map(([key, value]) => [key, resolveBoundValue(value)])) };
  const {
    isDragging,
    draggedItem,
    hoverTarget,
    startDrag,
    updateHoverTarget,
    endDrag,
    handleDrop,
    canAcceptDrop
  } = useStudioDnd();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(Number(cmp.props?.activo) || 0);
  const [rangeStart, setRangeStart] = useState(Number(cmp.props?.valueStart ?? 25));
  const [rangeEnd, setRangeEnd] = useState(Number(cmp.props?.valueEnd ?? 75));
  const [switchValue, setSwitchValue] = useState(Boolean(cmp.props?.checked));
  const [checkboxValue, setCheckboxValue] = useState(Boolean(cmp.props?.checked));

  useEffect(() => setSelectedSegment(Number(cmp.props?.activo) || 0), [cmp.props?.activo]);
  useEffect(() => {
    setRangeStart(Number(cmp.props?.valueStart ?? 25));
    setRangeEnd(Number(cmp.props?.valueEnd ?? 75));
  }, [cmp.props?.valueStart, cmp.props?.valueEnd]);
  useEffect(() => setSwitchValue(Boolean(cmp.props?.checked)), [cmp.props?.checked]);
  useEffect(() => setCheckboxValue(Boolean(cmp.props?.checked)), [cmp.props?.checked]);

  const matchesVisibility = condition => {
    if (condition === undefined || condition === null || condition === '') return true;
    if (typeof condition === 'boolean') return condition;
    const match = String(condition).trim().match(/^([\w.-]+)\s*(==|===|!=|!==|>=|<=|>|<)?\s*(.*)$/);
    if (!match) return true;
    const [, name, operator, rawExpected] = match;
    const actual = runtimeVariables[name];
    if (!operator) return Boolean(actual);
    let expected;
    try { expected = JSON.parse(rawExpected); } catch { expected = rawExpected.replace(/^['"]|['"]$/g, ''); }
    switch (operator) {
      case '==': case '===': return actual === expected || String(actual) === String(expected);
      case '!=': case '!==': return !(actual === expected || String(actual) === String(expected));
      case '>': return actual > expected;
      case '<': return actual < expected;
      case '>=': return actual >= expected;
      case '<=': return actual <= expected;
      default: return true;
    }
  };
  if (modoVistaPrevia && !matchesVisibility(cmp.props?.visibleWhen)) return null;

  const def = getComponentDefinition(cmp.tipo);
  const esContenedor = def?.isContainer || Boolean(cmp.hijos);
  const esSeleccionado = idComponenteSeleccionado === cmp.id && !modoVistaPrevia;

  // Determinar la orientaciÃ³n interna para sus hijos
  let orientacionHijos = 'vertical';
  const normTipo = String(cmp.tipo).toLowerCase();
  if (normTipo === 'row' || (normTipo === 'contenedor' && cmp.props?.direccion === 'row')) {
    orientacionHijos = 'horizontal';
  }

  // Resolver colores semÃ¡nticos de Material 3
  const bgColor = resolveM3Color(
    cmp.props.bg || (esContenedor ? 'surface' : 'transparent'),
    modoTema,
    paletaPersonalizada
  );
  const textColor = resolveM3Color(
    cmp.props.textColor || cmp.props.color || 'onSurface',
    modoTema,
    paletaPersonalizada
  );

  // Evitar desbordamiento horizontal cuando hay mÃ¡rgenes y width = 100%
  const tieneMargen = cmp.props.margin && cmp.props.margin !== '0' && cmp.props.margin !== '0px';
  const anchoCalculado = (cmp.props.width === '100%' && tieneMargen) ? 'auto' : (cmp.props.width || cmp.props.ancho || (esContenedor ? '100%' : 'auto'));

  const estiloComun = {
    padding: cmp.props.padding ?? (esContenedor ? '16px' : '0'),
    margin: 0,
    background: cmp.props.gradient || bgColor,
    backgroundImage: cmp.props.gradient || undefined,
    color: textColor,
    borderRadius: cmp.props.borderRadius || (esContenedor ? '12px' : '0'),
    fontSize: cmp.props.fontSize || '14px',
    fontWeight: cmp.props.fontWeight || 'normal',
    textAlign: cmp.props.align || 'left',
    width: '100%',
    minWidth: cmp.props.minWidth || undefined,
    maxWidth: '100%',
    alignSelf: cmp.props.alignSelf || (cmp.props.fillMaxWidth ? 'stretch' : 'auto'),
    height: (Number(cmp.props.weight) > 0 || cmp.props.fillMaxHeight || cmp.props.height === '100%') ? '100%' : (cmp.props.height || 'auto'),
    minHeight: cmp.props.minHeight || (esContenedor ? '50px' : undefined),
    maxHeight: cmp.props.maxHeight || undefined,
    boxSizing: 'border-box',
    border: resolveM3StyleValue(cmp.props.border, modoTema, paletaPersonalizada) || undefined,
    boxShadow: cmp.props.elevation ? `0 ${Number(cmp.props.elevation)}px ${Number(cmp.props.elevation) * 2}px rgba(0,0,0,.16)` : undefined,
    opacity: cmp.props.opacity !== undefined ? cmp.props.opacity : 1,
    position: 'relative',
    flexGrow: 0,
    flexShrink: 0,
    cursor: modoVistaPrevia ? 'pointer' : 'default',
    transition: 'all 0.15s ease'
  };

  const estiloWrapper = {
    display: 'flex', flexDirection: 'column', position: 'relative', boxSizing: 'border-box',
    width: cmp.props.weight > 0 ? 'auto' : (cmp.props.fillMaxWidth ? '100%' : anchoCalculado), height: (cmp.props.weight > 0 || cmp.props.fillMaxHeight || cmp.props.height === '100%') ? '100%' : (cmp.props.height || 'auto'), minWidth: cmp.props.minWidth || 0,
    maxWidth: cmp.props.maxWidth || '100%', minHeight: 0, maxHeight: cmp.props.maxHeight || undefined,
    flexGrow: cmp.props.weight !== undefined ? Number(cmp.props.weight) : 0,
    flexBasis: Number(cmp.props.weight) > 0 ? 0 : undefined,
    flexShrink: cmp.props.shrink !== undefined ? Number(cmp.props.shrink) : 1,
    alignSelf: cmp.props.alignSelf || undefined, margin: cmp.props.margin || 0
  };

  // Manejo de clic
  const handleClick = (e) => {
    e.stopPropagation();
    if (modoVistaPrevia) {
      if (cmp.accion) onEjecutarAccion(cmp.accion);
    } else {
      onSeleccionarComponente(cmp.id);
    }
  };

  // Hover detection para remarcar layout o componente (estilo Figma)
  const handleMouseEnter = (e) => {
    if (modoVistaPrevia || isDragging) return;
    e.stopPropagation();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Drag & Drop: Inicio de arrastre
  const handleDragStart = (e) => {
    if (modoVistaPrevia) return;
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', cmp.id);
    e.dataTransfer.effectAllowed = 'move';
    startDrag('canvas', cmp);
  };

  // Drag & Drop: Drag Over
  const handleDragOver = (e) => {
    if (modoVistaPrevia || !isDragging) return;
    e.preventDefault();
    e.stopPropagation();

    const isValid = canAcceptDrop ? canAcceptDrop(draggedItem?.id, cmp.id) : true;
    const rect = e.currentTarget.getBoundingClientRect();
    let position = 'inside';

    if (esContenedor) {
      if (parentOrientation === 'horizontal') {
        const xRel = e.clientX - rect.left;
        if (xRel < rect.width * 0.25) position = 'before';
        else if (xRel > rect.width * 0.75) position = 'after';
        else position = 'inside';
      } else {
        const yRel = e.clientY - rect.top;
        if (yRel < rect.height * 0.25) position = 'before';
        else if (yRel > rect.height * 0.75) position = 'after';
        else position = 'inside';
      }
    } else {
      if (parentOrientation === 'horizontal') {
        position = (e.clientX - rect.left < rect.width / 2) ? 'before' : 'after';
      } else {
        position = (e.clientY - rect.top < rect.height / 2) ? 'before' : 'after';
      }
    }

    e.dataTransfer.dropEffect = isValid ? 'move' : 'none';
    updateHoverTarget({
      targetId: cmp.id,
      position,
      orientation: parentOrientation,
      isValid
    });
  };

  const handleElementDrop = (e) => {
    if (modoVistaPrevia || !isDragging) return;
    e.preventDefault();
    e.stopPropagation();

    const isValid = canAcceptDrop ? canAcceptDrop(draggedItem?.id, cmp.id) : true;
    if (isValid && hoverTarget?.targetId === cmp.id) {
      handleDrop(cmp.id, hoverTarget.position || 'inside');
    } else {
      endDrag();
    }
  };

  const handleDragLeave = (e) => {
    if (hoverTarget?.targetId === cmp.id) {
      const rect = e.currentTarget.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        updateHoverTarget(null);
      }
    }
  };

  // Renderizado especÃ­fico segÃºn tipo (Material 3 + Bloque 1)
  let elementoInterno = null;
  const tipoLimpio = String(cmp.tipo).toLowerCase();

  switch (tipoLimpio) {
    case 'text':
    case 'texto':
      elementoInterno = (
        <div style={estiloComun} onClick={handleClick}>
          {toDisplayValue(cmp.props.texto ?? 'Texto')}
        </div>
      );
      break;

    case 'button':
    case 'boton':
    case 'outlinedbutton':
    case 'elevatedbutton':
    case 'filledtonalbutton':
    case 'textbutton':
    case 'bottomsheet':
    case 'dialog':
      elementoInterno = (
        <button
          style={{ ...estiloComun, boxShadow: tipoLimpio === 'elevatedbutton' ? '0 2px 4px rgba(0,0,0,.18)' : tipoLimpio === 'textbutton' ? 'none' : estiloComun.boxShadow }}
          onClick={handleClick}
          className={`hover:opacity-90 active:scale-95 text-center font-medium transition ${tipoLimpio === 'textbutton' ? '' : 'shadow-sm'}`}
        >
          {toDisplayValue(cmp.props.texto ?? cmp.etiqueta)}
        </button>
      );
      break;

    case 'iconbutton':
    case 'fillediconbutton':
    case 'filledtonaliconbutton':
    case 'outlinediconbutton':
    case 'icontogglebutton':
      elementoInterno = (
        <button
          style={{
            ...estiloComun,
            width: cmp.props.width || '40px',
            height: cmp.props.height || '40px',
            borderRadius: cmp.props.borderRadius || '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0'
          }}
          onClick={handleClick}
          className={`hover:bg-slate-500/10 active:scale-95 transition ${cmp.props.checked ? 'ring-2 ring-current' : ''}`}
          title={cmp.etiqueta || 'BotÃ³n de Ãcono'}
        >
          <Icon name={cmp.props.icon || 'settings'} className="w-5 h-5" />
        </button>
      );
      break;

    case 'fab':
      elementoInterno = (
        <button
          style={{
            ...estiloComun,
            borderRadius: cmp.props.borderRadius || '16px',
            width: cmp.props.texto ? 'auto' : (cmp.props.width || '56px'),
            height: cmp.props.height || '56px',
            padding: cmp.props.texto ? '0 20px' : '0',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onClick={handleClick}
          className="shadow-lg hover:shadow-xl active:scale-95 transition font-medium text-xs"
        >
          <Icon name={cmp.props.icon || 'plus'} className="w-5 h-5" />
          {cmp.props.texto != null && <span>{toDisplayValue(cmp.props.texto)}</span>}
        </button>
      );
      break;

    case 'textfield':
    case 'input':
    case 'outlinedtextfield':
      elementoInterno = (
        <input
          type="text"
          placeholder={cmp.props.placeholder || 'Escribe algo...'}
          readOnly={!modoVistaPrevia}
          style={estiloComun}
          onClick={handleClick}
          className="focus:outline-none border border-slate-700/40 focus:border-blue-500"
        />
      );
      break;

    case 'rangeslider': {
      const start = rangeStart;
      const end = rangeEnd;
      const min = Number(cmp.props.min ?? 0);
      const max = Number(cmp.props.max ?? 100);
      const color = resolveM3Color(cmp.props.color || 'primary', modoTema, paletaPersonalizada);
      elementoInterno = (
        <div style={estiloComun} className="space-y-1.5">
          <div className="flex justify-between text-xs"><span>{cmp.props.etiqueta || 'Rango'}</span><span className="font-mono">{start} â€“ {end}</span></div>
          <div className="flex items-center gap-2">
            <input aria-label="Valor mÃ­nimo del rango" type="range" min={min} max={end} value={start} onChange={(e) => setRangeStart(Number(e.target.value))} style={{ accentColor: color }} className="w-full" onClick={handleClick} />
            <input aria-label="Valor mÃ¡ximo del rango" type="range" min={start} max={max} value={end} onChange={(e) => setRangeEnd(Number(e.target.value))} style={{ accentColor: color }} className="w-full" onClick={handleClick} />
          </div>
        </div>
      );
      break;
    }

    case 'searchbar':
      elementoInterno = (
        <div
          style={{
            ...estiloComun,
            borderRadius: cmp.props.borderRadius || '28px'
          }}
          onClick={handleClick}
          className="flex items-center gap-2.5 px-4 py-2.5 shadow-sm border border-slate-700/20"
        >
          <Icon name="search" className="w-4 h-4 opacity-70 shrink-0" />
          <span className="text-xs truncate flex-1 opacity-80">
            {cmp.props.query || cmp.props.placeholder || 'Buscar en la aplicaciÃ³n...'}
          </span>
        </div>
      );
      break;

    case 'checkbox': {
      const colorCheck = resolveM3Color(cmp.props.color || 'primary', modoTema, paletaPersonalizada);
      const checkedVariable = cmp.props.variableName || getBoundVariable('checked');
      const isChecked = checkedVariable ? Boolean(runtimeVariables[checkedVariable]) : checkboxValue;
      elementoInterno = (
        <div style={estiloComun} onClick={handleClick} className="flex items-center gap-2.5 cursor-pointer py-1">
          <button type="button" role="checkbox" aria-checked={isChecked} onClick={event => { event.stopPropagation(); if (!modoVistaPrevia) { onSeleccionarComponente(cmp.id); return; } if (checkedVariable) onSetVariable?.(checkedVariable, !isChecked); else setCheckboxValue(!isChecked); if (cmp.accion) onEjecutarAccion(cmp.accion); }}
            style={{
              background: isChecked ? colorCheck : 'transparent',
              borderColor: isChecked ? colorCheck : '#79747E'
            }}
            className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
          >
            {isChecked && <Icon name="check" className="w-3.5 h-3.5 text-white stroke-[3]" />}
          </button>
          <span className="text-xs select-none">
            {cmp.props.etiqueta || 'OpciÃ³n Checkbox'}
          </span>
        </div>
      );
      break;
    }

    case 'radiobutton': {
      const colorRadio = resolveM3Color(cmp.props.color || 'primary', modoTema, paletaPersonalizada);
      elementoInterno = (
        <div style={estiloComun} onClick={handleClick} className="flex items-center gap-2.5 cursor-pointer py-1">
          <div
            style={{
              borderColor: cmp.props.selected ? colorRadio : '#79747E'
            }}
            className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
          >
            {cmp.props.selected && <div style={{ background: colorRadio }} className="w-2.5 h-2.5 rounded-full" />}
          </div>
          <span className="text-xs select-none">
            {cmp.props.etiqueta || 'OpciÃ³n Radio'}
          </span>
        </div>
      );
      break;
    }

    case 'slider': {
      const colorSlider = resolveM3Color(cmp.props.color || 'primary', modoTema, paletaPersonalizada);
      const val = Number(cmp.props.value || 50);
      const min = Number(cmp.props.min || 0);
      const max = Number(cmp.props.max || 100);
      const pct = Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
      elementoInterno = (
        <div style={estiloComun} onClick={handleClick} className="space-y-1.5 py-1">
          <div className="flex justify-between items-center text-xs">
            <span>{cmp.props.etiqueta || 'Control Deslizante'}</span>
            <span className="font-mono text-[11px] font-semibold">{val}</span>
          </div>
          <div className="relative w-full h-4 flex items-center">
            <div className="w-full h-1.5 bg-slate-400/30 rounded-full overflow-hidden">
              <div style={{ width: `${pct}%`, background: colorSlider }} className="h-full rounded-full" />
            </div>
            <div
              style={{ left: `calc(${pct}% - 8px)`, background: colorSlider }}
              className="absolute w-4 h-4 rounded-full shadow ring-2 ring-white cursor-pointer"
            />
          </div>
        </div>
      );
      break;
    }

    case 'dropdownmenu':
      elementoInterno = (
        <div style={estiloComun} onClick={handleClick} className="space-y-1">
          {cmp.props.etiqueta && (
            <span className="text-[11px] opacity-75 block font-medium">{cmp.props.etiqueta}</span>
          )}
          <div
            style={{
              borderRadius: cmp.props.borderRadius || '8px'
            }}
            className="flex items-center justify-between px-3 py-2 border border-slate-700/30 text-xs shadow-sm cursor-pointer"
          >
            <span className="truncate">{cmp.props.seleccionado || 'Seleccionar opciÃ³n...'}</span>
            <Icon name="chevronDown" className="w-3.5 h-3.5 opacity-60 ml-2" />
          </div>
        </div>
      );
      break;

    case 'chip': {
      const isSelected = Boolean(cmp.props.selected);
      const bgChip = isSelected
        ? resolveM3Color(cmp.props.activeBg || 'primaryContainer', modoTema, paletaPersonalizada)
        : resolveM3Color(cmp.props.bg || 'surfaceVariant', modoTema, paletaPersonalizada);
      const colorChip = isSelected
        ? resolveM3Color(cmp.props.activeTextColor || 'onPrimaryContainer', modoTema, paletaPersonalizada)
        : resolveM3Color(cmp.props.textColor || 'onSurfaceVariant', modoTema, paletaPersonalizada);
      elementoInterno = (
        <div
          style={{
            ...estiloComun,
            background: bgChip,
            color: colorChip,
            borderRadius: cmp.props.borderRadius || '8px',
            width: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onClick={handleClick}
          className={`px-3 py-1.5 text-xs font-medium border ${isSelected ? 'border-transparent shadow' : 'border-slate-700/30'} cursor-pointer hover:opacity-90 transition`}
        >
          {cmp.props.icon && <Icon name={cmp.props.icon} className="w-3.5 h-3.5" />}
          <span>{toDisplayValue(cmp.props.texto ?? 'Chip')}</span>
        </div>
      );
      break;
    }

    case 'switch': {
      const colorSwitch = resolveM3Color(cmp.props.color || 'primary', modoTema, paletaPersonalizada);
      const switchVariable = cmp.props.variableName || getBoundVariable('checked');
      const switchIsOn = switchVariable ? Boolean(runtimeVariables[switchVariable]) : switchValue;
      elementoInterno = (
        <div style={estiloComun} onClick={handleClick} className="flex items-center justify-between p-2 rounded bg-slate-800/20 border border-slate-700/30">
          <span className="text-xs">{cmp.props.etiqueta || 'FunciÃ³n'}</span>
          <button type="button" role="switch" aria-checked={switchIsOn} onClick={event => { event.stopPropagation(); if (!modoVistaPrevia) { onSeleccionarComponente(cmp.id); return; } const next = !switchIsOn; if (switchVariable) onSetVariable?.(switchVariable, next); else setSwitchValue(next); if (cmp.accion) onEjecutarAccion(cmp.accion); }} style={{ background: switchIsOn ? colorSwitch : '#475569' }} className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${switchIsOn ? 'justify-end' : 'justify-start'}`}>
            <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md"></div>
          </button>
        </div>
      );
      break;
    }

    case 'image':
    case 'imagen':
      elementoInterno = (
        <img
          src={cmp.props.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60'}
          alt={cmp.props.alt || 'Imagen'}
          style={{
            ...estiloComun,
            objectFit: cmp.props.objectFit || 'cover',
            display: 'block'
          }}
          onClick={handleClick}
          className="shadow-sm"
        />
      );
      break;

    case 'spacer':
      elementoInterno = (
        <div
          style={{
            width: cmp.props.width || '100%',
            height: cmp.props.height || '16px'
          }}
          onClick={handleClick}
          className="border border-dashed border-slate-700/40 rounded flex items-center justify-center text-[10px] text-slate-500 select-none"
        >
          Spacer ({cmp.props.height || '16px'})
        </div>
      );
      break;

    case 'divider':
      elementoInterno = (
        <div
          style={{
            background: bgColor,
            height: cmp.props.height || '1px',
            width: cmp.props.width || '100%',
            margin: cmp.props.margin || '8px 0'
          }}
          onClick={handleClick}
        />
      );
      break;

    // ==================== BLOQUE 2: NAVEGACIÃ“N, LISTAS Y FEEDBACK ====================
    case 'topappbar':
    case 'appbar': {
      const barBg = resolveM3Color(cmp.props.bg || 'surface', modoTema, paletaPersonalizada);
      const barColor = resolveM3Color(cmp.props.textColor || 'onSurface', modoTema, paletaPersonalizada);
      elementoInterno = (
        <div
          style={{
            ...estiloComun,
            background: barBg,
            color: barColor,
            borderRadius: cmp.props.borderRadius || '0px'
          }}
          onClick={handleClick}
          className="flex items-center justify-between px-4 py-3 shadow-sm border-b border-slate-700/20"
        >
          <div className="flex items-center gap-3">
            {cmp.props.showNavigationIcon !== false && <button className="p-1 rounded-full hover:bg-slate-500/10 transition" type="button" onClick={e => { e.stopPropagation(); if (modoVistaPrevia && cmp.accion) onEjecutarAccion(cmp.accion); else if (!modoVistaPrevia) onSeleccionarComponente(cmp.id); }}>
              <Icon name={cmp.props.navigationIcon || 'menu'} className="w-5 h-5" />
            </button>}
{cmp.props.showTitle !== false && cmp.props.titleType !== 'none' && (cmp.props.titleType === 'image' ? <img src={cmp.props.titleImage || ''} alt={toDisplayValue(cmp.props.titulo || 'Title')} className="max-h-8 max-w-36 object-contain" /> : cmp.props.titleType === 'icon' ? <Icon name={cmp.props.titleIcon || 'home'} className="w-5 h-5" /> : <span className="font-semibold text-sm truncate">{toDisplayValue(cmp.props.titulo)}</span>)}
          </div>
          {cmp.props.showActionIcon !== false && <button className="p-1 rounded-full hover:bg-slate-500/10 transition" type="button" onClick={e => { e.stopPropagation(); if (modoVistaPrevia && cmp.accion) onEjecutarAccion(cmp.accion); else if (!modoVistaPrevia) onSeleccionarComponente(cmp.id); }}>
            <Icon name={cmp.props.actionIcon || 'moreVertical'} className="w-5 h-5" />
          </button>}
        </div>
      );
      break;
    }

    case 'navigationbar':
    case 'bottomnav': {
      const navBg = resolveM3Color(cmp.props.bg || 'surface', modoTema, paletaPersonalizada);
      const actColor = resolveM3Color(cmp.props.activeColor || 'primary', modoTema, paletaPersonalizada);
      const actContainer = resolveM3Color(cmp.props.activeContainer || 'secondaryContainer', modoTema, paletaPersonalizada);
      const activeIconColor = resolveM3Color(cmp.props.activeIconColor || 'onSecondaryContainer', modoTema, paletaPersonalizada);
      const inactiveIconColor = resolveM3Color(cmp.props.inactiveIconColor || cmp.props.textColor || 'onSurfaceVariant', modoTema, paletaPersonalizada);
      const activeLabelColor = resolveM3Color(cmp.props.activeLabelColor || cmp.props.activeColor || 'primary', modoTema, paletaPersonalizada);
      const inactiveLabelColor = resolveM3Color(cmp.props.inactiveLabelColor || cmp.props.textColor || 'onSurfaceVariant', modoTema, paletaPersonalizada);
      const navStyle = cmp.props.navigationStyle || 'pill';

      const rawItems = cmp.props.items || 'Inicio:home, Buscar:search, Perfil:user';
      const itemsList = typeof rawItems === 'string'
        ? rawItems.split(',').map(s => {
            const [label, icon, viewId] = s.trim().split(':');
            return { label: label?.trim() || 'Item', icon: icon?.trim() || 'home', viewId: viewId?.trim() };
          })
        : Array.isArray(rawItems) ? rawItems : [];
      const activoIdx = Number(cmp.props.activo || 0);

      elementoInterno = (
        <div
          style={{
            ...estiloComun,
            background: navBg,
            borderRadius: cmp.props.borderRadius || '16px'
          }}
          onClick={handleClick}
          className="flex items-center justify-around py-2 px-1 shadow border-t border-slate-700/20"
        >
          {itemsList.map((item, idx) => {
            const isSelected = item.viewId ? item.viewId === vistaIdActual : idx === activoIdx;
            return (
              <div
                key={idx}
                onClick={e => { e.stopPropagation(); if (modoVistaPrevia && item.viewId) onEjecutarAccion({ tipo: 'navegar', vistaId: item.viewId }); else if (!modoVistaPrevia) onSeleccionarComponente(cmp.id); }}
                className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 cursor-pointer py-1 px-1 transition-all"
              >
                <div
                  style={{
                    backgroundColor: isSelected && navStyle === 'pill' ? actContainer : isSelected && navStyle === 'icon' ? actContainer : 'transparent',
                    color: isSelected ? (navStyle === 'color' ? actColor : activeIconColor) : inactiveIconColor
                  }}
                  className={`shrink-0 mx-auto rounded-full flex items-center justify-center transition-all ${navStyle === 'icon' ? 'w-9 h-9' : 'w-16 h-8'}`}
                >
                  <Icon name={item.icon || 'home'} className="w-5 h-5" />
                </div>
                {cmp.props.showLabels !== false && <span
                  style={{ color: isSelected ? activeLabelColor : inactiveLabelColor }}
                  className={`text-[10px] font-medium truncate ${isSelected ? 'font-bold' : ''}`}
                >
                  {item.label}
                </span>}
              </div>
            );
          })}
        </div>
      );
      break;
    }

    case 'segmentedbutton': {
      const options = String(cmp.props.items || 'DÃ­a, Semana, Mes').split(',').map(item => item.trim()).filter(Boolean);
      const activeBg = resolveM3Color(cmp.props.activeColor || 'secondaryContainer', modoTema, paletaPersonalizada);
      const activeText = resolveM3Color(cmp.props.activeTextColor || 'onSecondaryContainer', modoTema, paletaPersonalizada);
      elementoInterno = (
        <div style={{ ...estiloComun, display: 'flex', padding: 0, border: '1px solid #79747E', borderRadius: cmp.props.borderRadius || '20px', overflow: 'hidden' }}>
          {options.map((option, index) => {
            const selected = selectedSegment === index;
            return <button key={`${option}-${index}`} type="button" onClick={(e) => { e.stopPropagation(); if (!modoVistaPrevia) { onSeleccionarComponente(cmp.id); return; } setSelectedSegment(index); if (cmp.accion) onEjecutarAccion(cmp.accion); }} style={{ flex: 1, padding: '9px 12px', border: 0, borderRight: index < options.length - 1 ? '1px solid #79747E' : 0, background: selected ? activeBg : 'transparent', color: selected ? activeText : textColor }} className="text-xs font-medium transition">{option}</button>;
          })}
        </div>
      );
      break;
    }

    case 'navigationrail': {
      const rawItems = String(cmp.props.items || 'Inicio:home, Buscar:search, Guardados:heart, Perfil:user');
      const items = rawItems.split(',').map(entry => {
        const [label, icon] = entry.trim().split(':');
        return { label: label || 'Item', icon: icon || 'home' };
      });
      const railBg = resolveM3Color(cmp.props.bg || 'surface', modoTema, paletaPersonalizada);
      const railText = resolveM3Color(cmp.props.textColor || 'onSurfaceVariant', modoTema, paletaPersonalizada);
      const activeBg = resolveM3Color(cmp.props.activeColor || 'secondaryContainer', modoTema, paletaPersonalizada);
      elementoInterno = (
        <nav style={{ ...estiloComun, background: railBg, width: cmp.props.width || '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }} onClick={handleClick}>
          {items.map((item, index) => {
            const selected = index === Number(cmp.props.activo || 0);
            return <div key={`${item.label}-${index}`} className="flex flex-col items-center gap-1 w-full text-[10px]">
              <span style={{ background: selected ? activeBg : 'transparent', color: railText }} className="w-14 h-8 rounded-full flex items-center justify-center"><Icon name={item.icon} className="w-5 h-5" /></span>
              <span style={{ color: railText }} className="truncate max-w-full">{item.label}</span>
            </div>;
          })}
        </nav>
      );
      break;
    }

    case 'bottomappbar': {
      const rawItems = String(cmp.props.items || 'menu:menu, buscar:search, agregar:plus');
      const items = rawItems.split(',').map(entry => {
        const [label, icon, viewId] = entry.trim().split(':');
        return { label: label || 'AcciÃ³n', icon: icon || 'menu', viewId: viewId?.trim() };
      });
      const barBg = resolveM3Color(cmp.props.bg || 'surface', modoTema, paletaPersonalizada);
      const fabBg = resolveM3Color('primaryContainer', modoTema, paletaPersonalizada);
      const fabText = resolveM3Color('onPrimaryContainer', modoTema, paletaPersonalizada);
      const navStyle = cmp.props.navigationStyle || 'pill';
      const activeContainer = resolveM3Color(cmp.props.activeContainer || 'secondaryContainer', modoTema, paletaPersonalizada);
      const activeIcon = resolveM3Color(cmp.props.activeIconColor || 'onSecondaryContainer', modoTema, paletaPersonalizada);
      const inactiveIcon = resolveM3Color(cmp.props.inactiveIconColor || cmp.props.textColor || 'onSurfaceVariant', modoTema, paletaPersonalizada);
      const activeLabel = resolveM3Color(cmp.props.activeLabelColor || cmp.props.activeColor || 'primary', modoTema, paletaPersonalizada);
      const inactiveLabel = resolveM3Color(cmp.props.inactiveLabelColor || cmp.props.textColor || 'onSurfaceVariant', modoTema, paletaPersonalizada);
      const colorActive = resolveM3Color(cmp.props.activeColor || 'primary', modoTema, paletaPersonalizada);
      const activeIndex = Number(cmp.props.activo || 0);
      elementoInterno = (
        <div style={{ ...estiloComun, background: barBg, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }} onClick={handleClick}>
          {items.map((item, index) => {
            const selected = item.viewId ? item.viewId === vistaIdActual : index === activeIndex;
            return <button type="button" key={`${item.label}-${index}`} onClick={e => { e.stopPropagation(); if (modoVistaPrevia && item.viewId) onEjecutarAccion({ tipo: 'navegar', vistaId: item.viewId }); else if (!modoVistaPrevia) onSeleccionarComponente(cmp.id); }} className="min-w-0 flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-full hover:bg-slate-500/10" title={item.label}>
              <span style={{ background: selected && navStyle !== 'color' ? activeContainer : 'transparent', color: selected ? (navStyle === 'color' ? colorActive : activeIcon) : inactiveIcon }} className={`shrink-0 mx-auto rounded-full flex items-center justify-center ${navStyle === 'icon' ? 'w-9 h-9' : 'w-16 h-8'}`}><Icon name={item.icon} className="w-5 h-5" /></span>
              {cmp.props.showLabels && <span style={{ color: selected ? activeLabel : inactiveLabel }} className="max-w-full truncate text-[10px]">{item.label}</span>}
            </button>;
          })}
          <button type="button" style={{ background: fabBg, color: fabText }} className="w-14 h-14 -mt-8 rounded-2xl shadow-lg" title="AcciÃ³n principal"><Icon name="plus" className="w-6 h-6" /></button>
        </div>
      );
      break;
    }

    case 'tabs':
    case 'tabrow': {
      const tabsBg = resolveM3Color(cmp.props.bg || 'surface', modoTema, paletaPersonalizada);
      const tabsText = resolveM3Color(cmp.props.textColor || 'onSurface', modoTema, paletaPersonalizada);
      const indColor = resolveM3Color(cmp.props.indicatorColor || 'primary', modoTema, paletaPersonalizada);

      const rawTabs = cmp.props.tabs || 'General, Detalles, ConfiguraciÃ³n';
      const tabsList = typeof rawTabs === 'string'
        ? rawTabs.split(',').map(s => s.trim()).filter(Boolean)
        : Array.isArray(rawTabs) ? rawTabs : [];
      const activoIdx = Number(cmp.props.activo || 0);

      elementoInterno = (
        <div
          style={{
            ...estiloComun,
            background: tabsBg,
            borderRadius: cmp.props.borderRadius || '0px'
          }}
          onClick={handleClick}
          className="flex border-b border-slate-700/30 overflow-x-auto"
        >
          {tabsList.map((tabLabel, idx) => {
            const isSelected = idx === activoIdx;
            return (
              <div
                key={idx}
                style={{
                  color: isSelected ? indColor : tabsText,
                  borderBottom: isSelected ? `3px solid ${indColor}` : '3px solid transparent'
                }}
                className={`flex-1 py-3 px-2 text-center text-xs font-medium cursor-pointer transition select-none truncate ${
                  isSelected ? 'font-bold' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {tabLabel}
              </div>
            );
          })}
        </div>
      );
      break;
    }

    case 'listitem':
    case 'list_item': {
      const itemBg = resolveM3Color(cmp.props.bg || 'surface', modoTema, paletaPersonalizada);
      const itemText = resolveM3Color(cmp.props.textColor || 'onSurface', modoTema, paletaPersonalizada);
      const itemSub = resolveM3Color('onSurfaceVariant', modoTema, paletaPersonalizada);
      const iconColor = resolveM3Color('primary', modoTema, paletaPersonalizada);

      elementoInterno = (
        <div
          style={{
            ...estiloComun,
            background: itemBg,
            color: itemText,
            borderRadius: cmp.props.borderRadius || '8px'
          }}
          onClick={handleClick}
          className="flex items-center justify-between p-3 border border-slate-700/20 shadow-sm hover:bg-slate-500/5 transition cursor-pointer"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {cmp.props.leadingIcon && (
              <div
                style={{ color: iconColor }}
                className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center shrink-0"
              >
                <Icon name={cmp.props.leadingIcon} className="w-5 h-5" />
              </div>
            )}
            <div className="truncate">
              <span className="text-xs font-medium block truncate">
                {cmp.props.headline || cmp.props.texto || 'TÃ­tulo del Elemento'}
              </span>
              {cmp.props.supportingText && (
                <span style={{ color: itemSub }} className="text-[11px] block truncate opacity-80">
                  {cmp.props.supportingText}
                </span>
              )}
            </div>
          </div>
          {cmp.props.trailingIcon && (
            <div className="shrink-0 opacity-60 ml-2">
              <Icon name={cmp.props.trailingIcon || 'chevronRight'} className="w-4 h-4" />
            </div>
          )}
        </div>
      );
      break;
    }

    case 'avatar': {
      const avBg = resolveM3Color(cmp.props.bg || 'secondaryContainer', modoTema, paletaPersonalizada);
      const avText = resolveM3Color(cmp.props.textColor || 'onSecondaryContainer', modoTema, paletaPersonalizada);
      const avSize = cmp.props.size || '44px';

      elementoInterno = (
        <div
          style={{
            ...estiloComun,
            width: avSize,
            height: avSize,
            minWidth: avSize,
            minHeight: avSize,
            background: avBg,
            color: avText,
            borderRadius: cmp.props.borderRadius || '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: '0'
          }}
          onClick={handleClick}
          className="shadow-sm font-semibold select-none text-xs"
        >
          {cmp.props.src ? (
            <img src={cmp.props.src} alt="Avatar" className="w-full h-full object-cover" />
          ) : cmp.props.texto ? (
            <span>{cmp.props.texto}</span>
          ) : (
            <Icon name="user" className="w-5 h-5 opacity-80" />
          )}
        </div>
      );
      break;
    }

    case 'badge': {
      const badgeBg = resolveM3Color(cmp.props.bg || 'error', modoTema, paletaPersonalizada);
      const badgeText = resolveM3Color(cmp.props.textColor || 'onError', modoTema, paletaPersonalizada);

      elementoInterno = (
        <span
          style={{
            ...estiloComun,
            background: badgeBg,
            color: badgeText,
            borderRadius: cmp.props.borderRadius || '10px',
            padding: cmp.props.padding || '2px 7px',
            width: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={handleClick}
          className="text-[10px] font-bold font-mono tracking-tight shadow-sm select-none"
        >
          {cmp.props.texto || ''}
        </span>
      );
      break;
    }

    case 'circularprogressindicator':
    case 'circularprogress':
    case 'spinner': {
      const spColor = resolveM3Color(cmp.props.color || 'primary', modoTema, paletaPersonalizada);
      const spTrackColor = resolveM3Color(cmp.props.trackColor || 'surfaceVariant', modoTema, paletaPersonalizada);
      const spSize = cmp.props.size || '36px';
      const stroke = Number.parseFloat(cmp.props.strokeWidth) || 4;
      const circumference = 2 * Math.PI * 9;

      elementoInterno = (
        <div
          style={{
            ...estiloComun,
            width: spSize,
            height: spSize,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={handleClick}
          className="p-1"
        >
          <svg className="animate-spin w-full h-full" viewBox="0 0 24 24" fill="none" aria-label="Cargando">
            <circle
              style={{ stroke: spTrackColor, opacity: 0.28 }}
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth={stroke}
            />
            <circle
              style={{ stroke: spColor, strokeDasharray: `${circumference * 0.72} ${circumference}`, transformOrigin: '12px 12px' }}
              fill="none"
              cx="12"
              cy="12"
              r="9"
              transform="rotate(-90 12 12)"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
      break;
    }

    case 'linearprogressindicator':
    case 'linearprogress':
    case 'progressbar': {
      const barColor = resolveM3Color(cmp.props.color || 'primary', modoTema, paletaPersonalizada);
      const trackBg = resolveM3Color(cmp.props.trackColor || 'surfaceVariant', modoTema, paletaPersonalizada);
      const progress = Math.min(100, Math.max(0, Number(cmp.props.progress ?? 65)));
      const barHeight = cmp.props.height || '6px';

      elementoInterno = (
        <div
          style={{
            ...estiloComun,
            height: barHeight,
            background: trackBg,
            borderRadius: cmp.props.borderRadius || '4px',
            overflow: 'hidden'
          }}
          onClick={handleClick}
          className="w-full relative shadow-inner"
        >
          <div
            style={{
              width: `${progress}%`,
              background: barColor,
              height: '100%',
              borderRadius: cmp.props.borderRadius || '4px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      );
      break;
    }

    case 'snackbar':
    case 'toast_m3': {
      const snackBg = resolveM3Color(cmp.props.bg || 'inverseSurface', modoTema, paletaPersonalizada);
      const snackText = resolveM3Color(cmp.props.textColor || 'inverseOnSurface', modoTema, paletaPersonalizada);
      const actionColor = resolveM3Color(cmp.props.actionColor || 'primary', modoTema, paletaPersonalizada);

      elementoInterno = (
        <div
          style={{
            ...estiloComun,
            background: snackBg,
            color: snackText,
            borderRadius: cmp.props.borderRadius || '8px',
            padding: cmp.props.padding || '12px 16px'
          }}
          onClick={handleClick}
          className="flex items-center justify-between shadow-xl border border-slate-700/30 text-xs w-full"
        >
          <span className="truncate flex-1 font-medium mr-2">
            {cmp.props.mensaje || cmp.props.texto || 'Mensaje de notificaciÃ³n'}
          </span>
          {cmp.props.actionText && (
            <button
              style={{ color: actionColor }}
              className="font-bold uppercase tracking-wider text-[11px] hover:underline shrink-0"
              type="button"
            >
              {cmp.props.actionText}
            </button>
          )}
        </div>
      );
      break;
    }

    // Contenedores y Layouts (Box, Row, Column, Card, etc.)
    case 'box':
    case 'row':
    case 'column':
    case 'card':
    case 'tarjeta':
    case 'contenedor':
    default:
      if (esContenedor) {
        elementoInterno = (
          <LayoutRenderer tipo={cmp.tipo} props={cmp.props} style={estiloComun}>
            {cmp.hijos && cmp.hijos.length > 0 ? (
              cmp.hijos.map(hijo => (
                <CanvasRenderer
                  key={hijo.id}
                  cmp={hijo}
                  vistaIdActual={vistaIdActual}
                  runtimeVariables={runtimeVariables}
                  onSetVariable={onSetVariable}
                  idComponenteSeleccionado={idComponenteSeleccionado}
                  modoVistaPrevia={modoVistaPrevia}
                  parentOrientation={orientacionHijos}
                  modoTema={modoTema}
                  paletaPersonalizada={paletaPersonalizada}
                  onSeleccionarComponente={onSeleccionarComponente}
                  onEliminarComponente={onEliminarComponente}
                  onEjecutarAccion={onEjecutarAccion}
                  onActualizarProp={onActualizarProp}
                />
              ))
            ) : (
              <div className="text-[11px] text-slate-500 border border-dashed border-slate-700/60 p-3 text-center rounded w-full select-none">
                Arrastra o agrega elementos dentro de <strong className="text-slate-400">{cmp.etiqueta}</strong>
              </div>
            )}
          </LayoutRenderer>
        );
      } else {
        elementoInterno = (
          <div style={estiloComun} onClick={handleClick}>
            {cmp.etiqueta || cmp.tipo}
          </div>
        );
      }
      break;
  }

  const isCurrentHoverTarget = hoverTarget?.targetId === cmp.id;

  return (
    <div
      key={cmp.id}
      draggable={!modoVistaPrevia}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleElementDrop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ ...estiloWrapper, ...(cmp.props.fixedPosition ? {
        position: 'absolute', left: 0, right: 0, zIndex: 15,
        top: cmp.props.fixedPosition === 'top' ? `${cmp.props.fixedOffset || 0}px` : undefined,
        bottom: cmp.props.fixedPosition === 'bottom' ? `${cmp.props.fixedOffset || 0}px` : undefined
      } : {}) }}
      className={`relative group transition-all duration-150 ${
        esSeleccionado 
          ? 'outline outline-2 outline-blue-500 z-20 shadow-sm' 
          : isHovered && !modoVistaPrevia
            ? 'outline outline-1 outline-blue-400/80 outline-dashed z-10' 
            : ''
      } ${isDragging && draggedItem?.id === cmp.id ? 'opacity-40 scale-[0.98]' : ''}`}
    >
      {/* Indicador de soltado (Figma line / container glow) */}
      {isCurrentHoverTarget && (
        <DropIndicator
          position={hoverTarget.position}
          orientation={hoverTarget.orientation}
          isValid={hoverTarget.isValid}
        />
      )}

      {/* Etiqueta flotante al pasar el mouse por encima (Hover inspector tipo Figma) */}
      {!modoVistaPrevia && isHovered && !esSeleccionado && (
        <div className="absolute -top-4 right-0 bg-blue-500/90 text-[9px] text-white px-1.5 py-0.2 rounded-t font-mono pointer-events-none z-20 shadow">
          {cmp.etiqueta || def?.name || cmp.tipo}
        </div>
      )}

      {/* Badge de selecciÃ³n activo con nombre y botÃ³n de eliminar */}
      {!modoVistaPrevia && esSeleccionado && (
        <div className="absolute -top-6 left-0 bg-blue-600 text-[10px] text-white px-2 py-0.5 rounded-t flex items-center gap-1.5 z-30 font-medium shadow-md">
          <Icon name="grip" className="w-3 h-3 cursor-grab" />
          <span>{cmp.etiqueta || def?.name || cmp.tipo}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEliminarComponente(cmp.id);
            }}
            className="hover:text-red-200 ml-1"
            title="Eliminar componente (Delete / Backspace)"
          >
            <Icon name="trash" className="w-3 h-3" />
          </button>
        </div>
      )}

      {elementoInterno}
      {!modoVistaPrevia && esSeleccionado && esContenedor && <div className="absolute inset-0 pointer-events-none z-30">
        {['n','s','e','w','ne','nw','se','sw'].map(edge => <button key={edge} type="button" aria-label={`Resize ${edge}`} className={`pointer-events-auto absolute h-2.5 w-2.5 rounded-sm border border-white bg-blue-500 shadow ${edge.includes('n') ? 'top-[-5px]' : edge.includes('s') ? 'bottom-[-5px]' : 'top-1/2 -translate-y-1/2'} ${edge.includes('w') ? 'left-[-5px]' : edge.includes('e') ? 'right-[-5px]' : 'left-1/2 -translate-x-1/2'} ${edge.length === 1 ? (edge === 'n' || edge === 's' ? 'cursor-ns-resize' : 'cursor-ew-resize') : edge === 'ne' || edge === 'sw' ? 'cursor-nesw-resize' : 'cursor-nwse-resize'}`} onPointerDown={event => {
          event.preventDefault(); event.stopPropagation();
          const host = event.currentTarget.parentElement.parentElement;
          const rect = host.getBoundingClientRect();
          const scaleX = rect.width / Math.max(host.offsetWidth, 1); const scaleY = rect.height / Math.max(host.offsetHeight, 1);
          const startX = event.clientX, startY = event.clientY, startW = rect.width / scaleX, startH = rect.height / scaleY;
          event.currentTarget.setPointerCapture(event.pointerId);
          const move = e => { const dx = (e.clientX - startX) / scaleX, dy = (e.clientY - startY) / scaleY; const next = {};
            if (edge.includes('e') || edge.includes('w')) next.width = `${Math.max(24, Math.round(startW + (edge.includes('w') ? -dx : dx)))}px`;
            if (edge.includes('n') || edge.includes('s')) next.height = `${Math.max(24, Math.round(startH + (edge.includes('n') ? -dy : dy)))}px`;
            Object.entries(next).forEach(([key, value]) => onActualizarProp?.(key, value));
          };
          const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
          window.addEventListener('pointermove', move); window.addEventListener('pointerup', up, { once: true });
        }} />)}
      </div>}
    </div>
  );
};
