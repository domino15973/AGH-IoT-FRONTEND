import React, {createContext, useContext, useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import type {User as FirebaseUser} from "firebase/auth";
import {auth} from "../firebase/config";

type AuthContextType = {
    user: FirebaseUser | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{user, loading}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
