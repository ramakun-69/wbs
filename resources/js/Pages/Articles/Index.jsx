import { useEffect, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../Layouts/DashboardLayout";
import Breadcrumb from "../../Components/ui/Breadcrumb";
import Button from "../../Components/ui/Button";
import Modal from "../../Components/ui/Modal";
import Search from "../../Components/datatable/Search";
import Loading from "../../Components/datatable/Loading";
import DataTable from "../../Components/vendor/DataTable";
import TextInput from "../../Components/ui/TextInput";
import RichTextEditor from "../../Components/ui/RichTextEditor";
import SingleFileUpload from "../../Components/ui/SingleFileUpload";
import { confirmAlert } from "../../Components/ui/SweetAlert";
import { notifySuccess } from "../../Components/ui/Toastify";
import Form from "./Form";
import EditButton from './../../Components/datatable/EditButton';
import DeleteButton from './../../Components/datatable/DeleteButton';

const empty = {
    title: "",
    excerpt: "",
    content: "",
    cover_image: null,
    is_published: false,
};

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

    const {data, setData, post, processing, errors, reset, clearErrors, transform} = useForm(empty);

    const handleLoadTableData = () => {
        setIsLoading(true);
        axios.get(route("datatable.articles"), {
                params: { page: currentPage, per_page: rowsPerPage, search },
            })
            .then((response) => {
                setTableData(response.data.data ?? []);
                setTotalRows(response.data.total ?? 0);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        handleLoadTableData();
    }, [currentPage, rowsPerPage, search]);

    const handleOpenModal = (article = null) => {
        clearErrors();
        setEditing(article);
        setData(article ? { ...empty, ...article, cover_image: null } : empty);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditing(null);
        reset();
        clearErrors();
    };

    const handleSubmit = () => {
        const url = editing
            ? route("dashboard.articles.update", editing.id)
            : route("dashboard.articles.store");

        transform((form) => (editing ? { ...form, _method: "put" } : form));
        post(url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: (page) => {
                handleCloseModal();
                notifySuccess(
                    page.props?.flash?.success ??
                        t("Article saved successfully."),
                );
            },
        });
    };

    const handleDelete = (article) =>
        confirmAlert(
            t("Are You Sure?"),
            t("Delete this article?"),
            "warning",
            () =>
                router.delete(route("dashboard.articles.destroy", article.id), {
                    preserveScroll: true,
                    onSuccess: (page) =>
                        notifySuccess(
                            page.props?.flash?.success ??
                                t("Article deleted successfully."),
                        ),
                }),
        );

    const columns = [
        {
            name: t("No"),
            width: "70px",
            cell: (_row, index) => (currentPage - 1) * rowsPerPage + index + 1,
        },
        {
            name: t("Title"),
            selector: (row) => row.title,
            cell: (row) => (
                <div>
                    <strong>{row.title}</strong>
                    <small className="d-block text-muted">/{row.slug}</small>
                </div>
            ),
            sortable: true,
        },
        {
            name: t("Status"),
            cell: (row) => (
                <span
                    className={
                        "badge bg-" +
                        (row.is_published ? "success" : "secondary")
                    }
                >
                    {row.is_published ? t("Published") : t("Draft")}
                </span>
            ),
        },
        {
            name: t("Published At"),
            selector: (row) => row.published_at ?? "-",
            cell: (row) =>
                row.published_at
                    ? new Date(row.published_at).toLocaleDateString()
                    : "-",
        },
        {
            name: t("Actions"),
            right: true,
            cell: (row) => (
                <div>
                    <EditButton
                        type="button"
                        className="btn btn-sm btn-light me-1"
                        onClick={() => handleOpenModal(row)}
                        disabled={isLoading}
                    >
                        <Icon icon="solar:pen-outline" />
                    </EditButton>
                    <DeleteButton
                        type="button"
                        className="btn btn-sm btn-light text-danger"
                        onClick={() => handleDelete(row)}
                        disabled={isLoading}
                    >
                        <Icon icon="solar:trash-bin-trash-outline" />
                    </DeleteButton>
                </div>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <Breadcrumb
                title={t("Articles")}
                subtitle={t("Content Management")}
            />
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="mb-1">{t("Articles")}</h4>
                    <p className="text-muted mb-0">
                        {t("Manage public articles.")}
                    </p>
                </div>
                <Button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleOpenModal()}
                >
                    <Icon icon="line-md:plus" className="me-1" />
                    {t("Add Article")}
                </Button>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-end mb-3">
                        <div className="col-md-4">
                            <Search
                                search={search}
                                setSearch={(value) => {
                                    setSearch(value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={tableData}
                        progressPending={isLoading}
                        progressComponent={<Loading />}
                        noDataComponent={
                            isLoading ? (
                                <Loading />
                            ) : search ? (
                                t("datatable.zeroRecords")
                            ) : (
                                t("datatable.emptyTable")
                            )
                        }
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        paginationPerPage={rowsPerPage}
                        onChangePage={(page) => setCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setRowsPerPage(newPerPage);
                            setCurrentPage(page);
                        }}
                        highlightOnHover
                        persistTableHead
                        striped
                    />
                </div>
            </div>
            <Modal
                show={showModal}
                onClose={handleCloseModal}
                title={editing ? t("Edit Article") : t("Add Article")}
                saveText={t("Save")}
                onSave={handleSubmit}
                processing={processing}
                size="lg"
                className="article-form-modal"
                bodyClassName="article-form-modal-body"
            >
                <Form
                    data={data}
                    setData={setData}
                    errors={errors}
                    clearErrors={clearErrors}
                />
            </Modal>
        </DashboardLayout>
    );
}
