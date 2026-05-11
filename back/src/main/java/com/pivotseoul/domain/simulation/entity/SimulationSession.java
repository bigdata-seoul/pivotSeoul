package com.pivotseoul.domain.simulation.entity;

import com.pivotseoul.domain.user.entity.LifeStage;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "life_stage_id", nullable = false)
    private LifeStage lifeStage;

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

    @OneToOne(mappedBy = "simulationSession", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private UserCondition userCondition;

    protected SimulationSession() {
    }

    public static SimulationSession create(
            String sessionUuid,
            LifeStage lifeStage,
            String anonymousUserKeyHash,
            String sessionStatus,
            boolean consentToSaveResult,
            Instant createdAt
    ) {
        SimulationSession session = new SimulationSession();
        session.setSessionUuid(sessionUuid);
        session.setLifeStage(lifeStage);
        session.setAnonymousUserKeyHash(anonymousUserKeyHash);
        session.setSessionStatus(sessionStatus);
        session.setConsentToSaveResult(consentToSaveResult);
        session.setCreatedAt(createdAt);
        return session;
    }

    public void updateUserCondition(UserCondition userCondition) {
        this.userCondition = userCondition;
        if (userCondition != null) {
            userCondition.setSimulationSession(this);
        }
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
        return lifeStage == null ? null : lifeStage.getLifeStageId();
    }

    public LifeStage getLifeStage() {
        return lifeStage;
    }

    public void setLifeStage(LifeStage lifeStage) {
        this.lifeStage = lifeStage;
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

    public UserCondition getUserCondition() {
        return userCondition;
    }

    public void setUserCondition(UserCondition userCondition) {
        updateUserCondition(userCondition);
    }
}
