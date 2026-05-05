from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    cache_ttl: int = 900  # 15 minutes
    cors_origins: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
