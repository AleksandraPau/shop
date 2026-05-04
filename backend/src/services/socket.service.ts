import { Server, Socket } from 'socket.io';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

export const initSocket = (io: Server) => {
    io.use(async (socket, next) => {
        try {
            const rawCookies = socket.handshake.headers.cookie;
            if (!rawCookies) {
                return next(new Error('Authentication error: No cookies found'));
            }

            const cookies = cookie.parse(rawCookies);
            const token = cookies.token;

            if (!token) {
                return next(new Error('Authentication error: Token missing'));
            }

            const decoded = jwt.verify(token, SECRET_KEY) as { userId: number };
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            (socket as any).userId = user.id;
            next();
        } catch (err) {
            console.error("Socket Auth Error:", err);
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on("connection", (socket: Socket) => {
        const userId = (socket as any).userId;
        socket.join(`user_${userId}`);
        console.log(`User ${userId} connected`);

        socket.on("get_history", async () => {
            const history = await prisma.chatMessage.findMany({
                where: { userId },
                orderBy: { createdAt: 'asc' } 
            });
            socket.emit("chat_history", history);
        });

        socket.on("client_message", async (data: { text: string }) => {
            try {
                const savedMsg = await prisma.chatMessage.create({
                    data: { text: data.text, isMe: true, userId }
                });
                
                io.to(`user_${userId}`).emit("server_message", savedMsg);

                setTimeout(async () => {
                    const supportMsg = await prisma.chatMessage.create({
                        data: {
                            text: "Thank you! We'll be back soon!",
                            isMe: false,
                            userId
                        }
                    });
                    io.to(`user_${userId}`).emit("server_message", supportMsg);
                }, 1000);
            } catch (e) {
                console.error("Error saving message:", e);
            }
        });

        socket.on("disconnect", () => {
            console.log(`User ${userId} disconnected`);
        });
    });
};
