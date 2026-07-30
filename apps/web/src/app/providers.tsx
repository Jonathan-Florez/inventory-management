"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ToastProvider } from "@/features/toasts/ToastContext";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
    </QueryClientProvider>
    );
}