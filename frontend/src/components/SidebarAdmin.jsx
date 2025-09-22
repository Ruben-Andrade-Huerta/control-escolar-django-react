import { UsersIcon, UserGroupIcon, BookOpenIcon, AcademicCapIcon, CalendarIcon, DocumentChartBarIcon, HomeIcon } from '@heroicons/react/24/outline';

export function SidebarAdmin(){
    return(
        <nav className="fixed top-0 left-0 h-screen w-32 m-0 flex flex-col bg-blue-950 text-white">
           <ul>
                <li>
                    <HomeIcon class="h-6 w-6 inline mr-2 text-white" />
                    Inicio
                </li>
                <li>
                    <UsersIcon className="h-6 w-6 inline mr-2 text-white"></UsersIcon>
                    Usuarios
                </li>
                <li>
                    <UserGroupIcon className="h-6 w-6 inline mr-2 text-white" />
                    Grupos
                </li>
                <li>
                    <BookOpenIcon class="h-6 w-6 inline mr-2 text-white" />
                    Materias
                </li>
                <li>
                    <AcademicCapIcon className="h-6 w-6 inline mr-2 text-white" />
                    Evaluaciones
                </li>
                <li>
                    <CalendarIcon class="h-6 w-6 inline mr-2 text-white" />
                    Asistencias
                </li>
                <li>
                    <DocumentChartBarIcon class="h-6 w-6 inline mr-2 text-white" />
                    Reportes
                </li>
            </ul>
        </nav>
    )
}