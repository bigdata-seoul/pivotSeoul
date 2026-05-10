package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "simulation_session")
public class SimulationSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;

    @Column(name = "session_uuid", nullable = false, unique = true, length = 64)
    private String sessionUuid;

    @Column(name = "life_stage_id", nullable = false)
    private Long lifeStageId;

    @Column(name = "anonymous_user_key_hash", length = 128)
    private String anonymousUserKeyHash;

    @Column(name = "session_status", nullable = false, length = 32)
    private String sessionStatus;

    @Column(name = "consent_to_save_result", nullable = false)
    private boolean consentToSaveResult;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "expired_at")
    private Instant expiredAt;

    protected SimulationSession() {
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getSessionUuid() {
        return sessionUuid;
    }

    public void setSessionUuid(String sessionUuid) {
        this.sessionUuid = sessionUuid;
    }

    public Long getLifeStageId() {
        return lifeStageId;
    }

    public void setLifeStageId(Long lifeStageId) {
        this.lifeStageId = lifeStageId;
    }

    public String getAnonymousUserKeyHash() {
        return anonymousUserKeyHash;
    }

    public void setAnonymousUserKeyHash(String anonymousUserKeyHash) {
        this.anonymousUserKeyHash = anonymousUserKeyHash;
    }

    public String getSessionStatus() {
        return sessionStatus;
    }

    public void setSessionStatus(String sessionStatus) {
        this.sessionStatus = sessionStatus;
    }

    public boolean isConsentToSaveResult() {
        return consentToSaveResult;
    }

    public void setConsentToSaveResult(boolean consentToSaveResult) {
        this.consentToSaveResult = consentToSaveResult;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getExpiredAt() {
        return expiredAt;
    }

    public void setExpiredAt(Instant expiredAt) {
        this.expiredAt = expiredAt;
    }
}
