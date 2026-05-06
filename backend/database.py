from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

def _is_serverless() -> bool:
    # Cover Vercel + common serverless env flags.
    return bool(
        os.getenv("VERCEL") == "1"
        or os.getenv("VERCEL_ENV")
        or os.getenv("VERCEL_REGION")
        or os.getenv("NOW_REGION")
        or os.getenv("AWS_LAMBDA_FUNCTION_NAME")
    )


def _default_database_url() -> str:
    # Vercel serverless FS is read-only except for `/tmp`.
    if _is_serverless():
        return "sqlite:////tmp/atletico.db"
    return "sqlite:///./atletico_intelligence.db"


SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/atletico.db"
DATABASE_URL = SQLALCHEMY_DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
