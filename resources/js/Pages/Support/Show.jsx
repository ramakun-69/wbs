import { Link, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../Layouts/DashboardLayout";
import Breadcrumb from "../../Components/ui/Breadcrumb";
import TextInput from "../../Components/ui/TextInput";
import Button from "../../Components/ui/Button";
import RichTextEditor from "../../Components/ui/RichTextEditor";
import SingleFileUpload from "../../Components/ui/SingleFileUpload";
import { useAuth } from "../../src/hook/useAuth";
import Select from "react-select";

export default function Show({ ticket }) {
    const { t } = useTranslation();
    const { hasPermission } = useAuth();
    const canManageSupport = hasPermission("Manage Support");
    const { data, setData, post, processing, errors } = useForm({ message: "", attachments: [] });
    const { transform: transformStatus, patch: patchStatus, processing: statusProcessing } = useForm({ status: ticket.status });
    const handleSubmit = (event) => { event.preventDefault(); post(route("dashboard.supports.reply", ticket.id), { forceFormData: true, preserveScroll: true, onSuccess: () => setData({ message: "", attachments: [] }) }); };
    const handleFileChange = (file) => setData("attachments", file ? [file] : []);
    const handleStatusChange = (status) => {
        transformStatus(() => ({ status }));
        patchStatus(route("dashboard.supports.status.update", ticket.id), { preserveScroll: true });
    };
    const statusOptions = ["open", "in_progress", "closed"].map((value) => ({ value, label: t(`support.status.${value}`) }));
    const canReply = ticket.status !== "closed";
    return <DashboardLayout>
        <Breadcrumb title={t("Support")} subtitle={ticket.ticket_number} />
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3"><div><h4 className="mb-1">{ticket.subject}</h4><span className="text-muted">{ticket.ticket_number}</span>{canManageSupport && <div className="mt-3" style={{ minWidth: 280 }}><label className="form-label mb-1">{t("Support Status")}</label><Select classNamePrefix="react-select" options={statusOptions} value={statusOptions.find((option) => option.value === ticket.status)} onChange={(option) => handleStatusChange(option?.value ?? ticket.status)} isSearchable={false} isDisabled={statusProcessing} /></div>}</div><span className={`badge ${ticket.status === "closed" ? "bg-success" : "bg-primary"}`}>{t(`support.status.${ticket.status}`)}</span></div>
        <div className="card mb-3"><div className="card-body">
            {ticket.messages?.map((message) => <div className="border-bottom pb-3 mb-3" key={message.id}><div className="d-flex justify-content-between mb-2"><strong>{message.user?.name ?? "-"}</strong><small className="text-muted">{new Date(message.created_at).toLocaleString()}</small></div><div dangerouslySetInnerHTML={{ __html: message.message }} />{ticket.attachments?.filter((file) => file.support_message_id === message.id).map((file) => <a className="d-block mt-2" href={`/storage/${file.path}`} target="_blank" rel="noreferrer" key={file.id}>{file.original_name}</a>)}</div>)}
        </div></div>
        {canReply ? <div className="card"><div className="card-body"><h5>{t("Reply")}</h5><form onSubmit={handleSubmit}><div className="mb-3"><RichTextEditor height="180px" value={data.message} onChange={(value) => setData("message", value)} errorMessage={errors.message} /></div><SingleFileUpload inputId="support-reply-attachment" onChange={handleFileChange} /><div className="d-flex justify-content-end mt-3"><Button type="submit" className="btn btn-primary" disabled={processing}>{t("Send Reply")}</Button></div></form></div></div> : <div className="alert alert-success mb-0">{t("This support ticket is closed and cannot receive replies.")}</div>}
    </DashboardLayout>;
}
