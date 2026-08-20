import { Link } from "@inertiajs/react";
import { ArrowRight, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import PublicLayout, { ArticleImage, PublicSectionTitle } from "../../../Layouts/PublicLayout";

export default function Index({ articles }) {
    const { t } = useTranslation();
    return <PublicLayout><div className="public-container public-page-section"><PublicSectionTitle icon={FileText} title={t("Articles")} subtitle={t("Information and updates from the Inspectorate.")} /><div className="public-article-feed">{articles.data.map((article) => <Link className="public-feed-item" key={article.id} href={route("public.articles.show", article.slug)}><ArticleImage article={article} /><div><span className="public-date">{article.published_at ? new Date(article.published_at).toLocaleDateString() : "-"}</span><h3>{article.title}</h3><p>{article.excerpt || ""}</p><span className="public-text-link">{t("Read Article")} <ArrowRight size={16} /></span></div></Link>)}</div></div></PublicLayout>;
}
