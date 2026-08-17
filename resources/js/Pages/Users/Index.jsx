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
import Form from "./Form";
import DrawerPanel from "./DrawerPanel";
import { notifyError, notifySuccess } from "../../Components/ui/Toastify";

export default function Index({ roles = [] }) {
    const { t } = useTranslation();
    const [tableData, setTableData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [drawerUser, setDrawerUser] = useState(null);

    const { data, setData,  post, processing, errors, clearErrors, reset} = useForm({
        simpeg_user_id: "",
        username: "",
        name: "",
        email: "",
    });

    const loadTableData = () => {
        setIsLoading(true);
        axios.get(route("datatable.internal-users"), {
            params: {
                page: currentPage,
                per_page: rowsPerPage,
                search,
            },
        })
            .then((response) => {
                setTableData(response.data.data ?? []);
                setTotalRows(response.data.total ?? 0);
            })
            .catch(() => notifyError(t("An unexpected error occurred. Please try again later.")))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadTableData();
    }, [currentPage, rowsPerPage, search]);

    const openCreateModal = () => {
        clearErrors();
        reset();
        setModalOpen(true);
    };

    const closeCreateModal = () => {
        clearErrors();
        reset();
        setModalOpen(false);
    };

    const handleUserChange = (user) => {
        setData({
            simpeg_user_id: user?.id ?? "",
            username: user?.username ?? "",
            name: user?.name ?? "",
            email: user?.email ?? "",
        });
    };

    const selectedUser = data.simpeg_user_id
        ? {
            id: data.simpeg_user_id,
            username: data.username,
            name: data.name,
            email: data.email,
        }
        : null;

    const handleSubmitUser = () => {
        post(route("users.store"), {
            preserveScroll: true,
            onSuccess: (page) => {
                closeCreateModal();
                loadTableData();
                notifySuccess(page.props?.flash?.success ?? t("User added successfully."));
            },
            onError: (formErrors) => {
                if (formErrors.simpeg_user_id) notifyError(formErrors.simpeg_user_id);
            },
        });
    };

    const submitRoles = (roleNames) => {
        router.put(route("users.roles.update", drawerUser.id), {
            roles: roleNames,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                setDrawerUser(null);
                loadTableData();
                notifySuccess(page.props?.flash?.success ?? t("User roles updated successfully."));
            },
            onError: () => notifyError(t("An unexpected error occurred. Please try again later.")),
        });
    };

    const columns = [
        {
            name: "No",
            width: "70px",
            cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
        },
        {
            name: t("Email"),
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: t("Name"),
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: t("Role"),
            selector: (row) => row.roles?.map((role) => role.name).join(", ") || "-",
            sortable: true,
        },
        {
            name: t("Actions"),
            right: true,
            cell: (row) => (
                <Button
                    type="button"
                    className="btn btn-sm btn-info text-white"
                    onClick={() => setDrawerUser(row)}
                    disabled={isLoading}
                    title={t("Assign Roles")}
                >
                    <Icon icon="mdi:shield-key-outline" width="18" height="18" />
                </Button>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <Breadcrumb title={t("User Management")} subtitle={t("Users")} />

            <div className="d-flex justify-content-end mb-3">
                <Button type="button" className="btn btn-sm btn-primary" onClick={openCreateModal}>
                    <Icon icon="line-md:plus" className="me-2" width="20" height="20" />
                    {t("Add New User")}
                </Button>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-end mb-3">
                        <div className="col-md-4">
                            <Search search={search} setSearch={(value) => {
                                setSearch(value);
                                setCurrentPage(1);
                            }} />
                        </div>
                    </div>

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
                show={modalOpen}
                onClose={closeCreateModal}
                title={t("Add New Attribute", {attribute : t('User')})}
                onSave={handleSubmitUser}
                processing={processing}
                size="md"
            >
                <Form
                    data={data}
                    setData={setData}
                    errors={errors}
                    selectedUser={selectedUser}
                    onUserChange={handleUserChange}
                />
            </Modal>

            <DrawerPanel
                show={Boolean(drawerUser)}
                user={drawerUser}
                roles={roles}
                onClose={() => setDrawerUser(null)}
                onSubmit={submitRoles}
                isLoading={processing}
            />
        </DashboardLayout>
    );
}
