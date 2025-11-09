import React, {useEffect, useState} from "react";
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
import OverviewTile from "./OverviewTile";

const STORAGE_KEY = "dashboard_tiles";

function SortableTile({
                          id,
                          onRemove,
                          children,
                      }: {
    id: string;
    onRemove: (id: string) => void;
    children?: React.ReactNode;
}) {
    const {attributes, listeners, setNodeRef, transform, transition} =
        useSortable({id});
    const style = {transform: CSS.Transform.toString(transform), transition};

    return (
        <div ref={setNodeRef} style={style}>
            <Tile id={id} onRemove={onRemove} listeners={listeners} attributes={attributes}>
                {children}
            </Tile>
        </div>
    );
}

export default function TileGrid() {
    const [tiles, setTiles] = useState<string[]>([]);

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setTiles(parsed);
                    return;
                }
            } catch {
            }
        }
        setTiles(["overview", "2", "3", "4"]);
    }, []);

    useEffect(() => {
        if (tiles.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tiles));
        }
    }, [tiles]);

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
                    <div
                        className="
              grid
              justify-center
              gap-6
              [grid-template-columns:repeat(auto-fit,minmax(420px,1fr))]
              max-w-[2000px]
              mx-auto
            "
                    >
                        {tiles.map((id) => (
                            <SortableTile key={id} id={id} onRemove={handleRemove}>
                                {id === "overview" ? <OverviewTile/> : null}
                            </SortableTile>
                        ))}
                        <button
                            onClick={handleAddTile}
                            className="w-[420px] h-[420px] flex items-center justify-center rounded-xl border-2 border-dashed border-lime-400 text-lime-500 hover:bg-lime-400/10 transition"
                        >
                            <Plus size={40}/>
                        </button>
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
