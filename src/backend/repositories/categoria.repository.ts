import pool from '../Config/db';

export class CategoriaRepository {
    async listarTodas(): Promise<any[]> {
        const sql = `SELECT id, nome, tipo FROM categorias ORDER BY nome ASC`;
        const resultado = await pool.query(sql);
        return resultado.rows;
    }
}