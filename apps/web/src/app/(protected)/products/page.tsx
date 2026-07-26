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

    return (
        <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Productos</h1>
            <button onClick={handleNew} className="rounded bg-black px-4 py-2 text-white">
            Nuevo producto
            </button>
        </div>

        <ProductFilters value={filters} onChange={handleFiltersChange} />

        {showForm && (
            <div className="mb-4">
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

        {isLoading && <p className="text-sm text-gray-500">Cargando productos...</p>}
        {isError && (
            <p role="alert" className="text-sm text-red-600">
            No se pudieron cargar los productos.
            </p>
        )}

        {data && (
            <>
            <ProductTable products={data.items} onEdit={handleEdit} onDelete={handleDelete} />

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