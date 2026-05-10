from lifePivot_.app.modules.childcare.model import ChildcareFacility


class ChildcareRepository:
    def list_facilities(self, district: str) -> list[ChildcareFacility]:
        _ = district
        return []
