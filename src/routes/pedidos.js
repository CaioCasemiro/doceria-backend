import express from "express";
import gerarCodigoPix from "../services/gerarPix.js";
import prisma from "../bd.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const pedido = req.body;

        if (!pedido || !pedido.total) {
            return res.status(400).json({ erro: "Pedido inválido" });
        }

        console.log("total do pedido: ", pedido.total);

        const codigoPix = gerarCodigoPix(pedido.total);

        const novoPedido = await prisma.pedido.create({
            data: {
                nome: pedido.nome || null,
                itens: pedido.itens || [],
                total: pedido.total,
                codigoPix,
                status: "recebido",
            },
        });

        console.log("pedido salvo no banco:", novoPedido);

        return res.status(200).json({
            mensagem: "Pedido recebido e salvo com sucesso!",
            codigoPix,
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao processar pedido" });
    }
});

export default router;
