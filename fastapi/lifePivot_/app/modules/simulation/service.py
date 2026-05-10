from lifePivot_.app.modules.simulation.flow import run_simulation_flow
from lifePivot_.app.modules.simulation.schema import SimulationRequest, SimulationResponse


class SimulationService:
    def run(self, request: SimulationRequest) -> SimulationResponse:
        return run_simulation_flow(request)
