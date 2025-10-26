import React, {useState} from "react";
import {signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import {auth} from "../firebase/config";
import {Link, useNavigate} from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err: any) {
            setError("Invalid email or password");
        }
    };

    const handleForgotPassword = async () => {
        if (!email) return setError("Enter your email first");
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent");
            setError("");
        } catch {
            setError("Failed to send reset email");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 transition-colors">
            <form
                onSubmit={handleLogin}
                className="bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-8 w-full max-w-sm space-y-4 border border-lime-400/40"
            >
                <h1 className="text-2xl font-semibold text-center text-lime-500">Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-lime-400 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-lime-400 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {message && <p className="text-green-500 text-sm text-center">{message}</p>}

                <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-lime-500 text-white font-medium hover:bg-lime-600 transition"
                >
                    Sign In
                </button>

                <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="w-full text-sm text-lime-500 hover:underline"
                >
                    Forgot Password?
                </button>

                <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-lime-500 hover:underline">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}
