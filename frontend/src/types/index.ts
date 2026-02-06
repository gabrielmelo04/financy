export interface User {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: "INPUT" | "OUTPUT";
    category: {
        id: string;
        name: string;
        description?: string;
        icon?: string;
        color?: string;
    };
    description?: string;
    date?: string;
    updatedAt?: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    transactionCount: number;
    createdAt?: string;
    updatedAt?: string;
}