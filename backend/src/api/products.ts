import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        console.log("error receiving goods", error);
        res.status(500).json({error: "Server error loading items"});
    }
});

export default router;