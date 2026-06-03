import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import type { Departamento } from "./types";
import type { Departamento, Empleado } from "./types";

function App() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  const cargarDepartamentos = async () => {
    const { data, error } = await supabase
      .from("departamentos")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    setDepartamentos(data || []);
  };

  const crearDepartamento = async () => {
    const { error } = await supabase
      .from("departamentos")
      .insert([
        {
          nombre,
          ubicacion,
        },
      ]);

    if (error) {
      console.log(error);
      return;
    }

    setNombre("");
    setUbicacion("");

    cargarDepartamentos();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employees Manager</h1>

      <h2>Crear Departamento</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="text"
        placeholder="Ubicación"
        value={ubicacion}
        onChange={(e) => setUbicacion(e.target.value)}
      />

      <button onClick={crearDepartamento}>
        Crear Departamento
      </button>

      <h2>Departamentos</h2>

      {departamentos.map((departamento) => (
        <div key={departamento.id}>
          <p>
            <strong>{departamento.nombre}</strong>
          </p>

          <p>{departamento.ubicacion}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;