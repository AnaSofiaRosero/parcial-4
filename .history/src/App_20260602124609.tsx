import { useEffect } from "react";
import { supabase } from "./supabaseClient";

function App() {

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  const cargarDepartamentos = async () => {
    const { data, error } = await supabase
      .from("departamentos")
      .select("*");

    console.log(data);

    if(error){
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Employees Manager</h1>
    </div>
  );
}

export default App;