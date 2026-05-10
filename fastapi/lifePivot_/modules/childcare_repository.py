from lifePivot_.modules.childcare_model import ChildcareFacility


class ChildcareRepository:
    def list_facilities(self, district: str) -> list[ChildcareFacility]:
        _ = district
        return []
