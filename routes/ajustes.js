import express from "express";
import prisma from "../bd.js";
import { verificarAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/estoque", async (req, res) => {
    try {
        const doces = await prisma.doce.findMany({
            orderBy: { id: "asc" },
            select: {
                id: true,
                nome: true,
                imagem: true,
                quantidadeDisponivel: true,
                preco: true,
                categoria: true,
                isDestaque: true,
            },
        });
        return res.status(200).json(doces);
    } catch (erro) {
        console.error("Erro ao buscar estoque:", erro);
        return res.status(500).json({ erro: "Erro ao buscar estoque" });
    }
});

router.post("/estoque", verificarAdmin, async (req, res) => {
    try {
        const {
            nome,
            imagem,
            quantidadeDisponivel = 0,
            preco = 0,
            categoria = null,
            isDestaque = false,
        } = req.body || {};

        if (!nome || !nome.trim()) {
            return res.status(400).json({ erro: "Nome do doce é obrigatório" });
        }

        if (isDestaque) {
            const totalDestaques = await prisma.doce.count({
                where: { isDestaque: true },
            });
            if (totalDestaques >= 5) {
                return res.status(400).json({ erro: "Limite de 5 destaques atingido" });
            }
        }

        const novoDoce = await prisma.doce.create({
            data: {
                nome: nome.trim(),
                imagem: imagem || "",
                quantidadeDisponivel: Number(quantidadeDisponivel),
                preco: Number(preco),
                categoria,
                isDestaque: Boolean(isDestaque),
            },
        });

        return res.status(201).json(novoDoce);
    } catch (erro) {
        console.error("Erro ao criar doce:", erro);
        return res.status(500).json({ erro: "Erro ao criar doce" });
    }
});

router.put("/estoque/:id", verificarAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, imagem, quantidadeDisponivel, preco, categoria, isDestaque } = req.body || {};

        const doceExistente = await prisma.doce.findUnique({
            where: { id: Number(id) },
        });
        if (!doceExistente) {
            return res.status(404).json({ erro: "Doce não encontrado" });
        }

        const dadosAtualizacao = {};
        if (nome !== undefined) dadosAtualizacao.nome = nome.trim();
        if (imagem !== undefined) dadosAtualizacao.imagem = imagem;
        if (quantidadeDisponivel !== undefined)
            dadosAtualizacao.quantidadeDisponivel = Number(quantidadeDisponivel);
        if (preco !== undefined) dadosAtualizacao.preco = Number(preco);
        if (categoria !== undefined) dadosAtualizacao.categoria = categoria;
        if (isDestaque !== undefined) dadosAtualizacao.isDestaque = Boolean(isDestaque);

        if (isDestaque) {
            const totalDestaques = await prisma.doce.count({
                where: { isDestaque: true, NOT: { id: Number(id) } },
            });
            if (totalDestaques >= 5) {
                return res.status(400).json({ erro: "Limite de 5 destaques atingido" });
            }
        }

        const doceAtualizado = await prisma.doce.update({
            where: { id: Number(id) },
            data: dadosAtualizacao,
        });

        return res.status(200).json(doceAtualizado);
    } catch (erro) {
        console.error("Erro ao atualizar doce:", erro);
        return res.status(500).json({ erro: "Erro ao atualizar doce" });
    }
});

router.delete("/estoque/:id", verificarAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const doceExistente = await prisma.doce.findUnique({
            where: { id: Number(id) },
        });
        if (!doceExistente) {
            return res.status(404).json({ erro: "Doce não encontrado" });
        }

        await prisma.doce.delete({ where: { id: Number(id) } });
        return res.status(200).json({ mensagem: "Doce removido com sucesso" });
    } catch (erro) {
        console.error("Erro ao remover doce:", erro);
        return res.status(500).json({ erro: "Erro ao remover doce" });
    }
});

export default router;
