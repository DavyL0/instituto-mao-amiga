export type TipoPonto = 'coleta' | 'distribuição';

export type Ponto = {
    id: number;
    nome: string;
    endereco: string;
    bairro?: string;
    horario?: string;
    tipo?: TipoPonto | string;
    diasHorarios?: string;
    funcionamento?: string;
};

export type PontoFormData = {
    nome: string;
    endereco: string;
    bairro: string;
    horario: string;
    tipo: TipoPonto | string;
};

export type Doacao = {
    id: number;
    tipoItem: TipoItem;
    qtdItem: number;
    pontoSelecionado: Ponto;
    criadoEm: string;
};

export type RootStackParamList = {
    TelaListaPontos: undefined;
    TelaDoacoes: undefined;
    TelaDetalhePonto: { pontoId: number };
    TelaDetalheDoacao: { doacaoId: number };
    TelaFormularioDoacao: { doacaoId?: number } | undefined;
    TelaFormularioPonto: { pontoId?: number } | undefined;
};

export enum TipoItem {
    Roupas = 'Roupas',
    Alimentos = 'Alimentos',
    Brinquedos = 'Brinquedos',
    Outros = 'Outros',
}