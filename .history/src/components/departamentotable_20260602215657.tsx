// ─── COMPONENTE: TABLA DE DEPARTAMENTOS ──────────────────────
// Muestra la lista de departamentos con opciones de editar y eliminar.
// Props:
//   departamentos → lista de departamentos a mostrar
//   onEdit        → abre el modal de edición con el departamento seleccionado
//   onDeleted     → recarga la lista tras eliminar

import { supabase } from "../supabaseClient";
import type { Departamento } from "../types";

type Props = {
  departamentos: Departamento[];
  onEdit: (departamento: Departamento) => void;
  onDeleted: () => void;
};

export default function DepartamentoTable({ departamentos, onEdit, onDeleted }: Props) {

  // Elimina un departamento por su id en Supabase
  const eliminarDepartamento = async (id: string) => {
    // Confirmación antes de eliminar
    if (!window.confirm("¿Seguro que deseas eliminar este departamento?")) return;

    const { error } = await supabase
      .from("departamentos") // Nombre exacto de la tabla en Supabase
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar departamento:", error);
      // Supabase rechaza si hay empleados asociados (restricción de Foreign Key)
      alert("No puedes eliminar un departamento que tenga empleados asociados");
      return;
    }

    onDeleted(); // Recargar lista en App
  };

  return (
    <div className="table-section">
      <div className="table-section-header">
        <h2>Departamentos</h2>
        {/* Badge con el total de registros */}
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
            {/* Si no hay departamentos, mostrar fila vacía */}
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
                    {/* Botón editar: pasa el departamento al modal vía onEdit */}
                    <button className="edit-btn" onClick={() => onEdit(dept)}>
                      ✏️ Editar
                    </button>
                    {/* Botón eliminar */}
                    <button
                      className="delete-btn"
                      onClick={() => eliminarDepartamento(dept.id)}
                    >
                       Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}