import { createStaticPix } from "pix-utils";
import 'dotenv/config'

export default function gerarCodigoPix(Valor) {
    const codigo = createStaticPix({
        merchantName: process.env.NOME_EMPRESA,
        merchantCity: process.env.CIDADE,
        pixKey: process.env.CHAVE_PIX,
        transactionAmount: Valor,
    })

    return codigo.toBRCode()
}

console.log(gerarCodigoPix(2))