import express from "express";
import { hashPass} from "../utilits/hashPass";
import { pool } from "../db"

const router = express.Router();

router.post("/login", async function (req, res) {
     try{
        const { email, password } = req.body;
        if (!email || !password) throw new Error("Email oe password error1");
        console.log(email, password);

        return res.status(200).json({ text: "success "});
    } catch (e) {
        //console.log(e);

        return res.status(400).json({error: e});
    }
});
router.post("/logout", async function (parns) {});

router.post("/registration", async function (req, res) {
    try{
        const { login: username, email, password } = req.body;
        if (!email || !password || !username)
          throw new Error("Email or password error1");
        console.log(email, password);
        if (email) {
        }//есть ли такой пользователь в бд
        const hashedPass = await hashPass(password);
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPass],
    );
    return res.status(200).json({ text: newUser.rows[0]});
    } catch (e) {
        //console.log(e);

        return res.status(400).json({error: e});
    }
});

export default router;