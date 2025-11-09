import React from "react";
import {X, Grip} from "lucide-react";

type TileProps = {
    id: string;
    onRemove: (id: string) => void;
    listeners?: any;
    attributes?: any;
    children?: React.ReactNode;
};

export default function Tile({id, onRemove, listeners, attributes, children}: TileProps) {
    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onRemove(id);
    };

    return (
        <div
            className="relative bg-white dark:bg-zinc-900 border border-lime-500 rounded-xl shadow-sm p-4 flex items-center justify-center w-[420px] h-[420px] select-none">
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 left-2 text-lime-600 hover:text-lime-400 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
            >
                <Grip size={18}/>
            </div>

            <button
                onClick={handleRemove}
                className="absolute top-2 right-2 text-lime-600 hover:text-red-500 transition"
            >
                <X size={18}/>
            </button>

            <div className="w-full h-full overflow-hidden flex items-center justify-center">
                {children ?? <span className="text-zinc-400 text-sm">Empty tile</span>}
            </div>
        </div>
    );
}
