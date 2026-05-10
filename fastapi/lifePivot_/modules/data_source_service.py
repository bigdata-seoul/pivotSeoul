from lifePivot_.pipelines.data_source_csv_loader import load_csv_records
from lifePivot_.pipelines.data_source_common_preprocessor import preprocess_records
from lifePivot_.pipelines.data_source_data_version_manager import resolve_data_version
from lifePivot_.pipelines.data_source_open_data_importer import import_open_data
from lifePivot_.pipelines.data_source_source_registry import list_registered_sources
from lifePivot_.modules.data_source_schema import (
    DataSourceIngestRequest,
    DataSourceIngestResponse,
    DataSourceSummary,
)


class DataSourceService:
    def list_sources(self) -> list[DataSourceSummary]:
        return [DataSourceSummary(key=s, description='registered source') for s in list_registered_sources()]

    def ingest(self, request: DataSourceIngestRequest) -> DataSourceIngestResponse:
        version = resolve_data_version(request.source_key)
        imported = import_open_data(request.source_key, request.path)
        records = load_csv_records(imported)
        preprocessed = preprocess_records(records)
        _ = version
        return DataSourceIngestResponse(source_key=request.source_key, records_loaded=len(preprocessed))
