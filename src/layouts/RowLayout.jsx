import React from 'react';

const JUSTIFY_MAP = {
  'start': 'flex-start',
  'center': 'center',
  'end': 'flex-end',
  'space-between': 'space-between',
  'space-around': 'space-around',
  'space-evenly': 'space-evenly'
};

const ALIGN_ITEMS_MAP = {
  'top': 'flex-start',
  'center': 'center',
  'bottom': 'flex-end',
  'stretch': 'stretch'
};

export const RowLayout = ({ props, children, style = {}, className = "" }) => {
  const horizontalArrangement = props.horizontalArrangement || 'start';
  const verticalAlignment = props.verticalAlignment || 'center';

  const tieneMargen = props.margin && props.margin !== '0' && props.margin !== '0px';
  const anchoCalculado = (props.width === '100%' && tieneMargen) ? 'auto' : (props.width || '100%');

  const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: props.wrap || ['flowrow', 'floxrow'].includes(String(props.layoutType || '').toLowerCase()) ? 'wrap' : 'nowrap',
    justifyContent: JUSTIFY_MAP[horizontalArrangement] || 'flex-start',
    alignItems: ALIGN_ITEMS_MAP[verticalAlignment] || 'center',
    gap: props.gap || '12px',
    padding: props.padding ?? '12px',
    margin: props.margin ?? '0',
    width: anchoCalculado,
    maxWidth: '100%',
    alignSelf: props.width === '100%' ? 'stretch' : undefined,
    height: props.height || 'auto',
    minHeight: props.minHeight || '50px',
    background: props.bg || 'transparent',
    borderRadius: props.borderRadius || '8px',
    border: props.border || undefined,
    boxSizing: 'border-box',
    position: 'relative',
    overflowX: props.scrollable ? 'auto' : undefined,
    overflowY: props.scrollable ? 'hidden' : undefined,
    ...style
  };

  return (
    <div style={rowStyle} className={`transition-all ${className}`}>
      {children}
    </div>
  );
};
