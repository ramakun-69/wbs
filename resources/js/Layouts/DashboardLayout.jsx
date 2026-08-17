import { useEffect, useState } from "react";
import Navbar from './../Components/templates/dashboard/Navbar';
import Sidebar from './../Components/templates/dashboard/Sidebar';
import Footer from './../../../template/src/components/layout/Footer';

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-topbar-color", "light");
        document.documentElement.setAttribute("data-menu-color", "light");
        document.documentElement.setAttribute("data-sidenav-size", sidebarOpen ? "full" : "default");
        return () => document.documentElement.removeAttribute("data-sidenav-size");
    }, [sidebarOpen]);

    return (
        <div className="wrapper">
            <Navbar onToggleSidebar={() => setSidebarOpen((value) => !value)} />
            <Sidebar items={MENU_ITEMS} onClose={() => setSidebarOpen(false)} />
            {sidebarOpen && <div className="offcanvas-backdrop fade show" onClick={() => setSidebarOpen(false)} />}
            <div className="page-content">
                <div className="container-fluid">{children}</div>
                <Footer />
            </div>
        </div>
    );
}
