from pydantic import BaseModel, Field


class DataSourceIngestRequest(BaseModel):
    source_key: str
    path: str


class DataSourceIngestResponse(BaseModel):
    source_key: str
    records_loaded: int = 0


class DataSourceSummary(BaseModel):
    key: str
    description: str = Field(default='')
