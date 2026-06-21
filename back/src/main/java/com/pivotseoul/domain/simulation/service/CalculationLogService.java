package com.pivotseoul.domain.simulation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.pivotseoul.domain.simulation.entity.CalculationLog;
import com.pivotseoul.domain.simulation.repository.CalculationLogRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class CalculationLogService {

    private static final String FORMULA_VERSION = "HOUSING_RIR_RULE_V1";

    private final CalculationLogRepository calculationLogRepository;

    public CalculationLogService(CalculationLogRepository calculationLogRepository) {
        this.calculationLogRepository = calculationLogRepository;
    }

    public void saveSuccessLog(
            Long simulationRunId,
            JsonNode input,
            JsonNode output) {
        CalculationLog log = new CalculationLog();
        log.setSimulationRunId(simulationRunId);
        log.setCalculationType("HOUSING_ANALYZE");
        log.setFormulaVersion(FORMULA_VERSION);
        log.setInputHash(toSha256(input));
        log.setOutputHash(toSha256(output));
        log.setPassedValidation(true);
        log.setErrorType(null);
        log.setErrorMessage(null);

        calculationLogRepository.save(log);
    }

    public void saveFailureLog(
            Long simulationRunId,
            JsonNode input,
            JsonNode output,
            String errorType,
            String errorMessage) {
        CalculationLog log = new CalculationLog();
        log.setSimulationRunId(simulationRunId);
        log.setCalculationType("HOUSING_ANALYZE");
        log.setFormulaVersion(FORMULA_VERSION);
        log.setInputHash(toSha256(input));
        log.setOutputHash(toSha256(output));
        log.setPassedValidation(false);
        log.setErrorType(errorType);
        log.setErrorMessage(errorMessage);

        calculationLogRepository.save(log);
    }

    private String toSha256(JsonNode node) {
        String value = node == null ? "null" : node.toString();

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(value.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : encodedHash) {
                hex.append(String.format("%02x", b));
            }

            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm is not available", e);
        }
    }
}