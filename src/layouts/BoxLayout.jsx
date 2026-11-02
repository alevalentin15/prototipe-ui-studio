import React from 'react';

export const ALIGNMENT_MAP = {
  'top-start': { justifyContent: 'flex-start', alignItems: 'flex-start' },
  'top-center': { justifyContent: 'center', alignItems: 'flex-start' },
  'top-end': { justifyContent: 'flex-end', alignItems: 'flex-start' },
  'center-start': { justifyContent: 'flex-start', alignItems: 'center' },
  'center': { justifyContent: 'center', alignItems: 'center' },
  'center-end': { justifyContent: 'flex-end', alignItems: 'center' },
  'bottom-start': { justifyContent: 'flex-start', alignItems: 'flex-end' },
  'bottom-center': { justifyContent: 'center', alignItems: 'flex-end' },
  'bottom-end': { justifyContent: 'flex-end', alignItems: 'flex-end' }
};

export const BoxLayout = ({ props, children, style = {}, className = "" }) => {
  const alignment = props.alignment || 'center';
  const flexAlign = ALIGNMENT_MAP[alignment] || ALIGNMENT_MAP.center;

  // Si tiene margen y el ancho es 100%, evitamos desbordamiento usando auto y max-width
  const tieneMargen = props.margin && props.margin !== '0' && props.margin !== '0px';
  const anchoCalculado = (props.width === '100%' && tieneMargen) ? 'auto' : (props.width || '100%');

  const boxStyle = {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxSizing: 'border-box',
    width: anchoCalculado,
    maxWidth: '100%',
    alignSelf: props.width === '100%' ? 'stretch' : undefined,
    height: props.height || 'auto',
    minHeight: props.minHeight || '80px',
    padding: props.padding ?? '16px',
    margin: props.margin ?? '0',
    background: props.bg || '#1e293b',
    borderRadius: props.borderRadius || '12px',
    gap: props.gap || '8px',
    border: props.border || undefined,
    overflow: 'hidden',
    flexGrow: props.weight !== undefined ? Number(props.weight) : undefined,
    ...flexAlign,
    ...style
  };

  return (
    <div style={boxStyle} className={`transition-all ${className}`}>
      {children}
    </div>
  );
};
