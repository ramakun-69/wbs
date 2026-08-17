import { X } from "lucide-react";
import LogoBox from "./partials/LogoBox";
import Menu from "./partials/Menu";
import Button from "../../ui/Button";

export default function Sidebar({ onClose }) {
    return (
        <aside className="sidenav-menu">
            <LogoBox />
            <Button
                type="button"
                onClick={onClose}
                className="button-close-fullsidebar border-0 bg-transparent"
            >
                <X size={20} />
            </Button>
            <div data-simplebar className="h-100 overflow-auto">
                <Menu />
                <div className="clearfix" />
            </div>
        </aside>
    );
}
