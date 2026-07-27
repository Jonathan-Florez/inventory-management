"use client";

import { useState } from "react";
import { useProducts } from "@/features/products/useProduct";
import {
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
} from "@/features/products/useProductMutations";
import { ProductForm, type ProductFormValues } from "@/features/products/ProductForm";
import { ProductTable } from "@/features/products/ProductTable";
import { ProductFilters } from "@/features/products/ProductFilters";
import type { Product, ProductStatus } from "@/lib/types";

export default function ProductsPage() {
    const [filters, setFilters] = useState<{
        categoryId?: number;
        status?: ProductStatus;
        lowStock: boolean;
        q: string;
    }>({ lowStock: false, q: "" });
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const { data, isLoading, isError } = useProducts({ ...filters, page });
    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct(editingProduct?.id ?? 0);
    const deleteProduct = useDeleteProduct();

    function handleFiltersChange(next: typeof filters) {
        setFilters(next);
        setPage(1);
    }

    function handleEdit(product: Product) {
        setEditingProduct(product);
        setShowForm(true);
    }

    function handleNew() {
        setEditingProduct(null);
        setShowForm(true);
    }

    async function handleDelete(product: Product) {
        const confirmed = window.confirm(
            `¿Eliminar "${product.name}"? Esto también elimina todos sus movimientos asociados. Esta acción no se puede deshacer.`
        );
        if (!confirmed) return;
        await deleteProduct.mutateAsync(product.id);
    }

    async function handleSubmit(values: ProductFormValues) {
        if (editingProduct) {
            await updateProduct.mutateAsync(values);
        } else {
            await createProduct.mutateAsync(values);
        }
        setShowForm(false);
        setEditingProduct(null);
    }

    const totalPages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
            {/* Ambientación visual de fondo */}
            <div className="absolute top-0 left-1/3 -z-10 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
            <div className="absolute bottom-12 right-1/4 -z-10 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />

            <main className="mx-auto max-w-5xl bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xl shadow-gray-200/50 space-y-6">
                
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-2">
                            Almacén Central
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-950">Productos</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Control completo sobre las existencias, precios y estados de tu stock.
                        </p>
                    </div>
                    <button 
                        onClick={handleNew} 
                        className="btn-primary text-sm font-medium shadow-sm self-start sm:self-auto flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                        Nuevo producto
                    </button>
                </div>

                <div className="card border-gray-100 shadow-sm bg-gray-50/50 p-4 rounded-xl">
                    <ProductFilters value={filters} onChange={handleFiltersChange} />
                </div>

                {showForm && (
                    <div className="card border-indigo-100 bg-indigo-50/20 shadow-inner animate-in fade-in slide-in-from-top-2 duration-200 p-5 rounded-xl">
                        <div className="mb-4 border-b border-gray-100 pb-2">
                            <h3 className="text-sm font-semibold text-indigo-950">
                                {editingProduct ? "📦 Modificar Información del Producto" : "✨ Registrar Nuevo Producto"}
                            </h3>
                        </div>
                        <ProductForm
                            initialValues={editingProduct ?? undefined}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingProduct(null);
                            }}
                        />
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-center py-12">
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border px-4 py-2 rounded-lg shadow-sm">
                            <svg className="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Cargando inventario...
                        </div>
                    </div>
                )}

                {isError && (
                    <div role="alert" className="rounded-xl bg-red-50 p-4 border border-red-200 shadow-sm">
                        <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                            No se pudieron cargar los productos del almacén.
                        </p>
                    </div>
                )}

                {data && (
                    <div className="space-y-4">
                        <div className="card overflow-hidden !p-0 border border-gray-200 shadow-sm bg-white">
                            <ProductTable products={data.items} onEdit={handleEdit} onDelete={handleDelete} />
                        </div>

                        <div className="flex items-center justify-between border border-gray-200/80 bg-white px-4 py-3.5 sm:px-6 rounded-xl shadow-sm">
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
                                    <p className="text-sm text-gray-600">
                                        Mostrando página <span className="font-semibold text-gray-900">{data.page}</span> de{" "}
                                        <span className="font-semibold text-gray-900">{totalPages}</span> — Items: <span className="font-semibold text-gray-900">{data.total}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="btn-secondary py-1.5 px-3.5 text-xs font-semibold bg-white disabled:opacity-40"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={page * data.page_size >= data.total}
                                        className="btn-secondary py-1.5 px-3.5 text-xs font-semibold bg-white disabled:opacity-40"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}