package com.davy.backend.dto;

import com.davy.backend.entity.Doacao;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Schema(description = "DTO para criação e atualização de uma doação")
public record DoacaoRequestDTO(

        @Schema(description = "Tipo do item doado", example = "Cesta Básica")
        @NotBlank(message = "O tipo do item é obrigatório e não pode ser vazio")
        @Size(max = 255)
        String tipoItem,

        @Schema(description = "Quantidade de itens doados (maior que zero)", example = "10")
        @NotNull(message = "A quantidade é obrigatória")
        @Positive(message = "A quantidade deve ser maior que zero")
        Integer quantidade,

        @Schema(description = "UUID do ponto de destino cadastrado")
        @NotNull(message = "O ponto de destino é obrigatório")
        UUID pontoDestinoId
) {
    public Doacao toEntity() {
        Doacao doacao = new Doacao();
        doacao.setTipoItem(this.tipoItem);
        doacao.setQuantidade(this.quantidade);
        return doacao;
    }

    public static Doacao toEntity(DoacaoRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return dto.toEntity();
    }
}
