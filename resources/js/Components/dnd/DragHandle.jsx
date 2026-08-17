import { Icon } from "@iconify/react";

export default function DragHandle({ attributes, listeners,className="" }) {
    return (
        <span
            {...attributes}
            {...listeners}
            className={`text-secondary ${className}`}
            style={{
                cursor: "grab",
            }}
        >
            <Icon icon="solar:hamburger-menu-outline" width={20} />
        </span>
    );
}
