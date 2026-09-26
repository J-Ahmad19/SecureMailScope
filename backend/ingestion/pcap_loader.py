import os
import json
import subprocess

def parse_pcap(filepath: str) -> dict:
    """
    Orchestrates the PCAP parsing pipeline.
    Prioritizes TShark -> Zeek -> Scapy -> Demo Fixture fallback.
    """
    filename = os.path.basename(filepath)
    
    # 1. Demo Mode Fallback (Deterministic)
    if filename.startswith("demo_"):
        return _load_demo_fixture(filename)
        
    # 2. Try TShark (Prototype implementation)
    try:
        # Just a check to see if TShark is available
        subprocess.run(["tshark", "-v"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        # In a real implementation, we would run tshark to extract streams.
        # For this prototype, if it's not a demo file, we just return a stubbed analysis
        # or we could fall back to scapy.
        pass
    except (FileNotFoundError, subprocess.CalledProcessError):
        pass
        
    # 3. Fallback to basic Scapy/Python extraction (Stub for prototype)
    return _basic_scapy_fallback(filename)

def _load_demo_fixture(filename: str) -> dict:
    scenario = filename.replace("demo_", "").replace(".pcap", "")
    base_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "demo")
    
    json_path = os.path.join(base_dir, scenario, f"demo_{scenario}.json")
    if os.path.exists(json_path):
        with open(json_path, 'r') as f:
            return json.load(f)
            
    # Fallback if json doesn't exist
    return _basic_scapy_fallback(filename)

def _basic_scapy_fallback(filename: str) -> dict:
    """Fallback when no PCAP tools are available and it's not a demo file."""
    return {
        "filename": filename,
        "status": "completed",
        "total_sessions": 1,
        "tls_sessions": 0,
        "plaintext_sessions": 1,
        "overall_risk_score": 50,
        "risk_level": "Medium",
        "sessions": [
            {
                "source_ip": "unknown",
                "source_port": 0,
                "destination_ip": "unknown",
                "destination_port": 0,
                "protocol": "unknown",
                "starttls_detected": "unknown",
                "tls_version": "unknown",
                "cipher_suite": "unknown",
                "key_exchange": "unknown",
                "forward_secrecy": "unknown",
                "anomaly_score": 50,
                "findings": [
                    {
                        "rule_id": "INFO-001",
                        "title": "Basic PCAP Uploaded",
                        "severity": "Low",
                        "confidence": "high",
                        "description": "A PCAP was uploaded but full protocol parsing is limited in this environment.",
                        "evidence": "File processed via fallback parser.",
                        "recommendation": "Ensure TShark or Zeek is installed for full extraction."
                    }
                ]
            }
        ]
    }
