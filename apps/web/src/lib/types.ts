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