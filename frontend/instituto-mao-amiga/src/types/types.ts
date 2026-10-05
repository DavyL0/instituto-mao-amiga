export type Ponto = {
    id: number;
    nome: string;
    endereco: string;
    diasHorarios: string;
    funcionamento: string;
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
    TelaFormularioDoacao: {doacaoId?: number} | undefined;
};

export enum TipoItem {
    Roupas = 'Roupas',
    Alimentos = 'Alimentos',
    Brinquedos = 'Brinquedos',
    Outros = 'Outros',
}