/**
 * Descarga los proyectos en formato JSON.
 */
export const exportarProyectosJSON = (proyectos) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proyectos, null, 2));
  const anchor = document.createElement('a');
  anchor.setAttribute("href", dataStr);
  anchor.setAttribute("download", `Proyectos_UI_LowCode_${Date.now()}.json`);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

