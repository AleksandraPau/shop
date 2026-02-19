import express from "express";
import bcrypt from "bcrypt";
import { hashPass } from "../utilits/hashPass";
import prisma from "../db";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: "Email/username or password required" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier}
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid login" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password"});
    }

    console.log(`User logged in: ${user.username}`);
    return res.status(200).json({ message: "success", username: user.username });

  } catch (e) {
    console.log("Login error:", e);
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

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      },
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
