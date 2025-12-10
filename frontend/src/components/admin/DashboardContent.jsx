import { useState, useEffect } from "react";
import { fetchAlumnos } from "../../services/Totalalumnos";
import { fetchDocentes } from "../../services/Totaldocentes";
import { fetchGrupos } from "../../services/TotalGrupos";

export function DashboardContent() {
  const [alumnos, setAlumnos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    async function cargarAlumnos() {
      const data = await fetchAlumnos();
      const total = Object.keys(data).length;
      setAlumnos(total);
    }
    cargarAlumnos();
  }, []);

  useEffect(() => {
    async function cargarDocentes() {
      const data = await fetchDocentes();
      const total = Object.keys(data).length;
      setDocentes(total);
    }
    cargarDocentes();
  }, []);

  useEffect(() => {
    async function cargarGrupos() {
      const data = await fetchGrupos();
      const total = Object.keys(data).length;
      setGrupos(total);
    }
    cargarGrupos();
  }, []);

  return (
    <div>
      <div>
        <h1>Panel de control</h1>
      </div>
      <div className="flex justify-center space-x-6">
        <div className="bg-gray-200 p-4 text-center rounded-2xl shadow w-54">
          <h1>Total de alumnos</h1>
          <p>{alumnos}</p>
        </div>
        <div className="bg-gray-200 p-4 text-center rounded-2xl shadow w-54">
          <h1>Total de docentes</h1>
          <p>{docentes}</p>
        </div>
        <div className="bg-gray-200 p-4 text-center rounded-2xl shadow w-54">
          <h1>Total Grupos</h1>
          <p>{grupos}</p>
        </div>
        <div className="bg-gray-200 p-4 text-center rounded-2xl shadow w-54">
          <h1>Periodo Academico</h1>
        </div>
      </div>
    </div>
  );
}
