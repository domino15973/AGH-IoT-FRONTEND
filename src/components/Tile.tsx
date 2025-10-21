import React from "react";
import {X} from "lucide-react";

type TileProps = {
    id: string;
    onRemove: (id: string) => void;
    children?: React.ReactNode;
};

export default function Tile({id, onRemove, children}: TileProps) {
    return (
        <div
            className="relative bg-white dark:bg-zinc-900 border border-lime-500 rounded-xl shadow-sm p-4 flex items-center justify-center">
            <button
                onClick={() => onRemove(id)}
                className="absolute top-2 right-2 text-lime-600 hover:text-red-500 transition"
            >
                <X size={18}/>
            </button>
            {children || <span className="text-zinc-400 text-sm">Empty tile</span>}
        </div>
    );
}
