package com.davy.backend.config;

import com.davy.backend.entity.Ponto;
import com.davy.backend.repository.PontoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final PontoRepository pontoRepository;

    @Override
    public void run(String... args) {
        if (pontoRepository.count() == 0) {
            List<Ponto> pontosIniciais = List.of(
                    Ponto.builder()
                            .nome("Ponto Central - Praça Cívica")
                            .endereco("Praça Pedro Ludovico Teixeira, s/n")
                            .bairro("Setor Central")
                            .horario("Seg a Sex, 8h às 17h")
                            .tipo("coleta")
                            .build(),
                    Ponto.builder()
                            .nome("Ponto Parque Vaca Brava")
                            .endereco("Av. T-10, s/n")
                            .bairro("Setor Bueno")
                            .horario("Seg a Sáb, 8h às 18h")
                            .tipo("coleta")
                            .build(),
                    Ponto.builder()
                            .nome("Ponto Bosque dos Buritis")
                            .endereco("Av. Assis Chateaubriand, s/n")
                            .bairro("Setor Oeste")
                            .horario("Seg a Sex, 8h às 16h")
                            .tipo("distribuição")
                            .build(),
                    Ponto.builder()
                            .nome("Ponto Parque Flamboyant")
                            .endereco("Rua 15, s/n")
                            .bairro("Jardim Goiás")
                            .horario("Ter a Dom, 9h às 17h")
                            .tipo("coleta")
                            .build(),
                    Ponto.builder()
                            .nome("Ponto Alameda Ricardo Paranhos")
                            .endereco("Alameda Ricardo Paranhos, Qd. 240")
                            .bairro("Setor Marista")
                            .horario("Seg a Sex, 7h às 19h")
                            .tipo("distribuição")
                            .build(),
                    Ponto.builder()
                            .nome("Ponto Praça da Matriz Campinas")
                            .endereco("Praça Santo Afonso, s/n")
                            .bairro("Setor Campinas")
                            .horario("Seg a Sáb, 8h às 17h")
                            .tipo("coleta")
                            .build(),
                    Ponto.builder()
                            .nome("Ponto Praça do Cruzeiro")
                            .endereco("Rua 84, s/n")
                            .bairro("Setor Sul")
                            .horario("Seg a Sex, 8h às 18h")
                            .tipo("distribuição")
                            .build(),
                    Ponto.builder()
                            .nome("Ponto Praça Universitária")
                            .endereco("Praça Universitária, s/n")
                            .bairro("Setor Universitário")
                            .horario("Seg a Sex, 8h às 20h")
                            .tipo("coleta")
                            .build(),
                    Ponto.builder()
                            .nome("Ponto Parque Areião")
                            .endereco("Av. Americano do Brasil, s/n")
                            .bairro("Setor Pedro Ludovico")
                            .horario("Seg a Dom, 7h às 18h")
                            .tipo("distribuição")
                            .build(),
                    Ponto.builder()
                            .nome("Ponto Lago das Rosas")
                            .endereco("Alameda das Rosas, s/n")
                            .bairro("Setor Oeste")
                            .horario("Seg a Sáb, 8h às 17h")
                            .tipo("coleta")
                            .build()
            );

            pontoRepository.saveAll(pontosIniciais);
        }
    }
}
