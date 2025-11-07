-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "nome" TEXT,
    "telefone" TEXT NOT NULL,
    "itens" JSONB,
    "total" DOUBLE PRECISION NOT NULL,
    "valorEntrega" DOUBLE PRECISION,
    "modoEntrega" TEXT NOT NULL,
    "endereco" JSONB,
    "status" TEXT NOT NULL DEFAULT 'recebido',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);
