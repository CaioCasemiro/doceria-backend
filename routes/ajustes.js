import express from "express"
import path from "path";
import prisma from path.resolve("bd.js")
import { verificarAdmin } from "../middleware/auth.js"
import fs from "fs";
import path from "path";

const arquivoHorarios = path.resolve("horarios.json");
const router = express.Router()

router.get("/estoque", async (req, res) => {
    try {
        const doces = await prisma.doce.findMany({
            orderBy: { id: "asc" },
            select: {
                id: true,
                nome: true,
                imagem: true,
                quantidadeDisponivel: true,
            }
        })
        return res.status(200).json(doces)
    } catch (erro) {
        console.error("Erro ao buscar estoque: ", erro)
        return res.status(500).json({ erro: "Erro ao buscar estoque" })
    }
})

router.post("/estoque", verificarAdmin, async (req, res) => {
    try {
        const { nome, imagem, quantidadeDisponivel = 0 } = req.body || {};
        if (!nome || !nome.trim()) {
            return res.status(400).json({ erro: "Nome do doce é obrigatório" });
        }

        const novoDoce = await prisma.doce.create({
            data: {
                nome: nome.trim(),
                imagem: imagem || "",
                quantidadeDisponivel: Number(quantidadeDisponivel) || 0,
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
        const { quantidadeDisponivel, nome, imagem } = req.body || {};

        const dadosAtualizacao = {};
        if (quantidadeDisponivel !== undefined) dadosAtualizacao.quantidadeDisponivel = Number(quantidadeDisponivel);
        if (nome !== undefined) dadosAtualizacao.nome = nome;
        if (imagem !== undefined) dadosAtualizacao.imagem = imagem;

        if (Object.keys(dadosAtualizacao).length === 0) {
            return res.status(400).json({ erro: "Nenhum campo para atualizar" });
        }

        const doceExistente = await prisma.doce.findUnique({ where: { id: Number(id) } });
        if (!doceExistente) {
            return res.status(404).json({ erro: "Doce não encontrado" });
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
        const doceExistente = await prisma.doce.findUnique({ where: { id: Number(id) } });
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

router.get("/horarios", (req, res) => {
    if (fs.existsSync(arquivoHorarios)) {
        const data = fs.readFileSync(arquivoHorarios, "utf-8");
        return res.json(JSON.parse(data));
    }
    return res.json({});
});

router.put("/horarios", (req, res) => {
    fs.writeFileSync(arquivoHorarios, JSON.stringify(req.body, null, 2));
    return res.json({ sucesso: true });
});

export default router;