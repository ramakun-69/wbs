import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

import DashboardLayout from "../../Layouts/DashboardLayout";
import Breadcrumb from "../../Components/ui/Breadcrumb";
import WorkflowActions from "./components/WorkflowActions";
import InvestigationWorkspace from "./components/InvestigationWorkspace";

const statusClass = {
    Submitted: "primary",
    "Waiting Irban Verification": "info",
    "Waiting SK": "warning",
    Investigation: "warning",
    "Waiting Irban Review": "info",
    "Waiting Secretary Review": "info",
    "Waiting Inspector Approval": "warning",
    "Not Verified": "secondary",
    Rejected: "danger",
    Completed: "success",
};

function sanitizeHtml(value = "") {
    if (typeof window === "undefined") return value;

    const parsed = new DOMParser().parseFromString(value, "text/html");
    parsed.body.querySelectorAll("script, style, iframe, object, embed, form").forEach((element) => element.remove());
    parsed.body.querySelectorAll("*").forEach((element) => {
        [...element.attributes].forEach((attribute) => {
            const name = attribute.name.toLowerCase();
            const value = attribute.value.trim().toLowerCase();
            if (name.startsWith("on") || ((name === "href" || name === "src") && value.startsWith("javascript:"))) {
                element.removeAttribute(attribute.name);
            }
        });
    });

    return parsed.body.innerHTML;
}

function RichText({ value }) {
    return <div className="complaint-rich-text text-break" dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }} />;
}

function formatDate(value) {
    if (!value) return "-";
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function Section({ title, children, className = "" }) {
    return (
        <div className={`card detail-section mb-3 ${className}`}>
            <div className="card-header detail-section-header">
                <h4 className="header-title mb-0">{title}</h4>
            </div>
            <div className="card-body">{children}</div>
        </div>
    );
}

export default function Show({ complaint }) {
    const { t } = useTranslation();
    const categoryLabel = complaint.category?.code
        ? t(`complaint_categories.${complaint.category.code}`, { defaultValue: complaint.category.name })
        : complaint.category?.name ?? "-";

    return (
        <DashboardLayout>
            <Breadcrumb title={t("Complaints")} subtitle={complaint.ticket_number} />

            <div className="d-flex justify-content-between align-items-center mb-3">
                <Link href={route("dashboard.complaints.index")} className="text-muted">
                    <Icon icon="solar:arrow-left-outline" className="me-1" />
                    {t("Back to complaints")}
                </Link>
            </div>

            <div className="complaint-hero card mb-3">
                <div className="complaint-hero-body">
                    <div>
                        <div className="complaint-hero-kicker">{t("Complaint Details")}</div>
                        <h2 className="complaint-hero-title">{complaint.title}</h2>
                        <div className="complaint-hero-meta">
                            <span><Icon icon="solar:ticket-outline" /> {complaint.ticket_number}</span>
                            <span><Icon icon="solar:calendar-outline" /> {formatDate(complaint.submitted_at)}</span>
                            <span><Icon icon="solar:tag-outline" /> {categoryLabel}</span>
                        </div>
                    </div>
                    <div className="complaint-hero-side">
                        <small>{t("Current Status")}</small>
                        <span className={`badge bg-${statusClass[complaint.status] ?? "secondary"}`}>
                            {t(complaint.status)}
                        </span>
                    </div>
                </div>
            </div>

            <Section title={t("Complaint Information")} className="detail-primary-section">
                <div className="row g-3">
                    <div className="col-md-4"><div className="detail-field"><small>{t("Complaint Number")}</small><span className="fw-semibold">{complaint.ticket_number}</span></div></div>
                    <div className="col-md-4"><div className="detail-field"><small>{t("Category")}</small><span>{categoryLabel}</span></div></div>
                    <div className="col-md-4"><div className="detail-field"><small>{t("Priority")}</small><span>{complaint.priority ? t(complaint.priority) : "-"}</span></div></div>
                    <div className="col-12"><div className="detail-field"><small>{t("Complaint Title")}</small><h4 className="mb-0">{complaint.title}</h4></div></div>
                    <div className="col-12"><div className="detail-content-block"><small>{t("Complaint Description")}</small><RichText value={complaint.description} /></div></div>
                </div>
            </Section>

            <Section title={t("Reporter Information")}>
                <div className="row g-3">
                    <div className="col-md-6"><div className="detail-field"><small>{t("Full Name")}</small><span>{complaint.reporter?.is_anonymous ? t("Anonymous") : complaint.reporter?.name || "-"}</span></div></div>
                    <div className="col-md-6"><div className="detail-field"><small>{t("Reporter Type")}</small><span>{complaint.reporter?.is_anonymous ? t("Anonymous") : t("Identified")}</span></div></div>
                </div>
            </Section>

            {complaint.verification && (
                <Section title={t("Verification Result")} className="verification-result-section">
                    <div className="row g-3">
                        <div className="col-md-4"><div className="detail-field"><small>{t("Decision")}</small><span className={`badge bg-${complaint.verification.decision === "Verified" ? "success" : "danger"}`}>{t(complaint.verification.decision)}</span></div></div>
                        <div className="col-md-8"><div className="detail-field"><small>{t("Verified By")}</small><span>{complaint.verification.verifier?.name ?? "-"}</span></div></div>
                        {complaint.verification.summary && <div className="col-12"><div className="detail-content-block"><small>{t("Analysis Summary")}</small><RichText value={complaint.verification.summary} /></div></div>}
                        {complaint.verification.note && <div className="col-12"><div className="detail-content-block verification-note"><small>{t("Rejection Reason")}</small><RichText value={complaint.verification.note} /></div></div>}
                    </div>
                </Section>
            )}

            <Section title={t("Involved Parties")}>
                {complaint.parties?.length ? (
                    <div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>{t("Full Name")}</th><th>{t("Position")}</th><th>{t("Position Classification")}</th></tr></thead><tbody>
                        {complaint.parties.map((party) => <tr key={party.id}><td>{party.name}</td><td>{party.position || "-"}</td><td>{party.position_classification ? t(party.position_classification) : "-"}</td></tr>)}
                    </tbody></table></div>
                ) : <span className="text-muted">{t("No involved parties.")}</span>}
            </Section>

            <Section title={t("Attachments")}>
                {complaint.attachments?.length ? <ul className="list-group list-group-flush">
                    {complaint.attachments.map((attachment) => <li className="list-group-item px-0 d-flex justify-content-between" key={attachment.id}><span><Icon icon="solar:paperclip-outline" className="me-2" />{attachment.file_name}</span><small className="text-muted">{attachment.mime_type || "-"}</small></li>)}
                </ul> : <span className="text-muted">{t("No attachments added.")}</span>}
            </Section>

            {complaint.status_histories?.length > 0 && <Section title={t("Status History")}>
                <div className="table-responsive"><table className="table table-sm align-middle mb-0"><thead><tr><th>{t("Action")}</th><th>{t("Status")}</th><th>{t("Note")}</th><th>{t("Date")}</th><th>{t("Changed By")}</th></tr></thead><tbody>
                    {complaint.status_histories.map((history) => <tr key={history.id}><td>{t(history.action)}</td><td>{t(history.to_status)}</td><td className="status-history-note">{history.note ? <RichText value={history.note} /> : "-"}</td><td>{formatDate(history.created_at)}</td><td>{history.changed_by?.name ?? "-"}</td></tr>)}
                </tbody></table></div>
            </Section>}

            {["Investigation", "Waiting Irban Review"].includes(complaint.status) && complaint.investigation && (
                <InvestigationWorkspace complaint={complaint} />
            )}

            <WorkflowActions complaint={complaint} />
        </DashboardLayout>
    );
}
