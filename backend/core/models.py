from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class Analysis(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str
    status: str = Field(default="processing")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    total_sessions: int = 0
    tls_sessions: int = 0
    plaintext_sessions: int = 0
    overall_risk_score: int = 0
    risk_level: str = "Low"
    
    sessions: List["Session"] = Relationship(back_populates="analysis")
    findings: List["Finding"] = Relationship(back_populates="analysis")


class Session(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    analysis_id: int = Field(foreign_key="analysis.id")
    source_ip: str
    source_port: int
    destination_ip: str
    destination_port: int
    protocol: str  # SMTP, IMAP, POP3
    starttls_detected: str = "unknown"  # detected, not_detected, unknown, insufficient_evidence
    tls_version: str = "unknown"
    cipher_suite: str = "unknown"
    key_exchange: str = "unknown"
    forward_secrecy: str = "unknown"
    anomaly_score: int = 0

    analysis: Analysis = Relationship(back_populates="sessions")
    certificate: Optional["Certificate"] = Relationship(back_populates="session")
    findings: List["Finding"] = Relationship(back_populates="session")


class Certificate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: int = Field(foreign_key="session.id")
    subject: str = "unknown"
    issuer: str = "unknown"
    valid_from: Optional[datetime] = None
    valid_to: Optional[datetime] = None
    public_key_algorithm: str = "unknown"
    public_key_length: Optional[int] = None
    signature_algorithm: str = "unknown"
    status: str = "unknown"

    session: Session = Relationship(back_populates="certificate")


class Finding(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    analysis_id: int = Field(foreign_key="analysis.id")
    session_id: Optional[int] = Field(default=None, foreign_key="session.id")
    rule_id: str
    title: str
    severity: str
    confidence: str = "high"
    description: str
    evidence: str
    recommendation: str
    
    analysis: Analysis = Relationship(back_populates="findings")
    session: Optional[Session] = Relationship(back_populates="findings")
