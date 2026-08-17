import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableRow({ id, children, className = "" }) {
    const { attributes, listeners, setNodeRef, transform, transition,isDragging } = useSortable({id});
   const style = {
       transform: CSS.Transform.toString(transform),
       transition,
       cursor: isDragging ? "grabbing" : "default",
   };
    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`${className} ${isDragging ? "table-primary" : ""}`}
        >
            {children({
                attributes,
                listeners,
                isDragging,
            })}
        </tr>
    );
}
