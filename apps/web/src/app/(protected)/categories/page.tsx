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

    const totalPages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

    return (
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-950">Categorías</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestiona los grupos y clasificaciones de tus productos en stock.
                    </p>
                </div>
                <button
                    onClick={handleNew}
                    className="btn-primary text-sm font-medium shadow-sm self-start sm:self-auto flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    Nueva categoría
                </button>
            </div>

            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602z" />
                    </svg>
                </div>
                <input
                    type="search"
                    placeholder="Buscar categoría por nombre..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    aria-label="Buscar categoría"
                    className="input-field pl-10 placeholder:text-gray-400 shadow-sm"
                />
            </div>

            {showForm && (
                <div className="card border-indigo-100 bg-indigo-50/20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="mb-3 border-b border-gray-100 pb-2">
                        <h3 className="text-sm font-semibold text-indigo-950">
                            {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                        </h3>
                    </div>
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

            {isLoading && (
                <div className="flex justify-center py-12">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Cargando categorías...
                    </div>
                </div>
            )}

            {isError && (
                <div role="alert" className="rounded-xl bg-red-50 p-4 border border-red-200">
                    <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                        No se pudieron cargar las categorías.
                    </p>
                </div>
            )}

            {data && (
                <div className="space-y-4">
                    <div className="card overflow-hidden !p-0">
                        <CategoryTable categories={data.items} onEdit={handleEdit} onDelete={handleDelete} />
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm border">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn-secondary text-xs disabled:opacity-40"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page * data.page_size >= data.total}
                                className="btn-secondary text-xs disabled:opacity-40"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando página <span className="font-semibold text-gray-900">{data.page}</span> de{" "}
                                    <span className="font-semibold text-gray-900">{totalPages}</span> ({data.total} categorías en total)
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="btn-secondary py-1.5 px-3 text-xs font-medium disabled:opacity-40 disabled:hover:bg-white"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page * data.page_size >= data.total}
                                    className="btn-secondary py-1.5 px-3 text-xs font-medium disabled:opacity-40 disabled:hover:bg-white"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}