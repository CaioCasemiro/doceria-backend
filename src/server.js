import express from "express";
import cors from "cors";
import pedidosRouter from "./routes/pedidos.js";

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use("/pedidos", pedidosRouter);

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
