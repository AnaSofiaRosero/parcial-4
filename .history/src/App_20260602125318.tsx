import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import type { Departamento } from "./types";

function App() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employees Manager</h1>

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