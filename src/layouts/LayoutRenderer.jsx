import React from 'react';
import { BoxLayout } from './BoxLayout.jsx';
import { RowLayout } from './RowLayout.jsx';
import { ColumnLayout } from './ColumnLayout.jsx';

export const LayoutRenderer = ({ tipo, props, children, style = {}, className = "" }) => {
  const normTipo = String(tipo).toLowerCase();

  if (normTipo === 'box') {
    return <BoxLayout props={props} style={style} className={className}>{children}</BoxLayout>;
  }

  if (normTipo === 'row' || normTipo === 'lazyrow' || normTipo === 'flowrow' || normTipo === 'floxrow' || (normTipo === 'contenedor' && props.direccion === 'row')) {
    return <RowLayout props={props} style={style} className={className}>{children}</RowLayout>;
  }

  // Column, Card, Tarjeta o Contenedor estándar
  return <ColumnLayout props={props} style={style} className={className}>{children}</ColumnLayout>;
};
