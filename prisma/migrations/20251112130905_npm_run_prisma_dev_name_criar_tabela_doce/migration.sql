-- CreateTable
CREATE TABLE "Doce" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "imagem" TEXT NOT NULL DEFAULT '',
    "quantidadeDisponivel" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Doce_pkey" PRIMARY KEY ("id")
);
