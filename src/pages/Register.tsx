import React, {useState} from "react";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase/config";
import {Link, useNavigate} from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) return setError("Invalid email address");
        if (password.length < 6) return setError("Password must be at least 6 characters");
        if (password !== confirmPassword) return setError("Passwords do not match");

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err: any) {
            if (err.code === "auth/email-already-in-use") setError("Email already in use");
            else setError("Error creating account");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 transition-colors">
            <form
                onSubmit={handleRegister}
                className="bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-8 w-full max-w-sm space-y-4 border border-lime-400/40"
            >
                <h1 className="text-2xl font-semibold text-center text-lime-500">Register</h1>

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

                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-lime-400 outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-lime-500 text-white font-medium hover:bg-lime-600 transition"
                >
                    Create Account
                </button>

                <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-lime-500 hover:underline">
                        Log in
                    </Link>
                </p>
            </form>
        </div>
    );
}
