import { UsersIcon, UserGroupIcon, BookOpenIcon, AcademicCapIcon, CalendarIcon, DocumentChartBarIcon, HomeIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { logout } from '../auth/authService';
import { useNavigate } from 'react-router-dom';

export function SidebarAdmin(){

    const navigate = useNavigate();

    const handleLogout = () =>{
        logout();
        navigate('/login');
    }

    return(
        <nav className="fixed top-0 left-0 h-screen w-32 m-0 flex flex-col bg-blue-950 text-white">
           <ul>
                <li>
                    <HomeIcon className="h-6 w-6 inline mr-2 text-white" />
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
                    <BookOpenIcon className="h-6 w-6 inline mr-2 text-white" />
                    Materias
                </li>
                <li>
                    <AcademicCapIcon className="h-6 w-6 inline mr-2 text-white" />
                    Evaluaciones
                </li>
                <li>
                    <CalendarIcon className="h-6 w-6 inline mr-2 text-white" />
                    Asistencias
                </li>
                <li>
                    <DocumentChartBarIcon className="h-6 w-6 inline mr-2 text-white" />
                    Reportes
                </li>
                <li>
                    <ArrowLeftStartOnRectangleIcon className="h-6 w-6 inline mr-2 text-white" />
                    <button onClick={handleLogout}>Cerrar sesion</button>
                </li>
            </ul>
        </nav>
    )
}