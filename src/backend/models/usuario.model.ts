export interface Usuario {
    id?: number;
    nome_usuario: string;
    email: string;
    senha_hash: string;
    ativo: boolean;
    data_criacao?: Date;
}