import api from '../api/axios';

export const fetchAlumnos = async () => {
    try{
        const response = await api.get('gestion/alumnos/');
        // console.log(response.data);
        let alumnos = response.data
        console.log(alumnos.length)
        return response.data;
    } catch (error){
        console.error('Error al obtener la lista de alumnos', error);
        throw(error);
    }
}

