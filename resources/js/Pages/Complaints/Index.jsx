import { Link } from "@inertiajs/react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import DashboardLayout from "../../Layouts/DashboardLayout";
import Breadcrumb from "../../Components/ui/Breadcrumb";
import Button from "../../Components/ui/Button";
import Search from "../../Components/datatable/Search";
import DataTable from "../../Components/vendor/DataTable";
import Select from "react-select";
import { useAuth } from "../../src/hook/useAuth";
import { formatDateTime } from "../../helper";

const statusClass = {
    Submitted: "primary",
    "Waiting Admin Review": "warning",
    "Waiting Irban Verification": "info",
    Investigation: "warning",
    Completed: "success",
    Rejected: "danger",
};

export default function Index() {
    const { t } = useTranslation();
    const [complaints, setComplaints] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { hasAnyPermission } = useAuth();
    useEffect(() => {
        setIsLoading(true);
        axios
            .get(route("datatable.complaints"), {
                params: {
                    page: currentPage,
                    per_page: rowsPerPage,
                    search,
                    status,
                },
            })
            .then((response) => {
                setComplaints(response.data.data ?? []);
                setTotalRows(response.data.total ?? 0);
            })
            .finally(() => setIsLoading(false));
    }, [currentPage, rowsPerPage, search, status]);

    const columns = [
        {
            name: t("Complaint Number"),
            selector: (row) => row.ticket_number,
            sortable: true,
        },
        { name: t("Title"), selector: (row) => row.title },
        {
            name: t("Category"),
            selector: (row) => t(row.category?.name) ?? "-",
        },
        {
            name: t("Date"),
            selector: (row) => formatDateTime(row.submitted_at) ?? "-",
            width : "300px"
        },
        { name: t("Priority"), selector: (row) => t(row.priority) ?? "-" },
        {
            name: t("Status"),
            cell: (row) => (
                <span
                    className={`badge bg-${statusClass[row.status] ?? "secondary"}`}
                >
                    {t(row.status)}
                </span>
            ),
        },
        {
            name: t("Actions"),
            right: true,
            cell: (row) => (
                <Link
                    href={route("dashboard.complaints.show", row.id)}
                    className="btn btn-sm btn-secondary"
                >
                    <Icon icon="solar:eye-outline" />
                </Link>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <Breadcrumb title={t("Dashboard")} subtitle={t("Complaints")} />

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="mb-1">{t("Complaints")}</h4>
                </div>
                {hasAnyPermission(["Create Complaint"]) && (
                    <Link href={route("dashboard.complaints.create")}>
                        <Button type="button" className="btn btn-primary">
                            <Icon icon="line-md:plus" className="me-1" />
                            {t("New Attribute", { attribute: t("Complaint") })}
                        </Button>
                    </Link>
                )}
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="row g-2 mb-3">
                        <div className="col-md-8">
                            <Search
                                search={search}
                                setSearch={(value) => {
                                    setSearch(value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <div className="col-md-4">
                            <Select
                                classNamePrefix="react-select"
                                options={["", "Draft", "Submitted", "Waiting Irban Verification", "Waiting SK", "Investigation", "Waiting Secretary Review", "Waiting Inspector Approval", "Not Verified", "Completed", "Rejected"].map((value) => ({ value, label: value ? t(value) : t("All statuses") }))}
                                value={{ value: status, label: status ? t(status) : t("All statuses") }}
                                onChange={(option) => {
                                    setStatus(option?.value ?? "");
                                    setCurrentPage(1);
                                }}
                                isClearable={false}
                            />
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={complaints}
                        progressPending={isLoading}
                        progressSkeleton={isLoading}
                        noDataComponent={t("No complaints found.")}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        paginationPerPage={rowsPerPage}
                        onChangePage={setCurrentPage}
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
        </DashboardLayout>
    );
}
