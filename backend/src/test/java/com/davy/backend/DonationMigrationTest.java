package com.davy.backend;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.FileSystemResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import java.sql.DriverManager;
import java.util.UUID;
import static org.assertj.core.api.Assertions.*;

class DonationMigrationTest {
    @Test void migratesLegacyNamesAndEnforcesForeignKey() throws Exception {
        try (var connection = DriverManager.getConnection("jdbc:h2:mem:migration_" + UUID.randomUUID());
             var statement = connection.createStatement()) {
            statement.execute("CREATE TABLE tb_ponto(id UUID PRIMARY KEY, nome VARCHAR(255))");
            statement.execute("CREATE TABLE tb_doacao(id UUID PRIMARY KEY, ponto_destino VARCHAR(255))");
            UUID pointId = UUID.randomUUID();
            statement.execute("INSERT INTO tb_ponto VALUES ('" + pointId + "', 'Destino')");
            statement.execute("INSERT INTO tb_doacao VALUES (RANDOM_UUID(), 'Destino')");
            ScriptUtils.executeSqlScript(connection, new FileSystemResource("scripts/migrate-doacao-destino.sql"));
            try (var result = statement.executeQuery("SELECT ponto_destino_id FROM tb_doacao")) {
                assertThat(result.next()).isTrue();
                assertThat(result.getObject(1, UUID.class)).isEqualTo(pointId);
            }
            assertThatThrownBy(() -> statement.execute("DELETE FROM tb_ponto")).isInstanceOf(java.sql.SQLException.class);
        }
    }
}