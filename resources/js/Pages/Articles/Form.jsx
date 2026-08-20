import { useTranslation } from "react-i18next";
import TextInput from "../../Components/ui/TextInput";
import RichTextEditor from "../../Components/ui/RichTextEditor";
import SingleFileUpload from "../../Components/ui/SingleFileUpload";

export default function Form({data, setData,errors, clearErrors})
{
    const {t} =useTranslation();
    return (
        <div className="row g-3 article-form-grid">
            <div className="col-12">
                <label className="form-label">{t("Article Title")}</label>
                <TextInput
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    errorMessage={errors.title}
                />
            </div>
            <div className="col-12">
                <label className="form-label">{t("Excerpt")}</label>
                <TextInput
                    value={data.excerpt}
                    onChange={(e) => setData("excerpt", e.target.value)}
                    errorMessage={errors.excerpt}
                />
            </div>
            <div className="col-12">
                <label className="form-label">{t("Article Content")}</label>
                <RichTextEditor
                    className="article-content-editor"
                    height="180px"
                    value={data.content}
                    onChange={(value) => setData("content", value)}
                    errorMessage={errors.content}
                />
            </div>
            <div className="col-md-8">
                <label className="form-label">{t("Cover Image")}</label>
                <SingleFileUpload
                    inputId="article-cover-upload"
                    initialFile={data.cover_image_path ? "/storage/" + data.cover_image_path : null}
                    selectedFile={data.cover_image}
                    onChange={(file) => setData("cover_image", file)}
                />
                <div className="text-danger small">{errors.cover_image}</div>
            </div>
            <div className="col-md-4 d-flex align-items-center">
                <label className="form-check mb-0 article-publish-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={data.is_published}
                        onChange={(e) =>
                            setData("is_published", e.target.checked)
                        }
                    />{" "}
                    <span className="form-check-label">
                        {t("Publish article")}
                    </span>
                </label>
            </div>
        </div>
    );
}
