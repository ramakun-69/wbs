import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../Layouts/DashboardLayout";
import Breadcrumb from "../../Components/ui/Breadcrumb";
import Button from "../../Components/ui/Button";
import Search from "../../Components/datatable/Search";
import Loading from "../../Components/datatable/Loading";
import DataTable from "../../Components/vendor/DataTable";
import { useAuth } from "../../src/hook/useAuth";

export default function Index() {
    const { t } = useTranslation();
    const { hasPermission } = useAuth();
    const canCreateSupport = hasPermission("Create Support") && !hasPermission("Manage Support");
    const [tableData, setTableData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadTableData = () => {
        setIsLoading(true);
        axios.get(route("datatable.supports"), {
            params: { page: currentPage, per_page: rowsPerPage, search, status },
        }).then((response) => {
            setTableData(response.data.data ?? []);
            setTotalRows(response.data.total ?? 0);
        }).finally(() => setIsLoading(false));
    };

    useEffect(() => { handleLoadTableData(); }, [currentPage, rowsPerPage, search, status]);

    const columns = [
        { name: t("No"), width: "70px", cell: (_row, index) => (currentPage - 1) * rowsPerPage + index + 1 },
        { name: t("Support ID"), selector: (row) => row.ticket_number, sortable: true },
        { name: t("Subject"), selector: (row) => row.subject, sortable: true },
        { name: t("Reporter"), selector: (row) => row.creator?.name ?? "-" },
        { name: t("Last Update"), selector: (row) => row.last_replied_at ? new Date(row.last_replied_at).toLocaleString() : "-" },
        { name: t("Status"), cell: (row) => <span className={`badge ${row.status === "closed" ? "bg-success" : "bg-primary"}`}>{t(`support.status.${row.status}`)}</span> },
        { name: t("Actions"), right: true, cell: (row) => <Link href={route("dashboard.supports.show", row.id)}><Button type="button" className="btn btn-sm btn-primary"><Icon icon="solar:eye-outline" /></Button></Link> },
    ];

    return <DashboardLayout>
        <Breadcrumb title={t("Support")} subtitle={t("Support Tickets")} />
        <div className="d-flex justify-content-between align-items-center mb-3">
            <div><h4 className="mb-1">{t("Support Tickets")}</h4><p className="text-muted mb-0">{t("Report problems encountered while using the application.")}</p></div>
            {canCreateSupport && <Link href={route("dashboard.supports.create")}><Button className="btn btn-primary"><Icon icon="line-md:plus" className="me-1" />{t("New Support Ticket")}</Button></Link>}
        </div>
        <div className="card"><div className="card-body">
            <div className="row g-2 mb-3"><div className="col-md-4"><Search search={search} setSearch={(value) => { setSearch(value); setCurrentPage(1); }} /></div><div className="col-md-3"><select className="form-select" value={status} onChange={(event) => { setStatus(event.target.value); setCurrentPage(1); }}><option value="">{t("All Statuses")}</option><option value="open">{t("support.status.open")}</option><option value="in_progress">{t("support.status.in_progress")}</option><option value="closed">{t("support.status.closed")}</option></select></div></div>
            <DataTable columns={columns} data={tableData} progressPending={isLoading} progressComponent={<Loading />} noDataComponent={isLoading ? <Loading /> : t("datatable.emptyTable")} pagination paginationServer paginationTotalRows={totalRows} paginationPerPage={rowsPerPage} onChangePage={setCurrentPage} onChangeRowsPerPage={(newPerPage, page) => { setRowsPerPage(newPerPage); setCurrentPage(page); }} highlightOnHover persistTableHead striped />
        </div></div>
    </DashboardLayout>;
}
