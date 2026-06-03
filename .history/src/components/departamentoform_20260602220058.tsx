// COMPONENTE: FORMULARIO CREAR DEPARTAMENTO 

import { useState } from "react";
import { supabase } from "../supabaseClient";

type Props = {
  onCreated: () => void;
};

export default function DepartamentoForm({ onCreated }: Props) {
 
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  // Inserta un nuevo departamento en Supabase
  const crearDepartamento = async () => {
   
    if (!nombre.trim()) {
      alert("El nombre del departamento es obligatorio");
      return;
    }

    const { error } = await supabase
      .from("departamentos") 
      .insert([{ nombre, ubicacion }]);

    if (error) {
      console.error("Error al crear departamento:", error);
      return;
    }

    
    setNombre("");
    setUbicacion("");
    onCreated();
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Nuevo Departamento</h2>
      </div>
      <div className="form">
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
        <button className="primary-btn" onClick={crearDepartamento}>
          + Crear Departamento
        </button>
      </div>
    </div>
  );
}