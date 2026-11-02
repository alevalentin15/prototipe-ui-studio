/**
 * REGISTRO CENTRALIZADO DE COMPONENTES
 * Define el catálogo unificado inspirado en Jetpack Compose & Material 3.
 * Todos los componentes consumen tokens de diseño semánticos (primary, surface, background, etc.)
 */

export const COMPONENT_CATEGORIES = {
  LAYOUTS: 'Layouts',
  TEXTO: 'Texto',
  ACCIONES: 'Acciones',
  ENTRADAS: 'Entradas',
  SELECCION: 'Selección',
  VISUALIZACION: 'Visualización',
  CONTENEDORES: 'Contenedores',
  NAVEGACION: 'Navegación',
  FEEDBACK: 'Feedback / Estado',
  SUPERPOSICIONES: 'Superposiciones',
  UTILIDADES: 'Utilidades'
};

export const COMPONENT_DEFINITIONS = {
  // ==================== LAYOUTS ====================
  Box: {
    type: 'Box',
    aliases: ['box'],
    name: 'Box (Superposición)',
    category: COMPONENT_CATEGORIES.LAYOUTS,
    icon: 'square',
    description: 'Contenedor que permite superponer elementos y posicionarlos con alineación flexible.',
    isContainer: true,
    defaultProps: {
      bg: 'surface',
      padding: '16px',
      margin: '0',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '100%',
      height: 'auto',
      minHeight: '80px',
      alignment: 'center',
      gap: '8px'
    },
    propertySections: ['dimensiones', 'layout_box', 'espaciado', 'estilos']
  },

  Row: {
    type: 'Row',
    aliases: ['row'],
    name: 'Row (Fila Horizontal)',
    category: COMPONENT_CATEGORIES.LAYOUTS,
    icon: 'layers',
    description: 'Organiza componentes horizontalmente en fila con espaciado y alineación.',
    isContainer: true,
    defaultProps: {
      bg: 'transparent',
      padding: '12px',
      margin: '0',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '100%',
      height: 'auto',
      horizontalArrangement: 'start',
      verticalAlignment: 'center',
      gap: '12px',
      wrap: false
    },
    propertySections: ['dimensiones', 'layout_row', 'espaciado', 'estilos']
  },

  LazyColumn: {
    type: 'LazyColumn', aliases: ['lazycolumn'], name: 'LazyColumn (Lista Vertical)', category: COMPONENT_CATEGORIES.LAYOUTS,
    icon: 'box', description: 'Lista vertical desplazable con alto configurable.', isContainer: true,
    defaultProps: { bg: 'transparent', width: '100%', height: '240px', padding: '0', gap: '8px', scrollable: true },
    propertySections: ['dimensiones', 'layout_column', 'espaciado', 'estilos']
  },
  LazyRow: {
    type: 'LazyRow', aliases: ['lazyrow'], name: 'LazyRow (Lista Horizontal)', category: COMPONENT_CATEGORIES.LAYOUTS,
    icon: 'layers', description: 'Lista horizontal desplazable con ancho configurable.', isContainer: true,
    defaultProps: { bg: 'transparent', width: '100%', height: 'auto', padding: '0', gap: '8px', scrollable: true },
    propertySections: ['dimensiones', 'layout_row', 'espaciado', 'estilos']
  },
  FlowRow: {
    type: 'FlowRow', aliases: ['flowrow', 'floxrow'], name: 'FlowRow (Fila con ajuste)', category: COMPONENT_CATEGORIES.LAYOUTS,
    icon: 'layers', description: 'Fila flexible que envuelve elementos a la siguiente línea.', isContainer: true,
    defaultProps: { bg: 'transparent', width: '100%', padding: '0', gap: '8px', wrap: true },
    propertySections: ['dimensiones', 'layout_row', 'espaciado', 'estilos']
  },

  Column: {
    type: 'Column',
    aliases: ['column', 'contenedor'],
    name: 'Column (Columna Vertical)',
    category: COMPONENT_CATEGORIES.LAYOUTS,
    icon: 'box',
    description: 'Organiza componentes verticalmente en columna respetando el orden y espacio.',
    isContainer: true,
    defaultProps: {
      bg: 'surface',
      padding: '16px',
      margin: '0',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '100%',
      height: 'auto',
      verticalArrangement: 'start',
      horizontalAlignment: 'stretch',
      gap: '12px'
    },
    propertySections: ['dimensiones', 'layout_column', 'espaciado', 'estilos']
  },

  // ==================== CONTENEDORES ====================
  Card: {
    type: 'Card',
    aliases: ['card', 'tarjeta'],
    name: 'Card (Tarjeta Elevada)',
    category: COMPONENT_CATEGORIES.CONTENEDORES,
    icon: 'card',
    description: 'Superficie elevada para agrupar contenido relacionado.',
    isContainer: true,
    defaultProps: {
      bg: 'surfaceVariant',
      textColor: 'onSurfaceVariant',
      padding: '16px',
      margin: '0',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '100%',
      height: 'auto',
      gap: '12px',
      direccion: 'column',
      horizontalAlignment: 'stretch',
      verticalAlignment: 'start'
    },
    propertySections: ['dimensiones', 'layout_column', 'espaciado', 'estilos']
  },

  ListItem: {
    type: 'ListItem',
    aliases: ['listitem', 'list_item'],
    name: 'ListItem (Fila de Lista)',
    category: COMPONENT_CATEGORIES.CONTENEDORES,
    icon: 'layers',
    description: 'Fila estándar de lista M3 con ícono líder, título, subtítulo y acción final.',
    isContainer: false,
    defaultProps: {
      headline: 'Título del Elemento',
      supportingText: 'Descripción secundaria o detalle',
      leadingIcon: 'box',
      trailingIcon: 'chevronRight',
      bg: 'surface',
      textColor: 'onSurface',
      borderRadius: '8px',
      padding: '12px 16px',
      margin: '0',
      width: '100%',
      maxWidth: '100%'
    },
    propertySections: ['contenido_listitem', 'dimensiones', 'espaciado', 'estilos']
  },

  // ==================== NAVEGACIÓN ====================
  TopAppBar: {
    type: 'TopAppBar',
    aliases: ['topappbar', 'appbar'],
    name: 'TopAppBar (Barra Superior)',
    category: COMPONENT_CATEGORIES.NAVEGACION,
    icon: 'menu',
    description: 'Barra superior de aplicación Material 3 con título e íconos de navegación.',
    isContainer: false,
    defaultProps: {
      titulo: 'Título de Pantalla',
      navigationIcon: 'menu',
      actionIcon: 'moreVertical',
      bg: 'surface',
      textColor: 'onSurface',
      padding: '12px 16px',
      margin: '0',
      width: '100%',
      maxWidth: '100%'
    },
    propertySections: ['contenido_topappbar', 'dimensiones', 'espaciado', 'estilos']
  },

  NavigationBar: {
    type: 'NavigationBar',
    aliases: ['navigationbar', 'bottomnav'],
    name: 'NavigationBar (Barra Inferior)',
    category: COMPONENT_CATEGORIES.NAVEGACION,
    icon: 'home',
    description: 'Barra de navegación inferior con destinos principales y píldora activa.',
    isContainer: false,
    defaultProps: {
      items: 'Inicio:home, Buscar:search, Perfil:user',
      activo: 0,
      bg: 'surface',
      textColor: 'onSurfaceVariant',
      activeColor: 'primary',
      activeContainer: 'secondaryContainer',
      padding: '8px 12px',
      margin: '0',
      width: '100%',
      maxWidth: '100%'
    },
    propertySections: ['contenido_navigationbar', 'dimensiones', 'espaciado', 'estilos']
  },

  Tabs: {
    type: 'Tabs',
    aliases: ['tabs', 'tabrow'],
    name: 'Tabs (Pestañas M3)',
    category: COMPONENT_CATEGORIES.NAVEGACION,
    icon: 'layers',
    description: 'Barra horizontal de pestañas con indicador de selección deslizante.',
    isContainer: false,
    defaultProps: {
      tabs: 'General, Detalles, Configuración',
      activo: 0,
      bg: 'surface',
      textColor: 'onSurface',
      indicatorColor: 'primary',
      padding: '0',
      margin: '0',
      width: '100%',
      maxWidth: '100%'
    },
    propertySections: ['contenido_tabs', 'dimensiones', 'espaciado', 'estilos']
  },

  // ==================== FEEDBACK / ESTADO ====================
  Avatar: {
    type: 'Avatar',
    aliases: ['avatar'],
    name: 'Avatar (Foto / Iniciales)',
    category: COMPONENT_CATEGORIES.FEEDBACK,
    icon: 'user',
    description: 'Representación visual de usuario en forma circular con iniciales o imagen.',
    isContainer: false,
    defaultProps: {
      texto: 'JD',
      src: '',
      size: '44px',
      bg: 'secondaryContainer',
      textColor: 'onSecondaryContainer',
      borderRadius: '50%',
      margin: '0'
    },
    propertySections: ['contenido_avatar', 'dimensiones', 'espaciado', 'estilos']
  },

  Badge: {
    type: 'Badge',
    aliases: ['badge'],
    name: 'Badge (Insignia Numérica)',
    category: COMPONENT_CATEGORIES.FEEDBACK,
    icon: 'bell',
    description: 'Insignia pequeña de aviso o conteo numérico no leído.',
    isContainer: false,
    defaultProps: {
      texto: '3',
      bg: 'error',
      textColor: 'onError',
      borderRadius: '10px',
      padding: '2px 6px',
      margin: '0'
    },
    propertySections: ['contenido_badge', 'dimensiones', 'espaciado', 'estilos']
  },

  CircularProgressIndicator: {
    type: 'CircularProgressIndicator',
    aliases: ['circularprogress', 'spinner'],
    name: 'CircularProgress (Spinner)',
    category: COMPONENT_CATEGORIES.FEEDBACK,
    icon: 'loader',
    description: 'Indicador de carga circular continuo estilo Material 3.',
    isContainer: false,
    defaultProps: {
      color: 'primary',
      size: '36px',
      strokeWidth: '4px',
      margin: '8px auto'
    },
    propertySections: ['contenido_circularprogress', 'dimensiones', 'espaciado']
  },

  LinearProgressIndicator: {
    type: 'LinearProgressIndicator',
    aliases: ['linearprogress', 'progressbar'],
    name: 'LinearProgress (Barra Carga)',
    category: COMPONENT_CATEGORIES.FEEDBACK,
    icon: 'minus',
    description: 'Barra de progreso horizontal con porcentaje visual de avance.',
    isContainer: false,
    defaultProps: {
      progress: 65,
      color: 'primary',
      trackColor: 'surfaceVariant',
      height: '6px',
      width: '100%',
      maxWidth: '100%',
      borderRadius: '4px',
      margin: '8px 0'
    },
    propertySections: ['contenido_linearprogress', 'dimensiones', 'espaciado']
  },

  Snackbar: {
    type: 'Snackbar',
    aliases: ['snackbar', 'toast_m3'],
    name: 'Snackbar (Barra Mensaje)',
    category: COMPONENT_CATEGORIES.FEEDBACK,
    icon: 'sheet',
    description: 'Mensaje emergente inferior de corta duración con botón de acción.',
    isContainer: false,
    defaultProps: {
      mensaje: 'Elemento actualizado correctamente',
      actionText: 'Deshacer',
      bg: 'inverseSurface',
      textColor: 'inverseOnSurface',
      actionColor: 'inversePrimary',
      borderRadius: '8px',
      padding: '12px 16px',
      margin: '8px 0',
      width: '100%',
      maxWidth: '100%'
    },
    propertySections: ['contenido_snackbar', 'dimensiones', 'espaciado', 'estilos']
  },

  // ==================== TEXTO ====================
  Text: {
    type: 'Text',
    aliases: ['text', 'texto'],
    name: 'Text (Texto / Encabezado)',
    category: COMPONENT_CATEGORIES.TEXTO,
    icon: 'type',
    description: 'Componente básico para mostrar etiquetas, títulos o párrafos.',
    isContainer: false,
    defaultProps: {
      texto: 'Nuevo Texto',
      fontSize: '16px',
      fontWeight: 'normal',
      color: 'onSurface',
      align: 'left',
      bg: 'transparent',
      margin: '0',
      padding: '0',
      width: 'auto'
    },
    propertySections: ['contenido_texto', 'dimensiones', 'espaciado', 'estilos']
  },

  // ==================== ACCIONES ====================
  Button: {
    type: 'Button',
    aliases: ['button', 'boton'],
    name: 'Button (Botón de Acción)',
    category: COMPONENT_CATEGORIES.ACCIONES,
    icon: 'mouse',
    description: 'Botón interactivo con soporte para eventos y personalización de estilos.',
    isContainer: false,
    defaultProps: {
      texto: 'Hacer Clic',
      bg: 'primary',
      textColor: 'onPrimary',
      borderRadius: '20px',
      padding: '10px 24px',
      margin: '0',
      width: 'auto',
      fontSize: '14px',
      fontWeight: '500'
    },
    propertySections: ['contenido_boton', 'dimensiones', 'espaciado', 'estilos']
  },

  IconButton: {
    type: 'IconButton',
    aliases: ['iconbutton', 'icon_button'],
    name: 'IconButton (Botón de Ícono)',
    category: COMPONENT_CATEGORIES.ACCIONES,
    icon: 'settings',
    description: 'Botón circular de acción rápida basado en ícono.',
    isContainer: false,
    defaultProps: {
      icon: 'settings',
      bg: 'transparent',
      textColor: 'onSurfaceVariant',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      margin: '0',
      padding: '8px'
    },
    propertySections: ['contenido_iconbutton', 'dimensiones', 'espaciado', 'estilos']
  },

  FAB: {
    type: 'FAB',
    aliases: ['fab', 'floatingactionbutton'],
    name: 'FAB (Botón Flotante)',
    category: COMPONENT_CATEGORIES.ACCIONES,
    icon: 'plus',
    description: 'Floating Action Button representativo de Material 3 con elevación.',
    isContainer: false,
    defaultProps: {
      icon: 'plus',
      texto: '',
      bg: 'primaryContainer',
      textColor: 'onPrimaryContainer',
      borderRadius: '16px',
      width: '56px',
      height: '56px',
      margin: '0',
      padding: '16px'
    },
    propertySections: ['contenido_fab', 'dimensiones', 'espaciado', 'estilos']
  },

  // ==================== ENTRADAS ====================
  TextField: {
    type: 'TextField',
    aliases: ['textfield', 'input'],
    name: 'TextField (Campo de Entrada)',
    category: COMPONENT_CATEGORIES.ENTRADAS,
    icon: 'square',
    description: 'Campo de texto para entrada de usuario y formularios.',
    isContainer: false,
    defaultProps: {
      placeholder: 'Escribe algo...',
      bg: 'surfaceVariant',
      textColor: 'onSurface',
      borderRadius: '8px',
      padding: '12px 16px',
      margin: '0',
      width: '100%',
      maxWidth: '100%',
      fontSize: '14px'
    },
    propertySections: ['contenido_input', 'dimensiones', 'espaciado', 'estilos']
  },

  SearchBar: {
    type: 'SearchBar',
    aliases: ['searchbar', 'search'],
    name: 'SearchBar (Buscador M3)',
    category: COMPONENT_CATEGORIES.ENTRADAS,
    icon: 'search',
    description: 'Barra de búsqueda en forma de píldora con ícono integrado.',
    isContainer: false,
    defaultProps: {
      placeholder: 'Buscar en la aplicación...',
      bg: 'surfaceVariant',
      textColor: 'onSurfaceVariant',
      borderRadius: '28px',
      padding: '10px 18px',
      margin: '0',
      width: '100%',
      maxWidth: '100%'
    },
    propertySections: ['contenido_searchbar', 'dimensiones', 'espaciado', 'estilos']
  },

  Checkbox: {
    type: 'Checkbox',
    aliases: ['checkbox'],
    name: 'Checkbox (Casilla de Selección)',
    category: COMPONENT_CATEGORIES.ENTRADAS,
    icon: 'check',
    description: 'Casilla interactiva para opciones múltiples o términos.',
    isContainer: false,
    defaultProps: {
      etiqueta: 'Opción Checkbox',
      checked: true,
      color: 'primary',
      textColor: 'onSurface',
      margin: '0',
      padding: '6px'
    },
    propertySections: ['contenido_checkbox', 'dimensiones', 'espaciado', 'estilos']
  },

  RadioButton: {
    type: 'RadioButton',
    aliases: ['radiobutton', 'radio'],
    name: 'RadioButton (Botón de Opción)',
    category: COMPONENT_CATEGORIES.ENTRADAS,
    icon: 'disc',
    description: 'Selector de opción única en grupos excluyentes.',
    isContainer: false,
    defaultProps: {
      etiqueta: 'Opción Radio',
      selected: true,
      color: 'primary',
      textColor: 'onSurface',
      margin: '0',
      padding: '6px'
    },
    propertySections: ['contenido_radio', 'dimensiones', 'espaciado', 'estilos']
  },

  Slider: {
    type: 'Slider',
    aliases: ['slider'],
    name: 'Slider (Control Deslizante)',
    category: COMPONENT_CATEGORIES.ENTRADAS,
    icon: 'sliders',
    description: 'Deslizador numérico continuo con rango configurable.',
    isContainer: false,
    defaultProps: {
      etiqueta: 'Nivel / Volumen',
      value: 60,
      min: 0,
      max: 100,
      step: 1,
      color: 'primary',
      textColor: 'onSurface',
      width: '100%',
      maxWidth: '100%',
      margin: '0',
      padding: '8px'
    },
    propertySections: ['contenido_slider', 'dimensiones', 'espaciado', 'estilos']
  },

  DropdownMenu: {
    type: 'DropdownMenu',
    aliases: ['dropdown', 'dropdownmenu', 'select'],
    name: 'DropdownMenu (Desplegable)',
    category: COMPONENT_CATEGORIES.ENTRADAS,
    icon: 'menu',
    description: 'Menú desplegable con lista de opciones seleccionables.',
    isContainer: false,
    defaultProps: {
      etiqueta: 'Seleccionar opción',
      opciones: 'Opción 1, Opción 2, Opción 3',
      seleccionado: 'Opción 1',
      bg: 'surfaceVariant',
      textColor: 'onSurface',
      borderRadius: '8px',
      padding: '10px 14px',
      margin: '0',
      width: '100%',
      maxWidth: '100%'
    },
    propertySections: ['contenido_dropdown', 'dimensiones', 'espaciado', 'estilos']
  },

  Switch: {
    type: 'Switch',
    aliases: ['switch'],
    name: 'Switch (Interruptor)',
    category: COMPONENT_CATEGORIES.ENTRADAS,
    icon: 'toggle',
    description: 'Interruptor binario para activar o desactivar estados.',
    isContainer: false,
    defaultProps: {
      etiqueta: 'Activar función',
      checked: true,
      bg: 'transparent',
      textColor: 'onSurface',
      color: 'primary',
      padding: '8px',
      margin: '0',
      width: '100%',
      maxWidth: '100%'
    },
    propertySections: ['contenido_switch', 'dimensiones', 'espaciado', 'estilos']
  },

  // ==================== SELECCIÓN ====================
  Chip: {
    type: 'Chip',
    aliases: ['chip', 'assistchip', 'filterchip'],
    name: 'Chip (Etiqueta M3)',
    category: COMPONENT_CATEGORIES.SELECCION,
    icon: 'tag',
    description: 'Elemento compacto tipo píldora para filtros o selecciones.',
    isContainer: false,
    defaultProps: {
      texto: 'Filtro Activo',
      selected: false,
      icon: 'tag',
      bg: 'surfaceVariant',
      textColor: 'onSurfaceVariant',
      activeBg: 'primaryContainer',
      activeTextColor: 'onPrimaryContainer',
      borderRadius: '8px',
      padding: '6px 14px',
      margin: '0'
    },
    propertySections: ['contenido_chip', 'dimensiones', 'espaciado', 'estilos']
  },

  // ==================== VISUALIZACIÓN ====================
  Image: {
    type: 'Image',
    aliases: ['image', 'imagen'],
    name: 'Image (Imagen / Banner)',
    category: COMPONENT_CATEGORIES.VISUALIZACION,
    icon: 'file',
    description: 'Muestra una imagen visual o placeholder de producto.',
    isContainer: false,
    defaultProps: {
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
      alt: 'Imagen de muestra',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '100%',
      height: '160px',
      objectFit: 'cover',
      margin: '0'
    },
    propertySections: ['contenido_imagen', 'dimensiones', 'espaciado', 'estilos']
  },

  // ==================== UTILIDADES ====================
  Divider: {
    type: 'Divider',
    aliases: ['divider', 'divisor'],
    name: 'Divider (Línea Separadora)',
    category: COMPONENT_CATEGORIES.UTILIDADES,
    icon: 'minus',
    description: 'Línea visual para separar secciones o bloques.',
    isContainer: false,
    defaultProps: {
      bg: 'outlineVariant',
      height: '1px',
      width: '100%',
      maxWidth: '100%',
      margin: '8px 0'
    },
    propertySections: ['dimensiones', 'espaciado', 'estilos']
  },

  Spacer: {
    type: 'Spacer',
    aliases: ['spacer', 'espaciador'],
    name: 'Spacer (Espacio Flexible)',
    category: COMPONENT_CATEGORIES.UTILIDADES,
    icon: 'box',
    description: 'Genera un espacio vacío para empujar o separar componentes.',
    isContainer: false,
    defaultProps: {
      height: '16px',
      width: '100%',
      maxWidth: '100%'
    },
    propertySections: ['dimensiones']
  },

  // ==================== SUPERPOSICIONES ====================
  BottomSheet: {
    type: 'BottomSheet',
    aliases: ['bottomsheet'],
    name: 'Bottom Sheet (Menú Inferior)',
    category: COMPONENT_CATEGORIES.SUPERPOSICIONES,
    icon: 'sheet',
    description: 'Gatillador que despliega una hoja modal desde la parte inferior.',
    isContainer: false,
    esTriggerOverlay: true,
    defaultProps: {
      texto: 'Desplegar Bottom Sheet',
      bg: 'primary',
      textColor: 'onPrimary',
      borderRadius: '20px',
      padding: '10px 18px',
      margin: '0',
      width: '100%',
      maxWidth: '100%'
    },
    propertySections: ['contenido_boton', 'dimensiones', 'espaciado', 'estilos']
  },

  Dialog: {
    type: 'Dialog',
    aliases: ['dialog'],
    name: 'Dialog (Diálogo Modal)',
    category: COMPONENT_CATEGORIES.SUPERPOSICIONES,
    icon: 'layers',
    description: 'Gatillador que abre un diálogo modal de confirmación.',
    isContainer: false,
    esTriggerOverlay: true,
    defaultProps: {
      texto: 'Abrir Diálogo Modal',
      bg: 'secondary',
      textColor: 'onSecondary',
      borderRadius: '20px',
      padding: '10px 18px',
      margin: '0',
      width: '100%',
      maxWidth: '100%'
    },
    propertySections: ['contenido_boton', 'dimensiones', 'espaciado', 'estilos']
  }
};

/**
 * Encuentra la definición de un componente dado su tipo o alias existente.
 */
// Bloque 3: variantes y patrones Material 3 que amplían el catálogo existente.
const definirComponenteBloque3 = (type, category, options = {}) => ({
  type,
  aliases: options.aliases || [type.toLowerCase()],
  name: options.name || type,
  category,
  icon: options.icon || 'square',
  description: options.description || `${type} Material 3.`,
  isContainer: Boolean(options.isContainer),
  defaultProps: options.defaultProps || {},
  propertySections: options.propertySections || ['dimensiones', 'espaciado', 'estilos']
});

Object.assign(COMPONENT_DEFINITIONS, {
  OutlinedButton: definirComponenteBloque3('OutlinedButton', COMPONENT_CATEGORIES.ACCIONES, {
    name: 'Outlined Button', icon: 'square', propertySections: ['contenido_boton', 'dimensiones', 'espaciado', 'estilos'],
    defaultProps: { texto: 'Outlined Button', bg: 'transparent', textColor: 'primary', border: '1px solid outline', borderRadius: '20px', padding: '10px 24px', width: 'auto' }
  }),
  ElevatedButton: definirComponenteBloque3('ElevatedButton', COMPONENT_CATEGORIES.ACCIONES, {
    name: 'Elevated Button', icon: 'mouse', propertySections: ['contenido_boton', 'dimensiones', 'espaciado', 'estilos'],
    defaultProps: { texto: 'Elevated Button', bg: 'surface', textColor: 'primary', borderRadius: '20px', padding: '10px 24px', width: 'auto', elevation: 2 }
  }),
  FilledTonalButton: definirComponenteBloque3('FilledTonalButton', COMPONENT_CATEGORIES.ACCIONES, {
    name: 'Filled Tonal Button', icon: 'mouse', propertySections: ['contenido_boton', 'dimensiones', 'espaciado', 'estilos'],
    defaultProps: { texto: 'Tonal Button', bg: 'secondaryContainer', textColor: 'onSecondaryContainer', borderRadius: '20px', padding: '10px 24px', width: 'auto' }
  }),
  TextButton: definirComponenteBloque3('TextButton', COMPONENT_CATEGORIES.ACCIONES, {
    name: 'Text Button', icon: 'type', propertySections: ['contenido_boton', 'dimensiones', 'espaciado', 'estilos'],
    defaultProps: { texto: 'Text Button', bg: 'transparent', textColor: 'primary', borderRadius: '20px', padding: '10px 12px', width: 'auto' }
  }),
  FilledIconButton: definirComponenteBloque3('FilledIconButton', COMPONENT_CATEGORIES.ACCIONES, {
    name: 'Filled Icon Button', icon: 'settings', propertySections: ['contenido_iconbutton', 'dimensiones', 'espaciado', 'estilos'],
    defaultProps: { icon: 'settings', bg: 'primary', textColor: 'onPrimary', borderRadius: '50%', width: '40px', height: '40px', padding: '8px' }
  }),
  FilledTonalIconButton: definirComponenteBloque3('FilledTonalIconButton', COMPONENT_CATEGORIES.ACCIONES, {
    name: 'Filled Tonal Icon Button', icon: 'settings', propertySections: ['contenido_iconbutton', 'dimensiones', 'espaciado', 'estilos'],
    defaultProps: { icon: 'settings', bg: 'secondaryContainer', textColor: 'onSecondaryContainer', borderRadius: '50%', width: '40px', height: '40px', padding: '8px' }
  }),
  OutlinedIconButton: definirComponenteBloque3('OutlinedIconButton', COMPONENT_CATEGORIES.ACCIONES, {
    name: 'Outlined Icon Button', icon: 'settings', propertySections: ['contenido_iconbutton', 'dimensiones', 'espaciado', 'estilos'],
    defaultProps: { icon: 'settings', bg: 'transparent', textColor: 'onSurfaceVariant', border: '1px solid outline', borderRadius: '50%', width: '40px', height: '40px', padding: '8px' }
  }),
  IconToggleButton: definirComponenteBloque3('IconToggleButton', COMPONENT_CATEGORIES.ACCIONES, {
    name: 'Icon Toggle Button', icon: 'toggle', propertySections: ['contenido_iconbutton', 'dimensiones', 'espaciado', 'estilos'],
    defaultProps: { icon: 'check', checked: false, bg: 'transparent', textColor: 'onSurfaceVariant', borderRadius: '50%', width: '40px', height: '40px', padding: '8px' }
  }),
  ElevatedCard: definirComponenteBloque3('ElevatedCard', COMPONENT_CATEGORIES.CONTENEDORES, {
    name: 'Elevated Card', icon: 'card', isContainer: true,
    defaultProps: { bg: 'surface', textColor: 'onSurface', padding: '16px', borderRadius: '12px', width: '100%', gap: '12px', elevation: 2, direccion: 'column' }
  }),
  OutlinedCard: definirComponenteBloque3('OutlinedCard', COMPONENT_CATEGORIES.CONTENEDORES, {
    name: 'Outlined Card', icon: 'card', isContainer: true,
    defaultProps: { bg: 'surface', textColor: 'onSurface', border: '1px solid outlineVariant', padding: '16px', borderRadius: '12px', width: '100%', gap: '12px', direccion: 'column' }
  }),
  OutlinedTextField: definirComponenteBloque3('OutlinedTextField', COMPONENT_CATEGORIES.ENTRADAS, {
    name: 'Outlined Text Field', icon: 'square', propertySections: ['contenido_input', 'dimensiones', 'espaciado', 'estilos'],
    defaultProps: { placeholder: 'Escribe algo...', bg: 'transparent', textColor: 'onSurface', border: '1px solid outline', borderRadius: '4px', padding: '12px 16px', width: '100%' }
  }),
  RangeSlider: definirComponenteBloque3('RangeSlider', COMPONENT_CATEGORIES.ENTRADAS, {
    name: 'Range Slider', icon: 'sliders', propertySections: ['contenido_rangeslider', 'dimensiones', 'espaciado', 'estilos'],
    defaultProps: { etiqueta: 'Rango', valueStart: 25, valueEnd: 75, min: 0, max: 100, step: 1, color: 'primary', width: '100%' }
  }),
  SegmentedButton: definirComponenteBloque3('SegmentedButton', COMPONENT_CATEGORIES.SELECCION, {
    name: 'Segmented Button', icon: 'layers', propertySections: ['contenido_segmentedbutton', 'dimensiones', 'espaciado', 'estilos'],
    defaultProps: { items: 'Día, Semana, Mes', activo: 0, bg: 'transparent', textColor: 'onSurface', activeColor: 'secondaryContainer', activeTextColor: 'onSecondaryContainer', width: '100%' }
  }),
  NavigationRail: definirComponenteBloque3('NavigationRail', COMPONENT_CATEGORIES.NAVEGACION, {
    name: 'Navigation Rail', icon: 'layers', propertySections: ['contenido_navigationrail', 'dimensiones', 'espaciado', 'estilos'],
    defaultProps: { items: 'Inicio:home, Buscar:search, Guardados:heart, Perfil:user', activo: 0, bg: 'surface', textColor: 'onSurfaceVariant', activeColor: 'secondaryContainer', width: '80px', padding: '12px 8px' }
  }),
  BottomAppBar: definirComponenteBloque3('BottomAppBar', COMPONENT_CATEGORIES.NAVEGACION, {
    name: 'Bottom App Bar', icon: 'layers', propertySections: ['contenido_navigationbar', 'dimensiones', 'espaciado', 'estilos'],
    defaultProps: { items: 'menu:menu, buscar:search, agregar:plus', bg: 'surface', textColor: 'onSurfaceVariant', width: '100%', padding: '12px 16px', borderRadius: '16px' }
  })
});

export const getComponentDefinition = (tipo) => {
  if (!tipo) return null;
  const normalizado = String(tipo).toLowerCase();

  if (COMPONENT_DEFINITIONS[tipo]) {
    return COMPONENT_DEFINITIONS[tipo];
  }

  for (const def of Object.values(COMPONENT_DEFINITIONS)) {
    if (def.type.toLowerCase() === normalizado) return def;
    if (def.aliases && def.aliases.some(a => a.toLowerCase() === normalizado)) {
      return def;
    }
  }

  return {
    type: tipo,
    name: tipo,
    category: COMPONENT_CATEGORIES.CONTENEDORES,
    icon: 'box',
    isContainer: tipo.includes('contenedor') || tipo.includes('tarjeta'),
    defaultProps: { padding: '8px', margin: '0', maxWidth: '100%', bg: 'surface', textColor: 'onSurface' },
    propertySections: ['dimensiones', 'espaciado', 'estilos']
  };
};

/**
 * Obtiene los componentes agrupados por categoría para la biblioteca visual
 */
export const getComponentsByCategory = () => {
  const agrupados = {};
  Object.values(COMPONENT_CATEGORIES).forEach(cat => {
    agrupados[cat] = [];
  });

  Object.values(COMPONENT_DEFINITIONS).forEach(def => {
    if (agrupados[def.category]) {
      agrupados[def.category].push(def);
    }
  });

  return Object.fromEntries(
    Object.entries(agrupados).filter(([_, items]) => items.length > 0)
  );
};
