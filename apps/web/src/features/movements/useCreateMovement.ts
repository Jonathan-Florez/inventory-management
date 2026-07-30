import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api-client";
import { useAuth } from "@/features/auth/AuthContext";
import { useToast } from "@/features/toasts/ToastContext";
import type { Movement, MovementCreate } from "@/lib/types";

export function useCreateMovement(productId: number) {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (body: MovementCreate) =>
        apiFetch<Movement>(`/products/${productId}/movements`, { method: "POST", body, token }),
        onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["movements", productId] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        showToast(
            variables.type === "in" ? "Entrada de stock registrada \u2713" : "Salida de stock registrada \u2713"
        );
        },
        onError: (err) => {
        const message = err instanceof ApiError ? err.detail : "No se pudo registrar el movimiento.";
        showToast(message, "error");
        },
    });
}
