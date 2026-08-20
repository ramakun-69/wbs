import { useForm } from "@inertiajs/react";
import { useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import Button from "../../../Components/ui/Button";
import Modal from "../../../Components/ui/Modal";
import TextInput from "../../../Components/ui/TextInput";
import RichTextEditor from "../../../Components/ui/RichTextEditor";
import SingleFileUpload from "../../../Components/ui/SingleFileUpload";
import { confirmAlert } from "../../../Components/ui/SweetAlert";
import { notifySuccess } from "../../../Components/ui/Toastify";
import { useAuth } from "../../../src/hook/useAuth";
import { stripHtml } from "../../../Utils/text";

const actionsByStatus = {
    "Submitted": [
        { permission: "Register Complaint", route: "dashboard.complaints.admin.process", label: "Process to Irban", className: "btn-primary" },
    ],
    "Waiting Irban Verification": [
        { permission: "Verify Complaint", route: "dashboard.complaints.verification.verify", label: "Continue", className: "btn-primary" },
        { permission: "Verify Complaint", route: "dashboard.complaints.verification.reject", label: "Reject", className: "btn-danger", reject: true },
    ],
    "Waiting SK": [
        { permission: "Create Investigation", route: "dashboard.complaints.investigation.issue-sk", label: "Issue SK", className: "btn-primary", issueSk: true },
    ],
    "Waiting Irban Review": [
        { permission: "Forward Investigation", route: "dashboard.complaints.investigation.return-team", label: "Return to Technical Team", className: "btn-warning", requiresNote: true },
        { permission: "Forward Investigation", route: "dashboard.complaints.investigation.forward-secretary", label: "Send to Secretary", className: "btn-primary" },
    ],
    "Waiting Secretary Review": [
        { permission: "Review Investigation", route: "dashboard.complaints.review.return", label: "Return", className: "btn-warning", requiresNote: true },
        { permission: "Review Investigation", route: "dashboard.complaints.review.forward", label: "Forward", className: "btn-primary" },
    ],
    "Waiting Inspector Approval": [
        { permission: "Approve Recommendation", route: "dashboard.complaints.approval.return", label: "Return", className: "btn-warning", requiresNote: true },
        { permission: "Approve Recommendation", route: "dashboard.complaints.approval.approve", label: "Complete", className: "btn-success" },
    ],
};

export default function WorkflowActions({ complaint }) {
    const { t } = useTranslation();
    const { hasPermission } = useAuth();
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectError, setRejectError] = useState("");
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [returnAction, setReturnAction] = useState(null);
    const [returnError, setReturnError] = useState("");
    const { data, setData, transform, post, processing, errors } = useForm({
        priority: complaint.priority ?? "Medium",
        decision: "Verified",
        summary: "",
        note: "",
        sk_number: "",
        sk_date: "",
        team_leader_name: "",
        basis: "",
        sk_file: null,
        approval_note: "",
    });
    const [showSkModal, setShowSkModal] = useState(false);
    const actions = (actionsByStatus[complaint.status] ?? [])
        .filter((action) => hasPermission(action.permission));

    if (!actions.length) return null;

    const handleSubmit = (action) => {
        if (action.issueSk) {
            setShowSkModal(true);
            return;
        }

        if (action.reject) {
            setRejectError("");
            setShowRejectModal(true);
            return;
        }

        if (action.requiresNote) {
            setReturnAction(action);
            setReturnError("");
            setData("note", "");
            setShowReturnModal(true);
            return;
        }

        if (action.route === "dashboard.complaints.approval.approve") {
            setData("approval_note", "");
            setShowApprovalModal(true);
            return;
        }

        confirmAlert(
            t("Are You Sure?"),
            t("confirm_description"),
            "warning",
            () => {
                if (complaint.status === "Waiting Irban Verification") {
                    transform((formData) => ({ ...formData, decision: "Verified" }));
                }

                post(route(action.route, complaint.id), {
                preserveScroll: true,
                onSuccess: (page) => {
                    notifySuccess(
                        page.props?.flash?.success ?? t("Complaint workflow updated successfully."),
                    );
                },
                });
            },
        );
    };

    const returnComplaint = () => {
        const note = stripHtml(data.note).trim();

        if (!note) {
            setReturnError(t("Return note is required."));
            return;
        }

        post(route(returnAction.route, complaint.id), {
            preserveScroll: true,
            onSuccess: (page) => {
                setShowReturnModal(false);
                setReturnAction(null);
                notifySuccess(
                    page.props?.flash?.success ??
                        t("Complaint workflow updated successfully."),
                );
            },
        });
    };

    const issueSk = () => {
        post(route("dashboard.complaints.investigation.issue-sk", complaint.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: (page) => {
                setShowSkModal(false);
                notifySuccess(page.props?.flash?.success ?? t("Complaint workflow updated successfully."));
            },
        });
    };

    const approveComplaint = () => {
        post(route("dashboard.complaints.approval.approve", complaint.id), {
            preserveScroll: true,
            onSuccess: (page) => {
                setShowApprovalModal(false);
                notifySuccess(page.props?.flash?.success ?? t("Complaint workflow updated successfully."));
            },
        });
    };

    const rejectComplaint = () => {
        const note = data.note.trim();

        if (!note) {
            setRejectError(t("Rejection reason is required."));
            return;
        }

        transform((formData) => ({
            ...formData,
            decision: "Not Verified",
            note,
        }));
        post(route("dashboard.complaints.verification.reject", complaint.id), {
            preserveScroll: true,
            onSuccess: (page) => {
                setShowRejectModal(false);
                notifySuccess(
                    page.props?.flash?.success ?? t("Complaint workflow updated successfully."),
                );
            },
        });
    };

    return (
        <>
            {complaint.status === "Waiting Irban Verification" && (
                <div className="card mb-3">
                    <div className="card-header">
                        <h4 className="header-title mb-0">{t("Substance Verification")}</h4>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">{t("Conclusion")}</label>
                                <Select classNamePrefix="react-select" options={[{ value: "Verified", label: t("Meets the criteria") }, { value: "Not Verified", label: t("Does not meet the criteria") }]} value={{ value: data.decision, label: data.decision === "Verified" ? t("Meets the criteria") : t("Does not meet the criteria") }} onChange={(option) => setData("decision", option?.value ?? "")} isClearable={false} isSearchable={false} />
                            </div>
                            <div className="col-12">
                                <label className="form-label">{t("Analysis Note")}</label>
                                <RichTextEditor height="120px" value={data.summary} onChange={(value) => setData("summary", value)} placeholder={t("Explain the basis of the conclusion")} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="card mb-3">
                <div className="card-body d-flex flex-wrap justify-content-end align-items-end gap-2">
                {complaint.status === "Submitted" && (
                    <div>
                        <label className="form-label mb-1">{t("Priority")}</label>
                        <Select classNamePrefix="react-select" options={["High", "Medium", "Low"].map((value) => ({ value, label: t(value) }))} value={{ value: data.priority, label: t(data.priority) }} onChange={(option) => setData("priority", option?.value ?? "")} isClearable={false} isSearchable={false} />
                    </div>
                )}
                {actions.map((action) => (
                    <Button
                        key={action.route}
                        type="button"
                        className={`btn ${action.className}`}
                        isLoading={processing}
                            onClick={() => handleSubmit(action)}
                    >
                        {t(action.label)}
                    </Button>
                ))}
                </div>
            </div>

            <Modal
                show={showSkModal}
                onClose={() => !processing && setShowSkModal(false)}
                title={t("Assignment Letter")}
                saveText={t("Issue SK")}
                onSave={issueSk}
                processing={processing}
                size="lg"
            >
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">{t("Assignment Letter Number")}</label>
                        <TextInput value={data.sk_number} onChange={(event) => setData("sk_number", event.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">{t("Assignment Letter Date")}</label>
                        <TextInput type="date" value={data.sk_date} onChange={(event) => setData("sk_date", event.target.value)} />
                    </div>
                    <div className="col-12">
                        <label className="form-label">{t("Team Leader")}</label>
                        <TextInput value={data.team_leader_name} onChange={(event) => setData("team_leader_name", event.target.value)} />
                    </div>
                    <div className="col-12">
                        <label className="form-label">{t("Legal Basis")}</label>
                        <RichTextEditor height="120px" value={data.basis} onChange={(value) => setData("basis", value)} />
                    </div>
                    <div className="col-12">
                        <label className="form-label">{t("Assignment Letter File")} <span className="text-danger">*</span></label>
                        <SingleFileUpload inputId="assignment-letter-file-upload" onChange={(file) => setData("sk_file", file)} />
                        {errors.sk_file && <div className="invalid-feedback d-block">{errors.sk_file}</div>}
                        <small className="text-muted">{t("Supported assignment letter formats")}</small>
                    </div>
                </div>
            </Modal>

            <Modal
                show={showRejectModal}
                onClose={() => !processing && setShowRejectModal(false)}
                title={t("Reject Complaint")}
                saveText={t("Confirm Rejection")}
                onSave={rejectComplaint}
                processing={processing}
            >
                <p className="text-danger small">
                    {t("This complaint will be rejected and will not proceed to investigation.")}
                </p>
                <label className="form-label">
                    {t("Rejection Reason")} <span className="text-danger">*</span>
                </label>
                <RichTextEditor
                    height="120px"
                    value={data.note}
                    onChange={(value) => {
                        setData("note", value);
                        setRejectError("");
                    }}
                    placeholder={t("Explain why this complaint does not meet the criteria")}
                    errorMessage={rejectError}
                />
            </Modal>

            <Modal
                show={showApprovalModal}
                onClose={() => !processing && setShowApprovalModal(false)}
                title={t("Inspector Approval")}
                saveText={t("Complete Complaint")}
                onSave={approveComplaint}
                processing={processing}
                size="lg"
            >
                <p className="text-muted small">{t("Write the inspector approval before completing this complaint.")}</p>
                <label className="form-label">{t("Inspector Approval")} <span className="text-danger">*</span></label>
                <RichTextEditor height="180px" value={data.approval_note} onChange={(value) => setData("approval_note", value)} errorMessage={errors.approval_note} placeholder={t("Write the approval note")} />
            </Modal>

            <Modal
                show={showReturnModal}
                onClose={() => !processing && setShowReturnModal(false)}
                title={t("Return for Revision")}
                saveText={t("Return Complaint")}
                onSave={returnComplaint}
                processing={processing}
                size="lg"
            >
                <p className="text-warning small">
                    {t("Explain what needs to be corrected before returning this complaint.")}
                </p>
                <label className="form-label">
                    {t("Return Note")} <span className="text-danger">*</span>
                </label>
                <RichTextEditor
                    height="140px"
                    value={data.note}
                    onChange={(value) => {
                        setData("note", value);
                        setReturnError("");
                    }}
                    placeholder={t("Write the correction note")}
                    errorMessage={returnError || errors.note}
                />
            </Modal>
        </>
    );
}
