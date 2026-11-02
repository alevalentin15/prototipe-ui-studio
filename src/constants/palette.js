export const categoriasPaleta = {
  'Elementos Base': [
    { tipo: 'texto', etiqueta: 'Texto / Encabezado', icon: 'type', defaultProps: { texto: 'Nuevo Texto', fontSize: '16px', fontWeight: 'normal', color: '#e2e8f0', align: 'left' } },
    { tipo: 'boton', etiqueta: 'Botón de Acción', icon: 'mouse', defaultProps: { texto: 'Hacer Clic', bg: '#3b82f6', textColor: '#ffffff', borderRadius: '8px', padding: '10px 18px', ancho: 'auto' } },
    { tipo: 'input', etiqueta: 'Campo de Texto (Input)', icon: 'square', defaultProps: { placeholder: 'Escribe algo...', bg: '#1e293b', textColor: '#ffffff', borderRadius: '8px', padding: '10px' } },
    { tipo: 'switch', etiqueta: 'Interruptor (Switch/Toggle)', icon: 'toggle', defaultProps: { etiqueta: 'Activar función', checked: true } }
  ],
  'Estructura y Layout': [
    { tipo: 'contenedor', etiqueta: 'Contenedor Flex', icon: 'box', defaultProps: { bg: '#1e293b', padding: '16px', borderRadius: '12px', direccion: 'column', gap: '8px' } },
    { tipo: 'tarjeta', etiqueta: 'Tarjeta de Contenido', icon: 'card', defaultProps: { bg: '#1e293b', padding: '16px', borderRadius: '12px', gap: '12px' } }
  ],
  'Capas Especiales (Móvil/Web)': [
    { tipo: 'bottomsheet', etiqueta: 'Bottom Sheet (Móvil)', icon: 'sheet', defaultProps: { texto: 'Desplegar Bottom Sheet', bg: '#8b5cf6', textColor: '#ffffff', borderRadius: '8px', padding: '10px' }, esTriggerOverlay: true },
    { tipo: 'dialog', etiqueta: 'Diálogo Modal', icon: 'layers', defaultProps: { texto: 'Abrir Diálogo Modal', bg: '#059669', textColor: '#ffffff', borderRadius: '8px', padding: '10px' }, esTriggerOverlay: true }
  ]
};
