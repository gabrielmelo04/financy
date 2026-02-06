import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { TransactionModel } from "../models/transaction.model.js";
import { IsAuth } from "../middlewares/auth.middleware.js";
import { TransactionService } from "../services/transaction.service.js";
import { CreateTransactionInput, UpdateTransactionInput } from "../dtos/input/transaction.input.js";
import { UserContext } from "../graphql/context/index.js";


@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)

export class TransactionResolver { 

    private transactionService = new TransactionService();

    @Mutation(() => TransactionModel)
    async createTransaction(
        @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput,
        @Ctx() context: UserContext,
    ) {
        if (!context.user) {
            throw new Error("Unauthorized");
        }
        return this.transactionService.createTransaction(data, context.user.id);
    }

    @Mutation(() => Boolean)
    async deleteTransaction(
        @Arg('id', () => String) id: string,
        @Ctx() context: UserContext,
    ) {
        const result = await this.transactionService.deleteTransaction(id, context.user?.id || '');
        return !!result;
    }

    @Mutation(() => TransactionModel)
    async updateTransaction(
        @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput,
        @Arg('id', () => String) id: string,
        @Ctx() context: UserContext) {
        return this.transactionService.updateTransaction(id, context.user?.id || '', data);
    }

    @Query(() => [TransactionModel])
    async listTransactions(@Ctx() context: UserContext) {
        return this.transactionService.listTransactions(context.user?.id || '');
    }
    
}