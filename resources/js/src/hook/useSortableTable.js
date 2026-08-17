import { arrayMove } from "@dnd-kit/sortable";

export default function useSortableTable( items,setItems,onSorted) {

    const handleDragEnd = ({ active, over }) => {

        if (!over) return;

        if (active.id === over.id) return;

        const oldIndex = items.findIndex(
            (item) => item.id === active.id
        );

        const newIndex = items.findIndex(
            (item) => item.id === over.id
        );

        const sorted = arrayMove(
            items,
            oldIndex,
            newIndex
        );

        setItems(sorted);

        onSorted?.(sorted);

    };

    return {
        handleDragEnd,
    };
}