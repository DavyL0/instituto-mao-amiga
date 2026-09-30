export type Ponto = {
    id: number;
    nome: string;
    endereco: string;
    diasHorarios: string;
    funcionamento: string;
};

export type Doacao = {
    nomeItem: string;
    qtdItem: string;
    pontoSelecionado: Ponto;
};