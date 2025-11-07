import {useState, useEffect} from "react"
import { fetchAlumnos } from "../services/alumnos"

export function DashboardContent(){
    const [alumnos, setAlumnos] = useState([])

    useEffect(() => {
        async function cargarAlumnos(){
        const data = await fetchAlumnos();
        console.log(data)
        setAlumnos(data)
    }
    cargarAlumnos();
    }, []);

    return(
        <div className="flex flex-col justify-center items-center">
            <h1>Alumnos</h1>
            {alumnos.map((alumno, index) => (
                <div key={index}>
                    <p>Nombre: {alumno.usuario.first_name}</p>
                    <p>Matricula: {alumno.matricula}</p>
                </div>
            ))
            }
        </div>
    )
}