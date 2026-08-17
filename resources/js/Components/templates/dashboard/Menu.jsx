import { Link, usePage } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";

function MenuItem({ item }) {
    const { url } = usePage();
    const isActive = item.url && (url === item.url || url.startsWith(`${item.url}/`));
    const Icon = item.icon;

    if (item.isTitle) return <li className="side-nav-title">{item.label}</li>;

    return (
        <li className={`side-nav-item ${isActive ? "active" : ""}`}>
            <Link href={item.url || "#"} className={`side-nav-link ${isActive ? "active" : ""}`}>
                {Icon && <span className="menu-icon"><Icon size={18} /></span>}
                <span className="menu-text">{item.label}</span>
                {item.badge && <span className={`badge rounded text-end bg-${item.badge.variant}`}>{item.badge.text}</span>}
                {item.children && <ChevronRight size={14} className="menu-arrow" />}
            </Link>
            {item.children && (
                <ul className="sub-menu">
                    {item.children.map((child) => <MenuItem key={child.key} item={child} />)}
                </ul>
            )}
        </li>
    );
}

export default function Menu({ items = [] }) {
    return <ul className="side-nav">{items.map((item) => <MenuItem key={item.key} item={item} />)}</ul>;
}
