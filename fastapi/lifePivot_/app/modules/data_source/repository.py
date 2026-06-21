from lifePivot_.app.modules.data_source.model import DataSourceMeta


class DataSourceRepository:
    def list_sources(self) -> list[DataSourceMeta]:
        return [
            DataSourceMeta(key='sarang'),
            DataSourceMeta(key='sunwoo_from_spring'),
            DataSourceMeta(key='yunseo'),
        ]
