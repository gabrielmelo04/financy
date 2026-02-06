import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { UserModel } from "../models/user.model.js";
import { UserService } from "../services/user.service.js";
import { CreateUserInput } from "../dtos/input/user.input.js";
import { UserContext } from "../graphql/context/index.js";


@Resolver(() => UserModel)


export class UserResolver {
    private userService = new UserService();

    @Query(() => [UserModel])
    async getUsers() {
        return this.userService.getUsers();
    }

    @Mutation(() => UserModel)

    async createUser(
        @Arg('data', () => CreateUserInput) data: CreateUserInput,
    ) {
        return this.userService.createUser(data);
    }

    @Mutation(() => UserModel)
    async updateUser(@Ctx() context: UserContext, @Arg('name', () => String) name: string) {
        return this.userService.updateUser(context.user?.id || '', name);
    }
}