package com.davy.backend.dto;

import com.davy.backend.entity.Ponto;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "DTO para retorno de dados de um ponto de coleta/distribuição")
public record PontoResponseDTO(
        @Schema(description = "ID único do ponto", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
        UUID id,

        @Schema(description = "Nome do ponto", example = "Ponto Central - Praça Cívica")
        String nome,

        @Schema(description = "Endereço do ponto", example = "Praça Cívica, s/n")
        String endereco,

        @Schema(description = "Bairro do ponto", example = "Setor Central")
        String bairro,

        @Schema(description = "Horário de funcionamento do ponto", example = "Seg a Sex, 8h às 17h")
        String horario,

        @Schema(description = "Tipo do ponto (coleta ou distribuição)", example = "coleta")
        String tipo
) {
    public static PontoResponseDTO fromEntity(Ponto ponto) {
        if (ponto == null) {
            return null;
        }
        return new PontoResponseDTO(
                ponto.getId(),
                ponto.getNome(),
                ponto.getEndereco(),
                ponto.getBairro(),
                ponto.getHorario(),
                ponto.getTipo()
        );
    }
}
