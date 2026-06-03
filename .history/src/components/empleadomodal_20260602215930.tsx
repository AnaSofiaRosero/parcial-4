// COMPONENTE: MODAL EDITAR EMPLEADO 

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import type { Empleado, Departamento } from "../types";

type Props = {
  empleado: Empleado | null;
  departamentos: Departamento[];
  onClose: () => void;
  onSaved: () => void;
};

export default function EmpleadoModal({ empleado, departamentos, onClose, onSaved }: Props) {
  // Estado local del formulario del modal
  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");
  const [salario, setSalario] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");

  // Cada vez que cambia el empleado recibido, sincronizamos el formulario
  useEffect(() => {
    if (empleado) {
      setNombre(empleado.nombre);
      setPuesto(empleado.puesto);
      setSalario(String(empleado.salario)); // Convertimos número a string para el input
      setDepartamentoId(empleado.departamento_id);
    }
  }, [empleado]); // Se ejecuta cuando cambia la prop empleado

  
  if (!empleado) return null;

  
  const guardar = async () => {
    const { error } = await supabase
      .from("empleados") 
      .update({
        nombre,
        puesto,
        salario: Number(salario),         
        departamento_id: departamentoId,  
      })
      .eq("id", empleado.id); 

    if (error) {
      console.error("Error al actualizar empleado:", error);
      return;
    }

    onSaved();  
    onClose();  
  };

  return (
    
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation evita que el clic dentro del modal lo cierre */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Empleado</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Puesto"
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
          />
          <input
            type="number"
            placeholder="Salario"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
          />
          {/* Selector de departamento */}
          <select
            value={departamentoId}
            onChange={(e) => setDepartamentoId(e.target.value)}
          >
            <option value="">Seleccione un departamento</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="save-btn" onClick={guardar}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}