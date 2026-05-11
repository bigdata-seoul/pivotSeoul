package com.pivotseoul.domain.simulation.service;

import com.pivotseoul.domain.simulation.dto.CreateSessionRequest;
import com.pivotseoul.domain.simulation.dto.CreateSessionResponse;
import com.pivotseoul.domain.simulation.entity.LifeStage;
import com.pivotseoul.domain.simulation.entity.SimulationSession;
import com.pivotseoul.domain.simulation.entity.UserCondition;
import com.pivotseoul.domain.simulation.repository.LifeStageRepository;
import com.pivotseoul.domain.simulation.repository.SimulationSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SimulationSessionService {

    private final LifeStageRepository lifeStageRepository;
    private final SimulationSessionRepository simulationSessionRepository;

    @Transactional
    public CreateSessionResponse createSession(CreateSessionRequest request) {
        // 1. LifeStageCode를 기반으로 LifeStage 엔티티 조회
        LifeStage lifeStage = lifeStageRepository.findByStageCode(request.lifeStageCode())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 생애단계 코드입니다: " + request.lifeStageCode()));

        // 2. SimulationSession 생성 (session_uuid 발급)
        String sessionUuid = UUID.randomUUID().toString();
        SimulationSession session = SimulationSession.builder()
                .sessionUuid(sessionUuid)
                .lifeStage(lifeStage)
                .sessionStatus("CREATED")
                .build();

        // 3. UserCondition 생성 및 연관관계 매핑
        UserCondition userCondition = UserCondition.builder()
                .simulationSession(session)
                .currentDistrict(request.currentDistrict())
                .compareDistrict(request.compareDistrict())
                .monthlyIncome(request.monthlyIncome())
                .monthlyHousing(request.monthlyHousing())
                .monthlyLiving(request.monthlyLiving())
                .commuteTime(request.commuteTime())
                .childcareCost(request.childcareCost())
                .returnToWorkMonths(request.returnToWorkMonths())
                .retirementAge(request.retirementAge())
                .savings(request.savings())
                .build();

        session.setUserCondition(userCondition);

        // 4. DB 저장 (SimulationSession에 Cascade=ALL이 걸려있으므로 UserCondition도 함께 저장됨)
        simulationSessionRepository.save(session);

        // 5. 프론트엔드가 기대하는 sessionId 필드에 UUID 값을 담아 반환
        return new CreateSessionResponse(sessionUuid);
    }
}