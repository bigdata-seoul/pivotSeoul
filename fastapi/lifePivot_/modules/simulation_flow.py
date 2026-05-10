from lifePivot_.modules.simulation_schema import SimulationRequest, SimulationResponse


def run_simulation_flow(request: SimulationRequest) -> SimulationResponse:
    district = request.district.strip()
    return SimulationResponse(
        input_normalized={'district': district},
        modules_used=['housing', 'career', 'childcare', 'senior', 'policy', 'llm_explanation'],
    )
