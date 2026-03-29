import express from "express";
import { AuthService } from "../services/auth.services";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const, 
  maxAge: 24 *60 *60 * 1000
};

router.get("/me", protect, async (req: any, res) => {
  try {
    const user = await AuthService.findUserById(req.user.userId);
    res.json(user);
  } catch (e) {
    res.status(401).json({ error: "Not authorized" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const { token, username} = await AuthService.login(identifier, password);

    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(200).json({ message: "success", username });
  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return res.status(200).json({ message: "Logged out" });
});
 
router.post("/registration", async (req, res) => {
  try {
    const { login, email, password } = req.body;
    const user = await AuthService.register(login, email, password);
    res.status(201).json({ text: user.username });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;