import express from "express";
import { hashPass } from "../utilits/hashPass";
import prisma from "../db";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email or password required" });
    }
    console.log(email, password);

    return res.status(200).json({ text: "success" });
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", async (req, res) => {
  return res.status(200).json({ message: "Logged out" });
});

router.post("/registration", async (req, res) => {
  try {
    const { login: username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email and password required" });
    }

    console.log(email, password);

    // Проверка существования пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    const hashedPass = await hashPass(password);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPass,
      },
    });

    return res.status(201).json({ text: newUser.username });
  } catch (e) {
    console.error("Registration error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
