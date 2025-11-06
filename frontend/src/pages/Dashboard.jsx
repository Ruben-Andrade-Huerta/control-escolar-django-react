import { SidebarAdmin } from "../components/SidebarAdmin";
import { DashboardContent } from "../components/DashboardContent";

export function Dashboard() {
    return(
        <div className="bg blue-">
            <SidebarAdmin/>
            <DashboardContent/>
        </div>
    )
}