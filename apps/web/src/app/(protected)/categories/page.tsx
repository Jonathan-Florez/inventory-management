"use client";

import { useState } from "react";
import { useCategories } from "@/features/categories/useCategories";
import {
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from "@/features/categories/useCategoryMutations";
import { CategoryForm } from "@/features/categories/CategoryForm";
import { CategoryTable } from "@/features/categories/CategoryTable";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data, isLoading, isError } = useCategories({ search, page });
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory(editingCategory?.id ?? 0);
    const deleteCategory = useDeleteCategory();

    function handleEdit(category: Category) {
        setEditingCategory(category);
        setShowForm(true);
    }

    function handleNew() {
        setEditingCategory(null);
        setShowForm(true);
    }

    async function handleDelete(category: Category) {
        const confirmed = window.confirm(
        `¿Eliminar "${category.name}"? Esto también elimina sus ${category.product_count} producto(s) y todos sus movimientos asociados. Esta acción no se puede deshacer.`
        );
        if (!confirmed) return;
        await deleteCategory.mutateAsync(category.id);
    }

    async function handleSubmit(values: { name: string; description?: string }) {
        if (editingCategory) {
        await updateCategory.mutateAsync(values);
        } else {
        await createCategory.mutateAsync(values);
        }
        setShowForm(false);
        setEditingCategory(null);
    }

    return (
        <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Categorías</h1>
            <button onClick={handleNew} className="rounded bg-black px-4 py-2 text-white">
            Nueva categoría
            </button>
        </div>

        <input
            type="search"
            placeholder="Buscar categoría..."
            value={search}
            onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
            }}
            aria-label="Buscar categoría"
            className="mb-4 w-full rounded border border-gray-300 px-3 py-2"
        />

        {showForm && (
            <div className="mb-4">
            <CategoryForm
                initialValues={editingCategory ?? undefined}
                onSubmit={handleSubmit}
                onCancel={() => {
                setShowForm(false);
                setEditingCategory(null);
                }}
            />
            </div>
        )}

        {isLoading && <p className="text-sm text-gray-500">Cargando categorías...</p>}
        {isError && (
            <p role="alert" className="text-sm text-red-600">
            No se pudieron cargar las categorías.
            </p>
        )}

        {data && (
            <>
            <CategoryTable categories={data.items} onEdit={handleEdit} onDelete={handleDelete} />

            <div className="mt-4 flex items-center justify-between text-sm">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="disabled:opacity-40">
                Anterior
                </button>
                <span>
                Página {data.page} de {Math.max(1, Math.ceil(data.total / data.page_size))}
                </span>
                <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * data.page_size >= data.total}
                className="disabled:opacity-40"
                >
                Siguiente
                </button>
            </div>
            </>
        )}
        </main>
    );
}