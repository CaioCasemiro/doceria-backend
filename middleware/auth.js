import jwt from "jsonwebtoken";

export function verificarAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: "Não autorizado: token ausente" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const dados = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = dados;
        next();
    } catch (e) {
        return res.status(401).json({ erro: "Não autorizado: token inválido" });
    }
}
