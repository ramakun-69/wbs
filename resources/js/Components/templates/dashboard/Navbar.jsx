import { Link } from "@inertiajs/react";
import { LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import LogoBox from "./partials/LogoBox";
import Button from "../../ui/Button";
import { Icon } from "@iconify/react";
import Flags from "./partials/Flags";
import LeftSideBarToggle from './partials/LeftSideBarToogle';
import { useAuth } from "../../../src/hook/useAuth";
import ThemeModeToggle from "./partials/ThemeModeToogle";
import { useTranslation } from "react-i18next";
import { confirmAlert } from "../../ui/SweetAlert";


export default function Navbar({ onToggleSidebar }) {
    const {user }= useAuth();
    const {t} = useTranslation();
     const handleLogout = () => {
        confirmAlert(t('Are You Sure?'), t('logout_confirmation'), 'warning', () => {
            window.location.assign('/logout');
        });
    }
    return (
        <header className="app-topbar">
            <div className="page-container topbar-menu">
                <div className="d-flex align-items-center gap-2">
                    <LogoBox />
                    <LeftSideBarToggle onToggle={onToggleSidebar} />
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Flags />
                    <ThemeModeToggle />
                    <div className="topbar-item nav-user dropdown">
                        <Button
                            className="topbar-link drop-arrow-none px-2 border-0 bg-transparent"
                            data-bs-toggle="dropdown"
                            type="button"
                        >
                            <span
                                className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                                style={{ width: 32, height: 32 }}
                            >
                                {(user?.name || "U").charAt(0).toUpperCase()}
                            </span>
                            <span className="d-none d-lg-inline fw-semibold ms-2">
                                {user?.name || "User"}
                            </span>
                        </Button>
                        <div className="dropdown-menu dropdown-menu-end">
                            <Link href="/profile" className="dropdown-item">
                                <User size={16} className="me-2" />
                                {t("Profile")}
                            </Link>
                            <Button
                                type="button"
                                className="dropdown-item text-danger"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} className="me-2" />{" "}
                                {t("Logout")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
