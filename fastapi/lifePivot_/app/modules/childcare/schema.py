from pydantic import BaseModel


class ChildcareRequest(BaseModel):
    district: str
    child_age: int | None = None


class ChildcareResult(BaseModel):
    district: str
    capacity_status: str = "pending"
