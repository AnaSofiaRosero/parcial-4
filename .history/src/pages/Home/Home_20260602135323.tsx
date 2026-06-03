import "./Home.css";

interface Props {
  setPantalla: (pantalla: string) => void;
}

function Home({ setPantalla }: Props) {
  return (
    <div className="home">

      <h1>Employees Manager</h1>

      <div className="cards">

        <div
          className="card"
          onClick={() => setPantalla("empleados")}
        >
          <div className="icon">👤</div>
          <h2>Gestión de Empleados</h2>
        </div>

        <div
          className="card"
          onClick={() => setPantalla("departamentos")}
        >
          <div className="icon">🏢</div>
          <h2>Gestión de Departamentos</h2>
        </div>

      </div>

    </div>
  );
}

export default Home;