import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

import DashboardLayout from "../../../Layouts/DashboardLayout";
import Breadcrumb from "../../../Components/ui/Breadcrumb";
import Button from "../../../Components/ui/Button";
import TextInput from "../../../Components/ui/TextInput";
import SelectInput from "../../../Components/ui/SelectInput";
import Loading from "../../../Components/datatable/Loading";
import DataTable from "../../../Components/vendor/DataTable";
import { useAuth } from "../../../src/hook/useAuth";
import { formatDate } from "../../../helper";

const EMPTY_FILTERS = {
    period_from: "",
    period_to: "",
    ticket_number: "",
    category_id: "",
    status: "",
};

const STATUS_OPTIONS = [
    "Draft",
    "Submitted",
    "Waiting Admin Review",
    "Rejected",
    "Waiting Irban Verification",
    "Not Verified",
    "Waiting SK",
    "Investigation",
    "Waiting Irban Review",
    "Waiting Secretary Review",
    "Waiting Inspector Approval",
    "Completed",
];

export default function Index({ categories = [] }) {
    const { t } = useTranslation();
    const { hasPermission } = useAuth();
    const [formFilters, setFormFilters] = useState(EMPTY_FILTERS);
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [tableData, setTableData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadTableData = () => {
        setIsLoading(true);
        axios.get(route("datatable.complaint-reports"), {
            params: {
                page: currentPage,
                per_page: rowsPerPage,
                ...filters,
            },
        })
            .then((response) => {
                setTableData(response.data.data ?? []);
                setTotalRows(response.data.total ?? 0);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        handleLoadTableData();
    }, [currentPage, rowsPerPage, filters]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFormFilters((current) => ({ ...current, [name]: value }));
    };

    const handleApplyFilter = (event) => {
        event.preventDefault();
        setCurrentPage(1);
        setFilters({ ...formFilters });
    };

    const handleResetFilter = () => {
        setFormFilters(EMPTY_FILTERS);
        setFilters(EMPTY_FILTERS);
        setCurrentPage(1);
    };

    const handleExport = () => {
        const query = new URLSearchParams(
            Object.entries(filters).filter(([, value]) => value),
        ).toString();
        window.location.href = `${route("dashboard.reports.complaints.export")}${query ? `?${query}` : ""}`;
    };

    const columns = [
        {
            name: t("No"),
            width: "70px",
            cell: (_row, index) => (currentPage - 1) * rowsPerPage + index + 1,
        },
        {
            name: t("Ticket Number"),
            selector: (row) => row.ticket_number,
            cell: (row) => row.ticket_number,
            sortable: true,
        },
        {
            name: t("Reporter"),
            selector: (row) => row.reporter?.name ?? "",
            cell: (row) =>
                row.reporter?.is_anonymous
                    ? t("Anonymous")
                    : (row.reporter?.name ?? "-"),
        },
        {
            name: t("Title"),
            selector: (row) => row.title,
            wrap: true,
        },
        {
            name: t("Category"),
            selector: (row) => t(row.category?.name) ?? "-",
        },
        {
            name: t("Date"),
            selector: (row) => row.submitted_at ?? row.created_at,
            cell: (row) => formatDate(row.submitted_at ?? row.created_at),
        },
        {
            name: t("Priority"),
            selector: (row) => row.priority ?? "-",
            cell: (row) => (row.priority ? t(row.priority) : "-"),
        },
        {
            name: t("Status"),
            cell: (row) => (
                <span className="badge bg-light text-dark">
                    {t(row.status?.value ?? row.status ?? "-")}
                </span>
            ),
        },
        // {
        //     name: t("Actions"),
        //     right: true,
        //     cell: (row) => (
        //         <a
        //             href={route("dashboard.complaints.show", row.id)}
        //             className="btn btn-sm btn-light"
        //         >
        //             <Icon icon="solar:eye-outline" />
        //         </a>
        //     ),
        // },
    ];

    return (
        <DashboardLayout>
            <Breadcrumb title={t("Complaint Reports")} subtitle={t("Reports")} />

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="mb-1">{t("Complaint Reports")}</h4>
                    <p className="text-muted mb-0">{t("Review and export complaint data.")}</p>
                </div>
                {hasPermission("Export Complaints") && (
                    <Button type="button" className="btn btn-primary" onClick={handleExport}>
                        <Icon icon="solar:download-outline" className="me-1" />
                        {t("Export")}
                    </Button>
                )}
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <form onSubmit={handleApplyFilter}>
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">{t("From")}</label>
                                <TextInput
                                    type="date"
                                    name="period_from"
                                    value={formFilters.period_from}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">{t("To")}</label>
                                <TextInput
                                    type="date"
                                    name="period_to"
                                    value={formFilters.period_to}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">{t("Ticket Number")}</label>
                                <TextInput
                                    name="ticket_number"
                                    value={formFilters.ticket_number}
                                    onChange={handleFilterChange}
                                    placeholder={t("Ticket Number")}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">{t("Status")}</label>
                                <SelectInput
                                    className="form-select"
                                    name="status"
                                    value={formFilters.status}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">{t("All statuses")}</option>
                                    {STATUS_OPTIONS.map((status) => (
                                        <option key={status} value={status}>{t(status)}</option>
                                    ))}
                                </SelectInput>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">{t("Category")}</label>
                                <SelectInput
                                    className="form-select"
                                    name="category_id"
                                    value={formFilters.category_id}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">{t("All categories")}</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {t(`complaint_categories.${category.code}`) || category.name}
                                        </option>
                                    ))}
                                </SelectInput>
                            </div>
                            <div className="col-md-6 d-flex align-items-end justify-content-end gap-2">
                                <Button type="button" className="btn btn-light" onClick={handleResetFilter}>
                                    {t("Reset")}
                                </Button>
                                <Button type="submit" className="btn btn-primary">
                                    <Icon icon="solar:magnifer-outline" className="me-1" />
                                    {t("Apply Filter")}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <DataTable
                        columns={columns}
                        data={tableData}
                        progressPending={isLoading}
                        progressComponent={<Loading />}
                        noDataComponent={isLoading ? <Loading /> : t("datatable.emptyTable")}
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
