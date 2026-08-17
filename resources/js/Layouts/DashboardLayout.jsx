import { useEffect, useState } from "react";
import Navbar from './../Components/templates/dashboard/Navbar';
import Sidebar from './../Components/templates/dashboard/Sidebar';
import Footer from "../Components/templates/dashboard/Footer";

export default function DashboardLayout({ children }) {
    const [menuSize, setMenuSize] = useState("default");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-topbar-color", "brand");
        document.documentElement.setAttribute("data-menu-color", "light");
        document.documentElement.setAttribute("data-sidenav-size", menuSize);
        if (menuSize !== "full") document.documentElement.classList.remove("sidebar-enable");
        return () => {
            document.documentElement.removeAttribute("data-sidenav-size");
            document.documentElement.classList.remove("sidebar-enable");
        };
    }, [menuSize]);

    useEffect(() => {
        const syncMenuSize = () => {
            if (window.innerWidth <= 768) {
                setMenuSize("full");
                setSidebarOpen(false);
                document.documentElement.classList.remove("sidebar-enable");
            } else if (window.innerWidth <= 1140) {
                setMenuSize("condensed");
            } else {
                setMenuSize("default");
            }
        };

        syncMenuSize();
        window.addEventListener("resize", syncMenuSize);
        return () => window.removeEventListener("resize", syncMenuSize);
    }, []);

    const toggleSidebar = () => {
        if (window.innerWidth <= 768) {
            setMenuSize("full");
            setSidebarOpen((current) => {
                document.documentElement.classList.toggle("sidebar-enable", !current);
                return !current;
            });
            return;
        }

        setMenuSize((current) => current === "default" ? "sm-hover" : "default");
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        document.documentElement.classList.remove("sidebar-enable");
    };

    return (
        <div className="wrapper">
            <Navbar onToggleSidebar={toggleSidebar} />
            <Sidebar onClose={closeSidebar} />
            {menuSize === "full" && sidebarOpen && <div className="dashboard-sidebar-backdrop" onClick={closeSidebar} />}
            <div className="page-content">
                <div className="container-fluid">{children}</div>
                <Footer />
            </div>
        </div>
    );
}
