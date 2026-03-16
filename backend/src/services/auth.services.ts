import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db";
import { hashPass } from "../utilits/hashPass";

const SECRET_KEY =  process.env.JWT_SECRET || "default_secret_for_dev"

export const AuthService = {
    async findUserById(id: number) {
        return prisma.user.findFirst({
            where: {id},
            select: {id: true, username: true, email: true, role: true }
        });
    },

    async login(identifier: string, pass: string) {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: identifier},
                    {username: identifier}
                ]
            }
        });

        if (!user) throw new Error("Invalid login");

        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) throw new Error("Invalid password");

        const token = jwt.sign(
            {userId: user.id, role: user.role || "USER" },
            SECRET_KEY,
            {expiresIn: "1d"}
        );

        return {token, username: user.username};
    },

    async register(username: string, email: string, pass: string) {
        const existing = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }]}
        });

        if (existing) throw new Error("User already exists");

        const hashed = await hashPass(pass);
        return prisma.user.create({
            data: { username, email, password: hashed }
        });
    }
};