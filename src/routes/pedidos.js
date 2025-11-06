import express from "express";
import gerarCodigoPix from "../services/gerarPix.js"

const router = express.Router()

router.post("/", async (req, res) => {
    try {
        const pedido = req.body


        if (!pedido || !pedido.total) {
            return res.status(400).json({ erro: "Pedido inválido" })
        }

        console.log("total do pedido: ", pedido.total)

        if (!pedido.total) {
            return res.status(400).json({ erro: "Total do pedido não definido" });
        }

        const codigoPix = gerarCodigoPix(pedido.total)
        console.log("pedido recebido: ", pedido, "\nCódigo pix gerado: ", codigoPix)

        return res.status(200).json({
            messagem: "Pedido recebido com sucesso",
            codigoPix
        })
    } catch (erro) {
        console.error(erro)
        return res.status(500).json({ erro: "Erro ao processar pedido" })
    }
})

export default router