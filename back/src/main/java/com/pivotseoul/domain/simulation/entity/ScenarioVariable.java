package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.*;

/**
 * [엔티티] 시나리오 변수
 *
 * 하나의 시나리오(Scenario)에 속하는 조건 변수 1건을 나타낸다.
 * 소득, 보증금, 월세, 통근시간 등 비교 시뮬레이션에 사용되는
 * 모든 수치 입력값을 key-value 구조로 저장한다.
 *
 * - Scenario : ScenarioVariable = 1 : N
 * - key-value 설계로 추후 사용자 직접 변수 추가 기능 대응 가능
 *   TODO: 사용자 정의 변수 추가 기능 구현 시 varKey 검증 로직 추가
 */
@Entity
@Table(name = "scenario_variable")
public class ScenarioVariable {

    /** PK — scenario_variable 테이블 자동 증가 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variable_id")
    private Long variableId;

    /**
     * 소속 시나리오 ID (FK)
     * TODO: 추후 Scenario 엔티티와 @ManyToOne 연관관계 전환 가능
     */
    @Column(name = "scenario_id", nullable = false)
    private Long scenarioId;

    /**
     * 변수 키 — 변수의 종류를 식별하는 문자열
     * 예: "INCOME"(소득), "DEPOSIT"(보증금), "MONTHLY_RENT"(월세),
     *     "COMMUTE_TIME"(통근시간)
     * TODO: VarKey Enum으로 전환해 허용 키 목록 명시적으로 관리 권장
     */
    @Column(name = "var_key", nullable = false, length = 64)
    private String varKey;

    /**
     * 변수 값 — 모든 수치를 문자열로 저장 (단위 혼재 대응)
     * 예: "3000000", "120", "45"
     * TODO: 단위 정보를 별도 컬럼(var_unit)으로 분리하는 것 고려
     */
    @Column(name = "var_value", length = 256)
    private String varValue;

    /** JPA 기본 생성자 — 외부 직접 호출 금지 */
    protected ScenarioVariable() {}

    /**
     * 시나리오 변수 생성 팩토리 메서드
     *
     * @param scenarioId 소속 시나리오 ID
     * @param varKey     변수 키
     * @param varValue   변수 값 (문자열)
     */
    public static ScenarioVariable create(Long scenarioId, String varKey, String varValue) {
        ScenarioVariable variable = new ScenarioVariable();
        variable.scenarioId = scenarioId;
        variable.varKey = varKey;
        variable.varValue = varValue;
        return variable;
    }

    /**
     * 변수 값 수정 메서드
     * - varKey(종류)는 변경 불가, 값만 업데이트
     */
    public void updateValue(String varValue) {
        this.varValue = varValue;
    }

    // ========================
    // Getter
    // ========================

    public Long getVariableId() { return variableId; }
    public Long getScenarioId() { return scenarioId; }
    public String getVarKey() { return varKey; }
    public String getVarValue() { return varValue; }
}