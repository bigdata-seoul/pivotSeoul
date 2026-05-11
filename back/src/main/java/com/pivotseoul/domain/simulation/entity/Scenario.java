package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.*;

/**
 * [엔티티] 시나리오
 *
 * 사용자(세션)가 생성한 시뮬레이션 시나리오 1건을 나타낸다.
 * 현재 지역 vs 비교 지역, 생애 단계 유형, 표시 순서 등을 관리한다.
 *
 * - 1개의 세션(session_id)에 여러 시나리오가 속할 수 있다 (1:N)
 * - 시나리오 변수(ScenarioVariable)는 별도 엔티티로 분리 관리된다
 */
@Entity
@Table(name = "scenario")
public class Scenario {

    /** PK — scenario 테이블 자동 증가 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scenario_id")
    private Long scenarioId;

    /**
     * 세션 ID (FK 참조 없이 ID만 보관)
     * - 추후 Session 엔티티와 @ManyToOne 연관관계로 전환 가능
     * TODO: Session 엔티티 생성 시 @ManyToOne으로 교체
     */
    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    /**
     * 시나리오 유형 — 생애 단계를 문자열로 구분
     * 예: "YOUTH"(청년), "NEWLYWED"(신혼·출산), "SENIOR"(노년)
     * TODO: 추후 ScenarioType Enum으로 전환 후 @Enumerated(EnumType.STRING) 적용
     */
    @Column(name = "scenario_type", nullable = false, length = 16)
    private String scenarioType;

    /** 현재 거주 자치구 ID (district 테이블 FK) */
    @Column(name = "current_district_id")
    private Long currentDistrictId;

    /** 비교 대상 자치구 ID (district 테이블 FK) */
    @Column(name = "compare_district_id")
    private Long compareDistrictId;

    /** 시나리오 제목 — 사용자가 직접 입력하거나 자동 생성 */
    @Column(name = "scenario_title", length = 256)
    private String scenarioTitle;

    /**
     * 다중 시나리오 비교 시 표시 순서
     * TODO: 다중 시나리오 비교 기능 구현 시 정렬 기준으로 활용
     */
    @Column(name = "display_order")
    private Integer displayOrder;

    /** JPA 기본 생성자 — 외부에서 직접 호출 금지, 팩토리 메서드 사용 */
    protected Scenario() {}

    /**
     * 시나리오 생성 팩토리 메서드
     * - setter 남발 방지, 필수값 누락 컴파일 타임 차단
     *
     * @param sessionId         세션 ID
     * @param scenarioType      생애 단계 유형 문자열
     * @param currentDistrictId 현재 자치구 ID
     * @param compareDistrictId 비교 자치구 ID
     * @param scenarioTitle     시나리오 제목
     * @param displayOrder      표시 순서
     */
    public static Scenario create(
            Long sessionId,
            String scenarioType,
            Long currentDistrictId,
            Long compareDistrictId,
            String scenarioTitle,
            Integer displayOrder
    ) {
        Scenario scenario = new Scenario();
        scenario.sessionId = sessionId;
        scenario.scenarioType = scenarioType;
        scenario.currentDistrictId = currentDistrictId;
        scenario.compareDistrictId = compareDistrictId;
        scenario.scenarioTitle = scenarioTitle;
        scenario.displayOrder = displayOrder;
        return scenario;
    }

    /**
     * 시나리오 내용 수정 메서드 (PATCH 대응)
     * - 수정 가능한 필드만 노출, scenarioId/sessionId는 변경 불가
     */
    public void update(
            String scenarioTitle,
            Long currentDistrictId,
            Long compareDistrictId,
            Integer displayOrder
    ) {
        this.scenarioTitle = scenarioTitle;
        this.currentDistrictId = currentDistrictId;
        this.compareDistrictId = compareDistrictId;
        this.displayOrder = displayOrder;
    }

    // ========================
    // Getter (읽기 전용 공개)
    // Setter는 팩토리/update 메서드로 대체 — 외부 직접 호출 금지
    // ========================

    public Long getScenarioId() { return scenarioId; }
    public Long getSessionId() { return sessionId; }
    public String getScenarioType() { return scenarioType; }
    public Long getCurrentDistrictId() { return currentDistrictId; }
    public Long getCompareDistrictId() { return compareDistrictId; }
    public String getScenarioTitle() { return scenarioTitle; }
    public Integer getDisplayOrder() { return displayOrder; }
}