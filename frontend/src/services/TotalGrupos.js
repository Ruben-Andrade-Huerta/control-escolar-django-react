import api from "../api/axios";

export const fetchGrupos = async () => {
    try{
        const response = await api.get('gestion/grupos/');
        return response.data;
    } catch(error){
        console.error('Error al obtener la lista de grupos', error)
        throw(error)
    }
}