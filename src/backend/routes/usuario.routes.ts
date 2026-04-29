import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';

const router = Router();
const usuarioController = new UsuarioController();

router.post('/usuarios', usuarioController.criar);

router.get('/usuarios', usuarioController.listarTodos);

router.put('/usuarios/:id/acesso', usuarioController.atualizarAcesso);

router.get('/usuarios/:id', usuarioController.buscarPorId);

router.put('/usuarios/:id/perfil', usuarioController.atualizarPerfil);

router.put('/usuarios/:id/delete', usuarioController.deleteUsuario);

router.post('/login', usuarioController.login);

export default router;