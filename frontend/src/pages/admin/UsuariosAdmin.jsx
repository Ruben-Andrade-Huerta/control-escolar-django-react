import { SidebarAdmin } from "../../components/admin/SidebarAdmin";
import { NavbarAdmin } from '../../components/admin/NavbarAdmin'
import {UsuariosContent} from '../../components/admin/UsuariosContentAdmin'

export function UsuariosAdmin(){
    return(
        <div className="bg blue-">
            <SidebarAdmin/>
            <NavbarAdmin/>
            <UsuariosContent />
        </div>
    )
}