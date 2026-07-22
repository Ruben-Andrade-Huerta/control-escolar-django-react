import { SidebarAdmin } from "../../components/admin/SidebarAdmin";
import { DashboardContent } from "../../components/admin/DashboardContent";
import { NavbarAdmin } from '../../components/admin/NavbarAdmin'

export function DashboardAdmin() {
    return(
        <div className="flex h-screen">
            <SidebarAdmin/>
            <div className="flex flex-col flex-1">
                <NavbarAdmin/>
                <DashboardContent/>
                {/* <FooterAdmin/> */}
            </div>
        </div>
    )
}