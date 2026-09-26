from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlmodel import Session
import os
import shutil
from typing import Dict

from core.models import Analysis, Session as DBSession, Certificate, Finding
from core.config import engine
from ingestion.pcap_loader import parse_pcap

router = APIRouter()

@router.post("/upload")
async def upload_pcap(file: UploadFile = File(...)):
    upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Analyze synchronously for prototype
    result_data = parse_pcap(file_path)
    
    with Session(engine) as session:
        # Create Analysis
        db_analysis = Analysis(
            filename=result_data["filename"],
            status="completed",
            total_sessions=result_data.get("total_sessions", 0),
            tls_sessions=result_data.get("tls_sessions", 0),
            plaintext_sessions=result_data.get("plaintext_sessions", 0),
            overall_risk_score=result_data.get("overall_risk_score", 0),
            risk_level=result_data.get("risk_level", "Unknown")
        )
        session.add(db_analysis)
        session.commit()
        session.refresh(db_analysis)
        
        # Add Sessions
        for sess_data in result_data.get("sessions", []):
            db_session = DBSession(
                analysis_id=db_analysis.id,
                source_ip=sess_data["source_ip"],
                source_port=sess_data["source_port"],
                destination_ip=sess_data["destination_ip"],
                destination_port=sess_data["destination_port"],
                protocol=sess_data["protocol"],
                starttls_detected=sess_data.get("starttls_detected", "unknown"),
                tls_version=sess_data.get("tls_version", "unknown"),
                cipher_suite=sess_data.get("cipher_suite", "unknown"),
                key_exchange=sess_data.get("key_exchange", "unknown"),
                forward_secrecy=sess_data.get("forward_secrecy", "unknown"),
                anomaly_score=sess_data.get("anomaly_score", 0)
            )
            session.add(db_session)
            session.commit()
            session.refresh(db_session)
            
            # Add Certificate if present
            cert_data = sess_data.get("certificate")
            if cert_data:
                db_cert = Certificate(
                    session_id=db_session.id,
                    subject=cert_data.get("subject", "unknown"),
                    issuer=cert_data.get("issuer", "unknown"),
                    valid_from=None, # In a real app we parse datetime string
                    valid_to=None,
                    public_key_algorithm=cert_data.get("public_key_algorithm", "unknown"),
                    public_key_length=cert_data.get("public_key_length"),
                    signature_algorithm=cert_data.get("signature_algorithm", "unknown"),
                    status=cert_data.get("status", "unknown")
                )
                session.add(db_cert)
                
            # Add Findings
            for f_data in sess_data.get("findings", []):
                db_finding = Finding(
                    analysis_id=db_analysis.id,
                    session_id=db_session.id,
                    rule_id=f_data["rule_id"],
                    title=f_data["title"],
                    severity=f_data["severity"],
                    confidence=f_data.get("confidence", "high"),
                    description=f_data["description"],
                    evidence=f_data["evidence"],
                    recommendation=f_data["recommendation"]
                )
                session.add(db_finding)
                
        session.commit()
        return {"analysis_id": db_analysis.id, "message": "Analysis completed."}
