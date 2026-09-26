from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from typing import List

from core.models import Analysis, Session as DBSession, Certificate, Finding
from core.config import engine

router = APIRouter()

@router.get("/analysis/{analysis_id}/report/json")
def get_analysis_report(analysis_id: int):
    with Session(engine) as session:
        analysis = session.get(Analysis, analysis_id)
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
            
        sessions = session.exec(select(DBSession).where(DBSession.analysis_id == analysis_id)).all()
        findings = session.exec(select(Finding).where(Finding.analysis_id == analysis_id)).all()
        
        report = analysis.dict()
        report["sessions"] = []
        for s in sessions:
            s_dict = s.dict()
            cert = session.exec(select(Certificate).where(Certificate.session_id == s.id)).first()
            s_dict["certificate"] = cert.dict() if cert else None
            
            s_findings = [f.dict() for f in findings if f.session_id == s.id]
            s_dict["findings"] = s_findings
            
            report["sessions"].append(s_dict)
            
        return report
