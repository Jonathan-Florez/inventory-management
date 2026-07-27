"use client";

import { useState, FormEvent } from "react";
import { ApiError } from "@/lib/api-client";
import type { Category } from "@/lib/types";

type CategoryFormProps = {
    initialValues?: Pick<Category, "name" | "description">;
    onSubmit: (values: { name: string; description?: string }) => Promise<unknown>;
    onCancel: () => void;
};

export function CategoryForm({ initialValues, onSubmit, onCancel }: CategoryFormProps) {
    const [name, setName] = useState(initialValues?.name ?? "");
    const [description, setDescription] = useState(initialValues?.description ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await onSubmit({ name, description: description || undefined });
        } catch (err) {
            setError(err instanceof ApiError ? err.detail : "No se pudo guardar la categoría.");
            setIsSubmitting(false);
            return;
        }
        setIsSubmitting(false);
    }

    const inputClasses = "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10";
    const labelClasses = "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5";

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-2">
            <div className="space-y-1">
                <label htmlFor="category-name" className={labelClasses}>
                    Nombre de la Categoría
                </label>
                <input
                    id="category-name"
                    type="text"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClasses}
                    placeholder="Ej: Electrónicos, Ropa, Repuestos..."
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="category-description" className={labelClasses}>
                    Descripción (opcional)
                </label>
                <textarea
                    id="category-description"
                    maxLength={500}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${inputClasses} resize-none`}
                    rows={3}
                    placeholder="Breve descripción del tipo de productos en esta sección..."
                />
            </div>

            {error && (
                <div role="alert" className="rounded-xl bg-red-50 p-3.5 border border-red-200">
                    <p className="text-sm font-medium text-red-700">⚠️ {error}</p>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="btn-secondary text-sm font-semibold px-4 py-2 bg-white border border-gray-200 shadow-sm"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary text-sm font-semibold px-4 py-2 shadow-sm disabled:opacity-50"
                >
                    {isSubmitting ? "Guardando..." : "Guardar Categoría"}
                </button>
            </div>
        </form>
    );
}