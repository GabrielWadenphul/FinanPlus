import { Request, Response } from 'express';
import { CategoriaRepository } from '../repositories/categoria.repository';

const categoriaRepository = new CategoriaRepository();

export class CategoriaController {
    listarCategorias = async (req: Request, res: Response): Promise<void> => {
        try {
            const categorias = await categoriaRepository.listarTodas();
            res.status(200).json(categorias);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    };
}