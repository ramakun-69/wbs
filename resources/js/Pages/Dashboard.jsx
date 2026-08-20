import { Link, usePage } from "@inertiajs/react";
import { ArrowRight, CheckCircle2, ClipboardList, Clock3, FilePlus2, FileWarning } from "lucide-react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { route } from "ziggy-js";
import DashboardLayout from "../Layouts/DashboardLayout";
import Button from "../Components/ui/Button";
import Breadcrumb from "../Components/ui/Breadcrumb";

const roleLabels = { admin: "Admin Dashboard", irban: "Irban V Dashboard", secretary: "Secretary Dashboard", technical: "Technical Team Dashboard", inspector: "Inspector Dashboard", user: "My Dashboard" };
const icons = { primary: ClipboardList, danger: FileWarning, warning: Clock3, info: ClipboardList, success: CheckCircle2, secondary: ClipboardList };

function MetricCard({ metric, t }) {
    const Icon = icons[metric.tone] || ClipboardList;
    return <div className="card border-0 shadow-sm h-100"><div className="card-body d-flex justify-content-between gap-3"><div><div className="text-muted text-uppercase small fw-semibold mb-2">{t(metric.label)}</div><div className="fs-3 fw-bold">{metric.value}</div></div><span className={`avatar-md rounded-3 bg-${metric.tone}-subtle text-${metric.tone} d-flex align-items-center justify-content-center`}><Icon size={22} /></span></div></div>;
}

function MonthlyChart({ items = [], t }) {
    const maximum = Math.max(...items.map((item) => item.value), 1);
    return <div className="card border-0 shadow-sm h-100"><div className="card-body"><h5 className="mb-1">{t("Complaints Received Monthly")}</h5><p className="text-muted small">{t("Complaint volume for the last six months")}</p><div className="d-flex align-items-end gap-3" style={{ minHeight: 190 }}>{items.map((item) => <div key={`${item.label}-${item.value}`} className="flex-fill text-center"><div className="small text-muted mb-2">{item.value}</div><div className="bg-primary rounded-top" style={{ height: `${Math.max((item.value / maximum) * 130, 8)}px` }} /><div className="small text-muted mt-2">{item.label}</div></div>)}</div></div></div>;
}

function LatestComplaints({ complaints = [], t }) {
    return <div className="card border-0 shadow-sm h-100"><div className="card-body p-0"><div className="p-3 d-flex justify-content-between align-items-center"><div><h5 className="mb-1">{t("Recent Complaints")}</h5><p className="text-muted small mb-0">{t("Latest complaint activity")}</p></div><Link href={route("dashboard.complaints.index")} className="small text-decoration-none">{t("View All")} <ArrowRight size={14} /></Link></div><div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>{t("Ticket Number")}</th><th>{t("Category")}</th><th>{t("Priority")}</th><th>{t("Status")}</th></tr></thead><tbody>{complaints.length ? complaints.map((complaint) => <tr key={complaint.id}><td><Link href={route("dashboard.complaints.show", complaint.id)} className="fw-semibold text-decoration-none">{complaint.ticket_number}</Link><div className="small text-muted text-truncate" style={{ maxWidth: 220 }}>{complaint.title}</div></td><td>{complaint.category || "-"}</td><td>{complaint.priority ? t(complaint.priority) : "-"}</td><td><span className="badge rounded-pill bg-primary-subtle text-primary">{t(complaint.status)}</span></td></tr>) : <tr><td colSpan="4" className="text-center text-muted py-5">{t("No complaints found.")}</td></tr>}</tbody></table></div></div></div>;
}

export default function Dashboard() {
    const { t } = useTranslation();
    const { dashboard } = usePage().props;
    const actionRoute = dashboard?.role === "user" ? "dashboard.complaints.create" : "dashboard.complaints.index";
    const actionLabel = dashboard?.role === "user" ? "Submit Complaint" : "View Complaints";

    return <DashboardLayout><Breadcrumb title={t("Dashboard")} /><div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4"><div><h3 className="mb-1">{t(roleLabels[dashboard?.role] || roleLabels.user)}</h3><p className="text-muted mb-0">{t("Monitor complaint activity and pending work")}</p></div><Link href={route(actionRoute)}><Button type="button" className="btn btn-primary"><FilePlus2 size={16} className="me-2" />{t(actionLabel)}</Button></Link></div><Row className="g-3 mb-4">{(dashboard?.metrics || []).map((metric) => <Col key={metric.label} xxl={3} md={6}><MetricCard metric={metric} t={t} /></Col>)}</Row><Row className="g-3 mb-4"><Col xl={5}><MonthlyChart items={dashboard?.monthly} t={t} /></Col><Col xl={7}><LatestComplaints complaints={dashboard?.latest} t={t} /></Col></Row><div className="card border-0 shadow-sm"><div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3"><div><h5 className="mb-1">{t("Workflow Overview")}</h5><p className="text-muted mb-0">{t("Open the complaint workspace to continue your assigned work.")}</p></div><Link href={route("dashboard.complaints.index")}><Button type="button" className="btn btn-outline-primary">{t("Open Complaint Workspace")} <ArrowRight size={16} className="ms-2" /></Button></Link></div></div></DashboardLayout>;
}
