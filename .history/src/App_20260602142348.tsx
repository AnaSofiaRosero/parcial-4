import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import type { Departamento, Empleado } from "./types";
import "./App.css";

function App() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  // ── Departamento form (crear)
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  // ── Empleado form (crear)
  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const [puesto, setPuesto] = useState("");
  const [salario, setSalario] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");

  // ── Modal editar departamento
  const [modalDept, setModalDept] = useState<Departamento | null>(null);
  const [modalDeptNombre, setModalDeptNombre] = useState("");
  const [modalDeptUbicacion, setModalDeptUbicacion] = useState("");

  // ── Modal editar empleado
  const [modalEmp, setModalEmp] = useState<Empleado | null>(null);
  const [modalEmpNombre, setModalEmpNombre] = useState("");
  const [modalEmpPuesto, setModalEmpPuesto] = useState("");
  const [modalEmpSalario, setModalEmpSalario] = useState("");
  const [modalEmpDeptId, setModalEmpDeptId] = useState("");

  useEffect(() => {
    cargarDepartamentos();
    cargarEmpleados();
  }, []);

  const cargarDepartamentos = async () => {
    const { data, error } = await supabase.from("departamentos").select("*");
    if (error) { console.log(error); return; }
    setDepartamentos(data || []);
  };

  const cargarEmpleados = async () => {
    const { data, error } = await supabase.from("empleados").select("*");
    if (error) { console.log(error); return; }
    setEmpleados(data || []);
  };

  const crearDepartamento = async () => {
    if (!nombre.trim()) { alert("El nombre del departamento es obligatorio"); return; }
    const { error } = await supabase.from("departamentos").insert([{ nombre, ubicacion }]);
    if (error) { console.log(error); return; }
    setNombre(""); setUbicacion("");
    cargarDepartamentos();
  };

  const crearEmpleado = async () => {
    if (!nombreEmpleado.trim() || !puesto.trim() || !salario || !departamentoId) {
      alert("Complete todos los campos"); return;
    }
    const { error } = await supabase.from("empleados").insert([{
      nombre: nombreEmpleado, puesto,
      salario: Number(salario), departamento_id: departamentoId,
    }]);
    if (error) { console.log(error); return; }
    setNombreEmpleado(""); setPuesto(""); setSalario(""); setDepartamentoId("");
    cargarEmpleados();
  };

  const abrirModalDept = (dept: Departamento) => {
    setModalDept(dept);
    setModalDeptNombre(dept.nombre);
    setModalDeptUbicacion(dept.ubicacion);
  };

  const abrirModalEmp = (emp: Empleado) => {
    setModalEmp(emp);
    setModalEmpNombre(emp.nombre);
    setModalEmpPuesto(emp.puesto);
    setModalEmpSalario(String(emp.salario));
    setModalEmpDeptId(emp.departamento_id);
  };

  const guardarDepartamento = async () => {
    if (!modalDept) return;
    const { error } = await supabase.from("departamentos")
      .update({ nombre: modalDeptNombre, ubicacion: modalDeptUbicacion })
      .eq("id", modalDept.id);
    if (error) { console.log(error); return; }
    setModalDept(null);
    cargarDepartamentos();
  };

  const guardarEmpleado = async () => {
    if (!modalEmp) return;
    const { error } = await supabase.from("empleados")
      .update({
        nombre: modalEmpNombre, puesto: modalEmpPuesto,
        salario: Number(modalEmpSalario), departamento_id: modalEmpDeptId,
      })
      .eq("id", modalEmp.id);
    if (error) { console.log(error); return; }
    setModalEmp(null);
    cargarEmpleados();
  };

  const eliminarEmpleado = async (id: string) => {
    const { error } = await supabase.from("empleados").delete().eq("id", id);
    if (error) { console.log(error); return; }
    cargarEmpleados();
  };

  const eliminarDepartamento = async (id: string) => {
    const { error } = await supabase.from("departamentos").delete().eq("id", id);
    if (error) {
      console.log(error);
      alert("No puedes eliminar un departamento que tenga empleados asociados");
      return;
    }
    cargarDepartamentos();
  };

  return (
    <div className="container">

      {/* Header */}
      <div className="app-header">
        <div className="header-icon">🏢</div>
        <div>
          <h1 className="title">Employees Manager</h1>
          <p className="title-sub">Gestión de talento y estructura organizacional</p>
        </div>
      </div>

      {/* Forms */}
      <div className="forms-grid">

        <div className="section">
          <div className="section-header">
            <div className="section-icon teal">🏗️</div>
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

        <div className="section">
          <div className="section-header">
            <div className="section-icon indigo">👤</div>
            <h2>Nuevo Empleado</h2>
          </div>
          <div className="form">
            <input
              type="text"
              placeholder="Nombre completo"
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
      </div>

      {/* Tabla Departamentos */}
      <div className="table-section">
        <div className="table-section-header">
          <h2>Departamentos</h2>
          <span className="badge">{departamentos.length}</span>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {departamentos.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan={3}>Sin departamentos registrados</td>
                </tr>
              ) : departamentos.map((dept) => (
                <tr key={dept.id}>
                  <td className="name-cell">{dept.nombre}</td>
                  <td>{dept.ubicacion}</td>
                  <td>
                    <div className="action-cell">
                      <button className="edit-btn" onClick={() => abrirModalDept(dept)}>
                        ✏️ Editar
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (window.confirm("¿Seguro que deseas eliminar este departamento?")) {
                            eliminarDepartamento(dept.id);
                          }
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla Empleados */}
      <div className="table-section">
        <div className="table-section-header">
          <h2>Empleados</h2>
          <span className="badge">{empleados.length}</span>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Puesto</th>
                <th>Departamento</th>
                <th>Salario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan={5}>Sin empleados registrados</td>
                </tr>
              ) : empleados.map((emp) => {
                const dept = departamentos.find((d) => d.id === emp.departamento_id);
                return (
                  <tr key={emp.id}>
                    <td className="name-cell">{emp.nombre}</td>
                    <td>{emp.puesto}</td>
                    <td>
                      <span className="dept-pill">
                         {dept?.nombre || "Sin departamento"}
                      </span>
                    </td>
                    <td className="salary-cell">${emp.salario.toLocaleString()}</td>
                    <td>
                      <div className="action-cell">
                        <button className="edit-btn" onClick={() => abrirModalEmp(emp)}>
                          Editar
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => {
                            if (window.confirm("¿Seguro que deseas eliminar este empleado?")) {
                              eliminarEmpleado(emp.id);
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Editar Departamento */}
      {modalDept && (
        <div className="modal-overlay" onClick={() => setModalDept(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Departamento</h2>
              <button className="modal-close" onClick={() => setModalDept(null)}>✕</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Nombre del departamento"
                value={modalDeptNombre}
                onChange={(e) => setModalDeptNombre(e.target.value)}
              />
              <input
                type="text"
                placeholder="Ubicación"
                value={modalDeptUbicacion}
                onChange={(e) => setModalDeptUbicacion(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setModalDept(null)}>Cancelar</button>
              <button className="save-btn" onClick={guardarDepartamento}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Empleado */}
      {modalEmp && (
        <div className="modal-overlay" onClick={() => setModalEmp(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><span>👤</span> Editar Empleado</h2>
              <button className="modal-close" onClick={() => setModalEmp(null)}>✕</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Nombre completo"
                value={modalEmpNombre}
                onChange={(e) => setModalEmpNombre(e.target.value)}
              />
              <input
                type="text"
                placeholder="Puesto"
                value={modalEmpPuesto}
                onChange={(e) => setModalEmpPuesto(e.target.value)}
              />
              <input
                type="number"
                placeholder="Salario"
                value={modalEmpSalario}
                onChange={(e) => setModalEmpSalario(e.target.value)}
              />
              <select
                value={modalEmpDeptId}
                onChange={(e) => setModalEmpDeptId(e.target.value)}
              >
                <option value="">Seleccione un departamento</option>
                {departamentos.map((d) => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setModalEmp(null)}>Cancelar</button>
              <button className="save-btn" onClick={guardarEmpleado}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;