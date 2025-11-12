import express from "express";
import cors from "cors";
import 'dotenv/config'
import pedidosRouter from "./routes/pedidos.js";
import adminRouter from "./routes/admin.js";

const app = express();

const origensPermitidas = [
  "https://adocicadadoceria.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origensPermitidas.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origem não permitida pelo CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json()); 

app.use("/pedidos", pedidosRouter);
app.use("/admin", adminRouter);

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
