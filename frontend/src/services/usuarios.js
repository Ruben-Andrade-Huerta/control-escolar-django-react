import api from "../api/axios";

const API_URL = "usuarios/usuarios/";

export const fetchUsuarios = async () => {
  try {
    const response = await api.get(API_URL);
    let usuarios = response.data;
    console.log(usuarios);
    return usuarios;
  } catch (error) {
    console.error("Error al obtener la lista de usuarios", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post(API_URL, userData);
    console.log("Usuario registrado exitosamente", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al registrar usuario", error);
    throw error;
  }
};
