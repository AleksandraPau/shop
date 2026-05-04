import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';
import { error } from 'node:console';

interface JwtPayload {
    userId: number;
}

export interface AuthRequest extends Request {
    user?: {
        userId: number;
    };
}

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({error:"Не авторизован, токен отсутствует"});
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

        const userExist = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true}
        });

        if (!userExist) {
            return res.status(401).json({ error: "Пользователь больше не существует"});
        }

        req.user = {userId: decoded.userId};

        next();
    } catch (err) {
        res.status(401).json({ error: "token is wrong!!!"});
    }
};