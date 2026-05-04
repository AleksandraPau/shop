import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import authRouter from "./api/auth";
import cartRoutes from "./api/cart";
import productsRouter from "./api/products";
import { initSocket } from "./services/socket.service";

const PORT = 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// HTTP & Socket Server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});

// Инициализация вынесенной логики сокетов
initSocket(io);

server.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});
