export type PaginatedResponse<T> = {
    items: T[];
    total: number;
    page: number;
    page_size: number;
};

export type User = {
    id: number;
    email: string;
    name: string;
    created_at: string;
};

export type AuthToken = {
    access_token: string;
    token_type: string;
    user: User;
};

export type Category = {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    product_count: number;
};

export type CategoryCreate = {
    name: string;
    description?: string;
};

export type CategoryUpdate = Partial<CategoryCreate>;

export type ProductStatus = "active" | "inactive" | "discontinued";

export type Product = {
    id: number;
    category_id: number;
    name: string;
    description: string | null;
    sku: string;
    quantity: number;
    price: string;
    min_stock: number;
    location: string | null;
    status: ProductStatus;
    image_url: string | null;
    created_at: string;
    updated_at: string;
    is_low_stock: boolean;
};

export type ProductCreate = {
    category_id: number;
    name: string;
    description?: string;
    sku: string;
    quantity: number;
    price: number;
    min_stock: number;
    location?: string;
    status?: ProductStatus;
    image_url?: string;
};

export type ProductUpdate = Partial<Omit<ProductCreate, "quantity">>;