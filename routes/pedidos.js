import express from "express";
import gerarCodigoPix from "../services/gerarPix.js";
import prisma from "../bd.js";
import { verificarAdmin } from "../middleware/auth.js";


const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const pedido = req.body;

        if (!pedido || !pedido.total || !pedido.telefone || !pedido.modoEntrega) {
            return res.status(400).json({ erro: "Pedido inválido ou incompleto" });
        }

        const codigoPix = gerarCodigoPix(pedido.total);

        const novoPedido = await prisma.pedido.create({
            data: {
                nome: pedido.nome || null,
                telefone: pedido.telefone,
                itens: pedido.itens || [],
                total: pedido.total,
                valorEntrega: pedido.valorEntrega || 0,
                modoEntrega: pedido.modoEntrega,
                endereco: pedido.modoEntrega === "delivery" ? pedido.endereco || null : null,
                codigoPix,
                status: "recebido",
            },
        });

        return res.status(200).json({
            mensagem: "Pedido recebido e salvo com sucesso!",
            codigoPix: codigoPix,
            pedido: novoPedido
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao processar pedido" });
    }
});

router.get("/", verificarAdmin, async (req, res) => {
    try {
        const pedidos = await prisma.pedido.findMany({
            orderBy: { criadoEm: "desc" },
        });
        return res.status(200).json(pedidos);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao buscar pedidos" });
    }
});

router.patch("/:id/finalizar", verificarAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const pedidoAtualizado = await prisma.pedido.update({
            where: { id: Number(id) },
            data: { finalizado: true },
        });
        return res.status(200).json(pedidoAtualizado);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao atualizar pedido" });
    }
});

export default router;
