import pool from "../Config/db";
import {Transacao} from '../models/transacao.model';

export class TransacaoRepository {
    async cadastrarTransacao(dados: Transacao): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const sqlInsertTransacao = `
                INSERT INTO transacoes (perfil_id, categoria_id, data_transacao, tipo, valor, descricao, num_parcelas)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
            `;

            await client.query(sqlInsertTransacao, [
                dados.perfil_id,
                dados.categoria_id,
                dados.data_transacao,
                dados.tipo,
                dados.valor,
                dados.descricao,
                dados.num_parcelas
            ]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async listarTodas(id: number): Promise<any[]> {

        if (!id || isNaN(id)) {
            throw new Error("ID de perfil inválido para busca.");
        }

        const sql = `
            SELECT t.id, t.data_transacao, c.nome as categoria_nome, t.descricao, t.tipo, t.valor
            FROM transacoes t
                     LEFT JOIN categorias c ON t.categoria_id = c.id
            WHERE t.perfil_id = $1
            ORDER BY t.data_transacao DESC;
        `;
        const resultado = await pool.query(sql, [id]);
        return resultado.rows;
    }

    async updateTransacao(id: number, dados: any): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const sqlUpdateTransacao = `
                UPDATE transacoes
                SET data_transacao = $1,
                    descricao      = $2,
                    categoria_id   = $3,
                    tipo           = $4,
                    valor          = $5
                WHERE id = $6
            `;

            await client.query(sqlUpdateTransacao, [
                dados.data_transacao,
                dados.descricao,
                dados.categoria_id,
                dados.tipo,
                dados.valor,
                id
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

    async deleteTransacao(id: number): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const sqlDeleteTransacao = `
                DELETE
                FROM transacoes
                WHERE id = $1;`

            await client.query(sqlDeleteTransacao, [id]);

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
            SELECT id, data_transacao, categoria_id, descricao, tipo, valor, num_parcelas
            FROM transacoes
            WHERE id = $1;
        `;
        const resultado = await pool.query(sql, [id]);
        return resultado.rows[0];
    }

}