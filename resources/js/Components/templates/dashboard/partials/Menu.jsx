import { Link, usePage } from "@inertiajs/react";
import { BookOpen, ClipboardCheck, FileBarChart, FileText, HelpCircle, LayoutDashboard, MessageSquare, Search, ShieldCheck, UserRound, Users, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { route } from "ziggy-js";
import { Ziggy } from "../../../../ziggy";
import { useAuth } from "../../../../src/hook/useAuth";

const item = (key, label, icon, permissions, routeName = null) => ({
    key,
    label,
    icon,
    permissions: Array.isArray(permissions)
        ? permissions
        : [permissions].filter(Boolean),
    route: routeName,
});

const MENU_ITEMS = [
    item("dashboard", "menu.dashboard", LayoutDashboard, [], "dashboard.index"),
    item("complaints", "menu.complaints", FileText, ["View All Complaints", "View Own Complaint", "Create Complaint", "View Investigation"], "dashboard.complaints.index"),
    item("reports", "menu.reports", FileBarChart, ["View All Complaints", "Export Complaints"], "dashboard.reports.complaints.index"),
    item("faq", "menu.faq", HelpCircle, "Manage FAQ", "dashboard.faqs.index"),
    item("support", "menu.support", MessageSquare, ["View Support", "Manage Support", "View Own Support", "Create Support"], "dashboard.supports.index"),
    item("users", "menu.users", Users, "Manage Users", "dashboard.users.index"),
    item("articles", "menu.articles", BookOpen, "Manage Content", "dashboard.articles.index", "/dashboard/articles"),
    item("investigation", "menu.investigation", Wrench, ["View Investigation", "Execute Investigation", "Submit Investigation"]),
    item("assignment", "menu.assignment_letter", ClipboardCheck, "Create Investigation"),
    item("review", "menu.investigation_review", Search, "Review Investigation"),
    item("approval", "menu.recommendation_approval", ShieldCheck, "Approve Recommendation"),
    item("categories", "menu.categories", FileText, "Manage Content"),
];

function filterItems(items, permissions, user) {
    return items.filter((menuItem) =>
        menuItem.route
        && (menuItem.key !== "profile" || user?.auth_type?.toLowerCase() !== "sso")
        && (!menuItem.permissions.length
            || menuItem.permissions.some((permission) => permissions.includes(permission)))
    );
}

export default function Menu() {
    const { url } = usePage();
    const { t } = useTranslation();
    const { permissions = [], user } = useAuth();
    const menuItems = filterItems(MENU_ITEMS, permissions, user);

    return <ul className="side-nav">
        {menuItems.map((item) => {
            const href = route(item.route, undefined, false, Ziggy);

           const isActive =
               href !== "#" &&
               (item.route === "dashboard.index"
                   ? url === href
                   : url === href || url.startsWith(`${href}/`));
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
