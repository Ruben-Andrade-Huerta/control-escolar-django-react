import api from '../api/axios'

export const fetchDocentes = async () =>{
    try{
        const response = await api.get('gestion/docentes/');
        return response.data
    } catch(error){
        console.error("Error al obtener la lista de docentes", error);
        throw(error)
    }
}