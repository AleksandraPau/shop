import express, {type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

import authRouter from "./api/auth";
import cartRoutes from "./api/cart";
import productsRouter from "./api/products";
import { id } from "effect/Fiber";

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
    console.log("Клиент подключился к чату", socket.id);

    socket.on("send_message", (data) => {
        console.log("Сообщение от юзера:", data.text);

        io.emit("receive_message", {
            id: Date.now(),
            text: `Поддержка получила: "${data.text}". Ожидайте ответа.`,
            isMe: false,
            // userId: data.userId
        });
    });

    socket.on("disconnect", () => {
        console.log("Клиент отключился");
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});