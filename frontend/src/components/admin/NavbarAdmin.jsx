import {
  ArrowLeftStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { logout } from "../../auth/authService";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export function NavbarAdmin() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    console.log("Logout");
    logout();
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div>
      <nav style={{ height: "var(--navbar-height)"}} className="fixed top-0 left-0 w-full bg-blue-800 p-4 flex justify-between">
        {/* <nav className="fixed top-0 left-0 w-full h-[var(--navbar-height)]"> */}
        <div className="flex items-center">
          {/* <li className="flex items-center pl-2">
            <img src="/logos/ccv_logo.jpg" className="h-12 w-12 pt-1" />
          </li> */}
          <img src="/logos/ccv_logo.jpg" className="h-12 w-12 pt-1" />
        </div>
        <div ref={dropdownRef} className="relative flex items-center">
          <h2 className="text-base text-white">School Admin</h2>
          <button
            onClick={() => setOpen((o) => !o)}
            className="cursor-pointer mx-2 px-4 py-2 text-white hover:bg-blue-600/50 rounded"
          >
            <UserCircleIcon class="h-7 w-7 text-white" />
          </button>
          {open && (
            <div className="mt-22 ml-2 absolute rounded block w-40 bg-gray-200 shadow-lg z-10">
              <button
                className="cursor-pointer w-full px-4 py-2 text-center text-sm text-gray-700 hover:bg-gray-300 rounded"
                onClick={handleLogout}
              >
                Cerrar sesion
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
