-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "nome" TEXT,
    "telefone" TEXT NOT NULL,
    "itens" JSONB NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "valorEntrega" DOUBLE PRECISION,
    "modoEntrega" TEXT NOT NULL,
    "endereco" JSONB,
    "codigoPix" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "finalizado" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);
