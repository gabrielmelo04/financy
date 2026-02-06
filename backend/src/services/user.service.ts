import { CreateUserInput } from "../dtos/input/user.input.js";
import { prisma } from "../../lib/prisma.js";
import { hashPassword } from "../utils/hash.js";

export class UserService {

    async getUsers() {
        return prisma.user.findMany();
    }

    async createUser(data: CreateUserInput) {
        const userExists = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (userExists) {
            throw new Error("Usuário com este email já existe");
        }

        const password_hash = await hashPassword(data.password);

        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: password_hash,
            },
        });
    }

    async findUser(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        return user;
    }

    async listUsers() {
        return prisma.user.findMany();
    }

    async updateUser(id: string, name: string) {
        return prisma.user.update({
            where: { id },
            data: { name },
        });
    }
}
