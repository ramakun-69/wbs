import { Icon } from "@iconify/react/dist/iconify.js";
import { Menu } from "lucide-react";
import Button from "../../../ui/Button";

export default function LeftSideBarToggle({ onToggle }) {
    return (
        <Button
            type="button"
            onClick={onToggle}
            className="sidenav-toggle-button px-2"
            aria-label="Toggle sidebar"
        >
            <Icon icon="ri:menu-2-line" className="fs-24" />
        </Button>
    );
}
