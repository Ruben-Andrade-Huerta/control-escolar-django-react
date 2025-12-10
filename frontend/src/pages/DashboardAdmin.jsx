import { SidebarAdmin } from "../components/admin/SidebarAdmin";
import { DashboardContent } from "../components/admin/DashboardContent";
import { NavbarAdmin } from '../components/admin/NavbarAdmin'

export function Dashboard() {
    return(
        <div className="bg blue-">
            <SidebarAdmin/>
            <NavbarAdmin/>
            <DashboardContent/>
        </div>
    )
}