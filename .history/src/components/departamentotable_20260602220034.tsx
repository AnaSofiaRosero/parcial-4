// COMPONENTE: TABLA DE DEPARTAMENTOS 

import { supabase } from "../supabaseClient";
import type { Departamento } from "../types";

type Props = {
  departamentos: Departamento[];
  onEdit: (departamento: Departamento) => void;
  onDeleted: () => void;
};

export default function DepartamentoTable({ departamentos, onEdit, onDeleted }: Props) {

 
  const eliminarDepartamento = async (id: string) => {
   
    if (!window.confirm("¿Seguro que deseas eliminar este departamento?")) return;

    const { error } = await supabase
      .from("departamentos") 
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar departamento:", error);
      
      alert("No puedes eliminar un departamento que tenga empleados asociados");
      return;
    }

    onDeleted(); 
  };

  return (
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
                    {/* Botón editar: pasa el departamento al modal vía onEdit */}
                    <button className="edit-btn" onClick={() => onEdit(dept)}>
                       Editar
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