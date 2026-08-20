import { useEffect, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../Layouts/DashboardLayout";
import Breadcrumb from "../../Components/ui/Breadcrumb";
import Button from "../../Components/ui/Button";
import Modal from "../../Components/ui/Modal";
import TextInput from "../../Components/ui/TextInput";
import RichTextEditor from "../../Components/ui/RichTextEditor";
import Search from "../../Components/datatable/Search";
import Loading from "../../Components/datatable/Loading";
import DataTable from "../../Components/vendor/DataTable";
import { confirmAlert } from "../../Components/ui/SweetAlert";
import { notifySuccess } from "../../Components/ui/Toastify";

const empty = { question: "", answer: "" };

export default function Index() {
    const { t } = useTranslation();
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm(empty);

    const handleLoadTableData = () => {
        setIsLoading(true);
        axios.get(route("datatable.faqs"), {
            params: { page: currentPage, per_page: rowsPerPage, search },
        }).then((response) => {
            setTableData(response.data.data ?? []);
            setTotalRows(response.data.total ?? 0);
        }).finally(() => setIsLoading(false));
    };

    useEffect(() => {
        handleLoadTableData();
    }, [currentPage, rowsPerPage, search]);
    const handleOpenModal = (faq = null) => {
        clearErrors();
        setEditing(faq);
        setShowModal(true);
        setData(faq ? { question: faq.question, answer: faq.answer } : empty);
    };
    const handleCloseModal = () => { setEditing(null); setShowModal(false); reset(); clearErrors(); };
    const handleSubmit = () => {
        const options = { preserveScroll: true, onSuccess: (page) => { handleCloseModal(); notifySuccess(page.props?.flash?.success ?? t("FAQ saved successfully.")); } };
        editing ? put(route("dashboard.faqs.update", editing.id), options) : post(route("dashboard.faqs.store"), options);
    };
    const handleDelete = (faq) => confirmAlert(t("Are You Sure?"), t("Delete this FAQ?"), "warning", () => router.delete(route("dashboard.faqs.destroy", faq.id), { preserveScroll: true, onSuccess: (page) => notifySuccess(page.props?.flash?.success ?? t("FAQ deleted successfully.")) }));

    const columns = [
        { name: t("No"), width: "70px", cell: (_row, index) => (currentPage - 1) * rowsPerPage + index + 1 },
        { name: t("Question"), selector: (row) => row.question, sortable: true },
        { name: t("Actions"), right: true, cell: (row) => <div>
            <Button type="button" className="btn btn-sm btn-light me-1" onClick={() => handleOpenModal(row)} disabled={isLoading}><Icon icon="solar:pen-outline" /></Button>
            <Button type="button" className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(row)} disabled={isLoading}><Icon icon="solar:trash-bin-trash-outline" /></Button>
        </div> },
    ];

    return <DashboardLayout>
        <Breadcrumb title={t("Dashboard")} subtitle={t("FAQ")} />
        <div className="d-flex justify-content-between align-items-center mb-3"><h4>{t("FAQ")}</h4><Button type="button" className="btn btn-primary" onClick={() => handleOpenModal()}><Icon icon="line-md:plus" className="me-1" />{t("Add FAQ")}</Button></div>
        <div className="card"><div className="card-body">
            <div className="d-flex justify-content-end mb-3"><div className="col-md-4">
                <Search search={search} setSearch={(value) => { setSearch(value); setCurrentPage(1); }} />
            </div></div>
            <DataTable
                columns={columns}
                data={tableData}
                progressPending={isLoading}
                progressComponent={<Loading />}
                noDataComponent={isLoading ? <Loading /> : search ? t("datatable.zeroRecords") : t("datatable.emptyTable")}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={rowsPerPage}
                onChangePage={(page) => setCurrentPage(page)}
                onChangeRowsPerPage={(newPerPage, page) => { setRowsPerPage(newPerPage); setCurrentPage(page); }}
                highlightOnHover
                persistTableHead
                striped
            />
        </div></div>
        <Modal show={showModal} onClose={handleCloseModal} title={editing ? t("Edit FAQ") : t("Add FAQ")} saveText={t("Save")} onSave={handleSubmit} processing={processing} size="lg">
            <div className="mb-3"><label className="form-label">{t("Question")}</label><TextInput value={data.question} onChange={(e) => setData("question", e.target.value)} errorMessage={errors.question} /></div>
            <div className="mb-3"><label className="form-label">{t("Answer")}</label><RichTextEditor height="180px" value={data.answer} onChange={(value) => setData("answer", value)} errorMessage={errors.answer} /></div>
        </Modal>
    </DashboardLayout>;
}
