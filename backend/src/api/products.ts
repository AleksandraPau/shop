import express from "express";
import { prisma } from "../db";

const router = express.Router();

// GET /api/products - Список всех товаров
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' }
    });
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(500).json({ error: "Не удалось загрузить товары" });
  }
});

// GET /api/products/:id - Детальная информация о товаре
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  // Проверка: является ли ID числом, чтобы Prisma не выдала ошибку
  if (isNaN(Number(id))) {
    return res.status(400).json({ error: "Неверный формат ID" });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!product) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(500).json({ error: "Ошибка сервера при поиске товара" });
  }
});

export default router;
