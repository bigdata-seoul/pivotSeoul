package com.pivotseoul.domain.simulation.repository;

import com.pivotseoul.domain.simulation.entity.Scenario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * [Repository] 시나리오
 *
 * Scenario 엔티티의 DB 접근을 담당한다.
 * JpaRepository 기본 CRUD 외에 세션 기반 조회 쿼리를 추가로 정의한다.
 */
public interface ScenarioRepository extends JpaRepository<Scenario, Long> {

    /**
     * 세션 ID로 소속 시나리오 전체 조회
     * - GET /api/simulations/{sessionId}/scenarios 에서 사용
     * - display_order 오름차순 정렬로 화면 표시 순서 보장
     *
     * @param sessionId 조회할 세션 ID
     * @return 해당 세션의 시나리오 목록 (표시 순서 정렬)
     */
    List<Scenario> findBySessionIdOrderByDisplayOrderAsc(Long sessionId);

    /**
     * 세션 ID + 시나리오 유형으로 존재 여부 확인
     * - 동일 세션 내 같은 유형의 시나리오 중복 생성 방지용
     * TODO: 유형별 중복 허용 정책 확정 후 사용 여부 결정
     *
     * @param sessionId    세션 ID
     * @param scenarioType 시나리오 유형 문자열
     * @return 존재하면 true
     */
    boolean existsBySessionIdAndScenarioType(Long sessionId, String scenarioType);

    /**
     * 세션 ID로 시나리오 수 조회
     * - 다중 시나리오 비교 시 최대 개수 제한 검증에 사용
     * TODO: 다중 시나리오 비교 기능 구현 시 최대 개수 정책 함께 정의
     *
     * @param sessionId 세션 ID
     * @return 해당 세션의 시나리오 개수
     */
    int countBySessionId(Long sessionId);
}