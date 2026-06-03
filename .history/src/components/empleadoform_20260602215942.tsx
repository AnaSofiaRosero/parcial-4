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

  // Inserta un nuevo empleado en Supabase
  const crearEmpleado = async () => {
    // Validación: todos los campos son obligatorios
    if (!nombre.trim() || !puesto.trim() || !salario || !departamentoId) {
      alert("Complete todos los campos");
      return;
    }

    const { error } = await supabase
      .from("empleados") // Nombre exacto de la tabla en Supabase
      .insert([{
        nombre,
        puesto,
        salario: Number(salario),         // Convertir string a número
        departamento_id: departamentoId,  // Foreign Key al departamento seleccionado
      }]);

    if (error) {
      console.error("Error al crear empleado:", error);
      return;
    }

    // Limpiar formulario y notificar al padre
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
        {/* Selector de departamento usando la lista recibida por props */}
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