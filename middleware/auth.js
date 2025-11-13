import jwt from "jsonwebtoken";

export function verificarAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: "Não autorizado: token ausente" });
    }

    const token = authHeader.split(" ")[1];

    try {
        console.log("🔑 JWT_SECRET usado:", process.env.JWT_SECRET || "(undefined)");
        console.log("🪪 Token recebido:", token);

        const dados = jwt.verify(token, process.env.JWT_SECRET);

        console.log("✅ Token válido! Payload decodificado:", dados);

        req.admin = dados;
        next();
    } catch (e) {
        console.error("❌ Erro JWT:", e.name, "-", e.message);
        return res.status(401).json({ erro: "Não autorizado: token inválido" });
    }
}
