package com.davy.backend;

import com.davy.backend.dto.*;
import com.davy.backend.entity.Ponto;
import com.davy.backend.repository.*;
import com.davy.backend.service.*;
import com.davy.backend.service.exception.ResourceNotFoundException;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.UUID;
import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Transactional
class DonationIntegrityTest {
    @Autowired DoacaoService doacoes;
    @Autowired PontoService pontos;
    @Autowired PontoRepository pontoRepository;
    @Autowired Validator validator;

    private Ponto ponto() {
        return pontoRepository.saveAndFlush(Ponto.builder().nome("Destino").endereco("Rua").bairro("Centro").horario("8h").tipo("coleta").build());
    }

    @Test void donationUsesExistingPointAndReflectsRenames() {
        Ponto ponto = ponto();
        var created = doacoes.create(new DoacaoRequestDTO("Alimentos", 3, ponto.getId()));
        ponto.setNome("Novo nome");
        pontoRepository.flush();
        var found = doacoes.findById(created.id());
        assertThat(found.pontoDestinoId()).isEqualTo(ponto.getId());
        assertThat(found.pontoDestino()).isEqualTo("Novo nome");
        var updated = doacoes.update(created.id(), new DoacaoRequestDTO("Roupas", 2, ponto.getId()));
        assertThat(updated.criadoEm()).isEqualTo(created.criadoEm());
        assertThatThrownBy(() -> pontos.delete(ponto.getId())).isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode().value()).isEqualTo(409));
    }

    @Test void rejectsMissingPointOnCreate() {
        var missing = new DoacaoRequestDTO("Alimentos", 1, UUID.randomUUID());
        assertThatThrownBy(() -> doacoes.create(missing)).isInstanceOf(ResourceNotFoundException.class);
    }

    @Test void validatesPointTypesAndTextLengths() {
        assertThat(validator.validate(new PontoRequestDTO("N", "E", "B", "H", "outro"))).isNotEmpty();
        assertThat(validator.validate(new PontoRequestDTO("N", "E", "B", "H", "distribuição"))).isEmpty();
        assertThat(validator.validate(new PontoRequestDTO("x".repeat(256), "E", "B", "H", "coleta"))).isNotEmpty();
        assertThat(validator.validate(new DoacaoRequestDTO("x".repeat(256), 1, UUID.randomUUID()))).isNotEmpty();
        assertThat(validator.validate(new DoacaoRequestDTO("Item", 0, null))).hasSize(2);
    }
    @Autowired org.springframework.web.context.WebApplicationContext context;

    @Test void httpReturnsValidationAndConflictStatuses() throws Exception {
        var mvc = org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup(context).build();
        var ponto = ponto();
        doacoes.create(new DoacaoRequestDTO("Item", 1, ponto.getId()));
        mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete("/api/v1/pontos/" + ponto.getId()))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isConflict());
        mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/v1/doacoes")
                .contentType("application/json").content("{\"tipoItem\":\"" + "x".repeat(256) + "\",\"quantidade\":1,\"pontoDestinoId\":\"" + ponto.getId() + "\"}"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isBadRequest());
    }

    @Test void updateRejectsMissingDestination() {
        var created = doacoes.create(new DoacaoRequestDTO("Item", 1, ponto().getId()));
        assertThatThrownBy(() -> doacoes.update(created.id(), new DoacaoRequestDTO("Item", 2, UUID.randomUUID())))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
