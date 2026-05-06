from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

def _default_database_url() -> str:
    # Vercel serverless FS is read-only except for `/tmp`.
    if os.getenv("VERCEL") == "1" or os.getenv("VERCEL_ENV"):
        return "sqlite:////tmp/atletico.db"
    return "sqlite:///./atletico_intelligence.db"


DATABASE_URL = os.getenv("DATABASE_URL", _default_database_url())

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
