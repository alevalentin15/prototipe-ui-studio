export const proyectosIniciales = [
  {
    id: 'proj-1',
    nombre: 'App Móvil Comercio',
    tema: {
      modo: 'claro',
      paletaPersonalizada: {}
    },
    variables: { mostrarOferta: true, contador: 0 },
    vistas: [
      {
        id: 'vista-1',
        nombre: 'Inicio Móvil',
        dispositivo: 'movil',
        ancho: 375,
        alto: 812,
        padding: 0,
        gap: 12,
        direccion: 'column',
        bg: 'background',
        componentes: [
          {
            id: 'cmp-1',
            tipo: 'Text',
            etiqueta: 'Título Bienvenida',
            props: { texto: '¡Hola de nuevo! 👋', fontSize: '22px', fontWeight: 'bold', color: 'onBackground', align: 'left' }
          },
          {
            id: 'cmp-2',
            tipo: 'SearchBar',
            etiqueta: 'Buscador de Productos',
            props: { placeholder: 'Buscar artículos...', bg: 'surfaceVariant', textColor: 'onSurfaceVariant', borderRadius: '28px', padding: '12px 18px' }
          },
          {
            id: 'cmp-3',
            tipo: 'Card',
            etiqueta: 'Banner Promocional',
            props: { bg: 'primaryContainer', textColor: 'onPrimaryContainer', borderRadius: '16px', padding: '16px', gap: '8px', visibleWhen: 'mostrarOferta == true' },
            hijos: [
              { id: 'cmp-3-1', tipo: 'Text', etiqueta: 'Texto Promo', props: { texto: '¡50% de Descuento Hoy!', fontSize: '18px', fontWeight: 'bold', color: 'onPrimaryContainer' } },
              { id: 'cmp-3-2', tipo: 'Button', etiqueta: 'Boton Oferta', props: { texto: 'Obtener Oferta', bg: 'primary', textColor: 'onPrimary', borderRadius: '20px', padding: '8px 18px' }, accion: { tipo: 'bottomsheet', payload: 'Detalles de la promoción exclusiva aplicados a tu cuenta.' } }
            ]
          },
          {
            id: 'cmp-4',
            tipo: 'Button',
            etiqueta: 'Abrir Menú Inferior',
            props: { texto: 'Abrir Opciones Rápidas', bg: 'secondary', textColor: 'onSecondary', borderRadius: '20px', padding: '12px 20px', width: 'auto' },
            accion: { tipo: 'bottomsheet', payload: 'Acciones rápidas del usuario:\n1. Ver Perfil\n2. Métodos de Pago\n3. Soporte' }
          },
          {
            id: 'cmp-5',
            tipo: 'Button',
            etiqueta: 'Diálogo de Confirmación',
            props: { texto: 'Confirmar Pedido', bg: 'primary', textColor: 'onPrimary', borderRadius: '20px', padding: '12px 20px', width: 'auto' },
            accion: { tipo: 'dialog', payload: '¿Deseas procesar tu compra por $49.99 USD?' }
          },
          { id: 'cmp-nav-switch', tipo: 'Switch', etiqueta: 'Controlar oferta con variable', props: { etiqueta: 'Mostrar banner promocional', variableName: 'mostrarOferta' } },
          { id: 'cmp-nav-hide', tipo: 'Button', etiqueta: 'Ocultar oferta con acción', props: { texto: 'Ocultar promoción', bg: 'surfaceVariant', textColor: 'onSurfaceVariant', padding: '10px 16px' }, accion: { tipo: 'setVariable', variable: 'mostrarOferta', value: 'false' } },
          { id: 'cmp-go-detail', tipo: 'Button', etiqueta: 'Navegar al detalle', props: { texto: 'Ver detalle del producto', bg: 'primary', textColor: 'onPrimary', padding: '10px 16px' }, accion: { tipo: 'navegar', vistaId: 'vista-2' } },
          { id: 'cmp-bottom-navigation', tipo: 'NavigationBar', etiqueta: 'Navegación del proyecto', props: { items: 'Inicio:home:vista-1, Producto:search:vista-2', activo: 0, navigationStyle: 'pill', showLabels: true, fixedPosition: 'bottom', applyToScreens: 'all', bg: 'surface', activeContainer: 'secondaryContainer' } }
        ]
      },
      {
        id: 'vista-2',
        nombre: 'Detalle de Producto',
        dispositivo: 'movil',
        ancho: 375,
        alto: 812,
        padding: 0,
        gap: 16,
        direccion: 'column',
        bg: 'background',
        componentes: [
          { id: 'cmp-2-1', tipo: 'Text', etiqueta: 'Título Producto', props: { texto: 'Audífonos Bluetooth Pro', fontSize: '24px', fontWeight: 'bold', color: 'onBackground' } },
          { id: 'cmp-2-2', tipo: 'Text', etiqueta: 'Precio', props: { texto: '$199.99 USD', fontSize: '20px', fontWeight: '600', color: 'primary' } },
          { id: 'cmp-2-3', tipo: 'Button', etiqueta: 'Comprar', props: { texto: 'Comprar Ahora', bg: 'primary', textColor: 'onPrimary', borderRadius: '20px', padding: '14px' }, accion: { tipo: 'alerta', payload: '¡Compra procesada con éxito!' } },
          { id: 'cmp-detail-topbar', tipo: 'TopAppBar', etiqueta: 'Barra superior de detalle', props: { titulo: 'Detalle de producto', navigationIcon: 'arrowLeft', showNavigationIcon: true, showActionIcon: false, fixedPosition: 'top', applyToScreens: 'current', bg: 'surface' }, accion: { tipo: 'navegar', vistaId: 'vista-1' } }
        ]
      }
    ]
  },
  {
    id: 'proj-2',
    nombre: 'Panel Web de Control',
    tema: {
      modo: 'claro',
      paletaPersonalizada: {}
    },
    vistas: [
      {
        id: 'vista-web-1',
        nombre: 'Dashboard Principal',
        dispositivo: 'web',
        ancho: 1024,
        alto: 640,
        padding: 0,
        gap: 16,
        direccion: 'column',
        bg: 'background',
        componentes: [
          { id: 'cmp-w1', tipo: 'Text', etiqueta: 'Encabezado Dashboard', props: { texto: 'Resumen de Métricas del Sistema', fontSize: '28px', fontWeight: 'bold', color: 'onBackground' } },
          {
            id: 'cmp-w2',
            tipo: 'Row',
            etiqueta: 'Fila Métricas',
            props: { bg: 'transparent', gap: '16px', padding: '0', horizontalArrangement: 'start' },
            hijos: [
              {
                id: 'cmp-w2-1', tipo: 'Card', etiqueta: 'Tarjeta Usuarios', props: { bg: 'surfaceVariant', padding: '16px', borderRadius: '16px', width: '48%' },
                hijos: [
                  { id: 'cmp-w2-1a', tipo: 'Text', etiqueta: 'Label Users', props: { texto: 'Usuarios Activos', fontSize: '14px', color: 'onSurfaceVariant' } },
                  { id: 'cmp-w2-1b', tipo: 'Text', etiqueta: 'Valor Users', props: { texto: '12,450', fontSize: '24px', fontWeight: 'bold', color: 'primary' } }
                ]
              },
              {
                id: 'cmp-w2-2', tipo: 'Card', etiqueta: 'Tarjeta Ventas', props: { bg: 'surfaceVariant', padding: '16px', borderRadius: '16px', width: '48%' },
                hijos: [
                  { id: 'cmp-w2-2a', tipo: 'Text', etiqueta: 'Label Ventas', props: { texto: 'Ventas Mensuales', fontSize: '14px', color: 'onSurfaceVariant' } },
                  { id: 'cmp-w2-2b', tipo: 'Text', etiqueta: 'Valor Ventas', props: { texto: '$34,800 USD', fontSize: '24px', fontWeight: 'bold', color: 'primary' } }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
