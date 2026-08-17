import { X } from "lucide-react";
import LogoBox from "./LogoBox";
import Menu from "./Menu";


export default function Sidebar({ items, onClose }) {
    return (
        <aside className="sidenav-menu">
            <LogoBox />
            <button type="button" onClick={onClose} className="button-close-fullsidebar border-0 bg-transparent">
                <X size={20} />
            </button>
            <div data-simplebar className="h-100 overflow-auto">
                <Menu items={items} />
                <div className="clearfix" />
            </div>
        </aside>
    );
}
