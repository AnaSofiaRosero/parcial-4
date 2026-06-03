import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import type { Departamento, Empleado } from "./types";

function App() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  // Departamento
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  // Empleado
  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const [puesto, setPuesto] = useState("");
  const [salario, setSalario] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");

  useEffect(() => {
    cargarDepartamentos();
    cargarEmpleados();
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

  const cargarEmpleados = async () => {
    const { data, error } = await supabase
      .from("empleados")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    setEmpleados(data || []);
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

  const crearEmpleado = async () => {
    const { error } = await supabase
      .from("empleados")
      .insert([
        {
          nombre: nombreEmpleado,
          puesto,
          salario: Number(salario),
          departamento_id: departamentoId,
        },
      ]);

    if (error) {
      console.log(error);
      return;
    }

    setNombreEmpleado("");
    setPuesto("");
    setSalario("");
    setDepartamentoId("");

    cargarEmpleados();
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

      <hr />

      <h2>Crear Empleado</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombreEmpleado}
        onChange={(e) => setNombreEmpleado(e.target.value)}
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
        <option value="">
          Seleccione un departamento
        </option>

        {departamentos.map((departamento) => (
          <option
            key={departamento.id}
            value={departamento.id}
          >
            {departamento.nombre}
          </option>
        ))}
      </select>

      <button onClick={crearEmpleado}>
        Crear Empleado
      </button>

      <hr />

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

      <h2>Empleados</h2>

      {empleados.map((empleado) => (
        <div key={empleado.id}>
          <p>
            <strong>{empleado.nombre}</strong>
          </p>

          <p>{empleado.puesto}</p>

          <p>Salario: ${empleado.salario}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;