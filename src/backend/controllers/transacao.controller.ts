import { Request, Response } from 'express';
import {TransacaoRepository} from '../repositories/transacao.repository';

const transacaoRepo = new TransacaoRepository();

export class TransacaoController {

    criarTransacao = async (req: Request, res: Response): Promise<void> => {
        try {
            const dadosDoFront = req.body;
            await transacaoRepo.cadastrarTransacao(dadosDoFront);
            res.status(201).json({mensagem: "Transação cadastrada com sucesso!"});
        } catch (error) {
            console.error("Erro no Controller ao criar transação:", error);
            res.status(500).json({mensagem: "Erro interno ao criar transação."});
        }
    }

    listarTodas = async (req: Request, res: Response): Promise<void> => {
        try {
            const { perfil_id } = req.query;

            const idNumero = parseInt(perfil_id as string);

            const transacoes = await transacaoRepo.listarTodas(idNumero);

            res.status(200).json(transacoes);

        } catch (error) {
            console.error("Erro ao buscar transações:", error);
            res.status(500).json({mensagem: "Erro ao listar transações."});
        }
    }

    updateTransacao = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10);
            const dadosDoFront = req.body;

            await transacaoRepo.updateTransacao(id, dadosDoFront);

            res.status(200).json({mensagem: "Transação atualizada com sucesso!"});
        } catch (error) {
            console.error("Erro no Controller ao atualizar:", error);
            res.status(500).json({mensagem: "Erro interno ao atualizar transação."});
        }
    }

    deleteTransacao = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10);

            await transacaoRepo.deleteTransacao(id);

            res.status(200).json({mensagem: "Transação excluída com sucesso!"});
        } catch (error) {
            console.error("Erro no Controller ao excluir:", error);
            res.status(500).json({mensagem: "Erro interno ao excluir transação."});
        }
    }

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10);
            const transacao = await transacaoRepo.buscarPorId(id);
            if (transacao) {
                res.status(200).json(transacao);
            } else {
                res.status(404).json({ mensagem: "Transação não encontrada" });
            }
        } catch (error) {
            res.status(500).json({ mensagem: "Erro ao buscar transação" });
        }
    }

}