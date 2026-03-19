import express, {type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./api/auth";
import productsRouter from "./api/products"

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRouter);

app.use("/api/products", productsRouter);

app.get("/", (req, res) => {
    res.status(200).json({ status: "ok!!!!!!"});
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});