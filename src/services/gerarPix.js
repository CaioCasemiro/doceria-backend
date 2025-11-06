import { createStaticPix } from "pix-utils";


export default function gerarCodigoPix(Valor) {
    const merchantName = process.env.NOME_EMPRESA;
    const merchantCity = process.env.CIDADE;
    const pixKey = process.env.CHAVE_PIX;

    if (!merchantName || !merchantCity || !pixKey) {
        throw new Error("Variáveis de ambiente do PIX não estão definidas!");
    }

    if (!Valor || typeof Valor !== "number") {
        throw new Error("Valor inválido para gerar PIX: " + Valor);
    }

    if (Valor == null) {
        throw new Error("O valor do PIX não pode ser nulo ou undefined!");
    }


    const codigo = createStaticPix({
        merchantName,
        merchantCity,
        pixKey,
        transactionAmount: Valor,
    })

    return codigo.toBRCode();
}

