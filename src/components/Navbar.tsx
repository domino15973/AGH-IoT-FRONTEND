import React from "react";
import {Moon, Sun, LogOut} from "lucide-react";
import {useDarkMode} from "../hooks/useDarkMode";
import {useAuth} from "../context/AuthContext";
import {signOut} from "firebase/auth";
import {auth} from "../firebase/config";

export default function Navbar() {
    const {darkMode, setDarkMode} = useDarkMode();
    const {user} = useAuth();

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-lime-400 dark:bg-zinc-800 shadow">
            <div className="flex items-center gap-3">
                <img src="/lizard.svg" alt="logo" className="w-7 h-7"/>
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
                    SMART TERRARIUM
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {user && (
                    <span className="text-sm text-zinc-800 dark:text-zinc-300">
            {user.email}
          </span>
                )}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-full transition ${
                        darkMode ? "bg-zinc-700 text-yellow-400" : "bg-white text-zinc-700"
                    }`}
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
                </button>
                {user && (
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full bg-white/60 dark:bg-zinc-700 hover:scale-105 transition"
                    >
                        <LogOut className="w-5 h-5 text-zinc-700 dark:text-zinc-300"/>
                    </button>
                )}
            </div>
        </header>
    );
}
