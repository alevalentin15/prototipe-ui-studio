import React from 'react';

const JUSTIFY_MAP = {
  'start': 'flex-start',
  'center': 'center',
  'end': 'flex-end',
  'space-between': 'space-between',
  'space-around': 'space-around'
};

const ALIGN_ITEMS_MAP = {
  'start': 'flex-start',
  'center': 'center',
  'end': 'flex-end',
  'stretch': 'stretch'
};

export const ColumnLayout = ({ props, children, style = {}, className = "" }) => {
  const verticalArrangement = props.verticalArrangement || 'start';
  const horizontalAlignment = props.horizontalAlignment || 'start';
  const isRowLegacy = props.direccion === 'row';

  const tieneMargen = props.margin && props.margin !== '0' && props.margin !== '0px';
  const anchoCalculado = (props.width === '100%' && tieneMargen) ? 'auto' : (props.width || '100%');

  const columnStyle = {
    display: 'flex',
    flexDirection: isRowLegacy ? 'row' : 'column',
    justifyContent: JUSTIFY_MAP[verticalArrangement] || 'flex-start',
    alignItems: ALIGN_ITEMS_MAP[horizontalAlignment] || 'flex-start',
    gap: props.gap || '12px',
    padding: props.padding ?? '16px',
    margin: props.margin ?? '0',
    width: anchoCalculado,
    maxWidth: '100%',
    alignSelf: props.width === '100%' ? 'stretch' : undefined,
    height: props.height || 'auto',
    minHeight: props.minHeight || '60px',
    background: props.bg || '#1e293b',
    borderRadius: props.borderRadius || '12px',
    border: props.border || undefined,
    boxSizing: 'border-box',
    position: 'relative',
    overflowY: props.scrollable ? 'auto' : undefined,
    ...style
  };

  return (
    <div style={columnStyle} className={`transition-all ${className}`}>
      {children}
    </div>
  );
};
