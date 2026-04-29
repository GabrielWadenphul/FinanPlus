import { Router } from 'express';
import { TransacaoController } from '../controllers/transacao.controller';

const router = Router();
const transacaoController = new TransacaoController();

router.post('/transacoes', transacaoController.criarTransacao);

router.get('/transacoes', transacaoController.listarTodas);

router.get('/transacoes/:id', transacaoController.buscarPorId);

router.put('/transacoes/:id', transacaoController.updateTransacao);

router.delete('/transacoes/:id', transacaoController.deleteTransacao);

export default router;