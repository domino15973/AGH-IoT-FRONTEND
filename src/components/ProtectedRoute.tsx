import React from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

export default function ProtectedRoute({children}: { children: JSX.Element }) {
    const {user, loading} = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950">
                <img
                    src="/lizard.svg"
                    alt="Loading"
                    className="w-20 h-20 animate-pulse"
                />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace/>;
    return children;
}
