import { Link, useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../Layouts/DashboardLayout";
import Breadcrumb from "../../Components/ui/Breadcrumb";
import TextInput from "../../Components/ui/TextInput";
import Button from "../../Components/ui/Button";
import RichTextEditor from "../../Components/ui/RichTextEditor";
import SingleFileUpload from "../../Components/ui/SingleFileUpload";

export default function Create() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({ subject: "", message: "", attachments: [] });
    const handleSubmit = (event) => {
        event.preventDefault();
        post(route("dashboard.supports.store"), { forceFormData: true, preserveScroll: true });
    };
    const handleFileChange = (file) => setData("attachments", file ? [file] : []);

    return <DashboardLayout>
        <Breadcrumb title={t("Support")} subtitle={t("New Support Ticket")} />
        <div className="card"><div className="card-header d-flex align-items-center"><Link href={route("dashboard.supports.index")} className="me-3"><Icon icon="solar:arrow-left-linear" width="20" /></Link><h4 className="mb-0">{t("Create Support Ticket")}</h4></div><div className="card-body">
            <form onSubmit={handleSubmit}>
                <div className="mb-3"><label className="form-label">{t("Subject")}</label><TextInput value={data.subject} onChange={(event) => setData("subject", event.target.value)} errorMessage={errors.subject} /></div>
                <div className="mb-3"><label className="form-label">{t("Message")}</label><RichTextEditor height="220px" value={data.message} onChange={(value) => setData("message", value)} errorMessage={errors.message} /></div>
                <div className="mb-3"><label className="form-label">{t("Attachment")}</label><SingleFileUpload inputId="support-attachment" onChange={handleFileChange} /></div>
                <div className="d-flex justify-content-end gap-2"><Link href={route("dashboard.supports.index")} className="btn btn-light">{t("Cancel")}</Link><Button type="submit" className="btn btn-primary" disabled={processing}>{t("Send Support")}</Button></div>
            </form>
        </div></div>
    </DashboardLayout>;
}
