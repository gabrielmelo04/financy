import { Arg, Mutation, Resolver } from "type-graphql";
import { AuthService } from "../services/auth.service.js";
import { LoginOutput, RegisterOutput } from "../dtos/output/auth.output.js";
import { LoginInput } from "../dtos/input/auth.input.js";
import { CreateUserInput } from "../dtos/input/user.input.js";



@Resolver()
export class AuthResolver { 
    private authService = new AuthService();

    @Mutation(() => LoginOutput)

    async login(
        @Arg('data', () => LoginInput) data: LoginInput,
    ): Promise<LoginOutput> {
        return this.authService.login(data);
    }

    @Mutation(() => RegisterOutput)
    async register(
        @Arg('data', () => CreateUserInput) data: CreateUserInput,
    ): Promise<RegisterOutput> {
        return this.authService.register(data);
    }
}