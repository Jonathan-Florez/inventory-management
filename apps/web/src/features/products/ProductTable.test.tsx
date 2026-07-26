import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductTable } from "./ProductTable";
import type { Product } from "@/lib/types";

const baseProduct: Product = {
    id: 1,
    category_id: 1,
    name: "Producto de prueba",
    description: null,
    sku: "SKU-001",
    quantity: 2,
    price: "10.00",
    min_stock: 5,
    location: null,
    status: "active",
    image_url: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    is_low_stock: true,
};

describe("ProductTable", () => {
    it("muestra el badge de stock bajo cuando is_low_stock es true", () => {
        render(<ProductTable products={[baseProduct]} onEdit={vi.fn()} onDelete={vi.fn()} />);
        expect(screen.getByText("Stock bajo")).toBeInTheDocument();
    });

    it("no muestra el badge cuando is_low_stock es false", () => {
        render(
        <ProductTable products={[{ ...baseProduct, is_low_stock: false }]} onEdit={vi.fn()} onDelete={vi.fn()} />
        );
        expect(screen.queryByText("Stock bajo")).not.toBeInTheDocument();
    });

    it("muestra el mensaje de vacío cuando no hay productos", () => {
        render(<ProductTable products={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
        expect(screen.getByText("No hay productos que coincidan con los filtros.")).toBeInTheDocument();
    });
});