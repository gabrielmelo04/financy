import { prisma } from "../../lib/prisma.js";
import { CreateCategoryInput, UpdateCategoryInput } from "../dtos/input/category.input.js";


export class CategoryService { 

    async createCategory(data: CreateCategoryInput, userId: string) {
        const categoryExists = await prisma.category.findFirst({
            where: { name: data.name, userId },
        });

        if (categoryExists) {
            throw new Error("Categoria com este nome já existe");
        }

        return prisma.category.create({
            data: {
                name: data.name,
                description: data.description,
                icon: data.icon,
                color: data.color,
                userId,
            },
        });
    }
    
    async listCategories(userId: string) {
        const categories = await prisma.category.findMany({
            where: { userId: userId },
            include: {
                user: true,
                transactions: true,
            },
            orderBy: {
                name: "asc",
            },
        });

        return categories.map((category) => ({
            ...category,
            transactionCount: category.transactions.length,
        }));
    }

    async updateCategory(data: UpdateCategoryInput, id: string, userId: string) {
        const categoryExists = await prisma.category.findFirst({
            where: { id, userId },
        });

        if (!categoryExists) {
            throw new Error("Categoria não encontrada");
        }

        return prisma.category.update({
            where: { id, userId },
            data: {
                ...data,
            },
            include: {
                user: true,
            },
        });
    }

    async deleteCategory(id: string, userId: string) { 
        const categoryExists = await prisma.category.findFirst({
            where: { id, userId },
        });

        if (!categoryExists) {
            throw new Error("Categoria não encontrada");
        }

        return prisma.category.delete({
            where: { id, userId },
        });
    }
}