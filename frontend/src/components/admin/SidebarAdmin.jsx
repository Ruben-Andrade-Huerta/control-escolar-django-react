import {
  UsersIcon,
  UserGroupIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  DocumentChartBarIcon,
  HomeIcon,
  ClockIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";

// Datos de navegacion-----

const NAV_ITEMS = [
  {
    section: "Principal",
    items: [{ label: "Dashboard", path: "/dashboard-admin", icon: HomeIcon }],
  },
  {
    section: "Gestión",
    items: [
      { label: "Usuarios", path: "/usuarios-admin", icon: UsersIcon },
      { label: "Grupos", path: "/admin/grupos", icon: UserGroupIcon },
      { label: "Materias", path: "/admin/materias", icon: BookOpenIcon },
    ],
  },
  {
    section: "Académico",
    items: [
      {
        label: "Evaluaciones",
        path: "/admin/evaluaciones",
        icon: AcademicCapIcon,
      },
      { label: "Asistencias", path: "/admin/asistencias", icon: ClockIcon },
      {
        label: "Reportes",
        path: "/admin/reportes",
        icon: DocumentChartBarIcon,
      },
      { label: "Periodos", path: "/admin/periodos", icon: CalendarDaysIcon },
    ],
  },
];

// Subcomponentes------

function NavSection({ label }) {
  return (
    <div className="text-[9px] uppercase tracking-[0.1em] text-white/[0.28] px-6 pt-3.5 pb-1.5">
      {label}
    </div>
  );
}

function NavItem({ label, icon: Icon, active, onClick }) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center gap-2.5 px-6 py-2.5 text-[13.5px] cursor-pointer border-l-2 transition-all select-none
        ${
          active
            ? "text-white bg-white/[0.11] border-accent-ccv"
            : "text-white/[0.58] border-transparent hover:text-white hover:bg-white/[0.07]"
        }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {label}
    </li>
  );
}

// Componente principal----------

export function SidebarAdmin() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const usuario = {
    nombre: "Ruben Andrade",
    rol: "Administrador",
    iniciales: "RA",
  };

  return (
    <aside className="w-[230px] min-w-[230px] h-screen bg-primary-ccv flex flex-col">
      {/* logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.08]">
        <div className="w-[45px] h-[45px] rounded-[9px] bg-white flex items-center justify-center flex-shrink-0">
          <img src="/logos/ccv_logo.jpg" alt="CCV Logo" className="w-10 h-10" />
        </div>
        <div>
          <div className="text-[12px] font-semibold text-white leading-tight">
            Control Escolar
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">
            Colegio Central Veracruzano
          </div>
        </div>
      </div>

      {/* {Sections} */}
      <nav className="">
        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            <NavSection label={group.section} />
            <ul>
              {group.items.map((item) => (
                <NavItem
                  key={item.path}
                  label={item.label}
                  icon={item.icon}
                  active={pathname === item.path}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}