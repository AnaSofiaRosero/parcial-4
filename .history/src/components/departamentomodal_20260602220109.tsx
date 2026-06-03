//COMPONENTE: MODAL EDITAR DEPARTAMENTO 

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import type { Departamento } from "../types";

type Props = {
  departamento: Departamento | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function DepartamentoModal({ departamento, onClose, onSaved }: Props) {
  
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");

 
  useEffect(() => {
    if (departamento) {
      setNombre(departamento.nombre);
      setUbicacion(departamento.ubicacion);
    }
  }, [departamento]); // Se ejecuta cuando cambia la prop departamento

  // Si no hay departamento seleccionado, no renderizar el modal
  if (!departamento) return null;

  // Actualiza el departamento en Supabase con los nuevos datos
  const guardar = async () => {
    const { error } = await supabase
      .from("departamentos") // Nombre exacto de la tabla en Supabase
      .update({ nombre, ubicacion })
      .eq("id", departamento.id); // Solo actualiza el registro con este id

    if (error) {
      console.error("Error al actualizar departamento:", error);
      return;
    }

    onSaved();  // Recargar lista en App
    onClose();  // Cerrar modal
  };

  return (
    // Clic en el overlay cierra el modal
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation evita que el clic dentro del modal lo cierre */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2> Editar Departamento</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            placeholder="Nombre del departamento"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ubicación"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="save-btn" onClick={guardar}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}