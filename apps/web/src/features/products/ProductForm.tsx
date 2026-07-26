"use client";

import { useState, FormEvent } from "react";
import { ApiError } from "@/lib/api-client";
import { useCategories } from "@/features/categories/useCategories";
import type { Product, ProductStatus } from "@/lib/types";


export type ProductFormValues = {
    category_id: number;
    name: string;
    description?: string;
    sku: string;
    quantity: number;
    price: number;
    min_stock: number;
    location?: string;
    status: ProductStatus;
    image_url?: string;
};

type ProductFormProps = {
    initialValues?: Product;
    onSubmit: (values: ProductFormValues) => Promise<unknown>;
    onCancel: () => void;
};

export function ProductForm({ initialValues, onSubmit, onCancel }: ProductFormProps) {
    const { data: categoriesData, isLoading: categoriesLoading } = useCategories({ pageSize: 100 });
    const isEditing = !!initialValues;

    const [categoryId, setCategoryId] = useState(initialValues?.category_id ?? 0);
    const [name, setName] = useState(initialValues?.name ?? "");
    const [description, setDescription] = useState(initialValues?.description ?? "");
    const [sku, setSku] = useState(initialValues?.sku ?? "");
    const [quantity, setQuantity] = useState(initialValues?.quantity ?? 0);
    const [price, setPrice] = useState(initialValues?.price ?? "");
    const [minStock, setMinStock] = useState(initialValues?.min_stock ?? 0);
    const [location, setLocation] = useState(initialValues?.location ?? "");
    const [status, setStatus] = useState<ProductStatus>(initialValues?.status ?? "active");
    const [imageUrl, setImageUrl] = useState(initialValues?.image_url ?? "");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
        await onSubmit({
            category_id: categoryId,
            name,
            description: description || undefined,
            sku,
            quantity: Number(quantity),
            price: Number(price),
            min_stock: Number(minStock),
            location: location || undefined,
            status,
            image_url: imageUrl || undefined,
        });
        } catch (err) {
        setError(err instanceof ApiError ? err.detail : "No se pudo guardar el producto.");
        setIsSubmitting(false);
        return;
        }
        setIsSubmitting(false);
    }

    const categories = categoriesData?.items ?? [];

    return (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-gray-200 p-4">
        <div className="space-y-1">
            <label htmlFor="product-category" className="block text-sm font-medium">
            Categoría
            </label>
            {categoriesLoading ? (
            <p className="text-sm text-gray-500">Cargando categorías...</p>
            ) : categories.length === 0 ? (
            <p className="text-sm text-amber-600">
                No tenés categorías todavía. Creá una categoría primero para poder registrar productos.
            </p>
            ) : (
            <select
                id="product-category"
                required
                value={categoryId || ""}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2"
            >
                <option value="" disabled>
                Seleccioná una categoría
                </option>
                {categories.map((c) => (
                <option key={c.id} value={c.id}>
                    {c.name}
                </option>
                ))}
            </select>
            )}
        </div>

        <div className="space-y-1">
            <label htmlFor="product-name" className="block text-sm font-medium">
            Nombre
            </label>
            <input
            id="product-name"
            type="text"
            required
            maxLength={150}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            />
        </div>

        <div className="space-y-1">
            <label htmlFor="product-sku" className="block text-sm font-medium">
            SKU
            </label>
            <input
            id="product-sku"
            type="text"
            required
            maxLength={50}
            disabled={isEditing}
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
            />
            {isEditing && (
            <p className="text-xs text-gray-500">El SKU no se puede modificar tras crear el producto.</p>
            )}
        </div>

        <div className="space-y-1">
            <label htmlFor="product-description" className="block text-sm font-medium">
            Descripción (opcional)
            </label>
            <textarea
            id="product-description"
            maxLength={1000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            rows={2}
            />
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
            <label htmlFor="product-quantity" className="block text-sm font-medium">
                Cantidad inicial
            </label>
            <input
                id="product-quantity"
                type="number"
                required
                min={0}
                disabled={isEditing}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
            />
            {isEditing && (
                <p className="text-xs text-gray-500">El stock se ajusta con movimientos, no acá.</p>
            )}
            </div>

            <div className="space-y-1">
            <label htmlFor="product-min-stock" className="block text-sm font-medium">
                Stock mínimo
            </label>
            <input
                id="product-min-stock"
                type="number"
                required
                min={0}
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2"
            />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
            <label htmlFor="product-price" className="block text-sm font-medium">
                Precio unitario
            </label>
            <input
                id="product-price"
                type="number"
                required
                min={0.01}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
            />
            </div>

            <div className="space-y-1">
            <label htmlFor="product-status" className="block text-sm font-medium">
                Estado
            </label>
            <select
                id="product-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full rounded border border-gray-300 px-3 py-2"
            >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="discontinued">Descontinuado</option>
            </select>
            </div>
        </div>

        <div className="space-y-1">
            <label htmlFor="product-location" className="block text-sm font-medium">
            Ubicación (opcional)
            </label>
            <input
            id="product-location"
            type="text"
            maxLength={100}
            placeholder="Ej: Estante A-3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            />
        </div>

        <div className="space-y-1">
            <label htmlFor="product-image" className="block text-sm font-medium">
            URL de imagen (opcional)
            </label>
            <input
            id="product-image"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            />
        </div>

        {error && (
            <p role="alert" className="text-sm text-red-600">
            {error}
            </p>
        )}

        <div className="flex gap-2">
            <button
            type="submit"
            disabled={isSubmitting || (!isEditing && categories.length === 0)}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
            {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" onClick={onCancel} className="rounded border border-gray-300 px-4 py-2">
            Cancelar
            </button>
        </div>
        </form>
    );
}