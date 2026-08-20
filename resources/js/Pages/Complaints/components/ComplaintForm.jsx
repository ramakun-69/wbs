import { useForm } from "@inertiajs/react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import Button from "../../../Components/ui/Button";
import { confirmAlert } from "../../../Components/ui/SweetAlert";
import { notifySuccess } from "../../../Components/ui/Toastify";
import TextInput from "../../../Components/ui/TextInput";
import ReporterSection from "./ReporterSection";
import PartiesSection, { emptyParty } from "./PartiesSection";
import AttachmentsSection from "./AttachmentsSection";
import CheckBoxInput from "../../../Components/ui/CheckBoxInput";
import RichTextEditor from "../../../Components/ui/RichTextEditor";

const defaultValues = {
    category_id: "",
    title: "",
    description: "",
    reporter: {
        name: "",
        is_anonymous: false,
    },
    parties: [emptyParty()],
    attachments: [],
    terms_accepted: false,
};

export { defaultValues };

export default function ComplaintForm({ categories = [], complaint = null }) {
    const { t } = useTranslation();
    const {
        data,
        setData,
        post,
        transform,
        processing,
        errors,
    } = useForm(complaint ? { ...defaultValues, ...complaint } : defaultValues);
    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: t(`complaint_categories.${category.code}`, {
            defaultValue: category.name,
        }),
    }));

    const handleSubmit = (event, status) => {
        event.preventDefault();

        const message = status === "Draft"
            ? t("save_draft_confirmation")
            : t("submit_complaint_confirmation");

        confirmAlert(t("Are You Sure?"), message, "warning", () => {
            transform((formData) => ({ ...formData, status }));
            post(route("dashboard.complaints.store"), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    notifySuccess(
                        page.props?.flash?.success ?? t("Complaint submitted successfully."),
                    );
                },
            });
        });
    };

    return (
        <form onSubmit={(event) => handleSubmit(event, "Submitted")}>
            <div className="card">
                <div className="card-header border-0 border-bottom border-dashed">
                    <h4 className="header-title mb-1">{t("Complaint Form")}</h4>
                    <p className="text-muted mb-0">{t("Complete the complaint information")}</p>
                </div>

                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-6 mb-3">
                            <label className="form-label">{t("Complaint Title")} *</label>
                            <TextInput
                                value={data.title}
                                errorMessage={errors.title}
                                onChange={(event) => setData("title", event.target.value)}
                            />
                        </div>

                        <div className="col-lg-6 mb-3">
                            <label className="form-label">{t("Category")} *</label>
                            <Select
                                options={categoryOptions}
                                value={categoryOptions.find((option) => option.value === data.category_id) ?? null}
                                onChange={(option) => setData("category_id", option?.value ?? "")}
                                placeholder={t("Select category")}
                                isClearable
                                classNamePrefix="react-select"
                            />
                            {errors.category_id && <div className="text-danger small mt-2">{errors.category_id}</div>}
                        </div>

                        <div className="col-12 mb-3">
                            <label className="form-label">{t("Complaint Description")} *</label>
                            <RichTextEditor
                                height="240px"
                                value={data.description}
                                onChange={(value) => setData("description", value)}
                                errorMessage={errors.description}
                            />
                        </div>
                    </div>

                    <hr className="my-4" />

                    <ReporterSection data={data} setData={setData} errors={errors} />
                    <PartiesSection parties={data.parties} setData={setData} errors={errors} />
                    <AttachmentsSection attachments={data.attachments} setData={setData} />

                    <section className="complaint-form-section pb-0">
                        <h5>{t("Terms and Conditions")}</h5>
                        <p className="text-muted small">
                            {t("Please make sure the information submitted is accurate and can be supported by relevant evidence.")}
                        </p>
                        <div className="form-check">
                            <CheckBoxInput
                                id="terms-accepted"
                                type="checkbox"
                                checked={data.terms_accepted}
                                errorMessage={errors.terms_accepted}
                                label={t("I agree to the terms and conditions.")}
                                onChange={(event) => setData("terms_accepted", event.target.checked)}
                            />
                        </div>
                    </section>
                </div>

                <div className="card-footer d-flex justify-content-end gap-2 p-3">
                    <Button type="button" className="btn btn-outline-danger" onClick={() => window.history.back()}>
                        {t("Cancel")}
                    </Button>
                    <Button
                        type="button"
                        className="btn btn-outline-primary"
                        isLoading={processing}
                        onClick={(event) => handleSubmit(event, "Draft")}
                    >
                        {t("Save Draft")}
                    </Button>
                    <Button type="submit" className="btn btn-primary" isLoading={processing}>
                        {t("Submit Complaint")}
                    </Button>
                </div>
            </div>
        </form>
    );
}
