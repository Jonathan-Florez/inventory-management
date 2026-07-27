"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProduct } from "@/features/products/useProduct";
import { MovementForm } from "@/features/movements/MovementForm";
import { MovementHistory } from "@/features/movements/MovementHistory";

export default function ProductDetailPage() {
    const params = useParams<{ id: string }>();
    const productId = Number(params.id);
    const router = useRouter();

    const { data: product, isLoading, isError } = useProduct(productId);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
                <div className="flex items-center gap-3 text-sm text-gray-500 bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-md">
                    <svg className="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Buscando ficha técnica...
                </div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 px-4 py-8">
                <div role="alert" className="mx-auto max-w-3xl rounded-xl bg-red-50 p-5 border border-red-200 shadow-sm space-y-3">
                    <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                        El artículo solicitado no existe o fue removido.
                    </p>
                    <button 
                        onClick={() => router.push("/products")} 
                        className="btn-secondary text-xs font-semibold py-1.5 px-3 bg-white shadow-sm"
                    >
                        Regresar al almacén
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute top-0 right-1/3 -z-10 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
            <div className="absolute bottom-12 left-1/4 -z-10 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" />

            <main className="mx-auto max-w-3xl bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xl shadow-gray-200/50 space-y-6">
                
                <Link 
                    href="/products" 
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 bg-white border border-gray-200 rounded-md px-2.5 py-1.5 shadow-sm transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Volver al listado
                </Link>

                <div className={`card p-5 border-l-4 shadow-sm bg-white ${
                    product.is_low_stock ? "border-l-red-500 bg-red-50/5" : "border-l-indigo-600"
                }`}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-950">{product.name}</h1>
                            <p className="mt-1 text-sm text-gray-500 font-mono">
                                SKU: <span className="font-semibold text-gray-700">{product.sku}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <div className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-800">
                                Stock: <span className="font-bold">{product.quantity}</span>
                            </div>
                            {product.is_low_stock && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 animate-pulse">
                                    ⚠️ Stock bajo
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card border-gray-200/70 shadow-sm bg-white p-5 rounded-xl">
                    <div className="mb-3 border-b border-gray-100 pb-2">
                        <h3 className="text-sm font-semibold text-gray-900">Registrar flujo de stock</h3>
                    </div>
                    <MovementForm productId={productId} />
                </div>

                <div className="space-y-3 pt-2">
                    <h2 className="text-lg font-semibold tracking-tight text-gray-950">Historial de movimientos</h2>
                    <div className="card overflow-hidden !p-0 border border-gray-200 shadow-sm bg-white">
                        <MovementHistory productId={productId} />
                    </div>
                </div>
            </main>
        </div>
    );
}