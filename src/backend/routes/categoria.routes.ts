import { Router } from 'express';
import { CategoriaController } from '../controllers/categoria.controller';

const router = Router();
const categoriaController = new CategoriaController();

router.get('/categorias', categoriaController.listarCategorias);

export default router;