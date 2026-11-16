package com.davy.backend.dto;

import com.davy.backend.entity.Ponto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "DTO para criação e atualização de um ponto de coleta/distribuição")
public record PontoRequestDTO(

        @Schema(description = "Nome do Ponto", example = "Ponto Central - Praça Cívica")
        @NotBlank(message = "O nome é obrigatório e não pode ser vazio")
        String nome,

        @Schema(description = "Endereço do Ponto", example = "Praça Cívica, s/n")
        @NotBlank(message = "O endereço é obrigatório e não pode ser vazio")
        String endereco,

        @Schema(description = "Bairro do Ponto", example = "Setor Central")
        @NotBlank(message = "O bairro é obrigatório e não pode ser vazio")
        String bairro,

        @Schema(description = "Horário de funcionamento do Ponto", example = "Seg a Sex, 8h às 17h")
        @NotBlank(message = "O horário é obrigatório e não pode ser vazio")
        String horario,

        @Schema(description = "Tipo do Ponto (coleta ou distribuição)", example = "coleta")
        @NotBlank(message = "O tipo é obrigatório e não pode ser vazio")
        String tipo
) {
    public Ponto toEntity() {
        Ponto ponto = new Ponto();
        ponto.setNome(this.nome);
        ponto.setEndereco(this.endereco);
        ponto.setBairro(this.bairro);
        ponto.setHorario(this.horario);
        ponto.setTipo(this.tipo);
        return ponto;
    }

    public static Ponto toEntity(PontoRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return dto.toEntity();
    }
}
