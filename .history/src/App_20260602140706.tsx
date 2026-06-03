import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import type { Departamento, Empleado } from "./types";
import "./App.css";


function App() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  const [editandoDepartamento, setEditandoDepartamento] = useState<string | null>(null);
  const [editandoEmpleado, setEditandoEmpleado] = useState<string | null>(null);

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
    if (!nombre.trim()) {
      alert("El nombre del departamento es obligatorio");
      return;
    }

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

  const guardarDepartamento = async () => {
    if (!editandoDepartamento) return;

    const { error } = await supabase
      .from("departamentos")
      .update({
        nombre,
        ubicacion,
      })
      .eq("id", editandoDepartamento);

    if (error) {
      console.log(error);
      return;
    }

    setNombre("");
    setUbicacion("");
    setEditandoDepartamento(null);

    cargarDepartamentos();
  };

  const editarDepartamento = (departamento: Departamento) => {
    setEditandoDepartamento(departamento.id);
    setNombre(departamento.nombre);
    setUbicacion(departamento.ubicacion);
  };

  const crearEmpleado = async () => {
    if (
      !nombreEmpleado.trim() ||
      !puesto.trim() ||
      !salario ||
      !departamentoId
    ) {
      alert("Complete todos los campos");
      return;
    }

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

  const guardarEmpleado = async () => {
    if (!editandoEmpleado) return;

    const { error } = await supabase
      .from("empleados")
      .update({
        nombre: nombreEmpleado,
        puesto,
        salario: Number(salario),
        departamento_id: departamentoId,
      })
      .eq("id", editandoEmpleado);

    if (error) {
      console.log(error);
      return;
    }

    setNombreEmpleado("");
    setPuesto("");
    setSalario("");
    setDepartamentoId("");
    setEditandoEmpleado(null);

    cargarEmpleados();
  };

  const editarEmpleado = (empleado: Empleado) => {
    setEditandoEmpleado(empleado.id);

    setNombreEmpleado(empleado.nombre);
    setPuesto(empleado.puesto);
    setSalario(String(empleado.salario));
    setDepartamentoId(empleado.departamento_id);
  };

  const eliminarEmpleado = async (id: string) => {
    const { error } = await supabase
      .from("empleados")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    cargarEmpleados();
  };

  const eliminarDepartamento = async (id: string) => {
    const { error } = await supabase
      .from("departamentos")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      alert(
        "No puedes eliminar un departamento que tenga empleados asociados"
      );
      return;
    }

    cargarDepartamentos();
  };

  return (
    <div className="container">
      <h1 className="title">Employees Manager</h1>

      <div className="section">
        <h2>Gestión de Departamentos</h2>

        <div className="form">

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

          {editandoDepartamento ? (
            <button
              className="primary-btn"
              onClick={guardarDepartamento}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className="primary-btn"
              onClick={crearDepartamento}
            >
              Crear Departamento
            </button>
          )}

        </div>
      </div>

      <div className="section">
        <h2>Gestión de Empleados</h2>

        <div className="form">

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

          {editandoEmpleado ? (
            <button
              className="primary-btn"
              onClick={guardarEmpleado}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className="primary-btn"
              onClick={crearEmpleado}
            >
              Crear Empleado
            </button>
          )}

        </div>
      </div>

      <h2>Departamentos</h2>

<table className="table">
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Ubicación</th>
      <th>Acciones</th>
    </tr>
  </thead>

  <tbody>
    {departamentos.map((departamento) => (
      <tr key={departamento.id}>
        <td>{departamento.nombre}</td>
        <td>{departamento.ubicacion}</td>

        <td>
          <button
            className="edit-btn"
            onClick={() => editarDepartamento(departamento)}
          >
            Editar
          </button>

          <button
            className="delete-btn"
            onClick={() => {
              if (
                window.confirm(
                  "¿Seguro que deseas eliminar este departamento?"
                )
              ) {
                eliminarDepartamento(departamento.id);
              }
            }}
          >
            Eliminar
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      <h2>Empleados</h2>

      {empleados.map((empleado) => {
        const departamento = departamentos.find(
          (d) => d.id === empleado.departamento_id
        );

        return (
          <div key={empleado.id}>
            <p>
              <strong>{empleado.nombre}</strong>
            </p>

            <p>{empleado.puesto}</p>

            <p>Salario: ${empleado.salario}</p>

            <p>
              Departamento:{" "}
              {departamento?.nombre || "Sin departamento"}
            </p>

            <button
              className="edit-btn"
              onClick={() =>
                editarEmpleado(empleado)
              }
            >
              Editar
            </button>

            <button
              className="delete-btn"
              onClick={() => {
                if (
                  window.confirm(
                    "¿Seguro que deseas eliminar este empleado?"
                  )
                ) {
                  eliminarEmpleado(empleado.id);
                }
              }}
            >
              Eliminar
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;