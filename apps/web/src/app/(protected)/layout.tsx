"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";

export default function ProtectedLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    const { user, isLoading } = useAuth();
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

    return <>{children}</>;
}