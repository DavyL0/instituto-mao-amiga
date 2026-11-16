-- H2: execute somente em bancos que já possuem tb_doacao.ponto_destino (texto).
-- Faça backup do banco e pare a aplicação antes de executar.
-- Este SELECT deve retornar zero linhas. Resolva nomes ausentes/duplicados antes de continuar.
SELECT d.id, d.ponto_destino
FROM tb_doacao d
WHERE (SELECT COUNT(*) FROM tb_ponto p WHERE p.nome = d.ponto_destino) <> 1;

ALTER TABLE tb_doacao ADD COLUMN IF NOT EXISTS ponto_destino_id UUID;
UPDATE tb_doacao d SET ponto_destino_id =
    (SELECT p.id FROM tb_ponto p WHERE p.nome = d.ponto_destino)
WHERE d.ponto_destino_id IS NULL
  AND (SELECT COUNT(*) FROM tb_ponto p WHERE p.nome = d.ponto_destino) = 1;
-- Falha se algum destino não puder ser associado; não exclui registros.
ALTER TABLE tb_doacao ALTER COLUMN ponto_destino_id SET NOT NULL;
ALTER TABLE tb_doacao ADD CONSTRAINT IF NOT EXISTS fk_doacao_ponto
    FOREIGN KEY (ponto_destino_id) REFERENCES tb_ponto(id);
-- Mantém a coluna antiga como histórico. A aplicação passa a utilizar somente o ID.