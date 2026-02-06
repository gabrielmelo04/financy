import { ListCategoryOutput } from '../dtos/output/category.output.js';
import { Arg, Mutation, Query, Resolver, Ctx, UseMiddleware } from "type-graphql";
import { CategoryModel } from "../models/category.model.js";
import { CategoryService } from "../services/category.service.js";
import { CreateCategoryInput, UpdateCategoryInput } from "../dtos/input/category.input.js";
import { UserContext } from '../graphql/context/index.js';
import { IsAuth } from '../middlewares/auth.middleware.js';

    
@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)

export class CategoryResolver {
    private categoryService = new CategoryService();
    @Query(() => [CategoryModel])
    async listCategories(@Ctx() context: UserContext) {
        if (!context.user) {
            throw new Error("Unauthorized");
        }
        return this.categoryService.listCategories(context.user.id);
    }

    @Mutation(() => CategoryModel)
    async createCategory(
        @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput,
        @Ctx() context: UserContext,
    ) {
        if (!context.user) {
            throw new Error("Unauthorized");
        }
        return this.categoryService.createCategory(data, context.user.id);
    }

    @Mutation(() => CategoryModel)
    async updateCategory(
        @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput,
        @Arg('id', () => String) id: string,
        @Ctx() context: UserContext,
    ) {
        return this.categoryService.updateCategory(data, id, context.user?.id || '');
    }

    @Mutation(() => Boolean)
    async deleteCategory(
        @Arg('id', () => String) id: string,
        @Ctx() context: UserContext,
    ) {
        await this.categoryService.deleteCategory(id, context.user?.id || '');
        return true;
    }
}