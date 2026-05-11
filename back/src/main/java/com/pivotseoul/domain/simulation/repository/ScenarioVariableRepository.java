package com.pivotseoul.domain.simulation.repository;

import com.pivotseoul.domain.simulation.entity.ScenarioVariable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * [Repository] 시나리오 변수
 *
 * ScenarioVariable 엔티티의 DB 접근을 담당한다.
 * 시나리오 ID 기반 변수 목록 조회 및 키 기반 단건 조회를 제공한다.
 */
public interface ScenarioVariableRepository extends JpaRepository<ScenarioVariable, Long> {

    /**
     * 시나리오 ID로 변수 전체 조회
     * - 시나리오 요약 조회, 비교 계산 시 사용
     *
     * @param scenarioId 조회할 시나리오 ID
     * @return 해당 시나리오의 변수 목록
     */
    List<ScenarioVariable> findByScenarioId(Long scenarioId);

    /**
     * 시나리오 ID + 변수 키로 단건 조회
     * - 특정 변수 값 수정(PATCH) 시 사용
     * - 예: scenarioId=1, varKey="INCOME" → 소득 변수 1건 반환
     *
     * @param scenarioId 시나리오 ID
     * @param varKey     변수 키 (예: "INCOME", "DEPOSIT")
     * @return 해당 변수 Optional (없으면 empty)
     */
    Optional<ScenarioVariable> findByScenarioIdAndVarKey(Long scenarioId, String varKey);

    /**
     * 시나리오 ID로 변수 전체 삭제
     * - 시나리오 삭제(DELETE /api/scenarios/{scenarioId}) 시
     *   연관 변수도 함께 제거할 때 사용
     * TODO: Cascade 전략으로 전환 가능 — 엔티티 연관관계 정의 시 재검토
     *
     * @param scenarioId 삭제할 시나리오 ID
     */
    void deleteByScenarioId(Long scenarioId);

    /**
     * 시나리오 ID + 변수 키 존재 여부 확인
     * - 변수 저장 시 신규 insert vs 기존 update 분기 판단용
     *
     * @param scenarioId 시나리오 ID
     * @param varKey     변수 키
     * @return 존재하면 true
     */
    boolean existsByScenarioIdAndVarKey(Long scenarioId, String varKey);
}