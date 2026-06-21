from fastapi import APIRouter

from lifePivot_.app.modules.data_source.schema import (
    DataSourceIngestRequest,
    DataSourceIngestResponse,
    DataSourceSummary,
)
from lifePivot_.app.modules.data_source.service import DataSourceService

router = APIRouter(prefix='/data-source', tags=['data_source'])
service = DataSourceService()


@router.get('/sources', response_model=list[DataSourceSummary])
def get_sources() -> list[DataSourceSummary]:
    return service.list_sources()


@router.post('/ingest', response_model=DataSourceIngestResponse)
def ingest_source(body: DataSourceIngestRequest) -> DataSourceIngestResponse:
    return service.ingest(body)
