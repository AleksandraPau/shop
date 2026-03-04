import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { error } from 'node:console';

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({error:"Не авторизован, токен отсутствует"});
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        (res as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "token is wrong!!!"});
    }
};