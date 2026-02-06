import { prisma } from "../../lib/prisma.js";
import { LoginInput } from "../dtos/input/auth.input.js";
import { CreateUserInput } from '../dtos/input/user.input.js';
import { UserModel } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { signJwt } from "../utils/token.js";


export class AuthService {
    async generateToken(user: UserModel) {
        const token = signJwt({
            id: user.id,
            email: user.email,
            name: user.name
        },
        '1h'
        )

        const refreshToken = signJwt(
            {
                id: user.id,
                email: user.email,
                name: user.name
            },
            '1d'
        )

        return { token, refreshToken, user };

    }

    async register(data: CreateUserInput) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if(existingUser) {
            throw new Error('Usuário com este email já existe');
        }

        const hash = await hashPassword(data.password);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hash,
            },
        });

        return this.generateToken(user);
    }



    async login(data: LoginInput) { 

        const userExists = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!userExists) {
            throw new Error("Usuário não encontrado!");
        }

        const compare = await comparePassword(data.password, userExists.password);

        if (!compare) {
            throw new Error("Credenciais inválidas");
        }

        return this.generateToken(userExists);

    }
}