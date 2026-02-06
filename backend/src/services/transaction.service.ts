import { prisma } from "../../lib/prisma.js";
import { CreateTransactionInput, UpdateTransactionInput } from "../dtos/input/transaction.input.js";


export class TransactionService { 


    async createTransaction(data: CreateTransactionInput, userId: string) { 
        const categoryExists = await prisma.category.findFirst({
            where: { id: data.categoryId, userId },
        });

        if (!categoryExists) {
            throw new Error("Categoria não encontrada");
        }

        return prisma.transaction.create({
            data: {
                title: data.title,
                type: data.type,
                amount: data.amount,
                date: data.date,
                categoryId: data.categoryId,
                userId,
            },
            include: {
                category: true,
                user: true,
            },

        });
    }

    async listTransactions(userId: string) { 
        const transactions = await prisma.transaction.findMany({
            where: { userId: userId },
            include: {
                category: true,
                user: true,
            },
            orderBy: {
                date: "desc",
            }
        });
        return transactions;
    }

    async deleteTransaction(id: string, userId: string) { 
        const transactionExists = await prisma.transaction.findFirst({
            where: { id, userId },
        });

        if (!transactionExists) {
            throw new Error("Transação não encontrada");
        }

        return prisma.transaction.delete({
            where: { id, userId },
        });
    }

    async updateTransaction(id: string, userId: string, data: UpdateTransactionInput) { 
        const transactionExists = await prisma.transaction.findFirst({
            where: { id, userId },
        });

        if (!transactionExists) {
            throw new Error("Transação não encontrada");
        }

        return prisma.transaction.update({
            where: { id, userId },
            data: {
                ...data,
            },
            include: {
                category: true,
                user: true,
            },
        })
    }
}