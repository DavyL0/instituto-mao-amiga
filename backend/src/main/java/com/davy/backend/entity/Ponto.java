package com.davy.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_ponto")
public class Ponto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String nome;

    private String endereco;

    private String bairro;

    private String horario;

    private String tipo;
}
