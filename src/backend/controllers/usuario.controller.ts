import {Request, Response} from 'express';
import {UsuarioRepository} from '../repositories/usuario.repository';

const usuarioRepository = new UsuarioRepository();

export class UsuarioController {

    criar = async (req: Request, res: Response): Promise<void> => {
        try {
            const dadosDoFront = req.body;
            await usuarioRepository.cadastrarCompleto(dadosDoFront);
            res.status(201).json({mensagem: "Usuário cadastrado com sucesso!"});
        } catch (error) {
            console.error("Erro no Controller ao criar usuário:", error);
            res.status(500).json({mensagem: "Erro interno ao criar usuário."});
        }
    }

    listarTodos = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).json({mensagem: "A rota de listar todos está funcionando perfeitamente!"});
        } catch (error) {
            res.status(500).json({mensagem: "Erro ao listar usuários."});
        }
    }

    atualizarAcesso = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10);
            const dadosDoFront = req.body;

            await usuarioRepository.updateAcesso(id, dadosDoFront);

            res.status(200).json({mensagem: "Acesso atualizado com sucesso!"});
        } catch (error) {
            console.error("Erro no Controller ao atualizar:", error);
            res.status(500).json({mensagem: "Erro interno ao atualizar acesso."});
        }
    }

    atualizarPerfil = async (req: Request, res: Response): Promise<void> => {
        try {
            const usuario_id = parseInt(req.params.id as string, 10);
            const dadosDoFront = req.body;

            await usuarioRepository.updatePerfil(usuario_id, dadosDoFront);

            res.status(200).json({mensagem: "Perfil atualizado com sucesso!"});
        } catch (error) {
            console.error("Erro no Controller ao atualizar:", error);
            res.status(500).json({mensagem: "Erro interno ao atualizar perfil."});
        }
    }

    deleteUsuario = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10);

            await usuarioRepository.deleteUsuario(id);

            res.status(200).json({mensagem: "Usuário excluído com sucesso!"});
        } catch (error) {
            console.error("Erro no Controller ao excluir:", error);
            res.status(500).json({mensagem: "Erro interno ao excluir usuário."});
        }
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const {nome_usuario, senha} = req.body;

            if (!nome_usuario || !senha) {
                res.status(400).json({mensagem: "Usuário e senha são obrigatórios!"});
                return;
            }

            const usuario = await usuarioRepository.autenticar(nome_usuario, senha);

            if (!usuario) {
                res.status(401).json({mensagem: "Usuário ou senha inválidos, ou conta inativa."});
                return;
            }

            res.status(200).json({
                mensagem: "Login realizado com sucesso!",
                usuarioId: usuario.id,
                perfilId: usuario.perfil_id
            });

        } catch (error) {
            console.error("Erro no Controller ao fazer login:", error);
            res.status(500).json({mensagem: "Erro interno ao processar login."});
        }
    };

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10);
            const usuario = await usuarioRepository.buscarPorId(id);

            if (!usuario) {
                res.status(404).json({mensagem: "Usuário não encontrado."});
                return;
            }

            res.status(200).json(usuario);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            res.status(500).json({mensagem: "Erro interno ao buscar perfil."});
        }
    };

}