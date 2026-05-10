from lifePivot_.modules.simulation_model import Scenario


class SimulationRepository:
    def load_scenario(self, name: str, district: str) -> Scenario:
        return Scenario(name=name, district=district)
