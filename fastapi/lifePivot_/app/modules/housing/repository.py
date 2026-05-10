from lifePivot_.app.modules.housing.model import HousingSnapshot


class HousingRepository:
    def get_snapshot(self, district: str) -> HousingSnapshot:
        """TODO: Load district housing aggregates from data source."""
        return HousingSnapshot(district=district)
