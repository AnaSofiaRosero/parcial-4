// COMPONENTE: FORMULARIO CREAR EMPLEADO
import { useState } from "react";
import { supabase } from "../supabaseClient";
import type { Departamento } from "../types";

type Props = {
  departamentos: Departamento[];
  onCreated: () => void;
};

export default function EmpleadoForm({ departamentos, onCreated }: Props) {
 
  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");
  const [salario, setSalario] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");

 
  const crearEmpleado = async () => {
    // Validación: todos los campos son obligatorios
    if (!nombre.trim() || !puesto.trim() || !salario || !departamentoId) {
      alert("Complete todos los campos");
      return;
    }

    const { error } = await supabase
      .from("empleados") 
      .insert([{
        nombre,
        puesto,
        salario: Number(salario),        
        departamento_id: departamentoId,  
      }]);

    if (error) {
      console.error("Error al crear empleado:", error);
      return;
    }

    
    setNombre("");
    setPuesto("");
    setSalario("");
    setDepartamentoId("");
    onCreated();
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Nuevo Empleado</h2>
      </div>
      <div className="form">
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
    
        <select
          value={departamentoId}
          onChange={(e) => setDepartamentoId(e.target.value)}
        >
          <option value="">Seleccione un departamento</option>
          {departamentos.map((d) => (
            <option key={d.id} value={d.id}>{d.nombre}</option>
          ))}
        </select>
        <button className="primary-btn" onClick={crearEmpleado}>
          + Crear Empleado
        </button>
      </div>
    </div>
  );
}