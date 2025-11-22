import React from "react";

type Props = {
    onSelect: (type: string) => void;
    onClose: () => void;
};

const TILE_TYPES = [
    {type: "overview", label: "Overview"},
    {type: "temperature-chart", label: "Temperature Chart"},
    {type: "humidity-chart", label: "Humidity Chart"},
    {type: "water-chart", label: "Water Level Chart"},
    {type: "light-chart", label: "Light Intensity Chart"},
    {type: "diodes-chart", label: "Diode Status Chart"},
];

export default function TilePicker({onSelect, onClose}: Props) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div
                className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 w-full max-w-md border border-lime-500/40">
                <h2 className="text-xl font-semibold mb-4 text-center text-lime-500">
                    Add Tile
                </h2>

                <div className="space-y-3">
                    {TILE_TYPES.map((tile) => (
                        <button
                            key={tile.type}
                            onClick={() => onSelect(tile.type)}
                            className="w-full px-4 py-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition text-left text-zinc-800 dark:text-zinc-100"
                        >
                            {tile.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
