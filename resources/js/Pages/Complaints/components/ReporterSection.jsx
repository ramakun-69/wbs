import { useTranslation } from "react-i18next";
import TextInput from "../../../Components/ui/TextInput";
import CheckBoxInput from "../../../Components/ui/CheckBoxInput";

export default function ReporterSection({ data, setData, errors = {} }) {
    const { t } = useTranslation();

    return (
        <section className="complaint-form-section">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                    <h5 className="mb-1">{t("Reporter Information")}</h5>
                    <p className="text-muted mb-0 small">
                        {t("Complete the reporter information for this complaint.")}
                    </p>
                </div>
            </div>

            <div className="row g-3">
                {!data.reporter.is_anonymous && (
                    <div className="col-md-8">
                        <label className="form-label">
                            {t("Full Name")} <span className="text-danger">*</span>
                        </label>
                        <TextInput
                            value={data.reporter.name}
                            errorMessage={errors["reporter.name"]}
                            onChange={(event) =>
                                setData("reporter", {
                                    ...data.reporter,
                                    name: event.target.value,
                                })
                            }
                        />
                    </div>
                )}

                <div className={`${data.reporter.is_anonymous ? "col-12" : "col-md-4"} d-flex align-items-end`}>
                    <div className="form-check mb-2">
                        <CheckBoxInput
                            id="is-anonymous"
                            type="checkbox"
                            checked={data.reporter.is_anonymous}
                            label={t("Submit anonymously")}
                            onChange={(event) =>
                                setData("reporter", {
                                    ...data.reporter,
                                    name: event.target.checked ? "" : data.reporter.name,
                                    is_anonymous: event.target.checked,
                                })
                            }
                        />
                    </div>
                </div>
            </div>

            {data.reporter.is_anonymous && (
                <div className="alert alert-warning mt-3 mb-0">
                    {t( "Anonymous reports may limit the ability of officers to request additional information.")}
                </div>
            )}
        </section>
    );
}
