import { Link, usePage } from "@inertiajs/react";
import { ArrowRight, Facebook, Instagram, MapPin, Phone, Search, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../assets/dashboard/images/logo-sm.png";

export default function PublicLayout({ children }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);

    return <div className="public-site">
        <div className="public-topbar">
            <div className="public-container d-flex justify-content-between align-items-center gap-3">
                <span><MapPin size={15} /> Jl. Jenderal Ahmad Yani Kisaran</span>
                <span><Phone size={15} /> +62 813-6790-4334</span>
                <div className="d-flex gap-3 d-none d-lg-flex"><Facebook size={16} /><Twitter size={16} /><Instagram size={16} /></div>
            </div>
        </div>
        <header className="public-header">
            <div className="public-container d-flex align-items-center justify-content-between gap-4">
                <Link href={route("public.home")} className="public-brand">
                    <img src={logo} alt="Inspektorat Kabupaten Asahan" />
                    <span><em>INSPEKTORAT</em> KAB. ASAHAN</span>
                </Link>
                <nav className="public-nav">
                    <Link href={route("public.articles.index")}>{t("Articles")}</Link>
                    <Link href={route("public.tracking")}>{t("Complaint Tracking")}</Link>
                    <Link href={isAuthenticated ? route("dashboard.index") : route("login")} className="public-login-button">
                        {isAuthenticated ? t("Dashboard") : t("Sign In / Register")}
                    </Link>
                </nav>
            </div>
        </header>
        <main>{children}</main>
        <footer className="public-footer">
            <div className="public-container public-footer-grid">
                <div><h6>{t("Contact Us")}</h6><p>Jl. Jend. Ahmad Yani<br />+62 813-6790-4334<br />Senin–Kamis · 07.30–16.00<br />Jumat · 07.30–11.00</p></div>
                <div className="text-center"><img src={logo} alt="Logo" /><p>Copyright 2026 © Inspektorat Kab. Asahan</p></div>
            </div>
        </footer>
    </div>;
}

export function PublicSectionTitle({ icon: Icon = Search, title, subtitle }) {
    return <div className="public-section-title"><Icon size={28} /><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div>;
}

export function ArticleImage({ article, className = "" }) {
    const source = article.cover_image_path ? `/storage/${article.cover_image_path}` : logo;
    return <img className={className} src={source} alt={article.title} />;
}
