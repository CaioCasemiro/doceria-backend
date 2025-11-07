-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "nome" TEXT,
    "itens" JSONB,
    "total" DOUBLE PRECISION NOT NULL,
    "codigoPix" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'recebido',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);
