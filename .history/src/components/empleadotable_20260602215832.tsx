// COMPONENTE: TABLA DE EMPLEADOS

import { supabase } from "../supabaseClient";
import type { Empleado, Departamento } from "../types";

type Props = {
  empleados: Empleado[];
  departamentos: Departamento[];
  onEdit: (empleado: Empleado) => void;
  onDeleted: () => void;
};

export default function EmpleadoTable({ empleados, departamentos, onEdit, onDeleted }: Props) {

  // Elimina un empleado por su id en Supabase
  const eliminarEmpleado = async (id: string) => {
    // Confirmación antes de eliminar
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;

    const { error } = await supabase
      .from("empleados") 
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar empleado:", error);
      return;
    }

    onDeleted(); // Recargar lista en App
  };

  return (
    <div className="table-section">
      <div className="table-section-header">
        <h2>Empleados</h2>
        {/* Badge con el total de registros */}
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
            {/* Si no hay empleados, mostrar fila vacía */}
            {empleados.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={5}>Sin empleados registrados</td>
              </tr>
            ) : empleados.map((emp) => {
              // Resolver el nombre del departamento a partir del departamento_id (FK)
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
                  {/* toLocaleString formatea el número con separadores de miles */}
                  <td className="salary-cell">${emp.salario.toLocaleString()}</td>
                  <td>
                    <div className="action-cell">
                      {/* Botón editar: pasa el empleado al modal vía onEdit */}
                      <button className="edit-btn" onClick={() => onEdit(emp)}>
                         Editar
                      </button>
                      {/* Botón eliminar */}
                      <button
                        className="delete-btn"
                        onClick={() => eliminarEmpleado(emp.id)}
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
  );
}