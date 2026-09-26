from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from typing import List

from core.models import Finding
from core.config import engine

router = APIRouter()

@router.get("/analysis/{analysis_id}/findings")
def get_analysis_findings(analysis_id: int):
    with Session(engine) as session:
        findings = session.exec(select(Finding).where(Finding.analysis_id == analysis_id)).all()
        return findings
