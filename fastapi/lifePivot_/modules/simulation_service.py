from lifePivot_.modules.simulation_flow import run_simulation_flow
from lifePivot_.modules.simulation_schema import SimulationRequest, SimulationResponse


class SimulationService:
    def run(self, request: SimulationRequest) -> SimulationResponse:
        return run_simulation_flow(request)
