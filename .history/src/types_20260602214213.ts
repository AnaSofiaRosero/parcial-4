// ─── TIPOS DE DATOS ───────────────────────────────────────────
// Representan la estructura de las tablas en Supabase

// Tabla: departamentos
export type Departamento = {
  id: string;        // UUID - Primary Key
  nombre: string;    // Nombre del departamento (requerido)
  ubicacion: string; // Ubicación del departamento (requerido)
};

// Tabla: empleados
export type Empleado = {
  id: string;              // UUID - Primary Key
  nombre: string;          // Nombre completo del empleado (requerido)
  puesto: string;          // Puesto o cargo (requerido)
  salario: number;         // Salario numérico (requerido)
  departamento_id: string; // UUID - Foreign Key → departamentos.id
};