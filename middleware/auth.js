
export function verificarAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: "Não autorizado: token ausente" });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ erro: "Não autorizado: token inválido" });
    }

    next();
}
