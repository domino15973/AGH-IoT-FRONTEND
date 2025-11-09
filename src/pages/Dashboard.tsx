import React from "react";
import Navbar from "../components/Navbar";
import TileGrid from "../components/TileGrid";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
            <Navbar/>
                <main className="max-w-[2000px] mx-auto mt-6 px-4">
                <TileGrid/>
            </main>
        </div>
    );
}
