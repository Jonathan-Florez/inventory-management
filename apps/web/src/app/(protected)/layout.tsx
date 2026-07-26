"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";

export default function ProtectedLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
        router.push("/login");
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return (
        <main className="flex min-h-screen items-center justify-center">
            <p className="text-sm text-gray-500">Cargando...</p>
        </main>
        );
    }

    if (!user) {
        return null;
    }

    function handleLogout() {
        logout();
        router.push("/login");
    }

    return (
        <div className="min-h-screen">
        <nav className="border-b border-gray-200 bg-white px-4 py-3">
            <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div className="flex gap-4 text-sm font-medium">
                <Link href="/" className="text-gray-700 hover:text-indigo-600">
                Dashboard
                </Link>
                <Link href="/categories" className="text-gray-700 hover:text-indigo-600">
                Categorías
                </Link>
                <Link href="/products" className="text-gray-700 hover:text-indigo-600">
                Productos
                </Link>
            </div>
            <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">{user.name}</span>
                <button onClick={handleLogout} className="text-red-600 hover:underline">
                Cerrar sesión
                </button>
            </div>
            </div>
        </nav>
        {children}
        </div>
    );
}