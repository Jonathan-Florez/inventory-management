"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
                <div className="flex items-center gap-3 text-sm text-gray-500 bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-md">
                    <svg className="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verificando credenciales...
                </div>
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

    const isActive = (path: string) => {
        if (path === "/" && pathname === "/") return true;
        if (path !== "/" && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
            <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/70 backdrop-blur-md transition-all">
                <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Link 
                            href="/" 
                            className={`rounded-lg px-3 py-2 transition-all ${
                                isActive("/") 
                                    ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm shadow-indigo-100" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            Dashboard
                        </Link>
                        <Link 
                            href="/categories" 
                            className={`rounded-lg px-3 py-2 transition-all ${
                                isActive("/categories") 
                                    ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm shadow-indigo-100" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            Categorías
                        </Link>
                        <Link 
                            href="/products" 
                            className={`rounded-lg px-3 py-2 transition-all ${
                                isActive("/products") 
                                    ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm shadow-indigo-100" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            Productos
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 bg-white/80 border border-gray-200/60 py-1.5 pl-2.5 pr-3.5 rounded-full shadow-sm">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-sky-500 text-[11px] font-bold text-white uppercase tracking-wider shadow-inner">
                                {user.name.slice(0, 2)}
                            </div>
                            <span className="hidden sm:inline font-medium text-gray-700 max-w-[120px] truncate">
                                {user.name}
                            </span>
                        </div>

                        <button 
                            onClick={handleLogout} 
                            className="inline-flex items-center gap-1.5 font-medium text-gray-500 hover:text-red-600 border border-transparent hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-150"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            <span className="hidden md:inline">Cerrar sesión</span>
                        </button>
                    </div>

                </nav>
            </header>

            <div className="relative">
                {children}
            </div>
        </div>
    );
}