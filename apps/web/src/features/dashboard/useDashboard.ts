import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/features/auth/AuthContext";
import type { DashboardSummary } from "@/lib/types";

export function useDashboard() {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["dashboard"],
        queryFn: () => apiFetch<DashboardSummary>("/dashboard/summary", { token }),
        enabled: !!token,
    });
}