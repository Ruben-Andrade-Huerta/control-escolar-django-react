import api from "../api/axios";

export const fetchUsuarios = async () => {
    try{
        const response = await api.get('usuarios/usuarios')
        let usuarios = response.data
        return(usuarios)
    } catch (error) {
        console.error('Error al obtener la lista de usuarios', error)
        throw(error);
    }
}