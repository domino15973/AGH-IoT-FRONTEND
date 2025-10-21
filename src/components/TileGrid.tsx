import React, {useState} from "react";
import {DndContext, closestCenter} from "@dnd-kit/core";
import {arrayMove, SortableContext, useSortable, rectSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import Tile from "./Tile";

function SortableTile({id, onRemove}: { id: string; onRemove: (id: string) => void }) {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});
    const style = {transform: CSS.Transform.toString(transform), transition};

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Tile id={id} onRemove={onRemove}/>
        </div>
    );
}

export default function TileGrid() {
    const [tiles, setTiles] = useState(["1", "2", "3", "4"]);

    function handleRemove(id: string) {
        setTiles((prev) => prev.filter((t) => t !== id));
    }

    function handleDragEnd(event: any) {
        const {active, over} = event;
        if (over && active.id !== over.id) {
            setTiles((prev) => {
                const oldIndex = prev.indexOf(active.id);
                const newIndex = prev.indexOf(over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    }

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tiles} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                    {tiles.map((id) => (
                        <SortableTile key={id} id={id} onRemove={handleRemove}/>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
