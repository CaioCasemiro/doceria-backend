import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
    const { user, password } = req.body || {};

    if (!user || !password) {
        return res.status(400).json({ erro: "Usuário e senha são obrigatórios" });
    }

    const expectedUser = process.env.ADMIN_USER;
    const expectedPass = process.env.ADMIN_PASS;

    if (user === expectedUser && password === expectedPass) {
        const token = jwt.sign(
            { user },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.status(200).json({
            ok: true,
            token,
            mensagem: "Login bem-sucedido"
        });
    }

    return res.status(401).json({ erro: "Credenciais inválidas" });
});

export default router;
