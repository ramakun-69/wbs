import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import PublicLayout, { ArticleImage } from "../../../Layouts/PublicLayout";

export default function Show({ article }) {
    const { t } = useTranslation();
    return <PublicLayout><article className="public-container public-article-detail"><Link href={route("public.articles.index")} className="public-text-link"><ArrowLeft size={16} /> {t("Back to Articles")}</Link><span className="public-date d-block mt-4">{article.published_at ? new Date(article.published_at).toLocaleDateString() : "-"}</span><h1>{article.title}</h1>{article.cover_image_path && <ArticleImage article={article} className="public-detail-cover" />}<div className="public-rich-content" dangerouslySetInnerHTML={{ __html: article.content }} /></article></PublicLayout>;
}
