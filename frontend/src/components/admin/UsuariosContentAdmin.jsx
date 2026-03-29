import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { fetchUsuarios, registerUser } from "../../services/usuarios";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";

const columns = [
  { accessorKey: "id", header: "Id" },
  { accessorKey: "first_name", header: "Name" },
  { accessorKey: "last_name", header: "Apellido" },
  { accessorKey: "email", header: "Correo" },
  { accessorKey: "rol", header: "Rol" },
  { accessorKey: "is_active", header: "Activo" },
  {
    accessorKey: "date_joined",
    header: "Fecha de Registro",
    cell: info => {
      console.log(info.getValue());
      return dayjs(info.getValue()).format("DD/MM/YYYY");
    }
  },
];

export function UsuariosContent() {
  const [data, setData] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function cargarUsuarios() {
      const data = await fetchUsuarios();
      console.log(data);
      setData(data);
    }
    cargarUsuarios();
  }, []);

  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  const [showModal, setShowModal] = useState(false);

  //const [dropdown, setDropdown] = useState("");

  const onSubmitform = async (usuario) => {
    try {
      await registerUser(usuario);
      console.log("Usuario registrado exitosamente", usuario);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        top: "var(--navbar-height)",
        left: "var(--sidebar-width)",
        width: "var(--content-width)",
      }}
      className="fixed h-screen overflow-y-auto flex flex-col items-center mt-8"
    >
      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-bold pl-10">Usuarios</h1>
        <button
          className="cursor-pointer border-2 bg-blue-500 mr-8 text-white text-sm w-40 rounded-2xl hover:bg-blue-600"
          onClick={() => setShowModal(true)}
        >
          Crear nuevo Usuario
        </button>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white border-2 w-150 rounded-2xl border-gray-300">
              <form
                onSubmit={handleSubmit(onSubmitform)}
                className="p-4 flex flex-col gap-5"
              >
                <div>
                  <h2 className="text-3xl font-medium">
                    Registrar nuevo usuario
                  </h2>
                </div>
                <div>
                  <label htmlFor="first_name" className="p-2 text-lg">
                    Nombre(s)
                  </label>
                  <input
                    {...register("first_name", {
                      required: "El nombre es obligatorio",
                    })}
                    type="text"
                    id=""
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="last_name" className="p-2 text-lg">
                    Apellido(s)
                  </label>
                  <input
                    {...register("last_name", {
                      required: "El apellido es obligatorio",
                    })}
                    type="text"
                    id=""
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="p-2 text-lg">
                    Correo
                  </label>
                  <input
                    {...register("email", {
                      required: "El correo es obligatorio",
                    })}
                    type="email"
                    id=""
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="roles" className="p-2 text-lg block">
                    Rol
                  </label>
                  <select
                    {...register("rol", { required: "Selecciona un rol" })}
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                  >
                    <option value="" disabled hidden>
                      Selecciona un rol
                    </option>
                    <option value="admin">Administrador</option>
                    <option value="alumno">Alumno</option>
                    <option value="docente">Docente</option>
                  </select>
                  {errors.rol && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.rol.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="p-2 text-lg">
                    Contraseña
                  </label>
                  <input
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 8,
                        message:
                          "La contraseña debe tener al menos 8 caracteres",
                      },
                    })}
                    type="password"
                    name="password"
                    id=""
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password_confirmation"
                    className="p-2 text-lg"
                  >
                    Confirmar contraseña
                  </label>
                  <input
                    {...register("password_confirmation", {
                      required: "La confirmación de contraseña es obligatoria",
                      validate: (value) => {
                        const passwordActual = watch("password");

                        // Validación 1: Debe existir
                        if (!value) {
                          return "Debes confirmar la contraseña";
                        }

                        // Validación 2: Deben coincidir
                        if (value !== passwordActual) {
                          return "Las contraseñas no coinciden";
                        }

                        // Validación 3: Longitud mínima
                        if (value.length < 8) {
                          return "La contraseña debe tener al menos 8 caracteres";
                        }

                        // Todo está bien ✅
                        return true;
                      },
                    })}
                    type="password"
                    name="password_confirmation"
                    id="password_confirmation"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password_confirmation.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-between pt-4">
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        //setDropdown("");
                        reset();
                        setShowModal(false);
                      }}
                      className="cursor-pointer border-2 bg-white border-gray-300 text-black w-40 rounded-md hover:bg-gray-100 p-2"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => console.log("clic")}
                      type="submit"
                      className="cursor-pointer border-2 bg-blue-500  text-white w-40 rounded-md hover:bg-blue-600 p-2"
                    >
                      Guardar usuario
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <table className="text-left w-335 border mt-8">
        <thead className="bg-blue-600">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="pt-2 pl-2 pb-2 text-white cursor-pointer"
                >
                  <span className="flex">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getIsSorted() === "asc" ? (
                      <ArrowDownIcon class="h-6 w-6 text-white font-bold" />
                    ) : header.column.getIsSorted() === "desc" ? (
                      <ArrowUpIcon class="h-6 w-6 text-white font-bold" />
                    ) : null}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="[&:nth-child(even)]:bg-[#f2f2f2]">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-t pt-2 pl-2 pb-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          className="cursor-pointer border-2"
          onClick={() => table.setPageIndex(0)}
        >
          Primer Pagina
        </button>
        <button
          className="cursor-pointer border-2"
          onClick={() => table.nextPage()}
        >
          Pagina Siguiente
        </button>
        <button
          className="cursor-pointer border-2"
          onClick={() => table.previousPage()}
        >
          Pagina Anterior{" "}
        </button>
        <button
          className="cursor-pointer border-2"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        >
          Ultima Pagina
        </button>
      </div>
    </div>
  );
}
