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

        const data = {
            nome: pedido.nome || null,
            telefone: pedido.telefone,
            itens: pedido.itens || [],
            total: pedido.total,
            valorEntrega: pedido.valorEntrega || 0,
            modoEntrega: pedido.modoEntrega,
            endereco:
                pedido.modoEntrega === "delivery"
                    ? pedido.endereco || null
                    : null,
            codigoPix,
            status: "recebido",
        };

        console.log("REQ BODY:");
        console.log(JSON.stringify(req.body, null, 2));

        console.log("DATA:");
        console.log(JSON.stringify(data, null, 2));

        const novoPedido = await prisma.pedido.create({
            data,
        });

        return res.status(200).json({
            mensagem: "Pedido recebido e salvo com sucesso!",
            codigoPix,
            pedido: novoPedido,
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

// Cliente consulta seus próprios pedidos pelo telefone (rota pública, sem login)
router.get("/consulta", async (req, res) => {
    const { telefone } = req.query;

    if (!telefone) {
        return res.status(400).json({ erro: "Informe o telefone para consultar" });
    }

    try {
        const pedidos = await prisma.pedido.findMany({
            where: { telefone: String(telefone) },
            orderBy: { criadoEm: "desc" },
            take: 10, // últimos 10 pedidos, evita retornar histórico gigante
        });

        return res.status(200).json(pedidos);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao consultar pedidos" });
    }
});

// Admin atualiza o status do pedido (recebido -> em_preparo -> pronto -> entregue)
router.patch("/:id/status", verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const statusValidos = ["recebido", "em_preparo", "pronto", "entregue"];
    if (!status || !statusValidos.includes(status)) {
        return res.status(400).json({ erro: "Status inválido" });
    }

    try {
        const pedidoAtualizado = await prisma.pedido.update({
            where: { id: Number(id) },
            data: {
                status,
                finalizado: status === "entregue",
            },
        });

        return res.status(200).json(pedidoAtualizado);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao atualizar status do pedido" });
    }
});

export default router;