import { Link, usePage } from "@inertiajs/react";
import { BookOpen, ClipboardCheck, FileBarChart, FileText, HelpCircle, LayoutDashboard, MessageSquare, Search, ShieldCheck, UserRound, Users, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { route } from "ziggy-js";
import { Ziggy } from "../../../../ziggy";
import { useAuth } from "../../../../src/hook/useAuth";

const item = (key, label, icon, permissions, routeName = null, fallbackUrl = "") => ({ key, label, icon, permissions: Array.isArray(permissions) ? permissions : [permissions].filter(Boolean), route: routeName, fallbackUrl, url: "" });

const MENU_ITEMS = [
    item("dashboard", "menu.dashboard", LayoutDashboard, [], "dashboard.index", "/dashboard"),
    item("complaints", "menu.complaints", FileText, ["View All Complaints", "View Own Complaint", "Create Complaint"]),
    item("reports", "menu.reports", FileBarChart, ["View All Complaints", "Export Complaints"]),
    item("faq", "menu.faq", HelpCircle, ["View FAQ", "Manage Content"]),
    item("support", "menu.support", MessageSquare, ["View Support", "Manage Support", "View Own Support", "Create Support"]),
    item("users", "menu.users", Users, "Manage Users", "users.index", "/users"),
    item("categories", "menu.categories", FileText, "Manage Content"),
    item("articles", "menu.articles", BookOpen, "Manage Content"),
    item("investigation", "menu.investigation", Wrench, ["View Investigation", "Execute Investigation", "Submit Investigation"]),
    item("assignment", "menu.assignment_letter", ClipboardCheck, "Create Investigation"),
    item("review", "menu.investigation_review", Search, "Review Investigation"),
    item("approval", "menu.recommendation_approval", ShieldCheck, "Approve Recommendation"),
    item("profile", "menu.profile", UserRound, []),
];

function filterItems(items, permissions) {
    return items.filter((menuItem) => !menuItem.permissions.length || menuItem.permissions.some((permission) => permissions.includes(permission)));
}

export default function Menu() {
    const { url } = usePage();
    const { t } = useTranslation();
    const { permissions = [] } = useAuth();
    const menuItems = filterItems(MENU_ITEMS, permissions);

    return <ul className="side-nav">
        {menuItems.map((item) => {
            let href = item.fallbackUrl || item.url || "#";
            if (item.route) {
                try {
                    href = route(item.route, undefined, false, Ziggy);
                } catch {
                    href = item.fallbackUrl || "#";
                }
            }

            const isActive = href !== "#" && (url === href || url.startsWith(`${href}/`));
            const Icon = item.icon;

            return <li key={item.key} className={`side-nav-item ${isActive ? "active" : ""}`}>
                <Link href={href} className={`side-nav-link ${isActive ? "active" : ""}`}>
                    {Icon && <span className="menu-icon"><Icon size={18} /></span>}
                    <span className="menu-text">{t(item.label)}</span>
                </Link>
            </li>;
        })}
    </ul>;
}
