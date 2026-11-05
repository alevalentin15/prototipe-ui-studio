import React, { useState } from 'react';

const inferType = value => value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;

export const ProgrammingTab = ({ proyectoActual, onActualizarVariables }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('boolean');
  const [value, setValue] = useState('false');
  const variables = proyectoActual?.variables || {};

  const createValue = () => {
    if (type === 'null') return null;
    if (type === 'boolean') return value === 'true';
    if (type === 'number') return Number(value || 0);
    if (type === 'string') return value;
    return JSON.parse(value || (type === 'array' ? '[]' : '{}'));
  };
  const addVariable = () => {
    const variableName = name.trim();
    if (!variableName) return;
    try {
      onActualizarVariables?.({ ...variables, [variableName]: createValue() });
      setName('');
      setValue(type === 'boolean' ? 'false' : type === 'number' ? '0' : type === 'array' ? '[]' : type === 'object' ? '{}' : type === 'null' ? 'null' : '');
    } catch {
      window.alert('El valor debe tener formato JSON válido.');
    }
  };

  return <div className="space-y-4 text-xs">
    <div className="border-b border-slate-800 pb-3">
      <h3 className="text-sm font-semibold text-violet-300">Programación</h3>
      <p className="mt-1 text-[10px] text-slate-400">Define variables del proyecto. En Propiedades podrás enlazarlas a controles y valores; en Acciones puedes cambiarlas durante la vista previa.</p>
    </div>
    <section className="space-y-2 rounded-lg border border-slate-800 bg-slate-950 p-3">
      <span className="font-semibold text-slate-200">Nueva variable</span>
      <label className="block text-slate-400">Nombre<input value={name} onChange={event => setName(event.target.value)} placeholder="sesionActiva" className="mt-1 w-full rounded border border-slate-800 bg-slate-900 px-2 py-1.5 text-slate-100" /></label>
      <label className="block text-slate-400">Tipo<select value={type} onChange={event => { setType(event.target.value); setValue(event.target.value === 'boolean' ? 'false' : event.target.value === 'number' ? '0' : event.target.value === 'array' ? '[]' : event.target.value === 'object' ? '{}' : event.target.value === 'null' ? 'null' : ''); }} className="mt-1 w-full rounded border border-slate-800 bg-slate-900 px-2 py-1.5 text-slate-100"><option value="boolean">Booleano</option><option value="number">Número</option><option value="string">Texto</option><option value="array">Lista (JSON)</option><option value="object">Objeto (JSON)</option><option value="null">Nulo</option></select></label>
      <label className="block text-slate-400">Valor inicial<input value={value} onChange={event => setValue(event.target.value)} className="mt-1 w-full rounded border border-slate-800 bg-slate-900 px-2 py-1.5 font-mono text-slate-100" /></label>
      <button type="button" onClick={addVariable} disabled={!name.trim()} className="w-full rounded bg-violet-700 px-3 py-1.5 font-medium text-white hover:bg-violet-600 disabled:opacity-40">Crear variable</button>
    </section>
    <section className="space-y-2">
      <span className="font-semibold text-slate-200">Variables de {proyectoActual?.nombre || 'proyecto'}</span>
      {!Object.keys(variables).length && <p className="text-slate-500">Aún no hay variables.</p>}
      {Object.entries(variables).map(([variableName, variableValue]) => <label key={variableName} className="block rounded border border-slate-800 bg-slate-950 p-2 text-slate-400">
        <span className="flex justify-between"><strong className="text-slate-200">{variableName}</strong><span>{inferType(variableValue)}</span></span>
        <input key={`${variableName}-${inferType(variableValue)}`} defaultValue={JSON.stringify(variableValue)} onBlur={event => { try { onActualizarVariables?.({ ...variables, [variableName]: JSON.parse(event.target.value) }); event.target.setCustomValidity(''); } catch { event.target.setCustomValidity('Escribe un valor JSON válido'); event.target.reportValidity(); } }} className="mt-1 w-full rounded border border-slate-800 bg-slate-900 px-2 py-1.5 font-mono text-slate-100" />
      </label>)}
    </section>
  </div>;
};
