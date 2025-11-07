import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
    const { user, password } = req.body || {};

    if (!user || !password) {
        return res.status(400).json({ erro: "user e password são obrigatórios" });
    }

    const expectedUser = process.env.ADMIN_USER;
    const expectedPass = process.env.ADMIN_PASS;

    if (!expectedUser || !expectedPass) {
        console.error("Variáveis de ambiente ADMIN_USER/ADMIN_PASS não definidas");
        return res.status(500).json({ erro: "Configuração de autenticação não disponível" });
    }

    if (user === expectedUser && password === expectedPass) {
        const token = Buffer.from(`${user}:${Date.now()}`).toString("base64");
        return res.status(200).json({ ok: true, token, mensagem: "Login bem-sucedido" });
    }

    return res.status(401).json({ erro: "Credenciais inválidas" });
});

export default router;
