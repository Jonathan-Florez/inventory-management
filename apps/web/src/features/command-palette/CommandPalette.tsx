"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/features/products/useProduct";

type Action = {
    id: string;
    label: string;
    hint?: string;
    onSelect: () => void;
};

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // abrir/cerrar con Cmd+K o Ctrl+K desde cualquier pantalla protegida
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
            if (e.key === "Escape") {
                setOpen(false);
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (open) {
            setQuery("");
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [open]);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedQuery(query), 250);
        return () => clearTimeout(timeout);
    }, [query]);

    const { data: productResults, isFetching } = useProducts({
        q: debouncedQuery,
        pageSize: 6,
    });

    const navActions: Action[] = useMemo(
        () => [
            { id: "nav-dashboard", label: "Ir al Dashboard", hint: "Navegación", onSelect: () => router.push("/") },
            { id: "nav-categories", label: "Ver categorías", hint: "Navegación", onSelect: () => router.push("/categories") },
            { id: "nav-products", label: "Ver productos", hint: "Navegación", onSelect: () => router.push("/products") },
        ],
        [router]
    );

    const productActions: Action[] = useMemo(() => {
        if (!debouncedQuery || !productResults) return [];
        return productResults.items.map((p) => ({
            id: `product-${p.id}`,
            label: p.name,
            hint: `SKU ${p.sku}${p.is_low_stock ? " · stock bajo" : ""}`,
            onSelect: () => router.push(`/products/${p.id}`),
        }));
    }, [debouncedQuery, productResults, router]);

    const filteredNavActions = query
        ? navActions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))
        : navActions;

    const results = [...productActions, ...filteredNavActions];

    function select(action: Action) {
        action.onSelect();
        setOpen(false);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && results[activeIndex]) {
            e.preventDefault();
            select(results[activeIndex]);
        }
    }

    return (
        <>
            {/* Botón visible para quienes no conocen el atajo de teclado */}
            <button
                onClick={() => setOpen(true)}
                aria-label="Abrir búsqueda rápida"
                className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-200/60 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
                Buscar
                <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 text-[10px] font-semibold">⌘K</kbd>
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Búsqueda rápida"
                    className="fixed inset-0 z-50 flex items-start justify-center bg-gray-950/40 backdrop-blur-sm px-4 pt-[12vh]"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-400 shrink-0">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setActiveIndex(0);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Buscar productos por nombre o SKU, o navegar..."
                                aria-label="Buscar productos o navegar"
                                className="flex-1 text-sm outline-none placeholder:text-gray-400"
                            />
                            {isFetching && debouncedQuery && (
                                <span className="text-xs text-gray-400">Buscando...</span>
                            )}
                        </div>

                        <ul className="max-h-80 overflow-y-auto py-2">
                            {results.length === 0 ? (
                                <li className="px-4 py-6 text-center text-sm text-gray-400">
                                    Sin resultados para &quot;{query}&quot;.
                                </li>
                            ) : (
                                results.map((action, index) => (
                                    <li key={action.id}>
                                        <button
                                            onClick={() => select(action)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                                                index === activeIndex
                                                    ? "bg-indigo-50 text-indigo-700"
                                                    : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span className="font-medium">{action.label}</span>
                                            {action.hint && (
                                                <span className="text-xs text-gray-400">{action.hint}</span>
                                            )}
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}
