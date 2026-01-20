import {  UsersIcon, UserGroupIcon, BookOpenIcon, AcademicCapIcon, CalendarIcon, DocumentChartBarIcon, HomeIcon,  } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export function SidebarAdmin() {

  const navigate = useNavigate();

  return (
    <aside style={{ width: "var(--sidebar-width)" ,  top: "var(--navbar-height)"}} className="fixed left-0 h-screen m-0 flex flex-col bg-blue-800 text-white items-center">
    {/* // <aside className="fixed left-0 top-[var(--navbar-height)] h-full w-[var(--sidebar-width)]"> */}
      <ul className="w-40 space-y-3">
        <li onClick={() => navigate("/dashboard-admin")} className="h-8 flex items-center pl-2 cursor-pointer hover:bg-blue-600/50 rounded-b-sm">
          <HomeIcon className="h-6 w-6 inline mr-2 text-white" />
          Inicio
        </li>
        <li onClick={() => navigate("/usuarios-admin")} className="h-8 flex items-center pl-2 cursor-pointer hover:bg-blue-600/50 rounded-b-sm">
          <UsersIcon className="h-6 w-6 inline mr-2 text-white"></UsersIcon>
          Usuarios
        </li>
        <li className="h-8 flex items-center pl-2 cursor-pointer hover:bg-blue-600/50 rounded-b-sm">
          <UserGroupIcon className="h-6 w-6 inline mr-2 text-white" />
          Grupos
        </li>
        <li className="h-8 flex items-center pl-2 cursor-pointer hover:bg-blue-600/50 rounded-b-sm">
          <BookOpenIcon className="h-6 w-6 inline mr-2 text-white" />
          Materias
        </li>
        <li className="h-8 flex items-center pl-2 cursor-pointer hover:bg-blue-600/50 rounded-b-sm">
          <AcademicCapIcon className="h-6 w-6 inline mr-2 text-white" />
          Evaluaciones
        </li>
        <li className="h-8 flex items-center pl-2 cursor-pointer hover:bg-blue-600/50 rounded-b-sm">
          <CalendarIcon className="h-6 w-6 inline mr-2 text-white" />
          Asistencias
        </li>
        <li className="h-8 flex items-center pl-2 cursor-pointer hover:bg-blue-600/50 rounded-b-sm">
          <DocumentChartBarIcon className="h-6 w-6 inline mr-2 text-white" />
          Reportes
        </li>
      </ul>
    </aside>
  );
}
