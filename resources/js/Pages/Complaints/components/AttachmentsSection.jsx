import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import Button from "../../../Components/ui/Button";
import MultipleFileUpload from "../../../Components/ui/MultipleFileUpload";

export default function AttachmentsSection({ attachments, setData }) {
    const { t } = useTranslation();

    const handleRemoveFile = (index) => {
        setData("attachments", attachments.filter((_, fileIndex) => fileIndex !== index));
    };

    return (
        <section className="complaint-form-section">
            <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                <div>
                    <h5 className="mb-1">{t("Attachments")}</h5>
                    <p className="text-muted mb-0 small">
                        {t("Attach supporting evidence related to the complaint.")}
                    </p>
                </div>
                <MultipleFileUpload data={attachments} setData={setData} fieldName="attachments" maxFiles={10} allowedFileTypes={[".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".zip"]} />
            </div>

            <div className="alert alert-info py-2 small">
                {t("Maximum file size: 100 MB per file. Supported files: PDF, DOC, DOCX, JPG, PNG, ZIP, and other evidence formats.")}
            </div>

            {attachments.length === 0 ? (
                <div className="border rounded text-center text-muted py-4">
                    {t("No attachments added.")}
                </div>
            ) : (
                <div className="table-responsive border rounded">
                    <table className="table table-sm align-middle mb-0">
                        <thead>
                            <tr>
                                <th>{t("No")}</th>
                                <th>{t("File Name")}</th>
                                <th>{t("File Size")}</th>
                                <th className="text-end">{t("Actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attachments.map((file, index) => (
                                <tr key={`${file.name}-${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{file.name}</td>
                                    <td>{`${(file.size / 1024 / 1024).toFixed(2)} MB`}</td>
                                    <td className="text-end">
                                        <Button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <Icon icon="solar:trash-bin-trash-outline" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
