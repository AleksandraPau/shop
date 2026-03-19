import express from "express";
import prisma from "../db";

const router = express.Router();

router.get("/", async (res, req) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.statusCode(500).json({ error: "Error of getting products"});
    }
});

export default router;