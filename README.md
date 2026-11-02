# Prototipador UI Studio

Proyecto React + Vite separado del HTML original para abrirlo y continuarlo editando desde Antigravity o cualquier IDE.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Instalación y ejecución

```bash
npm install
npm run dev
```

Vite mostrará la URL local (normalmente `http://localhost:5173`).

## Compilar para producción

```bash
npm run build
npm run preview
```

## Estructura

```text
prototipador-ui-studio/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── App.jsx                 # Editor: estado, canvas, inspector y acciones
│   ├── main.jsx                # Punto de entrada React
│   ├── data/
│   │   └── initialProjects.js  # Proyectos demo
│   └── styles/
│       └── index.css           # Estilos globales y Tailwind
└── README.md
```

## Propiedades de layout incorporadas

El inspector ahora permite modificar:

- Ancho: automático, 100%, 75%, 50% o 25%.
- Alto y ancho máximo.
- Alto mínimo.
- Padding y margin con sintaxis CSS (por ejemplo `16px`, `8px 12px`, `0 auto 16px`).
- Dirección y gap para contenedores y tarjetas.

Los estilos se aplican directamente al canvas. Se conserva la compatibilidad con proyectos existentes que utilizan `props.ancho`; `props.width` tiene prioridad.

## Modelo de datos

Cada componente conserva el esquema existente:

```js
{
  id: 'cmp-unique-id',
  tipo: 'contenedor',
  etiqueta: 'Contenedor principal',
  props: {
    width: '100%',
    padding: '16px',
    margin: '0 auto',
    gap: '12px',
    direccion: 'column'
  },
  hijos: []
}
```

Los valores de tamaño y espaciado aceptan unidades CSS (`px`, `%`, `rem`, `vw`, etc.). Para `width`, `height`, `minWidth`, `maxWidth`, `minHeight` y `maxHeight`, también se aceptan valores CSS como `auto`, `100%` o `calc(...)`.

## Notas de migración

- Se retiró el HTML de ejecución generado por el entorno anterior (scripts de inyección, Babel en navegador y dependencias CDN).
- React y ReactDOM ahora se gestionan como dependencias del proyecto.
- Tailwind se compila localmente mediante PostCSS.
- La persistencia y exportación/importación JSON del prototipo original se mantienen en el editor.
- El proyecto todavía conserva la lógica del editor concentrada en `App.jsx` como primer paso de migración funcional. La siguiente refactorización recomendable es extraer `Canvas`, `ComponentRenderer`, `InspectorPanel`, `LayersPanel`, `ComponentPalette` y los hooks de proyectos/selección a módulos independientes.

## Seguridad

No se migraron los scripts de integración/inyección del HTML original ni sus tokens de sesión. Si el archivo original se compartió fuera de un entorno privado, revisa y rota cualquier credencial temporal que hubiera quedado incrustada en él.
