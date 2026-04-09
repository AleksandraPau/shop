import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { protect } from "../middleware/authMiddleware"; // Проверь путь к мидлвару!
import { error } from "node:console";

const router = Router();
const prisma = new PrismaClient();

// ДОБАВИТЬ ТОВАР: POST http://localhost:3000/api/cart/add
router.post("/add", protect, async (req: any, res: any) => {
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity || 1);
    const userId = Number(req.user?.userId); // Берем ID из токена (безопасно)

    if (!productId || isNaN(productId)) {
        return res.status(400).json({ error: " Некорректный ID товара"});
    }

    try {
        const cart = await prisma.cart.upsert({
            where: { userId },
            update: {},
            create: { userId }
        });

        const cartItem = await prisma.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId
                }
            },
            update: { quantity: { increment: quantity } },
            create: { cartId: cart.id, productId, quantity }
        });

        res.status(200).json({ message: "Товар добавлен", cartItem });
    } catch (error) {
        console.error("PRISMA ERROR:", error);
        res.status(500).json({ error: "Ошибка при работе с корзиной" });
    }
});

// ПОЛУЧИТЬ КОРЗИНУ: GET http://localhost:3000/api/cart
router.get("/", protect, async (req: any, res: any) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.userId },
            include: {
                items: {
                    include: { product: true } // Подтягиваем инфу о товаре
                }
            }
        });
        res.json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ error: "Не удалось загрузить корзину" });
    }
});

// оформить заказ
router.post("/checkout", protect, async (req: any, res: any) => {
    const userId = Number(req.user.userId);

    try {
        const cart = await prisma.cart.findUnique({where: {userId}});

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
        }

        res.status(200).json({ message: "Order successfully issued", orderId: Math.floor(Math.random() * 10000)});
    } catch (error) {
        res.status(500).json({ error: "Error of order issue"})
    }
})

router.delete("/clear", protect, async (req: any, res: any) => {
    const userId = Number(req.user.userId);

    try {
        const cart = await prisma.cart.findUnique({ where: { userId} });

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
        }

        res.status(200).json({ message: "Cart is clear"});
    } catch (error) {
        res.status(500).json({ error: "Не удалось очистить корзину"});
    }
});

export default router;
