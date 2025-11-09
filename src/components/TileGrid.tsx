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
import ChartTile from "./ChartTile";

type TileConfig = {
    id: string;
    type: "overview" | "temperature-chart" | "empty";
    settings?: Record<string, any>;
};

function SortableTile({
                          tile,
                          onRemove,
                          onSettingsChange,
                      }: {
    tile: TileConfig;
    onRemove: (id: string) => void;
    onSettingsChange: (id: string, settings: Record<string, any>) => void;
}) {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: tile.id});
    const style = {transform: CSS.Transform.toString(transform), transition};

    const renderContent = () => {
        switch (tile.type) {
            case "overview":
                return <OverviewTile/>;
            case "temperature-chart":
                return (
                    <ChartTile
                        title="Temperature Chart"
                        endpoint="/api/db/temperatures/date-range"
                        unit="°C"
                        color="#84cc16"
                        savedRange={tile.settings?.range}
                        onRangeChange={(r) => onSettingsChange(tile.id, {range: r})}
                    />
                );
            default:
                return <span className="text-zinc-400 text-sm">Empty tile</span>;
        }
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Tile id={tile.id} onRemove={onRemove} listeners={listeners} attributes={attributes}>
                {renderContent()}
            </Tile>
        </div>
    );
}

export default function TileGrid() {
    const sensors = useSensors(useSensor(PointerSensor));
    const [tiles, setTiles] = useState<TileConfig[]>(() => {
        const saved = localStorage.getItem("tiles");
        return saved
            ? JSON.parse(saved)
            : [
                {id: "overview", type: "overview"},
                {id: "temperature-chart", type: "temperature-chart", settings: {range: "1d"}},
            ];
    });

    useEffect(() => {
        localStorage.setItem("tiles", JSON.stringify(tiles));
    }, [tiles]);

    function handleRemove(id: string) {
        setTiles((prev) => prev.filter((t) => t.id !== id));
    }

    function handleAddTile() {
        const newId = Math.random().toString(36).substring(2, 9);
        setTiles((prev) => [...prev, {id: newId, type: "empty"}]);
    }

    function handleSettingsChange(id: string, settings: Record<string, any>) {
        setTiles((prev) =>
            prev.map((t) => (t.id === id ? {...t, settings: {...t.settings, ...settings}} : t))
        );
    }

    function handleDragEnd(event: any) {
        const {active, over} = event;
        if (over && active.id !== over.id) {
            setTiles((prev) => {
                const oldIndex = prev.findIndex((t) => t.id === active.id);
                const newIndex = prev.findIndex((t) => t.id === over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    }

    return (
        <div className="p-6">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={tiles.map((t) => t.id)} strategy={rectSortingStrategy}>
                    <div
                        className="
              grid
              justify-center
              gap-6
              [grid-template-columns:repeat(auto-fit,minmax(420px,1fr))]
              max-w-[2000px]
              mx-auto
            "
                    >                        {tiles.map((tile) => (
                        <SortableTile
                            key={tile.id}
                            tile={tile}
                            onRemove={handleRemove}
                            onSettingsChange={handleSettingsChange}
                        />
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
