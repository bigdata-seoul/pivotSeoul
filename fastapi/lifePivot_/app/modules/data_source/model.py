from dataclasses import dataclass


@dataclass(frozen=True)
class DataSourceMeta:
    key: str
    version: str = 'v1'
