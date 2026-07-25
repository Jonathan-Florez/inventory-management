"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { apiFetch } from "@/lib/api-client";
import type { AuthToken, User } from "@/lib/types";

const TOKEN_STORAGE_KEY = "inventario_token";

type AuthContextValue = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (!storedToken) {
        setIsLoading(false);
        return;
        }

        apiFetch<User>("/auth/me", { token: storedToken })
        .then((currentUser) => {
            setToken(storedToken);
            setUser(currentUser);
        })
        .catch(() => {
            // Token inválido o expirado: se limpia, no se asume sesión válida.
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        })
        .finally(() => setIsLoading(false));
    }, []);

    async function login(email: string, password: string) {
        const data = await apiFetch<AuthToken>("/auth/login", {
        method: "POST",
        body: { email, password },
        });
        localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
        setToken(data.access_token);
        setUser(data.user);
    }

    async function register(email: string, password: string, name: string) {
        const data = await apiFetch<AuthToken>("/auth/register", {
        method: "POST",
        body: { email, password, name },
        });
        localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
        setToken(data.access_token);
        setUser(data.user);
    }

    function logout() {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}