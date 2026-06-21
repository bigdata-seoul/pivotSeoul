from fastapi import APIRouter

from lifePivot_.app.modules.simulation.schema import SimulationRequest, SimulationResponse
from lifePivot_.app.modules.simulation.service import SimulationService

router = APIRouter(prefix='/simulation', tags=['simulation'])
service = SimulationService()


@router.post('/run', response_model=SimulationResponse)
def run_simulation(body: SimulationRequest) -> SimulationResponse:
    return service.run(body)
