export interface Transacao {
    id?: number;
    perfil_id: number;
    categoria_id: number;
    tipo: 'RECEITA' | 'DESPESA';
    valor: number;
    data_transacao: string | Date;
    descricao: string;
    tag_extra : string;
    conciliada : boolean;
    num_parcelas : number;
}