import { useForm } from "@inertiajs/react";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../Components/ui/Button";
import TextInput from "../../../Components/ui/TextInput";
import RichTextEditor from "../../../Components/ui/RichTextEditor";
import SingleFileUpload from "../../../Components/ui/SingleFileUpload";
import { confirmAlert } from "../../../Components/ui/SweetAlert";
import { notifySuccess } from "../../../Components/ui/Toastify";
import { useAuth } from "../../../src/hook/useAuth";
import { stripHtml } from "../../../Utils/text";

const tabs = [
    "Examination Information",
    "Follow-up Plan",
    "Implementation",
    "Final Result",
];

const emptyActivity = {
    activity_date: "",
    activity_type: "Evidence Collection",
    description: "",
    activity_document: null,
};

const handlingOptions = [
    { value: "Pemsus", label: "Pemsus" },
    { value: "Pelimpahan", label: "Pelimpahan" },
    { value: "Clarification", label: "Clarification" },
    { value: "Koordinasi", label: "Koordinasi" },
];

const activityOptions = [
    { value: "Evidence Collection", label: "Evidence Collection" },
    { value: "Interview & Clarification", label: "Interview & Clarification" },
    { value: "Analysis & Testing", label: "Analysis & Testing" },
    { value: "Coordination", label: "Coordination" },
    { value: "Other", label: "Other" },
];

const conclusionOptions = [
    { value: "Administrative", label: "Administrative" },
    { value: "Disciplinary Violation", label: "Disciplinary Violation" },
    { value: "Overpayment", label: "Overpayment" },
    { value: "Code of Ethics Violation", label: "Code of Ethics Violation" },
];

const recommendationOptions = [
    { value: "Administrative Sanction", label: "Administrative Sanction" },
    { value: "Disciplinary Action", label: "Disciplinary Action" },
    { value: "Overpayment Recovery", label: "Overpayment Recovery" },
    { value: "Code of Ethics Action", label: "Code of Ethics Action" },
    { value: "Other", label: "Other" },
];

function formatDateInput(value) {
    if (!value) return "";

    return String(value).slice(0, 10);
}

export default function InvestigationWorkspace({ complaint }) {
    const { t } = useTranslation();
    const { hasPermission } = useAuth();
    const canExecute = hasPermission("Execute Investigation");
    const canEdit = canExecute && complaint.status === "Investigation";
    const investigation = complaint.investigation ?? {};
    const [activeTab, setActiveTab] = useState(0);
    const [activities, setActivities] = useState(
        investigation.activities ?? [],
    );
    // Tab access must follow persisted investigation data, not browser state.
    const [planSaved, setPlanSaved] = useState(
        Boolean(
            investigation.handling_type && investigation.target_completion_date,
        ),
    );
    const [phaseSaved, setPhaseSaved] = useState(
        (investigation.activities ?? []).length > 0,
    );
    const [finalValidation, setFinalValidation] = useState({});

    const phaseReady = phaseSaved && activities.length > 0;

    const isTabLocked = (index) =>
        (index === 2 && !planSaved) ||
        (index === 3 && (!planSaved || !phaseReady));

    useEffect(() => {
        if (isTabLocked(activeTab)) {
            setActiveTab(activeTab === 3 && planSaved ? 2 : 1);
        }
    }, [activeTab, planSaved, phaseReady]);
    const { data, setData, post, processing, errors } = useForm({
        handling_type: investigation.handling_type ?? "Pemsus",
        target_completion_date: formatDateInput(
            investigation.target_completion_date,
        ),
        conclusion: investigation.conclusion ?? "",
        conclusion_category:
            investigation.conclusion_category ?? "Administrative",
        reporter_report: investigation.reporter_report ?? "",
        implementation_document: null,
        recommendations: investigation.recommendations?.length
            ? investigation.recommendations.map((item) => ({
                  ...item,
                  document: null,
              }))
            : [],
    });
    const {
        data: activityData,
        setData: setActivityData,
        post: postActivity,
        processing: activityProcessing,
        errors: activityErrors,
    } = useForm(emptyActivity);

    const handleAddActivity = () => {
        postActivity(
            route(
                "dashboard.complaints.investigation.activities.store",
                complaint.id,
            ),
            {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: (page) => {
                    setActivities(
                        page.props.complaint?.investigation?.activities ?? [],
                    );
                    setActivityData(emptyActivity);
                },
            },
        );
    };

    const handleSaveImplementation = () => {
        setPhaseSaved(true);
        setActiveTab(3);
    };

    const handleSavePlan = () => {
        post(
            route("dashboard.complaints.investigation.plan.save", complaint.id),
            {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    setPlanSaved(true);
                    setActiveTab(2);
                    notifySuccess(t("Examination plan saved successfully."));
                },
            },
        );
    };

    const handleSaveResult = () => {
        if (!validateFinal()) return;

        post(
            route(
                "dashboard.complaints.investigation.result.save",
                complaint.id,
            ),
            {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: (page) =>
                    notifySuccess(
                        page.props?.flash?.success ??
                            t("Examination result saved successfully."),
                    ),
            },
        );
    };

    const validateFinal = () => {
        const validation = {
            conclusion: !stripHtml(data.conclusion).trim()
                ? t("Conclusion is required.")
                : "",
            conclusion_category: !data.conclusion_category
                ? t("Conclusion category is required.")
                : "",
            reporter_report: !stripHtml(data.reporter_report).trim()
                ? t("Report for reporter is required.")
                : "",
            recommendations: !data.recommendations.length
                ? t("Add at least one recommendation.")
                : data.recommendations.some((item) => !item.recommendation_type)
                  ? t("Select a recommendation type for every recommendation.")
                  : "",
        };

        setFinalValidation(validation);
        return !Object.values(validation).some(Boolean);
    };

    const handleAddRecommendation = () => {
        setData("recommendations", [
            ...data.recommendations,
            { recommendation_type: "", description: "", document: null },
        ]);
    };

    const handleUpdateRecommendation = (index, field, value) => {
        setData(
            "recommendations",
            data.recommendations.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item,
            ),
        );
    };

    const handleRemoveRecommendation = (index) => {
        setData(
            "recommendations",
            data.recommendations.filter((_, itemIndex) => itemIndex !== index),
        );
    };

    const handleSubmitResult = () => {
        if (!validateFinal()) return;

        confirmAlert(
            t("Are You Sure?"),
            t("Send the examination result to the Irban V?"),
            "warning",
            () =>
                post(
                    route(
                        "dashboard.complaints.investigation.submit",
                        complaint.id,
                    ),
                    {
                        preserveScroll: true,
                        forceFormData: true,
                        onSuccess: (page) =>
                            notifySuccess(
                                page.props?.flash?.success ??
                                    t(
                                        "Complaint workflow updated successfully.",
                                    ),
                            ),
                    },
                ),
        );
    };

    return (
        <div className={`card mb-3 ${canEdit ? "workspace-editable" : "workspace-readonly"}`}>
            <div className="card-header border-0 border-bottom border-dashed">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                    <div>
                        <h4 className="header-title mb-1">
                            {t("Investigation Workspace")}
                        </h4>
                        <p className="text-muted mb-0">{complaint.ticket_number}</p>
                    </div>
                    <span className="badge workspace-status-badge">
                        {t(complaint.status)}
                    </span>
                </div>
            </div>

            <div className="workspace-summary mx-3 mt-3">
                <div className="workspace-summary-item">
                    <span>{t("Category")}</span>
                    <strong>{t(complaint.category?.name) || "-"}</strong>
                </div>
                <div className="workspace-summary-item">
                    <span>{t("Priority")}</span>
                    <strong>{complaint.priority ? t(complaint.priority) : "-"}</strong>
                </div>
                <div className="workspace-summary-item">
                    <span>{t("Handling Type")}</span>
                    <strong>{investigation.handling_type ? t(investigation.handling_type) : "-"}</strong>
                </div>
                <div className="workspace-summary-item">
                    <span>{t("Target Completion Date")}</span>
                    <strong>{formatDateInput(investigation.target_completion_date) || "-"}</strong>
                </div>
                <div className="workspace-summary-item">
                    <span>{t("Activities")}</span>
                    <strong>{activities.length}</strong>
                </div>
            </div>

            <div className="card-body">
                <ul className="nav nav-tabs nav-bordered workspace-tabs mb-4">
                    {tabs.map((tab, index) => (
                        <li className="nav-item" key={tab}>
                            {(() => {
                                const locked = isTabLocked(index);

                                return (
                                    <Button
                                        type="button"
                                        className={`nav-link ${activeTab === index ? "active" : ""} ${locked ? "workspace-tab-locked" : ""}`}
                                        disabled={locked}
                                        aria-disabled={locked}
                                        tabIndex={locked ? -1 : 0}
                                        title={
                                            locked
                                                ? t(
                                                      index === 2
                                                          ? "Save the follow-up plan first."
                                                          : "Save the activity stage first.",
                                                  )
                                                : undefined
                                        }
                                        onClick={() => {
                                            if (locked) return;
                                            setActiveTab(index);
                                        }}
                                    >
                                        {index + 1}. {t(tab)}
                                    </Button>
                                );
                            })()}
                        </li>
                    ))}
                </ul>

                {activeTab === 0 && (
                    <div className="row g-3">
                        <div className="col-md-4">
                            <small className="text-muted d-block">
                                {t("Category")}
                            </small>
                            <strong>
                                {t(complaint.category?.name) ?? "-"}
                            </strong>
                        </div>
                        <div className="col-md-4">
                            <small className="text-muted d-block">
                                {t("Priority")}
                            </small>
                            <strong>
                                {complaint.priority
                                    ? t(complaint.priority)
                                    : "-"}
                            </strong>
                        </div>
                        <div className="col-md-4">
                            <small className="text-muted d-block">
                                {t("Assignment Letter Number")}
                            </small>
                            <strong>{investigation.sk_number ?? "-"}</strong>
                        </div>
                        <div className="col-12">
                            <small className="text-muted d-block mb-2">
                                {t("Complaint Description")}
                            </small>
                            <div className="bg-light rounded p-3 text-break">
                                {stripHtml(complaint.description)}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <small className="text-muted d-block">
                                {t("Team Leader")}
                            </small>
                            <span>{investigation.team_leader_name ?? "-"}</span>
                        </div>
                        {canEdit && (
                            <div className="col-12 d-flex justify-content-end">
                                <Button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setActiveTab(1)}
                                >
                                    {t("Continue to Plan")}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 1 && (
                    <div className="row g-3">
                        <div className="col-md-12">
                            <label className="form-label">
                                {t("Handling Type")}
                            </label>
                            <div className="row g-2">
                                {handlingOptions.map((option) => (
                                    <div
                                        className="col-12 col-lg-3"
                                        key={option.value}
                                    >
                                        <Button
                                            type="button"
                                            className={`w-100 handling-option ${data.handling_type === option.value ? "active" : ""}`}
                                            disabled={!canEdit}
                                            onClick={() =>
                                                setData(
                                                    "handling_type",
                                                    option.value,
                                                )
                                            }
                                        >
                                            {t(option.label)}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {errors.handling_type && (
                                <div className="text-danger small mt-2">
                                    {errors.handling_type}
                                </div>
                            )}
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">
                                {t("Target Completion Date")}
                            </label>
                            <TextInput
                                type="date"
                                value={data.target_completion_date}
                                onChange={(event) =>
                                    setData(
                                        "target_completion_date",
                                        event.target.value,
                                    )
                                }
                                errorMessage={errors.target_completion_date}
                                disabled={!canEdit}
                            />
                        </div>
                        <div className="col-12">
                            <div className="alert alert-info mb-0">
                                {t(
                                    "Complete the plan according to the assignment letter before recording activities.",
                                )}
                            </div>
                        </div>
                        {canEdit && (
                            <div className="col-12 d-flex justify-content-end">
                                <Button
                                    type="button"
                                    className="btn btn-primary"
                                    isLoading={processing}
                                    onClick={handleSavePlan}
                                >
                                    {t("Save Plan and Continue")}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 2 && (
                    <div>
                        <div className="workspace-phase-meta mb-4">
                            <div>
                                <span>{t("Target Completion Date")}</span>
                                <strong>{formatDateInput(investigation.target_completion_date) || "-"}</strong>
                            </div>
                            <div>
                                <span>{t("Handling Type")}</span>
                                <strong>{investigation.handling_type ? t(investigation.handling_type) : "-"}</strong>
                            </div>
                            <div>
                                <span>{t("Recorded Activities")}</span>
                                <strong>{activities.length}</strong>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h5 className="mb-1">
                                    {t("Investigation Activity Log")}
                                </h5>
                                <p className="text-muted small mb-0">
                                    {t(
                                        "Record every activity and supporting evidence.",
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="row g-3 mb-3">
                            <div className="col-md-3">
                                <label className="form-label">
                                    {t("Activity Date")}
                                </label>
                                <TextInput
                                    type="date"
                                    value={activityData.activity_date}
                                    onChange={(event) =>
                                        setActivityData(
                                            "activity_date",
                                            event.target.value,
                                        )
                                    }
                                    errorMessage={activityErrors.activity_date}
                                    disabled={!canEdit}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">
                                    {t("Activity Type")}
                                </label>
                                <Select
                                    classNamePrefix="react-select"
                                    options={activityOptions.map((option) => ({
                                        ...option,
                                        label: t(option.label),
                                    }))}
                                    value={
                                        activityOptions
                                            .map((option) => ({
                                                ...option,
                                                label: t(option.label),
                                            }))
                                            .find(
                                                (option) =>
                                                    option.value ===
                                                    activityData.activity_type,
                                            ) ?? null
                                    }
                                    onChange={(option) =>
                                        setActivityData(
                                            "activity_type",
                                            option?.value ?? "",
                                        )
                                    }
                                    isClearable={false}
                                    isSearchable={false}
                                    isDisabled={!canEdit}
                                />
                                {activityErrors.activity_type && (
                                    <div className="text-danger small mt-2">
                                        {activityErrors.activity_type}
                                    </div>
                                )}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">
                                    {t("Activity Description")}
                                </label>
                                <TextInput
                                    value={activityData.description}
                                    onChange={(event) =>
                                        setActivityData(
                                            "description",
                                            event.target.value,
                                        )
                                    }
                                    errorMessage={activityErrors.description}
                                    disabled={!canEdit}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">
                                    {t("Activity Document")}
                                </label>
                                <SingleFileUpload
                                    inputId="activity-document-upload"
                                    selectedFile={
                                        activityData.activity_document
                                    }
                                    onChange={(file) =>
                                        setActivityData(
                                            "activity_document",
                                            file,
                                        )
                                    }
                                    disabled={!canEdit}
                                />
                            </div>
                            {canEdit && (
                                <div className="col-md-2 d-flex align-items-end">
                                    <Button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        isLoading={activityProcessing}
                                    onClick={handleAddActivity}
                                    >
                                        {t("Add Activity")}
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="table-responsive">
                            <table className="table table-sm align-middle">
                                <thead>
                                    <tr>
                                        <th>{t("Date")}</th>
                                        <th>{t("Activity Type")}</th>
                                        <th>{t("Description")}</th>
                                        <th>{t("Document")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.length ? (
                                        activities.map((item) => (
                                            <tr key={item.id}>
                                                <td>{formatDateInput(item.activity_date)}</td>
                                                <td>{t(item.activity_type)}</td>
                                                <td>
                                                    {stripHtml(
                                                        item.description,
                                                    )}
                                                </td>
                                                <td>
                                                    {item.attachments
                                                        ?.map(
                                                            (attachment) =>
                                                                attachment.file_name,
                                                        )
                                                        .join(", ") || "-"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center text-muted"
                                            >
                                                {t("No activities recorded.")}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {canEdit && (
                            <div className="d-flex justify-content-end mt-3">
                                <Button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSaveImplementation}
                                    disabled={!activities.length}
                                >
                                    {t("Save This Stage")}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 3 && (
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label">
                                {t("Conclusion")}
                            </label>
                            <RichTextEditor
                                className="workspace-final-editor"
                                height="120px"
                                readOnly={!canEdit}
                                value={data.conclusion}
                                onChange={(value) =>
                                    setData("conclusion", value)
                                }
                                errorMessage={
                                    finalValidation.conclusion ||
                                    errors.conclusion
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t("Conclusion Category")}
                            </label>
                            <Select
                                classNamePrefix="react-select"
                                options={conclusionOptions.map((option) => ({
                                    ...option,
                                    label: t(option.label),
                                }))}
                                value={
                                    conclusionOptions
                                        .map((option) => ({
                                            ...option,
                                            label: t(option.label),
                                        }))
                                        .find(
                                            (option) =>
                                                option.value ===
                                                data.conclusion_category,
                                        ) ?? null
                                }
                                onChange={(option) =>
                                    setData(
                                        "conclusion_category",
                                        option?.value ?? "",
                                    )
                                }
                                isClearable={false}
                                isSearchable={false}
                                isDisabled={!canEdit}
                            />
                            {(finalValidation.conclusion_category ||
                                errors.conclusion_category) && (
                                <div className="text-danger small mt-2">
                                    {finalValidation.conclusion_category ||
                                        errors.conclusion_category}
                                </div>
                            )}
                        </div>
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <label className="form-label mb-0">
                                        {t("Recommendations")}
                                    </label>
                                    <small className="text-muted d-block">
                                        {t("Add one or more recommendations.")}
                                    </small>
                                </div>
                                {canEdit && (
                                    <Button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={handleAddRecommendation}
                                    >
                                        {t("Add Recommendation")}
                                    </Button>
                                )}
                            </div>
                            {data.recommendations.map(
                                (recommendation, index) => (
                                    <div
                                        className="workspace-recommendation-card border rounded p-3 mb-3"
                                        key={
                                            recommendation.id ??
                                            `recommendation-${index}`
                                        }
                                    >
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <strong>
                                                {t("Recommendation")}{" "}
                                                {index + 1}
                                            </strong>
                                            {canEdit && (
                                                <Button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        handleRemoveRecommendation(
                                                            index,
                                                        )
                                                    }
                                                >
                                                    {t("Remove")}
                                                </Button>
                                            )}
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    {t("Recommendation Type")}
                                                </label>
                                                <Select
                                                    classNamePrefix="react-select"
                                                    options={recommendationOptions.map(
                                                        (option) => ({
                                                            ...option,
                                                            label: t(
                                                                option.label,
                                                            ),
                                                        }),
                                                    )}
                                                    value={
                                                        recommendationOptions
                                                            .map((option) => ({
                                                                ...option,
                                                                label: t(
                                                                    option.label,
                                                                ),
                                                            }))
                                                            .find(
                                                                (option) =>
                                                                    option.value ===
                                                                    recommendation.recommendation_type,
                                                            ) ?? null
                                                    }
                                                    onChange={(option) =>
                                                        handleUpdateRecommendation(
                                                            index,
                                                            "recommendation_type",
                                                            option?.value ?? "",
                                                        )
                                                    }
                                                    isClearable={false}
                                                    isSearchable={false}
                                                    isDisabled={!canEdit}
                                                />
                                                {!recommendation.recommendation_type &&
                                                    finalValidation.recommendations && (
                                                        <div className="text-danger small mt-2">
                                                            {t(
                                                                "Recommendation type is required.",
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    {t(
                                                        "Recommendation Document",
                                                    )}
                                                </label>
                                                <SingleFileUpload
                                                    inputId={`recommendation-document-upload-${index}`}
                                                    initialFile={
                                                        recommendation.file_name ??
                                                        null
                                                    }
                                                    onChange={(file) =>
                                                        handleUpdateRecommendation(
                                                            index,
                                                            "document",
                                                            file,
                                                        )
                                                    }
                                                    disabled={!canEdit}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label">
                                                    {t(
                                                        "Recommendation Description",
                                                    )}
                                                </label>
                                                <RichTextEditor
                                                    className="workspace-final-editor"
                                                    height="120px"
                                                    readOnly={!canEdit}
                                                    value={
                                                        recommendation.description ??
                                                        ""
                                                    }
                                                    onChange={(value) =>
                                                        handleUpdateRecommendation(
                                                            index,
                                                            "description",
                                                            value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}
                            {!data.recommendations.length && (
                                <div className="border rounded text-center text-muted py-4">
                                    {t("No recommendations added.")}
                                </div>
                            )}
                        </div>
                        <div className="col-12">
                            <label className="form-label">
                                {t("Report for Reporter")}
                            </label>
                            <RichTextEditor
                                className="workspace-final-editor"
                                height="120px"
                                readOnly={!canEdit}
                                value={data.reporter_report}
                                onChange={(value) =>
                                    setData("reporter_report", value)
                                }
                                errorMessage={
                                    finalValidation.reporter_report ||
                                    errors.reporter_report
                                }
                            />
                        </div>
                        {(finalValidation.recommendations ||
                            errors.recommendations) && (
                            <div className="col-12 text-danger small">
                                {finalValidation.recommendations ||
                                    errors.recommendations}
                            </div>
                        )}
                        {canEdit && (
                            <div className="col-12 d-flex justify-content-end">
                                <Button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    isLoading={processing}
                                    onClick={handleSaveResult}
                                >
                                    {t("Save Examination Result")}
                                </Button>
                            </div>
                        )}
                        {canEdit && (
                            <div className="col-12 d-flex justify-content-end">
                                <Button
                                    type="button"
                                    className="btn btn-primary"
                                    isLoading={processing}
                                    onClick={handleSubmitResult}
                                >
                                    {t("Send to Irban V")}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
