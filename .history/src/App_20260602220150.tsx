import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import type { Departamento, Empleado } from "./types";

// Componentes de formularios (crear)
import DepartamentoForm from "./components/DepartamentoForm";
import EmpleadoForm from "./components/EmpleadoForm";

// Componentes de tablas (leer + eliminar)
import DepartamentoTable from "./components/DepartamentoTable";
import EmpleadoTable from "./components/EmpleadoTable";

// Componentes de modales (editar)
import DepartamentoModal from "./components/DepartamentoModal";
import EmpleadoModal from "./components/empleadomodal";

import "./App.css";

function App() {
 
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  
  const [modalDept, setModalDept] = useState<Departamento | null>(null);
  const [modalEmp, setModalEmp] = useState<Empleado | null>(null);

  // ── Cargar datos al montar el componente ────────────────────
  useEffect(() => {
    cargarDepartamentos();
    cargarEmpleados();
  }, []); // [] = solo se ejecuta una vez al montar

  // Consulta todos los departamentos desde Supabase
  const cargarDepartamentos = async () => {
    const { data, error } = await supabase
      .from("departamentos") // Nombre exacto de la tabla en Supabase
      .select("*");
    if (error) { console.error("Error cargando departamentos:", error); return; }
    setDepartamentos(data || []);
  };

  // Consulta todos los empleados desde Supabase
  const cargarEmpleados = async () => {
    const { data, error } = await supabase
      .from("empleados") // Nombre exacto de la tabla en Supabase
      .select("*");
    if (error) { console.error("Error cargando empleados:", error); return; }
    setEmpleados(data || []);
  };

  return (
    <div className="container">

      {/* ── Header de la aplicación ─────────────────────── */}
      <div className="app-header">
        <h1 className="title">Employees Manager</h1>
        <p className="title-sub">Gestión de talento y estructura organizacional</p>
      </div>

      {/* ── Formularios: crear departamento y empleado ──── */}
      <div className="forms-grid">
        {/* Al crear, recarga la lista correspondiente */}
        <DepartamentoForm onCreated={cargarDepartamentos} />
        <EmpleadoForm departamentos={departamentos} onCreated={cargarEmpleados} />
      </div>

      {/* ── Tablas: listar, editar y eliminar ───────────── */}
      <DepartamentoTable
        departamentos={departamentos}
        onEdit={setModalDept}           // Abre modal con el departamento seleccionado
        onDeleted={cargarDepartamentos} // Recarga tras eliminar
      />
      <EmpleadoTable
        empleados={empleados}
        departamentos={departamentos}
        onEdit={setModalEmp}            // Abre modal con el empleado seleccionado
        onDeleted={cargarEmpleados}     // Recarga tras eliminar
      />

      {/* ── Modales: editar departamento y empleado ──────── */}
      {/* Solo se renderizan cuando modalDept/modalEmp no es null */}
      <DepartamentoModal
        departamento={modalDept}
        onClose={() => setModalDept(null)}     // Cierra el modal
        onSaved={cargarDepartamentos}          // Recarga tras guardar
      />
      <EmpleadoModal
        empleado={modalEmp}
        departamentos={departamentos}
        onClose={() => setModalEmp(null)}      // Cierra el modal
        onSaved={cargarEmpleados}              // Recarga tras guardar
      />

    </div>
  );
}

export default App;