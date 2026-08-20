import DashboardLayout from "../../Layouts/DashboardLayout";
import Breadcrumb from "../../Components/ui/Breadcrumb";
import ComplaintForm from "./components/ComplaintForm";
import { useTranslation } from "react-i18next";

export default function Create({ categories = [] }) {
    const { t } = useTranslation();

    return (
        <DashboardLayout>
            <Breadcrumb title={t("Complaints")} subtitle={t("New Complaint")} />
            <ComplaintForm categories={categories} />
        </DashboardLayout>
    );
}
