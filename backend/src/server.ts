import express, {type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

import authRouter from "./api/auth";
import cartRoutes from "./api/cart";
import productsRouter from "./api/products";
import { id } from "effect/Fiber";
import prisma from "./db";
import { disconnect } from "cluster";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ status: "ok!!!!!!"});
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true
    }
});

io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    console.log(`User ${userId} connected to chat`);

    socket.on("get_history", async () => {
        try {
            const history = await prisma.chatMessage.findMany({
                where: { userId },
                orderBy: { createdAt: 'asc' } 
            });
            socket.emit("chat_history", history);
        } catch (e) {
            console.error("History loading error:", e);
        }
    });


    socket.on("client_message", async (data) => {
        if (isNaN(userId)) return;

        try {
            const savedMsg = await prisma.chatMessage.create({
                data: {
                    text: data.text,
                    isMe: true,
                    userId: Number(userId)
                }
            });
            socket.emit("server_message", savedMsg);

            const supportMsg = await prisma.chatMessage.create({
                data: {
                    text: "Thank you! We'll be back soon with answer!",
                    isMe: false,
                    userId: Number(userId)
                }
            });
            socket.emit("server_message", supportMsg);
        } catch (e) {
            console.error("Error to saving chat:", e);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User ${userId} diconnected`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});