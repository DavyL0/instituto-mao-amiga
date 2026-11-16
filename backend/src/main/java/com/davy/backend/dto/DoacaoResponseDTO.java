package com.davy.backend.dto;

import com.davy.backend.entity.Doacao;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "DTO para retorno de dados de uma doação")
public record DoacaoResponseDTO(
        @Schema(description = "ID único da doação", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
        UUID id,

        @Schema(description = "Tipo do item doado", example = "Cesta Básica")
        String tipoItem,

        @Schema(description = "Quantidade de itens doados", example = "10")
        Integer quantidade,

        @Schema(description = "Nome do ponto de destino", example = "Ponto Central - Praça Cívica")
        String pontoDestino,
        UUID pontoDestinoId,

        @Schema(description = "Data e hora de criação do registro", example = "2026-11-16T17:42:00")
        LocalDateTime criadoEm
) {
    public static DoacaoResponseDTO fromEntity(Doacao doacao) {
        if (doacao == null) {
            return null;
        }
        return new DoacaoResponseDTO(
                doacao.getId(),
                doacao.getTipoItem(),
                doacao.getQuantidade(),
                doacao.getPontoDestino().getNome(),
                doacao.getPontoDestino().getId(),
                doacao.getCriadoEm()
        );
    }
}
