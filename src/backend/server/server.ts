import express from 'express';
import cors from 'cors';
import usuarioRoutes from '../routes/usuario.routes';
import transacaoRoutes from '../routes/transacao.routes';
import categoriaRoutes from "../routes/categoria.routes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', usuarioRoutes);
app.use('/api', transacaoRoutes);
app.use('/api', categoriaRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Rotas disponíveis: http://localhost:${PORT}/api/usuarios`);
});