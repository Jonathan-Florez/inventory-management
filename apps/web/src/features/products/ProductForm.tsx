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

    const inputClasses = "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200";
    const labelClasses = "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5";

    return (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-2">
            
            <div className="space-y-1">
                <label htmlFor="product-category" className={labelClasses}>
                    Categoría
                </label>
                {categoriesLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500 py-2.5">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                        Cargando categorías...
                    </div>
                ) : categories.length === 0 ? (
                    <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                        ⚠️ No tenés categorías todavía. Creá una categoría primero para poder registrar productos.
                    </p>
                ) : (
                    <div className="relative">
                        <select
                            id="product-category"
                            required
                            value={categoryId || ""}
                            onChange={(e) => setCategoryId(Number(e.target.value))}
                            className={`${inputClasses} appearance-none pr-10`}
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
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <label htmlFor="product-name" className={labelClasses}>
                    Nombre
                </label>
                <input
                    id="product-name"
                    type="text"
                    required
                    maxLength={150}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClasses}
                    placeholder="Ej: Camiseta de Algodón Premium"
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="product-sku" className={labelClasses}>
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
                    className={inputClasses}
                    placeholder="Ej: TS-BLC-MED"
                />
                {isEditing && (
                    <p className="text-xs text-gray-400 italic mt-1">El SKU no se puede modificar tras crear el producto.</p>
                )}
            </div>

            <div className="space-y-1">
                <label htmlFor="product-description" className={labelClasses}>
                    Descripción (opcional)
                </label>
                <textarea
                    id="product-description"
                    maxLength={1000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${inputClasses} resize-none`}
                    rows={2}
                    placeholder="Detalles adicionales del artículo..."
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <label htmlFor="product-quantity" className={labelClasses}>
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
                        className={inputClasses}
                    />
                    {isEditing && (
                        <p className="text-xs text-gray-400 italic mt-1">El stock se ajusta con movimientos.</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label htmlFor="product-min-stock" className={labelClasses}>
                        Stock mínimo
                    </label>
                    <input
                        id="product-min-stock"
                        type="number"
                        required
                        min={0}
                        value={minStock}
                        onChange={(e) => setMinStock(Number(e.target.value))}
                        className={inputClasses}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <label htmlFor="product-price" className={labelClasses}>
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
                        className={inputClasses}
                        placeholder="0.00"
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="product-status" className={labelClasses}>
                        Estado
                    </label>
                    <div className="relative">
                        <select
                            id="product-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ProductStatus)}
                            className={`${inputClasses} appearance-none pr-10`}
                        >
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                            <option value="discontinued">Descontinuado</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <label htmlFor="product-location" className={labelClasses}>
                    Ubicación (opcional)
                </label>
                <input
                    id="product-location"
                    type="text"
                    maxLength={100}
                    placeholder="Ej: Estante A-3, Pasillo 2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={inputClasses}
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="product-image" className={labelClasses}>
                    URL de imagen (opcional)
                </label>
                <input
                    id="product-image"
                    type="url"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className={inputClasses}
                />
            </div>

            {error && (
                <div role="alert" className="rounded-xl bg-red-50 p-3.5 border border-red-200">
                    <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                        ⚠️ {error}
                    </p>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="btn-secondary text-sm font-semibold px-5 py-2.5 bg-white border border-gray-200 shadow-sm"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || (!isEditing && categories.length === 0)}
                    className="btn-primary text-sm font-semibold px-5 py-2.5 shadow-sm disabled:opacity-50"
                >
                    {isSubmitting ? "Guardando..." : "Guardar Producto"}
                </button>
            </div>
        </form>
    );
}