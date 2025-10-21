import React, {useState} from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    arrayMove,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import Tile from "./Tile";
import {Plus} from "lucide-react";

function SortableTile({
                          id,
                          onRemove,
                      }: {
    id: string;
    onRemove: (id: string) => void;
}) {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
        id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Tile id={id} onRemove={onRemove} listeners={listeners} attributes={attributes}/>
        </div>
    );
}

export default function TileGrid() {
    const [tiles, setTiles] = useState<string[]>(["1", "2", "3", "4"]);
    const sensors = useSensors(useSensor(PointerSensor));

    function handleRemove(id: string) {
        setTiles((prev) => prev.filter((t) => t !== id));
    }

    function handleAddTile() {
        const newId = Math.random().toString(36).substring(2, 9);
        setTiles((prev) => [...prev, newId]);
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
        <div className="p-6">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={tiles} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {tiles.map((id) => (
                            <SortableTile key={id} id={id} onRemove={handleRemove}/>
                        ))}
                        <button
                            onClick={handleAddTile}
                            className="aspect-square flex items-center justify-center rounded-xl border-2 border-dashed border-lime-400 text-lime-500 hover:bg-lime-400/10 transition"
                        >
                            <Plus size={40}/>
                        </button>
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
