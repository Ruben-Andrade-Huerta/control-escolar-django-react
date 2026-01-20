import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { fetchUsuarios } from "../../services/usuarios";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";

const columns = [
  { accessorKey: "id", header: "Id" },
  { accessorKey: "first_name", header: "Name" },
  { accessorKey: "last_name", header: "Apellido" },
  { accessorKey: "email", header: "Correo" },
  { accessorKey: "rol", header: "Rol" },
  { accessorKey: "is_active", header: "Activo" },
];

export function UsuariosContent() {
  const [data, setData] = useState([]);

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
  
  return (
    <div
      style={{
        top: "var(--navbar-height)",
        left: "var(--sidebar-width)",
        width: "var(--content-width)",
      }}
      className="fixed h-screen overflow-y-auto flex flex-col items-center "
    >
      <div className="flex justify-between w-full">
        <h1>Usuarios</h1>
        <button>Nuevo Usuario</button>
      </div>
      <table className="text-left w-300 border">
        <thead className="bg-gray-600">
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
        <button className="cursor-pointer border-2" onClick={() => table.setPageIndex(0)}>Primer Pagina</button>
        <button className="cursor-pointer border-2"  onClick={() => table.nextPage()}>Pagina Siguiente</button>
        <button className="cursor-pointer border-2"  onClick={() => table.previousPage()}>Pagina Anterior </button>
        <button className="cursor-pointer border-2"  onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
          Ultima Pagina
        </button>
      </div>
    </div>
  );
}
