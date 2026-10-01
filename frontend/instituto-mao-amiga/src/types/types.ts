export type Ponto = {
    id: number;
    nome: string;
    endereco: string;
    diasHorarios: string;
    funcionamento: string;
};

export type Doacao = {
    id: number;
    tipoItem: string;
    qtdItem: number;
    pontoSelecionado: Ponto;
    criadoEm: string;
};

export type RootStackParamList = {
    TelaListaPontos: undefined;
    TelaDetalhePonto: { pontoId: number };
    TelaFormularioDoacao: undefined;
};