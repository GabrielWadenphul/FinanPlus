import pool from '../Config/db';
import {Usuario} from '../models/usuario.model';

export class UsuarioRepository {

    async autenticar(nome_usuario: string, senha_hash: string): Promise<Usuario | null> {
        const sql = `
            SELECT *
            FROM usuarios
            WHERE nome_usuario = $1
              AND senha_hash = $2
              AND ativo = true
        `;
        const resultado = await pool.query(sql, [nome_usuario, senha_hash]);

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }

    async cadastrarCompleto(dados: any): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const sqlUsuario = `
                INSERT INTO usuarios (nome_usuario, email, senha_hash, ativo)
                VALUES ($1, $2, $3, $4) RETURNING id;
            `;
            const resUsuario = await client.query(sqlUsuario, [
                dados.nome_usuario,
                dados.email,
                dados.senha,
                true
            ]);

            const novoUsuarioId = resUsuario.rows[0].id;

            const sqlPerfil = `
                INSERT INTO perfis (usuario_id, nome_completo, documento, ocupacao, data_nascimento, tipo_perfil)
                VALUES ($1, $2, $3, $4, $5, $6);
            `;
            await client.query(sqlPerfil, [
                novoUsuarioId,
                dados.nome_completo,
                dados.documento,
                dados.ocupacao,
                dados.data_nascimento,
                dados.tipo_perfil
            ]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Erro no Banco de Dados:", error);
            throw error;
        } finally {
            client.release();
        }
    }

    async updatePerfil(usuario_id: number, dados: any): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const sqlUpdatePerfil = `
                UPDATE perfis
                SET nome_completo   = $1,
                    ocupacao        = $2,
                    data_nascimento = $3,
                    documento       = $4
                WHERE usuario_id = $5
            `;

            await pool.query(sqlUpdatePerfil, [
                dados.nome_completo,
                dados.ocupacao,
                dados.data_nascimento,
                dados.documento,
                usuario_id
            ]);
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Erro no Banco de Dados:", error);
            throw error;
        } finally {
            client.release();
        }
    }

    async updateAcesso(usuario_id: number, dados: any): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const sqlUpdateUsuario = `
                UPDATE usuarios
                SET nome_usuario = $1,
                    senha_hash   = $2
                WHERE id = $3
            `;

            await pool.query(sqlUpdateUsuario, [
                dados.nome_usuario,
                dados.senha_hash,
                usuario_id
            ]);
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Erro no Banco de Dados:", error);
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteUsuario(id: number): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const sqlDeleteUsuario = `
                UPDATE usuarios
                SET ativo = FALSE
                WHERE id = $1;`

            await pool.query(sqlDeleteUsuario, [id]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Erro no Banco de Dados:", error);
            throw error;
        } finally {
            client.release();
        }
    };

    async buscarPorId(id: number): Promise<any> {
        const sql = `
        SELECT p.nome_completo, u.nome_usuario, u.email, p.documento, p.data_nascimento, p.ocupacao
        FROM usuarios u
        JOIN perfis p ON p.usuario_id = u.id
        WHERE u.id = $1 AND u.ativo = true
    `;
        const resultado = await pool.query(sql, [id]);
        return resultado.rows[0];
    }

}