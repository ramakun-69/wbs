import { Link } from "@inertiajs/react";
import { ArrowRight, ChevronDown, FileText, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import PublicLayout, {
    ArticleImage,
    PublicSectionTitle,
} from "../../Layouts/PublicLayout";
import { RegisterForm } from "../Auth/Register";

export default function Home({ articles = [], faqs = [] }) {
    const { t } = useTranslation();
    const featured = articles[0];

    return (
        <PublicLayout>
            <section className="public-hero public-container">
                <div className="public-hero-copy">
                    <span className="public-eyebrow">
                        {t("Whistleblowing System")}
                    </span>
                    <h1>
                        {t("A safe channel to report and follow up on complaints")}
                    </h1>
                    <p>
                        {t("Submit information about alleged violations through a secure, professional, objective, and responsible channel.")}
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                        <Link
                            href={route("login")}
                            className="btn public-primary-button"
                        >
                            {t("Sign In / Register")} <ArrowRight size={16} />
                        </Link>
                        <Link
                            href={route("public.tracking")}
                            className="btn public-outline-button"
                        >
                            {t("Track Complaint")} <Search size={16} />
                        </Link>
                    </div>
                </div>
                <div className="public-register-panel">
                    <span className="public-panel-eyebrow">
                        {t("Secure Access")}
                    </span>
                    <h3>{t("Create Reporter Account")}</h3>
                    <RegisterForm compact showLoginLink={false} />
                </div>
            </section>
            <section className="public-container public-home-section">
                <PublicSectionTitle
                    icon={FileText}
                    title={t("Latest Articles")}
                    subtitle={t("Information and updates from the Inspectorate.")}
                />
                <div className="public-article-feature">
                    {featured && (
                        <>
                            <ArticleImage article={featured} />
                            <div>
                                <span className="public-date">
                                    {featured.published_at
                                        ? new Date(featured.published_at).toLocaleDateString() : "-"}
                                </span>
                                <h3>{featured.title}</h3>
                                <p>{featured.excerpt || ""}</p>
                                <Link
                                    href={route("public.articles.show", featured.slug)}
                                >
                                    {t("Read Article")} <ArrowRight size={16} />
                                </Link>
                            </div>
                        </>
                    )}
                </div>
                <div className="public-article-list">
                    {articles.slice(1).map((article) => (
                        <Link
                            className="public-article-mini"
                            key={article.id}
                            href={route("public.articles.show", article.slug)}
                        >
                            <ArticleImage article={article} />
                            <div>
                                <h4>{article.title}</h4>
                                <p>{article.excerpt || ""}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="text-end mt-3">
                    <Link
                        href={route("public.articles.index")}
                        className="public-text-link"
                    >
                        {t("View All Articles")} <ArrowRight size={16} />
                    </Link>
                </div>
            </section>
            <section className="public-faq-section">
                <div className="public-container">
                    <PublicSectionTitle
                        title={t("Frequently Asked Questions")}
                    />
                    {faqs.map((faq) => (
                        <details className="public-faq" key={faq.id}>
                            <summary>
                                <ChevronDown size={17} />
                                {faq.question}
                            </summary>
                            <div
                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                        </details>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
