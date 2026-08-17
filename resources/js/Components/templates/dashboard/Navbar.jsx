import { Link, router, usePage } from "@inertiajs/react";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import LogoBox from "./LogoBox";
import Button from './../../../Components/ui/Button';

export default function Navbar({ onToggleSidebar }) {
    const { auth } = usePage().props;
    const [dark, setDark] = useState(false);
    const user = auth?.user;

    useEffect(() => {
        const saved = localStorage.getItem("wbs-theme") === "dark";
        setDark(saved);
        document.documentElement.setAttribute("data-bs-theme", saved ? "dark" : "light");
    }, []);

    const toggleTheme = () => {
        const next = !dark;
        setDark(next);
        localStorage.setItem("wbs-theme", next ? "dark" : "light");
        document.documentElement.setAttribute("data-bs-theme", next ? "dark" : "light");
    };

    return (
        <header className="app-topbar">
            <div className="page-container topbar-menu">
                <div className="d-flex align-items-center gap-2">
                    <LogoBox />
                    <Button type="button" onClick={onToggleSidebar} className="sidenav-toggle-button border-0 bg-transparent px-2">
                        <Menu size={24} />
                    </Button>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Button type="button" onClick={toggleTheme} className="topbar-link border-0 bg-transparent" aria-label="Toggle theme">
                        {dark ? <Sun size={21} /> : <Moon size={21} />}
                    </Button>
                    <div className="topbar-item nav-user dropdown">
                        <Button className="topbar-link drop-arrow-none px-2 border-0 bg-transparent" data-bs-toggle="dropdown" type="button">
                            <span className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                                {(user?.name || "U").charAt(0).toUpperCase()}
                            </span>
                            <span className="d-none d-lg-inline fw-semibold ms-2">{user?.name || "User"}</span>
                        </Button>
                        <div className="dropdown-menu dropdown-menu-end">
                            <Link href="/profile" className="dropdown-item">Profile</Link>
                            <Button type="button" className="dropdown-item text-danger" onClick={() => router.post("/logout")}>
                                <LogOut size={16} className="me-2" /> Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
