"use client";

import { useState, FormEvent } from "react";
import { ApiError } from "@/lib/api-client";
import { useCreateMovement } from "@/features/movements/useCreateMovement";
import type { MovementType } from "@/lib/types";

export function MovementForm({ productId }: { productId: number }) {
    const createMovement = useCreateMovement(productId);

    const [type, setType] = useState<MovementType>("in");
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        try {
            await createMovement.mutateAsync({ type, quantity, note: note || undefined });
            setQuantity(1);
            setNote("");
        } catch (err) {
            setError(err instanceof ApiError ? err.detail : "No se pudo registrar el movimiento.");
        }
    }

    const inputClasses = "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10";
    const labelClasses = "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5";

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-2">
            
            <div className="space-y-1.5">
                <span className={labelClasses}>Tipo de Flujo</span>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1 border border-gray-200/40">
                    <button
                        type="button"
                        onClick={() => setType("in")}
                        className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
                            type === "in"
                                ? "bg-white text-emerald-700 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.24a.75.75 0 00-1.1 1.02l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75z" clipRule="evenodd" />
                        </svg>
                        Entrada / Stock (+)
                    </button>
                    <button
                        type="button"
                        onClick={() => setType("out")}
                        className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
                            type === "out"
                                ? "bg-white text-rose-700 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-6.84l1.95-2.1a.75.75 0 10-1.1-1.02L10 11.98 8.4 10.04a.75.75 0 10-1.1 1.02l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 000-1.02z" clipRule="evenodd" />
                        </svg>
                        Salida / Despacho (-)
                    </button>
                </div>
            </div>

            <div className="space-y-1">
                <label htmlFor="movement-quantity" className={labelClasses}>
                    Cantidad de Unidades
                </label>
                <input
                    id="movement-quantity"
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className={inputClasses}
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="movement-note" className={labelClasses}>
                    Nota o Referencia (opcional)
                </label>
                <input
                    id="movement-note"
                    type="text"
                    maxLength={500}
                    placeholder="Ej: Ajuste mensual, orden de compra #1024..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className={inputClasses}
                />
            </div>

            {error && (
                <div role="alert" className="rounded-xl bg-red-50 p-3 border border-red-200 text-sm text-red-700">
                    ⚠️ {error}
                </div>
            )}

            <button
                type="submit"
                disabled={createMovement.isPending}
                className="btn-primary w-full text-sm font-semibold py-2.5 shadow-sm disabled:opacity-50"
            >
                {createMovement.isPending ? "Procesando..." : "Registrar Flujo de Stock"}
            </button>
        </form>
    );
}