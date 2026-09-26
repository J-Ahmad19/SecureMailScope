import os
from sqlmodel import create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./securemailscope.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

class SecurityPolicy:
    """Configurable baseline for deterministic rule engine."""
    MIN_TLS_VERSION = "TLSv1.2"
    APPROVED_TLS_VERSIONS = ["TLSv1.2", "TLSv1.3"]
    MIN_RSA_KEY_SIZE = 2048
    REQUIRE_FORWARD_SECRECY = True
    REQUIRE_STARTTLS = True
